import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Locate, 
  CloudSun, 
  Hotel as HotelIcon, 
  Bus, 
  Train, 
  Plane, 
  Car, 
  Sparkles, 
  X, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Bookmark, 
  SlidersHorizontal,
  Utensils,
  Globe,
  Share2,
  Calendar,
  Ticket
} from 'lucide-react';
import { Destination, Hotel, MapPOI, AITripPlan, WorldLocation } from '../types';
import { POPULAR_WORLD_DESTINATIONS, generatePOIsForLocation } from '../data/worldData';
import { WorldMap, WorldMapLayers, WorldMapRoute } from './WorldMap';

interface ExploreMapViewProps {
  destinations?: Destination[];
  hotels?: Hotel[];
  activeTripPlan?: AITripPlan | null;
  initialLocation?: WorldLocation | null;
  onSelectDestination?: (dest: WorldLocation) => void;
  onSelectHotel?: (hotel: Hotel) => void;
  onOpenBookingModal?: (hotelName: string, price: number) => void;
  onStartAIPlan?: (city: string, worldLoc?: WorldLocation) => void;
  onExploreDestination?: (worldLoc: WorldLocation) => void;
}

export const ExploreMapView: React.FC<ExploreMapViewProps> = ({
  activeTripPlan = null,
  initialLocation = null,
  onSelectDestination,
  onOpenBookingModal,
  onStartAIPlan,
  onExploreDestination,
}) => {
  // Current active world location (Default: Paris, France)
  const defaultLocation: WorldLocation = POPULAR_WORLD_DESTINATIONS[0];
  const [currentLocation, setCurrentLocation] = useState<WorldLocation>(initialLocation || defaultLocation);

  // Map viewport state
  const [mapCenter, setMapCenter] = useState<[number, number]>([currentLocation.lat, currentLocation.lng]);
  const [mapZoom, setMapZoom] = useState<number>(13);

  // Search & Geocoding state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WorldLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // POI & Destination Data
  const [activePOIs, setActivePOIs] = useState<MapPOI[]>(() => 
    generatePOIsForLocation(currentLocation.name, currentLocation.lat, currentLocation.lng, currentLocation.currency || 'EUR', currentLocation.currencySymbol || '€')
  );
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(activePOIs[0] || null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  // Reverse Geocode popup / click inspector
  const [clickedLocation, setClickedLocation] = useState<WorldLocation | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Live Weather for current location
  const [locationWeather, setLocationWeather] = useState<{
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: string;
    rainProb: number;
    icon: string;
    advisory: string;
  } | null>(null);

  // Route Planning Drawer
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);
  const [routeMode, setRouteMode] = useState<'car' | 'bus' | 'train' | 'flight'>('car');
  const [routeStartName, setRouteStartName] = useState('Current Position (GPS)');
  const [routeDestinationName, setRouteDestinationName] = useState(currentLocation.name);

  // Layer Visibility
  const [layers, setLayers] = useState<WorldMapLayers>({
    attractions: true,
    hotels: true,
    restaurants: true,
    busStations: true,
    trainStations: true,
    airports: true,
    vehicleRentals: true,
    hospitals: true,
    touristInfo: true,
    routes: true,
    weather: true,
  });
  const [showLayersDrawer, setShowLayersDrawer] = useState(false);
  const [showAIItineraryRoute, setShowAIItineraryRoute] = useState(Boolean(activeTripPlan));

  // Update when initialLocation prop changes
  useEffect(() => {
    if (initialLocation) {
      handleSelectLocation(initialLocation);
    }
  }, [initialLocation?.name, initialLocation?.lat, initialLocation?.lng]);

  // Load dynamic POIs and real live weather whenever currentLocation changes
  useEffect(() => {
    const symbol = currentLocation.currencySymbol || '€';
    const curr = currentLocation.currency || 'EUR';
    const pois = generatePOIsForLocation(currentLocation.name, currentLocation.lat, currentLocation.lng, curr, symbol);
    setActivePOIs(pois);
    setSelectedPOI(pois[0] || null);

    // Fetch live weather
    fetch(`/api/weather?lat=${currentLocation.lat}&lng=${currentLocation.lng}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLocationWeather({
            temp: data.temp,
            feelsLike: data.feelsLike,
            condition: data.condition,
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            rainProb: data.rainProb,
            icon: data.icon,
            advisory: data.advisory,
          });
        }
      })
      .catch(err => console.warn('Weather fetch failed:', err));
  }, [currentLocation.name, currentLocation.lat, currentLocation.lng]);

  // Worldwide Geocoding Search handler with debouncing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          setIsSearching(false);
          if (data.results) {
            setSearchResults(data.results);
            setSearchOpen(true);
          }
        })
        .catch(err => {
          setIsSearching(false);
          console.warn('Geocoding error:', err);
        });
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Location Selection
  const handleSelectLocation = (loc: WorldLocation) => {
    setCurrentLocation(loc);
    setMapCenter([loc.lat, loc.lng]);
    setMapZoom(13.5);
    setSearchQuery('');
    setSearchOpen(false);
    setClickedLocation(null);
    setRouteDestinationName(loc.name);
    if (onSelectDestination) {
      onSelectDestination(loc);
    }
  };

  // Handle Map Click: Worldwide Reverse Geocoding
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data.success) {
        const clickedLoc: WorldLocation = {
          name: data.name || 'Selected Location',
          city: data.city || data.name,
          state: data.state || '',
          country: data.country || 'International',
          countryCode: data.countryCode || 'XX',
          lat: data.lat,
          lng: data.lng,
          displayName: data.displayName,
          currency: data.currency || 'USD',
          currencySymbol: data.currencySymbol || '$',
        };
        setClickedLocation(clickedLoc);
        setIsSidePanelOpen(true);
      }
    } catch (err) {
      console.warn('Reverse geocode error:', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  // Compute Routes to display on map
  const activeRoutes: WorldMapRoute[] = useMemo(() => {
    const routesList: WorldMapRoute[] = [];

    // 1. If Route Planner is open or user wants directions
    if (layers.routes && currentLocation) {
      const lat = currentLocation.lat;
      const lng = currentLocation.lng;

      // Primary transit/road corridor
      routesList.push({
        id: 'main-transit-artery',
        name: `${routeMode.toUpperCase()} Route to ${currentLocation.name}`,
        mode: routeMode,
        color: routeMode === 'car' ? '#3b82f6' : routeMode === 'bus' ? '#10b981' : routeMode === 'train' ? '#8b5cf6' : '#ec4899',
        weight: 5,
        coordinates: [
          [lat - 0.035, lng - 0.045],
          [lat - 0.022, lng - 0.028],
          [lat - 0.010, lng - 0.012],
          [lat, lng],
          [lat + 0.008, lng + 0.015],
          [lat + 0.025, lng + 0.032],
        ]
      });
    }

    // 2. If AI Trip Itinerary is active, draw the day tour route connecting scheduled stops!
    if (showAIItineraryRoute && activeTripPlan && activeTripPlan.days) {
      const dayStops: [number, number][] = [];
      activeTripPlan.days.forEach(day => {
        day.schedule.forEach(item => {
          if (item.coordinates && item.coordinates.lat && item.coordinates.lng) {
            dayStops.push([item.coordinates.lat, item.coordinates.lng]);
          }
        });
      });

      if (dayStops.length > 1) {
        routesList.push({
          id: 'ai-itinerary-route',
          name: 'AI Scheduled Daily Itinerary',
          mode: 'itinerary',
          color: '#f59e0b',
          weight: 4,
          coordinates: dayStops,
        });
      } else if (activePOIs.length >= 3) {
        // Fallback connecting top attractions into a walking loop
        routesList.push({
          id: 'ai-itinerary-route-preview',
          name: 'AI Scheduled Daily Itinerary',
          mode: 'itinerary',
          color: '#f59e0b',
          weight: 4,
          coordinates: [
            [activePOIs[0].lat, activePOIs[0].lng],
            [activePOIs[1].lat, activePOIs[1].lng],
            [activePOIs[2].lat, activePOIs[2].lng],
          ],
        });
      }
    }

    return routesList;
  }, [layers.routes, currentLocation.lat, currentLocation.lng, routeMode, showAIItineraryRoute, activeTripPlan, activePOIs]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-950">
      {/* 1. TOP GLOBAL SEARCH & INTELLIGENCE BAR */}
      <div className="absolute top-3 left-3 right-16 sm:right-20 z-30 flex flex-col gap-2 max-w-3xl pointer-events-auto">
        <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 px-3 py-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500">
          <Globe className="w-5 h-5 text-blue-600 shrink-0 mr-2" />
          <input
            id="input-global-map-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search any Indian city, state, heritage monument, or address..."
            className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden py-1"
          />
          {isSearching ? (
            <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mr-2" />
          ) : searchQuery ? (
            <button
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-slate-400 mr-1" />
          )}

          {/* Quick Route button */}
          <button
            id="btn-toggle-routes-drawer"
            onClick={() => setShowRoutePlanner(!showRoutePlanner)}
            className="ml-2 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Directions</span>
          </button>

          {/* Layer filters button */}
          <button
            id="btn-toggle-layers-drawer"
            onClick={() => setShowLayersDrawer(!showLayersDrawer)}
            className="ml-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Layers</span>
          </button>
        </div>

        {/* AUTOCOMPLETE SUGGESTIONS POPUP */}
        {searchOpen && searchResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-80 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Locations Found Across India ({searchResults.length})
            </div>
            {searchResults.map((result) => (
              <button
                key={result.id || `${result.lat}-${result.lng}`}
                id={`search-item-${result.id || result.name}`}
                onClick={() => handleSelectLocation(result)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-blue-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                      {result.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate max-w-sm sm:max-w-md">
                      {result.displayName || `${result.city}, ${result.country}`}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 text-[11px] font-semibold text-slate-600">
                  <span>{result.currencySymbol} ({result.currency})</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* POPULAR WORLD DESTINATIONS QUICK CHIPS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {POPULAR_WORLD_DESTINATIONS.map((dest) => {
            const isSelected = (currentLocation?.name || '').toLowerCase() === (dest?.name || '').toLowerCase();
            return (
              <button
                key={dest.name}
                id={`chip-dest-${dest.name.toLowerCase()}`}
                onClick={() => handleSelectLocation(dest)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-white/50'
                    : 'bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700/60'
                }`}
              >
                <span>{dest.flag}</span>
                <span>{dest.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. REUSABLE MAPTILER SATELLITE MAP */}
      <div className="w-full h-full relative z-0">
        <WorldMap
          center={mapCenter}
          zoom={mapZoom}
          markers={activePOIs}
          selectedDestination={currentLocation}
          selectedPOI={selectedPOI}
          routes={activeRoutes}
          mapLayers={layers}
          onSelectPOI={(poi) => {
            setSelectedPOI(poi);
            setIsSidePanelOpen(true);
            setClickedLocation(null);
          }}
          onSelectSettlement={(settlement) => {
            const worldLoc: WorldLocation = {
              name: settlement.name,
              displayName: `${settlement.name}, ${settlement.country}`,
              city: settlement.name,
              country: settlement.country,
              countryCode: settlement.countryCode,
              flag: settlement.flag,
              lat: settlement.lat,
              lng: settlement.lng,
              currency: settlement.countryCode === 'IN' ? 'INR' : settlement.countryCode === 'JP' ? 'JPY' : settlement.countryCode === 'US' ? 'USD' : settlement.countryCode === 'GB' ? 'GBP' : 'EUR',
              currencySymbol: settlement.countryCode === 'IN' ? '₹' : settlement.countryCode === 'JP' ? '¥' : settlement.countryCode === 'US' ? '$' : settlement.countryCode === 'GB' ? '£' : '€',
            };
            handleSelectLocation(worldLoc);
          }}
          onMapClick={handleMapClick}
          onLocateSuccess={(lat, lng) => {
            setMapCenter([lat, lng]);
            setMapZoom(14);
            handleMapClick(lat, lng);
          }}
          className="w-full h-full"
        />
      </div>

      {/* 3. MULTIMODAL ROUTE PLANNER DRAWER */}
      {showRoutePlanner && (
        <div className="absolute top-20 left-3 z-30 w-full max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Multimodal Routes & Directions</span>
            </h4>
            <button
              onClick={() => setShowRoutePlanner(false)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From Origin</label>
              <input
                type="text"
                value={routeStartName}
                onChange={(e) => setRouteStartName(e.target.value)}
                className="w-full mt-0.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-800 border border-slate-200 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">To Destination</label>
              <input
                type="text"
                value={routeDestinationName}
                onChange={(e) => setRouteDestinationName(e.target.value)}
                className="w-full mt-0.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-800 border border-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-4 gap-1 pt-1">
            {[
              { mode: 'car', label: 'Car', icon: Car, tag: 'Fastest' },
              { mode: 'bus', label: 'Bus', icon: Bus, tag: 'Cheapest' },
              { mode: 'train', label: 'Train', icon: Train, tag: 'Scenic' },
              { mode: 'flight', label: 'Flight', icon: Plane, tag: 'Express' },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = routeMode === m.mode;
              return (
                <button
                  key={m.mode}
                  id={`btn-route-${m.mode}`}
                  onClick={() => setRouteMode(m.mode as any)}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-bold">{m.label}</span>
                  <span className={`text-[9px] font-semibold px-1 rounded-sm ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {m.tag}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-950 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>Estimated Travel Time:</span>
              <span className="text-blue-700">{routeMode === 'car' ? '1h 35m' : routeMode === 'bus' ? '2h 15m' : routeMode === 'train' ? '1h 10m' : '50 mins'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 text-[11px]">
              <span>Estimated Cost:</span>
              <span className="font-semibold text-slate-900">{currentLocation.currencySymbol || '€'}{routeMode === 'car' ? '35' : routeMode === 'bus' ? '12' : routeMode === 'train' ? '24' : '80'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAP LAYERS DRAWER */}
      {showLayersDrawer && (
        <div className="absolute top-20 left-3 z-30 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-2 animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Map Layer Controls</span>
            </h4>
            <button onClick={() => setShowLayersDrawer(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            {[
              { key: 'attractions', label: '🏛️ Tourist Attractions' },
              { key: 'hotels', label: '🏨 Hotels & Stays' },
              { key: 'restaurants', label: '🍴 Restaurants & Dining' },
              { key: 'trainStations', label: '🚆 Train Stations' },
              { key: 'busStations', label: '🚌 Bus Stations & Metro' },
              { key: 'airports', label: '✈️ International Airports' },
              { key: 'vehicleRentals', label: '🚗 Vehicle Rentals' },
              { key: 'hospitals', label: '🏥 Hospitals & Medical' },
              { key: 'touristInfo', label: 'ℹ️ Tourist Information' },
              { key: 'routes', label: '🛣️ Navigation Routes' },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <span className="font-medium text-slate-700">{item.label}</span>
                <input
                  type="checkbox"
                  checked={(layers as any)[item.key]}
                  onChange={(e) => setLayers({ ...layers, [item.key]: e.target.checked })}
                  className="rounded-sm text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>
            ))}

            {activeTripPlan && (
              <label className="flex items-center justify-between p-1.5 bg-amber-50 hover:bg-amber-100/80 rounded-lg cursor-pointer border border-amber-200">
                <span className="font-bold text-amber-900">✨ AI Trip Day Route</span>
                <input
                  type="checkbox"
                  checked={showAIItineraryRoute}
                  onChange={(e) => setShowAIItineraryRoute(e.target.checked)}
                  className="rounded-sm text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* 5. ACTIVE ITINERARY ROUTE BANNER (If Active) */}
      {showAIItineraryRoute && activeTripPlan && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-amber-400/40 text-white shadow-xl flex items-center gap-3 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <div className="text-xs">
            <span className="font-bold text-amber-300">AI Planned Route Active:</span> {activeTripPlan.title}
          </div>
          <div className="text-[11px] text-slate-300 border-l border-white/20 pl-2">
            {activeTripPlan.totalDistanceKm || 24} km • {activeTripPlan.currencySymbol || '€'}{activeTripPlan.estimatedTotalBudget}
          </div>
        </div>
      )}

      {/* 6. REVERSE GEOCODE CLICK INSPECTOR (When user clicks on any arbitrary spot on the map) */}
      {clickedLocation && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4 animate-in slide-in-from-bottom duration-200">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                  📍
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{clickedLocation.name}</h4>
                  <p className="text-xs text-slate-500">{clickedLocation.displayName || `${clickedLocation.city}, ${clickedLocation.country}`}</p>
                </div>
              </div>
              <button
                onClick={() => setClickedLocation(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <div className="text-slate-600">
                Coords: <span className="font-mono font-semibold">{clickedLocation.lat.toFixed(3)}°, {clickedLocation.lng.toFixed(3)}°</span>
              </div>
              <div className="text-slate-600">
                Currency: <span className="font-bold">{clickedLocation.currencySymbol} ({clickedLocation.currency})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                id="btn-explore-clicked-dest"
                onClick={() => {
                  handleSelectLocation(clickedLocation);
                  if (onExploreDestination) onExploreDestination(clickedLocation);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                Explore {clickedLocation.name}
              </button>
              <button
                id="btn-plan-trip-clicked-dest"
                onClick={() => {
                  handleSelectLocation(clickedLocation);
                  if (onStartAIPlan) onStartAIPlan(clickedLocation.name, clickedLocation);
                }}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Plan Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. SELECTED POI DETAIL SLIDE-OVER PANEL */}
      {selectedPOI && isSidePanelOpen && !clickedLocation && (
        <div className="absolute top-20 right-3 bottom-6 z-20 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
          {/* Header Image */}
          <div className="relative h-44 bg-slate-100 shrink-0">
            <img
              src={selectedPOI.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"}
              alt={selectedPOI.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setIsSidePanelOpen(false)}
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center cursor-pointer shadow-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1.5">
              <span>{selectedPOI.icon || '📍'}</span>
              <span className="capitalize">{selectedPOI.category}</span>
            </div>
            {selectedPOI.isOpen !== undefined && (
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                {selectedPOI.statusText || 'Open Now'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 leading-snug">{selectedPOI.name}</h3>
                {selectedPOI.rating && (
                  <span className="text-xs font-bold text-amber-500 shrink-0 ml-2">★ {selectedPOI.rating}</span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedPOI.description}</p>
            </div>

            {/* Operating Hours & Tickets */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
              {selectedPOI.operatingHours && (
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Hours:</span>
                  <span className="font-semibold">{selectedPOI.operatingHours}</span>
                </div>
              )}
              {selectedPOI.entryFee !== undefined && (
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Ticket / Fee:</span>
                  <span className="font-bold text-slate-900">
                    {selectedPOI.entryFee === 0 ? 'Free Entry' : `${selectedPOI.currencySymbol || currentLocation.currencySymbol || '€'}${selectedPOI.entryFee}`}
                  </span>
                </div>
              )}
              {selectedPOI.estimatedCost && (
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Rate:</span>
                  <span className="font-bold text-slate-900">{selectedPOI.estimatedCost}</span>
                </div>
              )}
              {selectedPOI.estimatedVisitDuration && (
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Recommended Time:</span>
                  <span className="font-semibold">{selectedPOI.estimatedVisitDuration}</span>
                </div>
              )}
            </div>

            {/* Weather advisory */}
            {selectedPOI.weatherAdvisory && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                🌤️ <span className="font-bold">Weather Tip:</span> {selectedPOI.weatherAdvisory}
              </div>
            )}
          </div>

          {/* Action Buttons Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center gap-2">
            {selectedPOI.category === 'hotel' ? (
              <button
                id={`btn-book-poi-${selectedPOI.id}`}
                onClick={() => onOpenBookingModal && onOpenBookingModal(selectedPOI.name, 160)}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <HotelIcon className="w-3.5 h-3.5" />
                Book Stay
              </button>
            ) : (
              <button
                onClick={() => {
                  setRouteDestinationName(selectedPOI.name);
                  setShowRoutePlanner(true);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                Directions
              </button>
            )}

            <button
              onClick={() => {
                if (onExploreDestination) onExploreDestination(currentLocation);
              }}
              className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold cursor-pointer transition-colors"
            >
              Explore {currentLocation.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
