export interface WeatherInfo {
  temp: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: string;
  rainProb: number;
  icon: string;
}

export interface AttractionStatus {
  state: 'open' | 'closed' | 'closing_soon';
  label: string;
  color: string;
  openingHours: string;
  entryFee: number;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Peak';
  lastChecked: string;
  notice?: string;
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  state?: string;
  country?: string;
  countryCode?: string;
  currency?: string;
  currencySymbol?: string;
  category: 'Heritage' | 'Nature' | 'Spiritual' | 'Adventure' | 'Cultural' | 'Iconic' | 'Urban';
  tagline: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  weather: WeatherInfo;
  status: AttractionStatus;
  highlights: string[];
  bestTimeToVisit: string;
  suggestedDuration: string;
  recommendedTimeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  isIndoor: boolean;
}

export interface WorldLocation {
  id?: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  countryCode?: string;
  lat: number;
  lng: number;
  displayName: string;
  currency: string;
  currencySymbol: string;
  description?: string;
  flag?: string;
  population?: number;
  elevation?: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country?: string;
  location: string;
  address: string;
  image: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  originalPrice?: number;
  currency?: string;
  currencySymbol?: string;
  distanceFromDestination: string;
  availableRooms: number;
  amenities: string[];
  roomType: string;
  badge?: string;
  cancellationPolicy: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TransportOption {
  id: string;
  type: 'Bus' | 'Train' | 'Car' | 'Cab' | 'Flight' | 'Metro' | 'Bicycle' | 'Walking';
  providerName: string;
  vehicleModel: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currencySymbol?: string;
  frequency: string;
  status: string;
  isRealTime?: boolean;
  recommended?: boolean;
  tag?: 'Fastest' | 'Cheapest' | 'Most Convenient';
  features: string[];
}

export interface VehicleRental {
  id: string;
  name: string;
  type: 'Car' | 'Bike' | 'Scooter' | 'SUV';
  image: string;
  pricePerDay: string;
  rating: number;
  fuelType: string;
  seating: string;
  pickupLocation: string;
}

export interface RouteOption {
  id: string;
  name: string;
  distance: string;
  estimatedTime: string;
  trafficCondition: string;
  tollCost: string;
  description: string;
  keyStops: string[];
}

export interface MapPOI {
  id: string;
  name: string;
  category: 'attraction' | 'hotel' | 'restaurant' | 'transport' | 'rental' | 'fuel' | 'hospital' | 'bus' | 'train' | 'airport' | 'tourist_info';
  lat: number;
  lng: number;
  icon: string;
  description: string;
  rating?: number;
  priceRange?: string;
  operatingHours?: string;
  isOpen?: boolean;
  statusText?: string;
  image?: string;
  weather?: {
    temp: number;
    condition: string;
    rainProb?: number;
    icon?: string;
  };
  distanceKm?: number;
  entryFee?: number;
  currencySymbol?: string;
  timings?: string;
  availability?: string;
  estimatedCost?: string;
  transportType?: 'bus' | 'train' | 'airport' | 'taxi' | 'rental' | 'metro';
  associatedId?: string;
  weatherAdvisory?: string;
  estimatedVisitDuration?: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  rainProb: number;
  icon: string;
}

export interface DailyForecast {
  day: string;
  date: string;
  condition: string;
  high: number;
  low: number;
  rainProb: number;
  advisory?: string;
  icon: string;
}

export interface CityWeather {
  city: string;
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: string;
  rainProb: number;
  uvIndex: number;
  airQuality: string;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  travelImpactNote: string;
}

export interface RealTimeAlert {
  id: string;
  type: 'weather' | 'tourist_place' | 'transport' | 'emergency';
  severity: 'high' | 'medium' | 'info';
  title: string;
  message: string;
  timestamp: string;
  affectedDestination?: string;
  suggestedAction?: string;
}

export interface AITripScheduleItem {
  time: string;
  activity: string;
  placeName: string;
  duration: string;
  isOutdoor: boolean;
  note?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  category?: 'attraction' | 'food' | 'hotel' | 'transit';
}

export interface AITripDay {
  dayNumber: number;
  title: string;
  highlights: string[];
  schedule: AITripScheduleItem[];
}

export interface AITripPlan {
  title: string;
  destination: string;
  duration: string;
  budgetCategory: 'Budget' | 'Moderate' | 'Luxury';
  estimatedTotalBudget: number;
  currencySymbol?: string;
  currency?: string;
  totalDistanceKm?: number;
  estimatedTravelTime?: string;
  recommendedHotel: {
    name: string;
    pricePerNight: number;
    reason: string;
  };
  recommendedTransport: {
    mode: string;
    provider: string;
    estimatedCost: number;
    reason: string;
  };
  weatherTip: string;
  days: AITripDay[];
  alertsConsidered?: string[];
}

export interface UserTrip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  hotelBooked: string;
  transport: string;
  placesCount: number;
  estimatedBudget: number;
  currencySymbol?: string;
  status: 'Upcoming' | 'Completed' | 'Draft';
  itinerarySummary?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  travelPreferences: string[];
  budgetPreference: 'Budget' | 'Comfort' | 'Luxury';
  savedPlaceIds: string[];
  bookedHotelIds: string[];
  trips: UserTrip[];
  notificationsEnabled: boolean;
}

export type AppView =
  | 'home'
  | 'explore'
  | 'places'
  | 'weather'
  | 'hotels'
  | 'transport'
  | 'routes-map'
  | 'ai-planner'
  | 'alerts'
  | 'my-trips'
  | 'profile';
