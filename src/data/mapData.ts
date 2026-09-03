import { MapPOI } from '../types';

export interface RouteOptionDetail {
  mode: 'car' | 'bus' | 'train';
  modeLabel: string;
  duration: string;
  cost: number;
  costFormatted: string;
  provider: string;
  frequency: string;
  weatherSuitability: string;
  isRecommended: boolean;
  recommendationReason: string;
  trafficLevel: 'Low' | 'Moderate' | 'Heavy';
  stopsCount: number;
  co2Savings?: string;
  coordinates: [number, number][];
}

export const MAP_POIS_DATA: MapPOI[] = [
  // --- TOURIST ATTRACTIONS ---
  {
    id: 'poi-palace',
    associatedId: 'mysore-palace',
    name: 'Mysore Palace & Durbar Hall',
    category: 'attraction',
    lat: 12.3051,
    lng: 76.6552,
    icon: '🏰',
    description: 'Iconic royal seat of the Wadiyar dynasty. Majestic Indo-Saracenic architecture with 100,000 bulbs weekend illumination.',
    rating: 4.7,
    priceRange: '₹100 / Adult',
    entryFee: 100,
    isOpen: true,
    statusText: 'Open Today',
    operatingHours: '10:00 AM – 05:30 PM (Sunday Illumination 7 PM)',
    timings: '10:00 AM – 05:30 PM',
    distanceKm: 2.1,
    weather: { temp: 27, condition: 'Partly Cloudy', rainProb: 15, icon: '🌤️' },
    weatherAdvisory: 'Pleasant morning hours (27°C). Best visited before 1:30 PM to avoid heat and afternoon cloudbursts.'
  },
  {
    id: 'poi-zoo',
    associatedId: 'mysore-zoo',
    name: 'Sri Chamarajendra Zoo (Mysore Zoo)',
    category: 'attraction',
    lat: 12.3023,
    lng: 76.6644,
    icon: '🦁',
    description: 'Over 157 acres of lush botanical grounds and rare Asiatic lions, giraffes, white rhinos, and walk-through aviary.',
    rating: 4.5,
    priceRange: '₹100 / Adult',
    entryFee: 100,
    isOpen: false,
    statusText: 'Maintenance (Opens 2 PM)',
    operatingHours: '08:30 AM – 05:30 PM (Normally Closed on Tuesdays)',
    timings: '08:30 AM – 05:30 PM',
    distanceKm: 2.8,
    weather: { temp: 28, condition: 'Scattered Clouds', rainProb: 20, icon: '⛅' },
    weatherAdvisory: '🔴 Alert: Closed until 2:00 PM today for biological habitat maintenance.'
  },
  {
    id: 'poi-chamundi',
    associatedId: 'chamundi-hill',
    name: 'Chamundi Hills & Temple',
    category: 'attraction',
    lat: 12.2748,
    lng: 76.6705,
    icon: '⛰️',
    description: '1,000-meter hilltop summit with 17th-century Dravidian temple, monolithic 16-ft Nandi statue, and panoramic city views.',
    rating: 4.8,
    priceRange: 'Free (VIP ₹100)',
    entryFee: 0,
    isOpen: true,
    statusText: 'Open Today',
    operatingHours: '07:30 AM – 02:00 PM, 03:30 PM – 09:00 PM',
    timings: '07:30 AM – 09:00 PM',
    distanceKm: 8.5,
    weather: { temp: 24, condition: 'Cool Breeze', rainProb: 5, icon: '☀️' },
    weatherAdvisory: 'Pleasant morning hilltop breeze (24°C). Clear visibility across the entire valley.'
  },
  {
    id: 'poi-brindavan',
    associatedId: 'brindavan-gardens',
    name: 'Brindavan Gardens & KRS Dam',
    category: 'attraction',
    lat: 12.4244,
    lng: 76.5732,
    icon: '⛲',
    description: 'Terraced Mughal-inspired garden with musical dancing fountains and illuminated water cascades across the Cauvery River.',
    rating: 4.4,
    priceRange: '₹50 / Person',
    entryFee: 50,
    isOpen: true,
    statusText: 'Closing Soon (7:30 PM Cutoff)',
    operatingHours: '06:30 AM – 09:00 PM (Show 07:00 PM - 08:00 PM)',
    timings: '06:30 AM – 09:00 PM',
    distanceKm: 18.0,
    weather: { temp: 25, condition: 'Evening Breeze', rainProb: 10, icon: '🌤️' },
    weatherAdvisory: 'Fountain lights start at 7:00 PM. Expect moderate evening expressway traffic.'
  },
  {
    id: 'poi-jaganmohan',
    associatedId: 'jaganmohan-palace',
    name: 'Jaganmohan Palace Art Gallery',
    category: 'attraction',
    lat: 12.3082,
    lng: 76.6508,
    icon: '🏛️',
    description: 'Rare heritage gallery holding 16 original masterpieces by Raja Ravi Varma, antique French clocks, and royal musical artifacts.',
    rating: 4.6,
    priceRange: '₹75 / Adult',
    entryFee: 75,
    isOpen: true,
    statusText: 'Open (Ideal in Rain)',
    operatingHours: '08:30 AM – 05:30 PM',
    timings: '08:30 AM – 05:30 PM',
    distanceKm: 1.6,
    weather: { temp: 26, condition: 'Indoor Sanctuary', rainProb: 0, icon: '🏛️' },
    weatherAdvisory: '🛡️ Best afternoon weather contingency. Air-conditioned indoor galleries safe from rain.'
  },
  {
    id: 'poi-philomena',
    associatedId: 'st-philomenas-church',
    name: 'St. Philomena’s Cathedral',
    category: 'attraction',
    lat: 12.3211,
    lng: 76.6575,
    icon: '⛪',
    description: 'Neo-Gothic cathedral with twin 175-foot spires, French stained-glass windows, and underground catacomb chapel.',
    rating: 4.5,
    priceRange: 'Free Entry',
    entryFee: 0,
    isOpen: true,
    statusText: 'Open Today',
    operatingHours: '05:00 AM – 06:00 PM',
    timings: '05:00 AM – 06:00 PM',
    distanceKm: 3.2,
    weather: { temp: 27, condition: 'Partly Sunny', rainProb: 10, icon: '🌤️' },
    weatherAdvisory: 'Morning light shines through the eastern stained glass.'
  },
  {
    id: 'poi-karanji',
    associatedId: 'karanji-lake',
    name: 'Karanji Lake & Nature Park',
    category: 'attraction',
    lat: 12.3025,
    lng: 76.6715,
    icon: '🦆',
    description: 'Tranquil wetland sanctuary with India’s largest walk-through aviary, butterfly park, and scenic pedal boating.',
    rating: 4.6,
    priceRange: '₹50 / Person',
    entryFee: 50,
    isOpen: true,
    statusText: 'Open Today',
    operatingHours: '08:30 AM – 05:30 PM (Closed Tuesdays)',
    timings: '08:30 AM – 05:30 PM',
    distanceKm: 3.5,
    weather: { temp: 26, condition: 'Pleasant Breeze', rainProb: 15, icon: '🍃' },
    weatherAdvisory: 'High bird activity in the morning. Boating stops if heavy rain occurs.'
  },

  // --- HOTELS ---
  {
    id: 'poi-hotel-grand-mercure',
    associatedId: 'hotel-grand-mercure',
    name: 'Grand Mercure Mysore',
    category: 'hotel',
    lat: 12.3256,
    lng: 76.6432,
    icon: '🏨',
    description: '5-Star premium hotel with rooftop pool, multi-cuisine restaurant, and rain shuttle service.',
    rating: 4.6,
    priceRange: '₹4,200/night',
    availability: '5 Rooms Available',
    isOpen: true,
    distanceKm: 2.8,
    weather: { temp: 27, condition: 'City Center', icon: '🏨' },
    weatherAdvisory: 'Complimentary umbrellas and indoor valet parking available during rain.'
  },
  {
    id: 'poi-hotel-radisson',
    associatedId: 'hotel-radisson-blu',
    name: 'Radisson Blu Plaza Hotel',
    category: 'hotel',
    lat: 12.3012,
    lng: 76.6698,
    icon: '🏨',
    description: 'Luxury resort overlooking Chamundi Hills with infinity pool, spa, and EV charging station.',
    rating: 4.7,
    priceRange: '₹5,100/night',
    availability: 'Only 2 Rooms Left!',
    isOpen: true,
    distanceKm: 1.2,
    weather: { temp: 27, condition: 'Hill View', icon: '🏨' }
  },
  {
    id: 'poi-hotel-roopa',
    associatedId: 'hotel-roopa-elite',
    name: 'Hotel Roopa Elite',
    category: 'hotel',
    lat: 12.3218,
    lng: 76.6341,
    icon: '🏨',
    description: 'Modern executive hotel with rooftop lounge, high-speed Wi-Fi, and budget-friendly comfort.',
    rating: 4.4,
    priceRange: '₹1,950/night',
    availability: '8 Rooms Available',
    isOpen: true,
    distanceKm: 3.4,
    weather: { temp: 27, condition: 'Vani Vilas', icon: '🏨' }
  },
  {
    id: 'poi-hotel-royal-orchid',
    name: 'Royal Orchid Metropole',
    category: 'hotel',
    lat: 12.3135,
    lng: 76.6425,
    icon: '🏨',
    description: 'Historic heritage boutique hotel built by the Maharaja of Mysore in 1920 with royal courtyards.',
    rating: 4.6,
    priceRange: '₹4,800/night',
    availability: '4 Rooms Available',
    isOpen: true,
    distanceKm: 1.9,
    weather: { temp: 27, condition: 'Heritage Quarter', icon: '🏨' }
  },

  // --- TRANSPORT STATIONS ---
  {
    id: 'poi-transport-station',
    name: 'Mysuru Junction Railway Station (MYS)',
    category: 'transport',
    transportType: 'train',
    lat: 12.3168,
    lng: 76.6450,
    icon: '🚆',
    description: 'Central rail terminal serving Vande Bharat, Shatabdi, and Intercity trains connecting to Bengaluru, Chennai, and Mumbai.',
    rating: 4.3,
    availability: 'Vande Bharat #20608 & Chamundi Exp active',
    timings: '24 Hours Active Terminal',
    estimatedCost: 'Train fares from ₹95 to ₹540',
    distanceKm: 1.5,
    isOpen: true,
    statusText: 'Terminal Active',
    weather: { temp: 27, condition: 'Covered Platforms', icon: '🚆' }
  },
  {
    id: 'poi-transport-bus-central',
    name: 'KSRTC Suburban Central Bus Stand',
    category: 'transport',
    transportType: 'bus',
    lat: 12.3115,
    lng: 76.6578,
    icon: '🚌',
    description: 'Main express hub for Airavat Club Class AC buses, Flybus to Bangalore International Airport, and EV Power Plus coaches.',
    rating: 4.4,
    availability: 'Buses to Bangalore every 15 minutes',
    timings: '24 Hours Intercity Terminal',
    estimatedCost: 'Express Bus ₹390 – ₹450',
    distanceKm: 0.9,
    isOpen: true,
    statusText: 'Buses on Time',
    weather: { temp: 27, condition: 'Covered Bays', icon: '🚌' }
  },
  {
    id: 'poi-transport-airport',
    name: 'Mysore Domestic Airport (Mandakalli / MYQ)',
    category: 'transport',
    transportType: 'airport',
    lat: 12.2301,
    lng: 76.6528,
    icon: '✈️',
    description: 'Domestic commercial airport with scheduled daily flights to Chennai, Hyderabad, Goa, and Kochi via Alliance Air and IndiGo.',
    rating: 4.2,
    availability: 'Daily flights active',
    timings: 'Flights 08:00 AM – 07:00 PM',
    estimatedCost: 'Flight fares from ₹2,200',
    distanceKm: 12.0,
    isOpen: true,
    statusText: 'Flights Operational',
    weather: { temp: 26, condition: 'Normal Visibility', icon: '✈️' }
  },
  {
    id: 'poi-transport-taxi-palace',
    name: 'Palace North Gate Pre-Paid Taxi & Auto Hub',
    category: 'transport',
    transportType: 'taxi',
    lat: 12.3080,
    lng: 76.6550,
    icon: '🚕',
    description: 'Government authorized pre-paid cab and smart auto-rickshaw counter with fixed meter tariffs and airport transfers.',
    rating: 4.5,
    availability: '30+ Cabs on stand',
    timings: '06:00 AM – 11:30 PM',
    estimatedCost: 'City rides ₹100 – ₹350 | Bangalore ₹2,800',
    distanceKm: 0.4,
    isOpen: true,
    statusText: 'Drivers Available',
    weather: { temp: 27, condition: 'Shaded Stand', icon: '🚕' }
  },

  // --- VEHICLE RENTALS ---
  {
    id: 'poi-rental-ev-station',
    name: 'Smart EV Scooter Hub (Ather & Ola Fleet)',
    category: 'rental',
    transportType: 'rental',
    lat: 12.3160,
    lng: 76.6465,
    icon: '🛵',
    description: 'Electric two-wheeler pickup station with helmets, mobile mounts, and unlimited fast charging across Mysore city.',
    rating: 4.8,
    availability: '12 EV Scooters Ready',
    timings: '07:00 AM – 10:00 PM',
    estimatedCost: '₹499 / day (Includes 110 km range)',
    distanceKm: 1.6,
    isOpen: true,
    statusText: 'Instant Booking Open'
  },
  {
    id: 'poi-rental-bikes-palace',
    name: 'Royal Enfield & Self-Drive Bike Fleet',
    category: 'rental',
    transportType: 'rental',
    lat: 12.3040,
    lng: 76.6565,
    icon: '🏍️',
    description: 'Classic 350, Himalayan, and Hunter cruiser bikes with full touring gear, helmets, and mechanical warranty.',
    rating: 4.9,
    availability: '8 Bikes Available',
    timings: '08:00 AM – 09:00 PM',
    estimatedCost: '₹899 / day (Petrol self-fill)',
    distanceKm: 0.3,
    isOpen: true,
    statusText: 'Ready for Chamundi Hill ride'
  },
  {
    id: 'poi-rental-car-suburban',
    name: 'Suburban Self-Drive Car Stand (Swift & Thar 4x4)',
    category: 'rental',
    transportType: 'rental',
    lat: 12.3125,
    lng: 76.6590,
    icon: '🚗',
    description: 'Hatchbacks, compact SUVs, and 4WD convertibles with zero security deposit for verified App users.',
    rating: 4.7,
    availability: '6 Cars Ready',
    timings: '24 Hours Pickup & Drop',
    estimatedCost: '₹1,399 / day (Swift) | ₹2,699 (Thar)',
    distanceKm: 1.1,
    isOpen: true,
    statusText: 'Instant Keyless Unlock'
  },

  // --- RESTAURANTS ---
  {
    id: 'poi-rest-mylari',
    name: 'Hotel Original Mylari',
    category: 'restaurant',
    lat: 12.3084,
    lng: 76.6601,
    icon: '🍽️',
    description: 'World-famous iconic heritage eatery serving melt-in-the-mouth Mysore butter dosa on banana leaves since 1938.',
    rating: 4.7,
    priceRange: '₹80 – ₹150 / Person',
    isOpen: true,
    statusText: 'Open Now (Expect 15m Queue)',
    operatingHours: '06:30 AM – 01:30 PM, 03:30 PM – 09:00 PM',
    timings: 'Morning & Evening batches',
    distanceKm: 1.2,
    weather: { temp: 27, condition: 'Authentic Local Dosa', icon: '🥞' }
  },
  {
    id: 'poi-rest-guru-sweets',
    name: 'Guru Sweet Mart (Birthplace of Mysore Pak)',
    category: 'restaurant',
    lat: 12.3092,
    lng: 76.6515,
    icon: '🍬',
    description: 'Direct lineage of Kakasura Madappa, the royal chef who invented the original ghee-dripping Mysore Pak for the Maharaja.',
    rating: 4.8,
    priceRange: '₹200 – ₹500 / Box',
    isOpen: true,
    statusText: 'Open (Fresh Batch Ready)',
    operatingHours: '08:30 AM – 10:00 PM',
    timings: '08:30 AM – 10:00 PM',
    distanceKm: 0.8,
    weather: { temp: 27, condition: 'Heritage Sweets', icon: '🍬' }
  },
  {
    id: 'poi-rest-rrr',
    name: 'Hotel RRR Famous Royal Andhra Meals & Biryani',
    category: 'restaurant',
    lat: 12.3075,
    lng: 76.6545,
    icon: '🍛',
    description: 'High-energy spicy Andhra banana leaf thalis, chicken ghee roast, and regional South Indian specialties.',
    rating: 4.6,
    priceRange: '₹250 – ₹450 / Person',
    isOpen: true,
    statusText: 'Open for Lunch & Dinner',
    operatingHours: '11:30 AM – 04:00 PM, 07:00 PM – 10:30 PM',
    timings: '11:30 AM – 10:30 PM',
    distanceKm: 0.6,
    weather: { temp: 27, condition: 'Spicy Meals', icon: '🍛' }
  },

  // --- EMERGENCY & EV FACILITY ---
  {
    id: 'poi-facility-hospital',
    name: 'Apollo BGS Super Specialty Hospital',
    category: 'hospital',
    lat: 12.2980,
    lng: 76.6390,
    icon: '🏥',
    description: '24/7 emergency trauma care, tourist medical wing, and ambulance assistance.',
    rating: 4.7,
    timings: '24/7 Emergency Care',
    distanceKm: 3.1,
    isOpen: true,
    statusText: 'Emergency Open 24/7'
  },
  {
    id: 'poi-facility-ev-charger',
    name: 'Tata Power 60kW DC Hyper EV Charger Hub',
    category: 'fuel',
    lat: 12.3140,
    lng: 76.6530,
    icon: '⚡',
    description: 'Ultra-fast dual CCS2 electric vehicle chargers supporting all Indian EV cars and scooters.',
    rating: 4.8,
    timings: '24/7 Automated Charging',
    estimatedCost: '₹19 / kWh',
    distanceKm: 0.7,
    isOpen: true,
    statusText: '2 Bays Available'
  }
];

