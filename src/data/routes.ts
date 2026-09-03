import { RouteOption, MapPOI } from '../types';

export const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'blr-mysore-exp',
    name: 'Bengaluru-Mysuru Access-Controlled 10-Lane Expressway (NH 275)',
    distance: '143 km',
    estimatedTime: '1h 35m by Car / 3h 30m by Express Bus',
    trafficCondition: 'Smooth Traffic',
    tollCost: '₹320 (FASTag)',
    description: 'Direct high-speed corridor with bypass around Bidadi, Ramanagara, Channapatna, Maddur, Mandya, and Srirangapatna.',
    keyStops: [
      'Bidadi Industrial & Smart Food Stops (km 32)',
      'Ramanagara Sholay Hills & Silk Cocoon Market (km 48)',
      'Channapatna Wooden Toy Craft Centers (km 60)',
      'Maddur Tiffany Rest Stop - Famous Maddur Vada & Tender Coconut (km 80)',
      'Mandya Sugar & Jaggery Countryside (km 100)',
      'Srirangapatna Historic Fort & Sangama River Island (km 125)'
    ]
  },
  {
    id: 'blr-mysore-scenic',
    name: 'Kanakapura Scenic Heritage Highway (NH 209)',
    distance: '158 km',
    estimatedTime: '3h 15m by Car / 4h 15m by Bus',
    trafficCondition: 'Moderate Scenic Drive',
    tollCost: 'Zero Toll (Toll-Free Scenic Route)',
    description: 'Picturesque two-lane countryside drive past granite boulders, lush banyan groves, Chunchi falls detour, and Shivanasamudra river bluffs.',
    keyStops: [
      'Art of Living International Center (km 21)',
      'Kanakapura Silk Handlooms & Fresh Filter Coffee (km 55)',
      'Malavalli Village Pottery Guilds (km 98)',
      'Bannur Agricultural Fields & Fresh Sugarcane Juice (km 132)'
    ]
  }
];

export const MAP_POIS: MapPOI[] = [
  {
    id: 'poi-1',
    name: 'Mysore Palace & Durbar Hall',
    category: 'attraction',
    lat: 38,
    lng: 82,
    icon: '🏰',
    description: 'Indo-Saracenic royal seat of the Wadiyar dynasty with stained glass pavilion & 100,000 bulbs.',
    rating: 4.8,
    priceRange: '₹100 / Person',
    operatingHours: '10:00 AM – 05:30 PM (Daily)'
  },
  {
    id: 'poi-2',
    name: 'Sri Chamarajendra Zoo',
    category: 'attraction',
    lat: 44,
    lng: 88,
    icon: '🦁',
    description: 'One of the oldest and most acclaimed zoological parks in India with electric buggies.',
    rating: 4.6,
    priceRange: '₹100 / Person',
    operatingHours: '🔴 Closed for maintenance until 2:00 PM'
  },
  {
    id: 'poi-3',
    name: 'Chamundi Hill & Temple',
    category: 'attraction',
    lat: 72,
    lng: 85,
    icon: '⛰️',
    description: 'Prominent hill summit overlooking Mysore city with ancient temple and 16-foot Nandi monolith.',
    rating: 4.7,
    priceRange: 'Free Entry',
    operatingHours: '07:30 AM – 09:00 PM'
  },
  {
    id: 'poi-4',
    name: 'Jaganmohan Art Gallery',
    category: 'attraction',
    lat: 32,
    lng: 76,
    icon: '🎨',
    description: 'Historic palace hosting Raja Ravi Varma oil paintings and antique royal musical clocks.',
    rating: 4.5,
    priceRange: '₹75 / Person',
    operatingHours: '08:30 AM – 05:30 PM (Indoor safe during rain)'
  },
  {
    id: 'poi-5',
    name: 'Grand Mercure Mysore',
    category: 'hotel',
    lat: 25,
    lng: 65,
    icon: '🏨',
    description: '5-star hotel in peaceful Yadavagiri with rooftop pool and authentic regional dining.',
    rating: 4.7,
    priceRange: '₹4,200 / night',
    operatingHours: '24/7 Front Desk'
  },
  {
    id: 'poi-6',
    name: 'Radisson Blu Plaza Mysore',
    category: 'hotel',
    lat: 48,
    lng: 78,
    icon: '🏨',
    description: 'Luxury hotel adjoining the golf course with panoramic Chamundi Hill views.',
    rating: 4.8,
    priceRange: '₹5,100 / night',
    operatingHours: '24/7 Front Desk'
  },
  {
    id: 'poi-7',
    name: 'Mylari Hotel (Famous Dosa)',
    category: 'restaurant',
    lat: 40,
    lng: 74,
    icon: '🍽️',
    description: 'Heritage culinary icon serving iconic butter-soft Mysore masala dosas and coconut chutney.',
    rating: 4.9,
    priceRange: '₹90 / plate',
    operatingHours: '06:30 AM – 01:30 PM, 03:00 PM – 08:30 PM'
  },
  {
    id: 'poi-8',
    name: 'Maddur Highway Food Stop',
    category: 'restaurant',
    lat: 46,
    lng: 48,
    icon: '☕',
    description: 'Famous expressway stop for crispy Maddur Vada, hot piping filter coffee, and tender coconut.',
    rating: 4.6,
    priceRange: '₹60 - ₹120',
    operatingHours: '06:00 AM – 11:00 PM'
  },
  {
    id: 'poi-9',
    name: 'NHAI Highway EV Fast Charging & Shell',
    category: 'fuel',
    lat: 35,
    lng: 32,
    icon: '⚡',
    description: '60kW dual CCS2 EV fast charger + Clean fuel station with modern restrooms.',
    rating: 4.7,
    priceRange: 'Standard Tariff',
    operatingHours: '24 Hours Open'
  },
  {
    id: 'poi-10',
    name: 'Apollo BGS Hospitals & Trauma Unit',
    category: 'hospital',
    lat: 56,
    lng: 70,
    icon: '🏥',
    description: '24/7 Multi-speciality hospital with emergency medical response and tourist care desk.',
    rating: 4.6,
    priceRange: 'Emergency Care',
    operatingHours: '24/7 Emergency'
  }
];
