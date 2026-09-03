import { TransportOption, VehicleRental } from '../types';

export const TRANSPORTS_DATA: TransportOption[] = [
  // BUSES
  {
    id: 'trans-bus-1',
    type: 'Bus',
    providerName: 'KSRTC Airavat Club Class AC',
    vehicleModel: 'Volvo Multi-Axle Luxury Coach',
    origin: 'Bangalore (Satellite Bus Station)',
    destination: 'Mysore (Central Bus Stand)',
    departureTime: '07:30 AM',
    arrivalTime: '11:40 AM',
    duration: '4h 10m',
    price: 450,
    frequency: 'Every 20 mins',
    status: 'On time (Seats open)',
    recommended: true,
    features: ['Expressway Route', 'AC Push-Back Seats', 'Free Water Bottle', 'USB Charger', 'Live GPS Tracking']
  },
  {
    id: 'trans-bus-2',
    type: 'Bus',
    providerName: 'KSRTC EV Power Plus Electric',
    vehicleModel: 'Olectra Greentech Electric Intercity',
    origin: 'Bangalore (Majestic KBS)',
    destination: 'Mysore (Suburban Stand)',
    departureTime: '08:45 AM',
    arrivalTime: '01:00 PM',
    duration: '4h 15m',
    price: 390,
    frequency: 'Every 45 mins',
    status: 'On time',
    recommended: false,
    features: ['100% Zero-Emission Electric', 'Silent Cabin', 'Direct Highway Non-Stop', 'Speed-governed 80 km/h']
  },
  {
    id: 'trans-bus-3',
    type: 'Bus',
    providerName: 'Orange Travels AC Sleeper',
    vehicleModel: 'BharatBenz Executive Sleeper',
    origin: 'Bangalore (Madiwala)',
    destination: 'Mysore (Palace Circle)',
    departureTime: '11:30 PM',
    arrivalTime: '03:45 AM',
    duration: '4h 15m',
    price: 650,
    frequency: 'Night departures',
    status: 'Booking open',
    recommended: false,
    features: ['Private Sleeping Berths', 'Individual LED Screen', 'Reading Lamp', 'Rest Stop at Highway Plaza']
  },

  // TRAINS
  {
    id: 'trans-train-1',
    type: 'Train',
    providerName: 'Vande Bharat Express (#20608)',
    vehicleModel: 'Integral Coach Factory Semi-High Speed',
    origin: 'KSR Bengaluru City (SBC)',
    destination: 'Mysuru Junction (MYS)',
    departureTime: '10:25 AM',
    arrivalTime: '12:20 PM',
    duration: '1h 55m',
    price: 540,
    frequency: 'Daily (except Wed)',
    status: 'Fastest (Limited seats)',
    recommended: true,
    features: ['160 km/h Corridor', 'Revolving Ergonomic Seats', 'Bio-Vacuum Toilets', 'Complimentary Tea/Snack']
  },
  {
    id: 'trans-train-2',
    type: 'Train',
    providerName: 'Chamundi Intercity Express (#16216)',
    vehicleModel: 'Indian Railways Second Sitting',
    origin: 'Bengaluru Cantt',
    destination: 'Mysuru Jn',
    departureTime: '06:15 PM',
    arrivalTime: '09:55 PM',
    duration: '3h 40m',
    price: 135,
    frequency: 'Daily evening',
    status: '15m delay (Waitlist)',
    recommended: false,
    features: ['Daily Commuter Favorite', 'Budget Friendly', 'Scenic Mandya Paddy Field Corridor']
  },

  // CARS / CABS
  {
    id: 'trans-car-1',
    type: 'Car',
    providerName: 'TRAVELIQ Verified Outstation Cab',
    vehicleModel: 'Maruti Suzuki Dzire / Swift Sedan',
    origin: 'Any Bangalore Location (Doorstep)',
    destination: 'Direct Mysore Hotel Drop',
    departureTime: 'Instant (15 mins pickup)',
    arrivalTime: '3h 20m after pickup',
    duration: '3h 20m',
    price: 1200,
    frequency: '24x7 On-demand',
    status: 'Expressway Route Ready',
    recommended: false,
    features: ['Door-to-door convenience', 'Expressway Toll Included', 'Zero cancellation penalty', 'Chauffeur verified']
  },
  {
    id: 'trans-car-2',
    type: 'Cab',
    providerName: 'TRAVELIQ Prime Chauffeur SUV',
    vehicleModel: 'Toyota Innova Crysta (6+1 Seater)',
    origin: 'Bangalore Airport / City',
    destination: 'Mysore Resort Direct',
    departureTime: 'Scheduled / Instant',
    arrivalTime: '3h 10m',
    duration: '3h 10m',
    price: 2400,
    frequency: '24x7 On-demand',
    status: 'Instant confirmation',
    recommended: false,
    features: ['Spacious Group Seating', 'Ample Luggage Trunk', 'Expressway FASTag Included', 'Bottled Mineral Water']
  }
];

export const VEHICLE_RENTALS: VehicleRental[] = [
  {
    id: 'rental-1',
    name: 'Smart EV Scooter (Ather 450X)',
    type: 'Scooter',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    pricePerDay: '₹499 / day',
    rating: 4.8,
    fuelType: 'Electric (110 km range)',
    seating: '2 Persons',
    pickupLocation: 'Mysore Railway Station Mobility Hub'
  },
  {
    id: 'rental-2',
    name: 'Royal Enfield Classic 350',
    type: 'Bike',
    image: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=600&q=80',
    pricePerDay: '₹899 / day',
    rating: 4.9,
    fuelType: 'Petrol (35 km/l)',
    seating: '2 Persons',
    pickupLocation: 'Mysore Palace North Gate'
  },
  {
    id: 'rental-3',
    name: 'Maruti Suzuki Swift Self-Drive',
    type: 'Car',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    pricePerDay: '₹1,399 / day',
    rating: 4.7,
    fuelType: 'Petrol (Unlimited KMs)',
    seating: '5 Seater',
    pickupLocation: 'Suburban Bus Stand Hub'
  },
  {
    id: 'rental-4',
    name: 'Mahindra Thar 4x4 Convertible',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    pricePerDay: '₹2,699 / day',
    rating: 4.9,
    fuelType: 'Diesel Manual 4WD',
    seating: '4 Seater',
    pickupLocation: 'Mysore Central Ring Road'
  }
];
