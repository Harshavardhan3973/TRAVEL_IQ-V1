import { Destination } from '../types';

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: 'mysore-palace',
    name: 'Mysore Palace',
    city: 'Mysore',
    state: 'Karnataka',
    category: 'Heritage',
    tagline: 'The seat of the Wodeyar Dynasty and architectural marvel',
    description: 'The Palace of Mysore is a historical palace and a royal residence. Built in the Indo-Saracenic style with domes, turrets, arches and colonnades, it is one of India’s most visited monuments with mesmerizing Sunday night illumination.',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443a6d9?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewsCount: 18420,
    distanceKm: 2.5,
    coordinates: { lat: 12.3051, lng: 76.6552 },
    weather: {
      temp: 27,
      condition: 'Partly Cloudy',
      feelsLike: 29,
      humidity: 62,
      windSpeed: '12 km/h',
      rainProb: 15,
      icon: '🌤️'
    },
    status: {
      state: 'open',
      label: 'Open Today',
      color: '#10b981', // green
      openingHours: '10:00 AM - 05:30 PM (Illumination 07:00 PM Sundays)',
      entryFee: 100,
      crowdLevel: 'Moderate',
      lastChecked: 'Live 5 mins ago',
      notice: 'Audio guides available at Gate 4. Shoes check-in counter near South Gate.'
    },
    highlights: [
      'Golden Royal Throne & Durbar Hall',
      'Stained glass ceiling & sculpted pillars',
      '100,000 light bulb Sunday illumination',
      'Royal weaponry and carriage museum'
    ],
    bestTimeToVisit: 'Morning 10:00 AM - 12:30 PM (cooler temperatures & soft lighting)',
    suggestedDuration: '2.5 - 3 hours',
    recommendedTimeOfDay: 'Morning',
    isIndoor: false
  },
  {
    id: 'mysore-zoo',
    name: 'Sri Chamarajendra Zoological Gardens (Mysore Zoo)',
    city: 'Mysore',
    state: 'Karnataka',
    category: 'Nature',
    tagline: 'One of the oldest and most acclaimed zoological parks in Asia',
    description: 'Spread over 157 acres near Karanji Lake, Mysore Zoo is home to hundreds of rare species including giraffes, white tigers, gorillas, and diverse avian life in naturalistic enclosures.',
    image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    reviewsCount: 12150,
    distanceKm: 3.2,
    coordinates: { lat: 12.3023, lng: 76.6644 },
    weather: {
      temp: 27,
      condition: 'Scattered Clouds',
      feelsLike: 29,
      humidity: 64,
      windSpeed: '10 km/h',
      rainProb: 20,
      icon: '⛅'
    },
    status: {
      state: 'closed',
      label: 'Temporarily Closed',
      color: '#ef4444', // red
      openingHours: '08:30 AM - 05:30 PM (Normally Closed on Tuesdays)',
      entryFee: 100,
      crowdLevel: 'Low',
      lastChecked: 'Live 12 mins ago',
      notice: '🔴 Alert: Closed today until 2:00 PM for biological habitat maintenance & veterinary checkups.'
    },
    highlights: [
      'Anacondas and Walk-through Aviary',
      'White Rhinoceros and Asiatic Lion enclosures',
      'Battery-operated electric buggies for elders',
      'Direct walking connectivity to Karanji Lake'
    ],
    bestTimeToVisit: 'Early morning 08:30 AM when animals are most active',
    suggestedDuration: '3 hours',
    recommendedTimeOfDay: 'Morning',
    isIndoor: false
  },
  {
    id: 'brindavan-gardens',
    name: 'Brindavan Gardens & KRS Dam',
    city: 'Mysore',
    state: 'Karnataka',
    category: 'Nature',
    tagline: 'Terraced Mughal-style garden with synchronized musical fountains',
    description: 'Adjoining the Krishnarajasagara Dam across the sacred Cauvery River, Brindavan Gardens spans 60 acres of symmetrical terraces, topiary works, fountains and illuminated water cascades.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    rating: 4.4,
    reviewsCount: 15300,
    distanceKm: 18.0,
    coordinates: { lat: 12.4244, lng: 76.5732 },
    weather: {
      temp: 25,
      condition: 'Pleasant Breeze',
      feelsLike: 26,
      humidity: 70,
      windSpeed: '14 km/h',
      rainProb: 10,
      icon: '🌤️'
    },
    status: {
      state: 'closing_soon',
      label: 'Closing Soon (Entry cutoff 7:30 PM)',
      color: '#f59e0b', // amber
      openingHours: '06:30 AM - 09:00 PM (Musical Fountain 07:00 PM - 08:00 PM)',
      entryFee: 50,
      crowdLevel: 'High',
      lastChecked: 'Live 8 mins ago',
      notice: '🟡 Musical fountain show begins in 45 minutes; evening traffic on KRS road is moderate.'
    },
    highlights: [
      'Synchronized musical fountain light show',
      'Scenic boating across the Cauvery reservoir',
      'Illuminated geometric terraces and flower beds',
      'Fruit and ornamental horticulture orchards'
    ],
    bestTimeToVisit: 'Late afternoon 04:30 PM - 08:00 PM for sunset and fountain illumination',
    suggestedDuration: '2.5 hours',
    recommendedTimeOfDay: 'Evening',
    isIndoor: false
  },
  {
    id: 'chamundi-hill',
    name: 'Chamundi Hills & Sri Chamundeshwari Temple',
    city: 'Mysore',
    state: 'Karnataka',
    category: 'Spiritual',
    tagline: 'Sacred hilltop summit offering panoramic views of Mysore city',
    description: 'Rising 1,000 meters above sea level, Chamundi Hill is crowned by the 17th-century Dravidian temple dedicated to Goddess Chamundeshwari, patron deity of Mysore royalty.',
    image: 'https://images.unsplash.com/photo-1627993077796-0925e0a0a574?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewsCount: 19800,
    distanceKm: 11.5,
    coordinates: { lat: 12.2748, lng: 76.6705 },
    weather: {
      temp: 24,
      condition: 'Clear & Breezy',
      feelsLike: 25,
      humidity: 58,
      windSpeed: '18 km/h',
      rainProb: 5,
      icon: '☀️'
    },
    status: {
      state: 'open',
      label: 'Open Today',
      color: '#10b981',
      openingHours: '07:30 AM - 02:00 PM, 03:30 PM - 06:00 PM, 07:30 PM - 09:00 PM',
      entryFee: 0,
      crowdLevel: 'Moderate',
      lastChecked: 'Live 10 mins ago',
      notice: 'Free general darshan line; Special quick darshan ₹100 ticket counter available.'
    },
    highlights: [
      '7-tier 40-meter tall Gopuram with intricate carvings',
      'Monolithic 16-foot Nandi Bull statue carved from single rock',
      'Panoramic 360-degree viewpoint over Mysore Palace and city lights',
      '1,008 heritage stone steps trail for pilgrims and trekkers'
    ],
    bestTimeToVisit: 'Early morning 06:30 AM for sunrise or evening for city lighting view',
    suggestedDuration: '2 hours',
    recommendedTimeOfDay: 'Morning',
    isIndoor: false
  },
  {
    id: 'jaganmohan-palace',
    name: 'Jaganmohan Palace & Art Gallery (Sri Jayachamarajendra)',
    city: 'Mysore',
    state: 'Karnataka',
    category: 'Cultural',
    tagline: 'Treasury of Raja Ravi Varma paintings and royal artifacts',
    description: 'Constructed in 1861 as an alternate royal residence, this wooden architectural gem now houses one of Southern India’s most prized art collections, including iconic oil paintings by Raja Ravi Varma.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewsCount: 6800,
    distanceKm: 1.8,
    coordinates: { lat: 12.3082, lng: 76.6508 },
    weather: {
      temp: 27,
      condition: 'Indoor Air-Conditioned Shelter',
      feelsLike: 26,
      humidity: 50,
      windSpeed: 'Indoor',
      rainProb: 0,
      icon: '🏛️'
    },
    status: {
      state: 'open',
      label: 'Open (Ideal during rain)',
      color: '#10b981',
      openingHours: '08:30 AM - 05:30 PM',
      entryFee: 75,
      crowdLevel: 'Low',
      lastChecked: 'Live 15 mins ago',
      notice: '🟢 Recommended indoor sanctuary when afternoon showers occur.'
    },
    highlights: [
      '16 original masterworks by Raja Ravi Varma',
      'Centuries-old musical instruments & antique clocks',
      'Carved sandalwood and ivory miniature dioramas',
      'French musical calendar clock made in 1870'
    ],
    bestTimeToVisit: 'Afternoon 01:30 PM - 04:00 PM (great shield from rain or heat)',
    suggestedDuration: '1.5 - 2 hours',
    recommendedTimeOfDay: 'Afternoon',
    isIndoor: true
  },
  {
    id: 'st-philomenas-church',
    name: 'St. Philomena’s Cathedral',
    city: 'Mysore',
    state: 'Karnataka',
    category: 'Heritage',
    tagline: 'Majestic Neo-Gothic cathedral inspired by Cologne Cathedral',
    description: 'Constructed in 1936 by French architect Daly, St. Philomena’s is one of the tallest churches in Asia, featuring twin 175-foot spires, stained-glass windows crafted in France, and a subterranean crypt.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    reviewsCount: 8900,
    distanceKm: 3.8,
    coordinates: { lat: 12.3211, lng: 76.6575 },
    weather: {
      temp: 27,
      condition: 'Partly Sunny',
      feelsLike: 28,
      humidity: 60,
      windSpeed: '11 km/h',
      rainProb: 10,
      icon: '🌤️'
    },
    status: {
      state: 'open',
      label: 'Open Today',
      color: '#10b981',
      openingHours: '05:00 AM - 06:00 PM',
      entryFee: 0,
      crowdLevel: 'Low',
      lastChecked: 'Live 18 mins ago',
      notice: 'Visitors requested to maintain quiet reflection inside sanctum.'
    },
    highlights: [
      'Twin 175-foot Gothic spires visible across Mysore skyline',
      'Subterranean catacombs relic chapel holding Saint’s relic',
      'French stained glass depicting the Stations of the Cross',
      'Cruciform floor layout with marble altars'
    ],
    bestTimeToVisit: 'Morning 09:00 AM - 11:00 AM for stained glass sun reflection',
    suggestedDuration: '45 mins',
    recommendedTimeOfDay: 'Morning',
    isIndoor: true
  },
  {
    id: 'karanji-lake',
    name: 'Karanji Lake & Nature Park',
    city: 'Mysore',
    state: 'Karnataka',
    category: 'Nature',
    tagline: 'Serene wetland reserve with India’s largest walk-through aviary',
    description: 'Surrounded by a nature sanctuary and butterfly park, Karanji Lake spans 90 acres at the base of Chamundi Hills. It attracts over 147 species of migratory birds including pelicans and herons.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewsCount: 7100,
    distanceKm: 3.5,
    coordinates: { lat: 12.3025, lng: 76.6715 },
    weather: {
      temp: 26,
      condition: 'Pleasant Breeze',
      feelsLike: 27,
      humidity: 63,
      windSpeed: '12 km/h',
      rainProb: 15,
      icon: '🍃'
    },
    status: {
      state: 'open',
      label: 'Open Today',
      color: '#10b981',
      openingHours: '08:30 AM - 05:30 PM (Closed on Tuesdays)',
      entryFee: 50,
      crowdLevel: 'Low',
      lastChecked: 'Live 10 mins ago',
      notice: 'Boating facility operational until 05:00 PM.'
    },
    highlights: [
      '60-meter high walk-through aviary with peacocks & hornbills',
      'Peaceful pedal and row boating with water lily blooms',
      'Watchtower for birdwatching and photography',
      'Specially nurtured butterfly conservatory'
    ],
    bestTimeToVisit: 'Morning 08:30 AM - 10:30 AM for peak bird activity',
    suggestedDuration: '1.5 - 2 hours',
    recommendedTimeOfDay: 'Morning',
    isIndoor: false
  },
  {
    id: 'jaipur-amber-fort',
    name: 'Amber Palace & Fort',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    tagline: 'Crown jewel of Rajput hill forts overlooking Maota Lake',
    description: 'Constructed from red sandstone and marble, Amber Palace boasts the world-famous Sheesh Mahal (Mirror Palace), courtyards, and panoramic Aravalli mountain views.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewsCount: 24500,
    distanceKm: 11.0,
    coordinates: { lat: 26.9855, lng: 75.8513 },
    weather: {
      temp: 31,
      condition: 'Sunny & Warm',
      feelsLike: 33,
      humidity: 42,
      windSpeed: '9 km/h',
      rainProb: 0,
      icon: '☀️'
    },
    status: {
      state: 'open',
      label: 'Open Today',
      color: '#10b981',
      openingHours: '08:00 AM - 05:30 PM (Night tour 06:30 PM - 09:15 PM)',
      entryFee: 100,
      crowdLevel: 'High',
      lastChecked: 'Live 7 mins ago',
      notice: 'Night light-and-sound show tickets can be collected at gate counter.'
    },
    highlights: [
      'Sheesh Mahal mirror mosaics',
      'Sukh Niwas cool water-channel architecture',
      'Elephant ride or Jeep path up the sun gate',
      'Secret tunnel connection to Jaigarh Fort'
    ],
    bestTimeToVisit: 'Morning 08:30 AM before peak heat',
    suggestedDuration: '3 hours',
    recommendedTimeOfDay: 'Morning',
    isIndoor: false
  }
];