// High precision coordinates for the 10-Lane Bengaluru-Mysuru Expressway (NH 275)
export const EXPRESSWAY_COORDINATES: [number, number][] = [
  [12.9716, 77.5946], // Bangalore City Center (Majestic)
  [12.9249, 77.4987], // Kengeri Satellite Gate
  [12.8021, 77.3820], // Bidadi Bypass
  [12.7214, 77.2811], // Ramanagara Sholay Hills
  [12.6518, 77.2023], // Channapatna Toy City
  [12.5840, 77.0425], // Maddur Tiffanys Rest Stop
  [12.5246, 76.8982], // Mandya Sugar Corridor
  [12.4215, 76.7124], // Srirangapatna Heritage River Island
  [12.3480, 76.6620], // Mysore Ring Road North
  [12.3051, 76.6552], // Mysore Palace
];

// Kanakapura Scenic Route (NH 209) coordinates
export const SCENIC_ROUTE_COORDINATES: [number, number][] = [
  [12.9716, 77.5946], // Bangalore
  [12.8425, 77.5180], // Art of Living Center
  [12.5482, 77.4210], // Kanakapura Town
  [12.3840, 77.0580], // Malavalli
  [12.3320, 76.8520], // Bannur
  [12.3051, 76.6552]  // Mysore Palace
];

