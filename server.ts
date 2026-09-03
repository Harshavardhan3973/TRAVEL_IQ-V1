import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Resilient multi-model Gemini caller with automatic transient demand failover
async function generateJsonWithFallback(
  gemini: GoogleGenAI,
  prompt: string,
  temperature: number = 0.4
): Promise<any | null> {
  // Candidate models: primary flash, latest alias, and high-throughput lite
  const candidateModels = [
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ];

  for (const model of candidateModels) {
    try {
      const config: any = {
        responseMimeType: "application/json",
        temperature,
      };

      // Only specify thinkingLevel for Gemini 3 series models
      if (model.startsWith("gemini-3")) {
        config.thinkingConfig = {
          thinkingLevel: ThinkingLevel.LOW,
        };
      }

      const response = await gemini.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const text = response?.text || "";
      const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      if (cleaned) {
        const parsed = JSON.parse(cleaned);
        return parsed;
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isTransientDemand =
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand") ||
        errMsg.includes("429") ||
        errMsg.includes("RESOURCE_EXHAUSTED");

      if (isTransientDemand) {
        console.info(`[TRAVELIQ AI] Model ${model} is experiencing high demand, falling over to next model...`);
        // Brief pause before trying fallback model
        await new Promise((resolve) => setTimeout(resolve, 350));
      } else {
        console.info(`[TRAVELIQ AI] Notice for model ${model}: ${errMsg.slice(0, 90)}, attempting next model...`);
      }
    }
  }

  return null;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// MapTiler Configuration API with active verification and reliable fallback layers
let verifiedMapTilerKey: string | null = null;
let mapTilerKeyValid: boolean = false;
let lastVerificationTime = 0;

app.get("/api/maptiler-config", async (req, res) => {
  const rawKey = (process.env.MAPTILER_API_KEY || "").trim();
  // Valid MapTiler keys are alphanumeric strings without @ symbols, typically 20+ chars
  const looksValidFormat = Boolean(
    rawKey && 
    rawKey !== "YOUR_MAPTILER_KEY" && 
    !rawKey.startsWith("@") && 
    /^[a-zA-Z0-9_-]{10,}$/.test(rawKey)
  );

  const now = Date.now();
  if (looksValidFormat && (verifiedMapTilerKey !== rawKey || now - lastVerificationTime > 300000)) {
    verifiedMapTilerKey = rawKey;
    lastVerificationTime = now;
    try {
      const ping = await fetch(`https://api.maptiler.com/tiles/satellite-v2/0/0/0.jpg?key=${rawKey}`, {
        method: "HEAD",
        signal: AbortSignal.timeout(3000),
      });
      mapTilerKeyValid = ping.ok;
    } catch {
      mapTilerKeyValid = false;
    }
  } else if (!looksValidFormat) {
    mapTilerKeyValid = false;
  }

  const isConfigured = looksValidFormat && mapTilerKeyValid;

  res.json({
    configured: isConfigured,
    tileJsonUrl: isConfigured ? `https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=${rawKey}` : null,
    satelliteTileUrl: isConfigured 
      ? `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${rawKey}` 
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    settlementsOverlayUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    streetsTileUrl: isConfigured 
      ? `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${rawKey}` 
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    voyagerTileUrl: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    topoTileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    apiKey: isConfigured ? rawKey : "",
    provider: isConfigured ? "MapTiler HD" : "Esri Global Imagery & OpenStreetMap Settlements",
  });
});

// Optional proxy to retrieve TileJSON directly from MapTiler
app.get("/api/maptiler-tilejson", async (req, res) => {
  const apiKey = process.env.MAPTILER_API_KEY;
  if (!apiKey || apiKey === "YOUR_MAPTILER_KEY") {
    return res.status(404).json({ error: "MapTiler API key not configured" });
  }
  try {
    const response = await fetch(`https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=${apiKey}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch TileJSON from MapTiler" });
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch TileJSON" });
  }
});

// Currency detection helper
function getCurrencyForCountry(countryCode?: string, countryName?: string): { currency: string; symbol: string } {
  const code = (countryCode || "").toUpperCase();
  const name = (countryName || "").toLowerCase();

  if (code === "IN" || name.includes("india")) return { currency: "INR", symbol: "₹" };
  if (code === "US" || name.includes("united states") || name.includes("america")) return { currency: "USD", symbol: "$" };
  if (code === "GB" || name.includes("united kingdom") || name.includes("england") || name.includes("britain")) return { currency: "GBP", symbol: "£" };
  if (code === "JP" || name.includes("japan")) return { currency: "JPY", symbol: "¥" };
  if (code === "AE" || name.includes("emirates") || name.includes("dubai")) return { currency: "AED", symbol: "AED " };
  if (code === "AU" || name.includes("australia")) return { currency: "AUD", symbol: "A$" };
  if (code === "SG" || name.includes("singapore")) return { currency: "SGD", symbol: "S$" };
  if (code === "ID" || name.includes("indonesia") || name.includes("bali")) return { currency: "IDR", symbol: "Rp " };
  if (code === "CA" || name.includes("canada")) return { currency: "CAD", symbol: "C$" };
  if (code === "CH" || name.includes("switzerland")) return { currency: "CHF", symbol: "CHF " };
  if (code === "CN" || name.includes("china")) return { currency: "CNY", symbol: "¥" };
  if (code === "TH" || name.includes("thailand")) return { currency: "THB", symbol: "฿" };
  
  // European Union countries
  const euCodes = ["FR", "DE", "IT", "ES", "NL", "BE", "AT", "PT", "GR", "IE", "FI"];
  if (euCodes.includes(code) || name.includes("france") || name.includes("germany") || name.includes("italy") || name.includes("spain") || name.includes("europe")) {
    return { currency: "EUR", symbol: "€" };
  }

  return { currency: "USD", symbol: "$" };
}

// Well-known world landmarks mapping for instant search lookup
const WORLD_LANDMARKS: Record<string, { name: string; city: string; country: string; countryCode: string; lat: number; lng: number }> = {
  "eiffel tower": { name: "Eiffel Tower", city: "Paris", country: "France", countryCode: "FR", lat: 48.8584, lng: 2.2945 },
  "louvre museum": { name: "Louvre Museum", city: "Paris", country: "France", countryCode: "FR", lat: 48.8606, lng: 2.3376 },
  "notre dame": { name: "Notre-Dame de Paris", city: "Paris", country: "France", countryCode: "FR", lat: 48.8530, lng: 2.3499 },
  "burj khalifa": { name: "Burj Khalifa", city: "Dubai", country: "United Arab Emirates", countryCode: "AE", lat: 25.1972, lng: 55.2744 },
  "dubai mall": { name: "The Dubai Mall", city: "Dubai", country: "United Arab Emirates", countryCode: "AE", lat: 25.1985, lng: 55.2796 },
  "colosseum": { name: "Colosseum", city: "Rome", country: "Italy", countryCode: "IT", lat: 41.8902, lng: 12.4922 },
  "shibuya crossing": { name: "Shibuya Crossing", city: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6595, lng: 139.7005 },
  "tokyo tower": { name: "Tokyo Tower", city: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6586, lng: 139.7454 },
  "sensoji": { name: "Senso-ji Temple", city: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.7148, lng: 139.7967 },
  "statue of liberty": { name: "Statue of Liberty", city: "New York", country: "United States", countryCode: "US", lat: 40.6892, lng: -74.0445 },
  "central park": { name: "Central Park", city: "New York", country: "United States", countryCode: "US", lat: 40.7829, lng: -73.9654 },
  "times square": { name: "Times Square", city: "New York", country: "United States", countryCode: "US", lat: 40.7580, lng: -73.9855 },
  "big ben": { name: "Big Ben & Palace of Westminster", city: "London", country: "United Kingdom", countryCode: "GB", lat: 51.5007, lng: -0.1246 },
  "london eye": { name: "London Eye", city: "London", country: "United Kingdom", countryCode: "GB", lat: 51.5033, lng: -0.1195 },
  "marina bay sands": { name: "Marina Bay Sands", city: "Singapore", country: "Singapore", countryCode: "SG", lat: 1.2838, lng: 103.8591 },
  "gardens by the bay": { name: "Gardens by the Bay", city: "Singapore", country: "Singapore", countryCode: "SG", lat: 1.2816, lng: 103.8636 },
  "sydney opera house": { name: "Sydney Opera House", city: "Sydney", country: "Australia", countryCode: "AU", lat: -33.8568, lng: 151.2153 },
  "sagrada familia": { name: "Basílica de la Sagrada Família", city: "Barcelona", country: "Spain", countryCode: "ES", lat: 41.4036, lng: 2.1744 },
  "taj mahal": { name: "Taj Mahal", city: "Agra", country: "India", countryCode: "IN", lat: 27.1751, lng: 78.0421 },
  "mysore palace": { name: "Mysore Palace", city: "Mysore", country: "India", countryCode: "IN", lat: 12.3051, lng: 76.6552 },
  "tanah lot": { name: "Tanah Lot Temple", city: "Bali", country: "Indonesia", countryCode: "ID", lat: -8.6212, lng: 115.0868 },
  "ubud monkey forest": { name: "Sacred Monkey Forest Sanctuary", city: "Bali", country: "Indonesia", countryCode: "ID", lat: -8.5188, lng: 115.2582 },
};

// 1. GLOBAL GEOCODING API
app.get("/api/geocode", async (req, res) => {
  const query = (req.query.q as string || "").trim();
  if (!query) {
    return res.json({ results: [] });
  }

  const queryLower = query.toLowerCase();
  const matchedLandmarkKey = Object.keys(WORLD_LANDMARKS).find(k => queryLower.includes(k) || k.includes(queryLower));

  try {
    // 1. Check Open-Meteo Geocoding API (Fast, completely free, covers all world cities and locations)
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
    const response = await fetch(geocodeUrl);
    
    if (response.ok) {
      const data = await response.json();
      const rawResults = data.results || [];

      const formattedResults = rawResults.map((item: any) => {
        const curr = getCurrencyForCountry(item.country_code, item.country);
        return {
          id: `geo-${item.id}`,
          name: item.name,
          city: item.name,
          state: item.admin1 || "",
          country: item.country || "",
          countryCode: item.country_code || "",
          lat: item.latitude,
          lng: item.longitude,
          displayName: [item.name, item.admin1, item.country].filter(Boolean).join(", "),
          currency: curr.currency,
          currencySymbol: curr.symbol,
          population: item.population,
          elevation: item.elevation,
        };
      });

      // If user typed a specific landmark like "Eiffel Tower" or "Burj Khalifa", prepend landmark
      if (matchedLandmarkKey) {
        const lm = WORLD_LANDMARKS[matchedLandmarkKey];
        const curr = getCurrencyForCountry(lm.countryCode, lm.country);
        formattedResults.unshift({
          id: `lm-${matchedLandmarkKey}`,
          name: lm.name,
          city: lm.city,
          state: "",
          country: lm.country,
          countryCode: lm.countryCode,
          lat: lm.lat,
          lng: lm.lng,
          displayName: `${lm.name}, ${lm.city}, ${lm.country}`,
          currency: curr.currency,
          currencySymbol: curr.symbol,
        });
      }

      if (formattedResults.length > 0) {
        return res.json({ results: formattedResults });
      }
    }
  } catch (err) {
    console.warn("Geocoding service error:", err);
  }

  // Fallback if network fails
  if (matchedLandmarkKey) {
    const lm = WORLD_LANDMARKS[matchedLandmarkKey];
    const curr = getCurrencyForCountry(lm.countryCode, lm.country);
    return res.json({
      results: [{
        id: `lm-${matchedLandmarkKey}`,
        name: lm.name,
        city: lm.city,
        state: "",
        country: lm.country,
        countryCode: lm.countryCode,
        lat: lm.lat,
        lng: lm.lng,
        displayName: `${lm.name}, ${lm.city}, ${lm.country}`,
        currency: curr.currency,
        currencySymbol: curr.symbol,
      }]
    });
  }

  res.json({ results: [] });
});

// 2. REVERSE GEOCODING API (When clicking anywhere on the map)
app.get("/api/reverse-geocode", async (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: "Valid lat and lng required" });
  }

  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
    const response = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'TRAVELIQ-Global-Tourism-App/1.0',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state_district || "Selected Location";
      const countryName = addr.country || "Earth";
      const countryCode = (addr.country_code || "").toUpperCase();
      const stateName = addr.state || "";
      const curr = getCurrencyForCountry(countryCode, countryName);

      return res.json({
        success: true,
        name: data.name || cityName,
        city: cityName,
        state: stateName,
        country: countryName,
        countryCode,
        lat,
        lng,
        displayName: data.display_name || `${cityName}, ${countryName}`,
        currency: curr.currency,
        currencySymbol: curr.symbol,
      });
    }
  } catch (err) {
    console.warn("Reverse geocode error:", err);
  }

  // Generic fallback
  const curr = getCurrencyForCountry("", "");
  res.json({
    success: true,
    name: `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
    city: `Coordinates ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
    state: "",
    country: "International",
    countryCode: "XX",
    lat,
    lng,
    displayName: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
    currency: curr.currency,
    currencySymbol: curr.symbol,
  });
});

// 3. REAL LIVE WEATHER API (Worldwide via Open-Meteo free API)
app.get("/api/weather", async (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: "Valid lat and lng required" });
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const response = await fetch(weatherUrl);

    if (response.ok) {
      const data = await response.json();
      const current = data.current || {};
      const daily = data.daily || {};
      const hourly = data.hourly || {};

      // Interpret WMO weather codes
      const getConditionFromCode = (code: number) => {
        if (code === 0) return { label: "Clear Skies", icon: "☀️", advisory: "Optimal sunny conditions for all outdoor sightseeing." };
        if (code === 1 || code === 2) return { label: "Partly Cloudy", icon: "🌤️", advisory: "Pleasant weather; ideal for walking tours and monuments." };
        if (code === 3) return { label: "Overcast", icon: "☁️", advisory: "Overcast with comfortable cool temperatures." };
        if (code >= 45 && code <= 48) return { label: "Foggy / Mist", icon: "🌫️", advisory: "Reduced visibility; drive carefully and visit indoor sights." };
        if (code >= 51 && code <= 55) return { label: "Light Drizzle", icon: "🌦️", advisory: "Light intermittent rain; keep an umbrella handy." };
        if (code >= 61 && code <= 65) return { label: "Rain Showers", icon: "🌧️", advisory: "Rain expected; schedule indoor museums during peak showers." };
        if (code >= 71 && code <= 77) return { label: "Snow", icon: "❄️", advisory: "Snowy weather; dress in warm thermal layers." };
        if (code >= 80 && code <= 82) return { label: "Heavy Rain", icon: "⛈️", advisory: "Heavy rainfall alert; postpone open-top travel." };
        if (code >= 95) return { label: "Thunderstorm", icon: "⚡", advisory: "Thunderstorm warning; seek sheltered indoor venues." };
        return { label: "Mild & Pleasant", icon: "🌤️", advisory: "Good travel weather." };
      };

      const cond = getConditionFromCode(current.weather_code || 0);
      const temp = Math.round(current.temperature_2m ?? 24);
      const feelsLike = Math.round(current.apparent_temperature ?? temp);
      const humidity = Math.round(current.relative_humidity_2m ?? 55);
      const windSpeed = `${Math.round(current.wind_speed_10m ?? 12)} km/h`;
      const rainProb = Math.round(daily.precipitation_probability_max?.[0] ?? (current.precipitation > 0 ? 80 : 15));

      // Build daily forecast list
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dailyForecasts = (daily.time || []).slice(0, 5).map((dateStr: string, idx: number) => {
        const d = new Date(dateStr);
        const dayCode = daily.weather_code?.[idx] || 0;
        const dayCond = getConditionFromCode(dayCode);
        return {
          day: idx === 0 ? "Today" : dayNames[d.getDay()],
          date: dateStr,
          condition: dayCond.label,
          high: Math.round(daily.temperature_2m_max?.[idx] ?? temp + 2),
          low: Math.round(daily.temperature_2m_min?.[idx] ?? temp - 5),
          rainProb: Math.round(daily.precipitation_probability_max?.[idx] ?? 10),
          icon: dayCond.icon,
          advisory: dayCond.advisory,
        };
      });

      return res.json({
        success: true,
        source: "open-meteo-live",
        temp,
        feelsLike,
        condition: cond.label,
        humidity,
        windSpeed,
        rainProb,
        icon: cond.icon,
        advisory: cond.advisory,
        daily: dailyForecasts,
      });
    }
  } catch (err) {
    console.warn("Weather service error:", err);
  }

  // Safe fallback weather
  res.json({
    success: true,
    source: "fallback",
    temp: 24,
    feelsLike: 25,
    condition: "Partly Cloudy",
    humidity: 50,
    windSpeed: "10 km/h",
    rainProb: 15,
    icon: "🌤️",
    advisory: "Favorable conditions for exploring the city.",
    daily: [
      { day: "Today", date: "2026-09-12", condition: "Partly Cloudy", high: 26, low: 18, rainProb: 15, icon: "🌤️" },
      { day: "Sun", date: "2026-09-13", condition: "Sunny", high: 27, low: 19, rainProb: 10, icon: "☀️" },
      { day: "Mon", date: "2026-09-14", condition: "Scattered Clouds", high: 25, low: 17, rainProb: 20, icon: "⛅" },
    ]
  });
});

// 4. DESTINATION DATA API (Dynamic attractions, hotels, restaurants, transport, rentals for ANY place)
app.get("/api/destination-data", async (req, res) => {
  const name = (req.query.name as string || "Paris").trim();
  const lat = parseFloat(req.query.lat as string) || 48.8566;
  const lng = parseFloat(req.query.lng as string) || 2.3522;
  const country = (req.query.country as string || "France").trim();
  const countryCode = (req.query.countryCode as string || "FR").trim();

  const curr = getCurrencyForCountry(countryCode, country);
  const gemini = getGeminiClient();

  // Try generating rich local dynamic destination data if Gemini is available
  if (gemini) {
    try {
      const prompt = `Generate tourism intelligence for the destination: "${name}", ${country} (Coordinates: ${lat}, ${lng}).
Local Currency: ${curr.currency} (${curr.symbol}).
Return strictly valid JSON with no markdown wrapping:
{
  "name": "${name}",
  "country": "${country}",
  "tagline": "Short captivating sentence about ${name}",
  "description": "2-sentence overview for visitors",
  "attractions": [
    {
      "id": "att-1",
      "name": "Attraction Name",
      "category": "Heritage/Nature/Iconic",
      "rating": 4.8,
      "reviewsCount": 12000,
      "distanceKm": 1.5,
      "coordinates": { "lat": ${lat + 0.005}, "lng": ${lng + 0.005} },
      "status": { "state": "open", "label": "Open Today", "color": "#10b981", "openingHours": "09:00 AM - 06:00 PM", "entryFee": 20 },
      "highlights": ["Highlight 1", "Highlight 2"],
      "suggestedDuration": "2 hours",
      "isIndoor": false,
      "weatherSuitability": "Best in sunny or mild conditions"
    }
  ],
  "hotels": [
    {
      "id": "hot-1",
      "name": "Hotel Name",
      "rating": 4.6,
      "reviewsCount": 850,
      "pricePerNight": 150,
      "distanceFromDestination": "1.2 km",
      "amenities": ["WiFi", "Breakfast", "Air Conditioning", "Pool"],
      "roomType": "Deluxe Room",
      "coordinates": { "lat": ${lat - 0.004}, "lng": ${lng + 0.003} }
    }
  ],
  "restaurants": [
    {
      "id": "res-1",
      "name": "Restaurant Name",
      "cuisine": "Local & Gourmet",
      "rating": 4.7,
      "priceRange": "$$",
      "coordinates": { "lat": ${lat + 0.003}, "lng": ${lng - 0.004} }
    }
  ],
  "transports": [
    {
      "id": "tr-1",
      "type": "Metro / Bus / Train",
      "providerName": "City Transit",
      "vehicleModel": "Transit Line",
      "duration": "25 mins",
      "price": 3,
      "frequency": "Every 5 mins",
      "tag": "Fastest",
      "status": "On Time"
    }
  ],
  "alerts": [
    "Peak tourist queues between 11 AM - 3 PM; book tickets online in advance."
  ]
}`;

      const parsed = await generateJsonWithFallback(gemini, prompt, 0.3);
      if (parsed && (parsed.attractions?.length || parsed.name)) {
        return res.json({
          success: true,
          source: "gemini-ai",
          currency: curr.currency,
          currencySymbol: curr.symbol,
          data: parsed,
        });
      }
    } catch {
      // Smoothly fall through to algorithmic dynamic generator
    }
  }

  // Algorithmic dynamic tourism generator for any location on Earth
  const sampleAttractions = [
    {
      id: `att-${name.toLowerCase().replace(/\s+/g, '-')}-1`,
      name: `${name} Historic Center & Grand Plaza`,
      category: "Heritage",
      tagline: `Iconic focal point of ${name}`,
      description: `Historic heart featuring ornate architecture, pedestrian promenades, and cultural landmarks.`,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 14500,
      distanceKm: 1.2,
      coordinates: { lat: lat + 0.004, lng: lng + 0.003 },
      status: { state: "open", label: "Open Today", color: "#10b981", openingHours: "09:00 AM - 07:00 PM", entryFee: 15, crowdLevel: "Moderate", lastChecked: "Live 10m ago" },
      highlights: ["Panoramic architecture", "Photo viewpoints", "Guided tours"],
      suggestedDuration: "2 - 2.5 hours",
      isIndoor: false,
      weatherSuitability: "Best in morning or sunset hours",
    },
    {
      id: `att-${name.toLowerCase().replace(/\s+/g, '-')}-2`,
      name: `${name} National Art & Culture Museum`,
      category: "Cultural",
      tagline: `Renowned collections of regional & global fine arts`,
      description: `Spacious indoor galleries housing historic masterworks, sculptures, and rotating exhibitions.`,
      image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: 8900,
      distanceKm: 2.1,
      coordinates: { lat: lat - 0.005, lng: lng - 0.004 },
      status: { state: "open", label: "Open Today", color: "#10b981", openingHours: "10:00 AM - 05:30 PM", entryFee: 18, crowdLevel: "Low", lastChecked: "Live 5m ago" },
      highlights: ["Indoor master collections", "Audio guide headsets", "Climate-controlled galleries"],
      suggestedDuration: "2 hours",
      isIndoor: true,
      weatherSuitability: "Perfect during afternoon heat or rain",
    },
    {
      id: `att-${name.toLowerCase().replace(/\s+/g, '-')}-3`,
      name: `${name} Botanical Gardens & Waterfront`,
      category: "Nature",
      tagline: `Tranquil landscaped gardens and waterside walkway`,
      description: `Lush green sanctuaries with exotic flora, shaded walking trails, and serene water fountains.`,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviewsCount: 6200,
      distanceKm: 3.4,
      coordinates: { lat: lat + 0.008, lng: lng - 0.006 },
      status: { state: "open", label: "Open Today", color: "#10b981", openingHours: "08:00 AM - 06:30 PM", entryFee: 8, crowdLevel: "Low", lastChecked: "Live 15m ago" },
      highlights: ["Shaded garden pathways", "Cafes by the water", "Bird watching"],
      suggestedDuration: "1.5 hours",
      isIndoor: false,
      weatherSuitability: "Ideal for pleasant mornings",
    },
  ];

  const sampleHotels = [
    {
      id: `hotel-${name.toLowerCase().replace(/\s+/g, '-')}-1`,
      name: `Grand ${name} Palace & Spa`,
      city: name,
      country,
      location: `Central ${name}`,
      address: `10 Avenue du Centre, ${name}`,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 1420,
      pricePerNight: curr.currency === "INR" ? 5200 : curr.currency === "EUR" ? 180 : curr.currency === "GBP" ? 160 : curr.currency === "JPY" ? 22000 : 160,
      currency: curr.currency,
      currencySymbol: curr.symbol,
      distanceFromDestination: "0.8 km",
      availableRooms: 6,
      amenities: ["Free High-Speed WiFi", "Artisan Breakfast", "Rooftop Pool", "Concierge", "EV Charging"],
      roomType: "Executive King Room",
      badge: "Top Rated",
      cancellationPolicy: "Free cancellation until 24 hours prior",
      coordinates: { lat: lat - 0.003, lng: lng + 0.004 },
    },
    {
      id: `hotel-${name.toLowerCase().replace(/\s+/g, '-')}-2`,
      name: `${name} Boutique Suites`,
      city: name,
      country,
      location: `Historic Arts Quarter, ${name}`,
      address: `42 Heritage Way, ${name}`,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviewsCount: 980,
      pricePerNight: curr.currency === "INR" ? 3400 : curr.currency === "EUR" ? 115 : curr.currency === "GBP" ? 105 : curr.currency === "JPY" ? 15000 : 110,
      currency: curr.currency,
      currencySymbol: curr.symbol,
      distanceFromDestination: "1.4 km",
      availableRooms: 9,
      amenities: ["WiFi", "Continental Breakfast", "Air Conditioning", "Bicycle Rental"],
      roomType: "Superior Queen Room",
      badge: "Great Value",
      cancellationPolicy: "Free cancellation within 48 hours",
      coordinates: { lat: lat + 0.005, lng: lng - 0.003 },
    }
  ];

  const sampleTransports = [
    {
      id: "tr-fast",
      type: "Train",
      providerName: "Express High-Speed Rail",
      vehicleModel: "InterCity Express",
      origin: "Main Transport Terminal",
      destination: name,
      departureTime: "08:15 AM",
      arrivalTime: "09:45 AM",
      duration: "1h 30m",
      price: curr.currency === "INR" ? 450 : curr.currency === "EUR" ? 28 : curr.currency === "GBP" ? 24 : 32,
      currencySymbol: curr.symbol,
      frequency: "Every 30 mins",
      status: "On Time",
      tag: "Fastest",
      recommended: true,
      features: ["Complimentary WiFi", "Power Sockets", "Scenic Views"],
    },
    {
      id: "tr-cheap",
      type: "Bus",
      providerName: "Regional Express Coach",
      vehicleModel: "Air-Conditioned Coach",
      origin: "Central Bus Interchange",
      destination: name,
      departureTime: "08:45 AM",
      arrivalTime: "10:55 AM",
      duration: "2h 10m",
      price: curr.currency === "INR" ? 220 : curr.currency === "EUR" ? 14 : curr.currency === "GBP" ? 12 : 16,
      currencySymbol: curr.symbol,
      frequency: "Every 45 mins",
      status: "On Schedule",
      tag: "Cheapest",
      features: ["AC", "Luggage Hold", "Direct Route"],
    },
    {
      id: "tr-conv",
      type: "Car",
      providerName: "Private Ride & Taxi",
      vehicleModel: "Premium Sedan / EV",
      origin: "Doorstep Pickup",
      destination: name,
      departureTime: "Flexible / On Demand",
      arrivalTime: "Flexible",
      duration: "1h 45m",
      price: curr.currency === "INR" ? 1800 : curr.currency === "EUR" ? 75 : curr.currency === "GBP" ? 65 : 85,
      currencySymbol: curr.symbol,
      frequency: "Immediate",
      status: "Available Now",
      tag: "Most Convenient",
      features: ["Door-to-Door", "GPS Tracking", "Custom Stops"],
    }
  ];

  res.json({
    success: true,
    source: "dynamic-engine",
    currency: curr.currency,
    currencySymbol: curr.symbol,
    data: {
      name,
      country,
      tagline: `Discover the wonders, rich culture, and sights of ${name}.`,
      description: `${name} welcomes global travelers with vibrant neighborhoods, world-class attractions, and authentic dining.`,
      attractions: sampleAttractions,
      hotels: sampleHotels,
      transports: sampleTransports,
      alerts: [
        `Tourist pass available for 20% discount across museums in ${name}.`,
        `Favorable travel season; book weekend monument tickets online in advance.`
      ]
    }
  });
});

// 5. AI TRIP PLANNING API (Worldwide: Paris, Tokyo, Bali, New York, London, Mysore, or ANY location)
app.post("/api/plan-trip", async (req, res) => {
  const { 
    destination = "Paris", 
    budget = 500, 
    days = 3, 
    travelers = 2, 
    preferences = "History, photography, local cuisine", 
    travelDate = "Upcoming weekend",
    currency = "EUR",
    currencySymbol = "€",
    lat,
    lng
  } = req.body;

  const numBudget = Number(budget) || (currency === "INR" ? 5000 : 500);
  const numDays = Math.min(Math.max(Number(days) || 3, 1), 7);
  const targetLat = parseFloat(lat) || 48.8566;
  const targetLng = parseFloat(lng) || 2.3522;
  const curr = getCurrencyForCountry("", destination);
  const activeSymbol = currencySymbol || curr.symbol;

  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const prompt = `You are TRAVELIQ's Global Smart Tourism AI Planner.
Create a comprehensive, realistic, weather-aware ${numDays}-day travel itinerary for "${destination}".
Budget: ${activeSymbol}${numBudget} for ${travelers} traveler(s).
User Interests: ${preferences}.
Travel Date: ${travelDate}.

Requirements:
1. Coordinate realistic schedules that minimize transit fatigue.
2. Group nearby attractions together on each day.
3. Recommend an appropriate hotel within the budget category with nightly price.
4. Recommend intercity/local transport with estimated cost in ${activeSymbol}.
5. Provide a practical weather tip advising outdoor attractions during pleasant times and indoor galleries during hot/rainy hours.
6. Provide realistic latitude and longitude coordinates for every single scheduled activity and the hotel, centered around coordinates approx (${targetLat}, ${targetLng}).
7. Output strictly valid JSON matching this schema:
{
  "title": "${numDays}-Day Smart Itinerary for ${destination}",
  "destination": "${destination}",
  "duration": "${numDays} Days",
  "budgetCategory": "Moderate",
  "estimatedTotalBudget": ${Math.round(numBudget * 0.9)},
  "currencySymbol": "${activeSymbol}",
  "totalDistanceKm": 24.5,
  "estimatedTravelTime": "45 mins/day",
  "recommendedHotel": {
    "name": "Hotel Name in ${destination}",
    "pricePerNight": ${Math.round(numBudget * 0.3 / numDays)},
    "reason": "Central location near transit lines"
  },
  "recommendedTransport": {
    "mode": "Metro & Regional Rail",
    "provider": "City Metro Pass",
    "estimatedCost": ${Math.round(numBudget * 0.08)},
    "reason": "Fastest and most economical way to navigate between attractions"
  },
  "weatherTip": "Pleasant morning temperatures; visit open monuments before 1 PM and indoor museums during afternoon peak hours.",
  "days": [
    {
      "dayNumber": 1,
      "title": "Iconic Landmarks & Historic Center",
      "highlights": ["Top Attraction 1", "Regional Lunch", "Top Attraction 2"],
      "schedule": [
        {
          "time": "09:00 AM",
          "activity": "Morning Landmark Exploration",
          "placeName": "Landmark 1",
          "duration": "2.5 hrs",
          "isOutdoor": true,
          "coordinates": { "lat": ${targetLat + 0.003}, "lng": ${targetLng + 0.004} },
          "note": "Arrive early to beat queues."
        },
        {
          "time": "01:00 PM",
          "activity": "Authentic Cuisine Lunch",
          "placeName": "Traditional Bistro",
          "duration": "1 hr",
          "isOutdoor": false,
          "coordinates": { "lat": ${targetLat + 0.001}, "lng": ${targetLng + 0.002} },
          "note": "Famous local specialties."
        },
        {
          "time": "02:30 PM",
          "activity": "Indoor Museum & Art Exhibition",
          "placeName": "National Museum",
          "duration": "2 hrs",
          "isOutdoor": false,
          "coordinates": { "lat": ${targetLat - 0.004}, "lng": ${targetLng - 0.003} },
          "note": "Air-conditioned collections."
        }
      ]
    }
  ],
  "alertsConsidered": [
    "Peak tourist lines minimized with morning entry",
    "Indoor contingency applied during peak afternoon sun"
  ]
}`;

      const parsed = await generateJsonWithFallback(gemini, prompt, 0.4);
      if (parsed && parsed.days && Array.isArray(parsed.days) && parsed.days.length > 0) {
        return res.json({ success: true, plan: parsed, source: "gemini" });
      }
    } catch {
      // Smoothly fall through to dynamic intelligent fallback planner
    }
  }

  // Dynamic intelligent world fallback planner
  const isParis = destination.toLowerCase().includes("paris");
  const isTokyo = destination.toLowerCase().includes("tokyo");
  const isNY = destination.toLowerCase().includes("new york");
  const isDubai = destination.toLowerCase().includes("dubai");
  const isMysore = destination.toLowerCase().includes("mysore");

  let hotelName = `Grand ${destination} Boutique Hotel`;
  let hotelRate = Math.round(numBudget * 0.32 / numDays);
  let transportMode = "Metro & Light Rail Transit";
  let transportCost = Math.round(numBudget * 0.08);

  if (isParis) {
    hotelName = "Hôtel Le Grand Marais (Deluxe Room)";
    transportMode = "Paris RATP Metro & RER Day Pass";
  } else if (isTokyo) {
    hotelName = "Shinjuku Granbell Hotel";
    transportMode = "Tokyo Metro & Toei Subways 72h Ticket";
  } else if (isNY) {
    hotelName = "The Manhattan Club Suites";
    transportMode = "MTA Subway 7-Day Unlimited";
  } else if (isDubai) {
    hotelName = "Address Downtown Dubai";
    transportMode = "Dubai Metro Red Line & Nol Card";
  } else if (isMysore) {
    hotelName = "Grand Mercure Mysore";
    transportMode = "KSRTC Airavat AC Bus";
  }

  const generatedDays = [];
  for (let i = 1; i <= numDays; i++) {
    const latOffset = (i - 1) * 0.006;
    const lngOffset = (i - 1) * 0.005;

    let dayTitle = `Day ${i}: Highlights & Exploration`;
    let place1 = `${destination} Historic Plaza`;
    let place2 = `${destination} Traditional Cafe & Lunch`;
    let place3 = `${destination} Art Museum & Gallery`;
    let place4 = `${destination} Sunset Promenade`;

    if (isParis) {
      if (i === 1) {
        dayTitle = "Day 1: Royal Icons & The Seine";
        place1 = "Eiffel Tower & Champ de Mars";
        place2 = "Café de Flore Bistro Lunch";
        place3 = "Louvre Museum Galleries";
        place4 = "Seine River Sunset Cruise";
      } else if (i === 2) {
        dayTitle = "Day 2: Bohemian Montmartre & Historic Latin Quarter";
        place1 = "Sacré-Cœur Basilica & Place du Tertre";
        place2 = "Bouillon Chartier Authentic Lunch";
        place3 = "Musée d'Orsay Impressionist Art";
        place4 = "Notre-Dame & Shakespeare and Company";
      } else {
        dayTitle = "Day 3: Palace Splendor & Royal Gardens";
        place1 = "Arc de Triomphe & Champs-Élysées";
        place2 = "Le Marais Gourmet Tasting";
        place3 = "Centre Pompidou Modern Art";
        place4 = "Jardin du Luxembourg";
      }
    } else if (isTokyo) {
      if (i === 1) {
        dayTitle = "Day 1: Historic Asakusa & Futuristic Shibuya";
        place1 = "Senso-ji Temple & Nakamise Street";
        place2 = "Asakusa Ramen Lunch";
        place3 = "Tokyo National Museum";
        place4 = "Shibuya Crossing & Sky Observatory";
      } else if (i === 2) {
        dayTitle = "Day 2: Imperial Palace & Neon Shinjuku";
        place1 = "Meiji Jingu Shrine & Yoyogi Park";
        place2 = "Harajuku Street Food";
        place3 = "Mori Art Museum Roppongi";
        place4 = "Omoide Yokocho Shinjuku";
      } else {
        dayTitle = "Day 3: Bay Area & Electric Akihabara";
        place1 = "Tsukiji Outer Market Tasting";
        place2 = "Ginza Specialty Dining";
        place3 = "TeamLab Planets Immersive Exhibition";
        place4 = "Odaiba Rainbow Bridge Walk";
      }
    }

    generatedDays.push({
      dayNumber: i,
      title: dayTitle,
      highlights: [place1, place3, place4],
      schedule: [
        {
          time: "09:00 AM",
          activity: "Morning Architectural & Sightseeing Tour",
          placeName: place1,
          duration: "2.5 hrs",
          isOutdoor: true,
          coordinates: { lat: targetLat + 0.003 + latOffset, lng: targetLng + 0.004 + lngOffset },
          note: "Arrive early for soft morning light and shortest queues.",
        },
        {
          time: "01:00 PM",
          activity: "Authentic Regional Cuisine Lunch",
          placeName: place2,
          duration: "1 hr",
          isOutdoor: false,
          coordinates: { lat: targetLat + 0.001 + latOffset, lng: targetLng + 0.002 + lngOffset },
          note: "Sampling renowned local chef specialties.",
        },
        {
          time: "02:30 PM",
          activity: "Indoor Art Museum & Heritage Galleries",
          placeName: place3,
          duration: "2.5 hrs",
          isOutdoor: false,
          coordinates: { lat: targetLat - 0.003 + latOffset, lng: targetLng - 0.002 + lngOffset },
          note: "Climate-controlled galleries optimal during afternoon temperatures.",
        },
        {
          time: "06:30 PM",
          activity: "Sunset Promenade & Evening Illumination",
          placeName: place4,
          duration: "1.5 hrs",
          isOutdoor: true,
          coordinates: { lat: targetLat + 0.005 + latOffset, lng: targetLng - 0.004 + lngOffset },
          note: "Vibrant evening ambiance and illuminated city vistas.",
        }
      ]
    });
  }

  const fallbackPlan = {
    title: `${numDays}-Day Smart Travel Itinerary for ${destination}`,
    destination,
    duration: `${numDays} Days`,
    budgetCategory: (numBudget < 400 ? 'Budget' : numBudget > 1200 ? 'Luxury' : 'Moderate'),
    estimatedTotalBudget: Math.round(numBudget * 0.88),
    currencySymbol: activeSymbol,
    totalDistanceKm: Math.round(numDays * 7.5),
    estimatedTravelTime: "35–50 mins/day",
    recommendedHotel: {
      name: hotelName,
      pricePerNight: hotelRate,
      reason: "Central location with complimentary breakfast, direct transit connectivity and luggage lockers."
    },
    recommendedTransport: {
      mode: transportMode,
      provider: "City Transit Authority",
      estimatedCost: transportCost,
      reason: "Seamless city-wide access avoiding surface traffic bottlenecks."
    },
    weatherTip: "⚠️ Plan outdoor walking trails and viewpoints during cool morning hours. Indoor museums and cultural galleries scheduled for afternoon hours.",
    days: generatedDays,
    alertsConsidered: [
      "Optimized walking corridors to minimize transit costs",
      "Indoor afternoon scheduling to protect from peak heat and rain",
      "Pre-booked landmark timing slots to bypass main queues"
    ]
  };

  res.json({ success: true, plan: fallbackPlan, source: "smart-engine" });
});

// Start Express server and bind Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TRAVELIQ Server running on port ${PORT}`);
  });
}

startServer();