// Detailed Route Options for Current Location / Bangalore -> Mysore
export const ROUTE_MODE_OPTIONS: RouteOptionDetail[] = [
  {
    mode: 'bus',
    modeLabel: 'Express Bus',
    duration: '4h 10m',
    cost: 450,
    costFormatted: '₹450',
    provider: 'KSRTC Airavat Club Class AC (Volvo Multi-Axle)',
    frequency: 'Every 20 mins',
    weatherSuitability: '🛡️ 100% weather-proof with AC and rain shields',
    isRecommended: true,
    recommendationReason: 'Best balance of cost, safety, frequent 20-min departures, and bypasses toll queues via dedicated lanes.',
    trafficLevel: 'Low',
    stopsCount: 3,
    co2Savings: '72% lower CO2 vs personal car',
    coordinates: EXPRESSWAY_COORDINATES
  },
  {
    mode: 'car',
    modeLabel: 'Private Car / Cab',
    duration: '3h 20m',
    cost: 1200,
    costFormatted: '₹1,200 (Fuel + ₹320 Toll)',
    provider: 'Access-Controlled NH 275 Expressway',
    frequency: 'Instant departure',
    weatherSuitability: '⚠️ Watch for afternoon highway rain slicks between Maddur and Mandya',
    isRecommended: false,
    recommendationReason: 'Fastest door-to-door transit, convenient for families with luggage, but incurs tolls and expressway speed monitoring.',
    trafficLevel: 'Moderate',
    stopsCount: 1,
    coordinates: EXPRESSWAY_COORDINATES
  },
  {
    mode: 'train',
    modeLabel: 'Semi-High Speed Train',
    duration: '3h 40m',
    cost: 600,
    costFormatted: '₹600 (Vande Bharat / Intercity)',
    provider: 'Vande Bharat Express / Chamundi Express',
    frequency: 'Scheduled (10:25 AM, 02:30 PM)',
    weatherSuitability: '🛡️ Zero weather disruption, fully air-conditioned',
    isRecommended: false,
    recommendationReason: 'Ultra-smooth ride and scenic countryside, though limited seat availability on weekends.',
    trafficLevel: 'Low',
    stopsCount: 2,
    co2Savings: '85% lower CO2 vs personal car',
    coordinates: EXPRESSWAY_COORDINATES
  }
];

// AI 2-Day Planned Itinerary Coordinates
export const AI_TRIP_DAY1_COORDINATES: [number, number][] = [
  [12.3051, 76.6552], // Mysore Palace
  [12.3084, 76.6601], // Hotel Mylari (Lunch)
  [12.3082, 76.6508], // Jaganmohan Palace Art Gallery
  [12.3211, 76.6575], // St. Philomena's Cathedral
  [12.3256, 76.6432], // Grand Mercure Hotel
];

export const AI_TRIP_DAY2_COORDINATES: [number, number][] = [
  [12.3256, 76.6432], // Hotel
  [12.2748, 76.6705], // Chamundi Hill & Temple
  [12.3023, 76.6644], // Mysore Zoo
  [12.4244, 76.5732], // Brindavan Gardens (Evening Show)
];
