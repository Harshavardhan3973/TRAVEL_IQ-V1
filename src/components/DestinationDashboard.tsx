import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Sparkles, 
  Compass, 
  CloudSun, 
  Hotel as HotelIcon, 
  Bus, 
  Utensils, 
  Car, 
  AlertTriangle, 
  ArrowRight, 
  Calendar, 
  Star, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Navigation,
  DollarSign,
  Ticket
} from 'lucide-react';
import { WorldLocation, MapPOI, Hotel, TransportOption } from '../types';
import { generatePOIsForLocation } from '../data/worldData';

interface DestinationDashboardProps {
  destination: WorldLocation;
  pois?: MapPOI[];
  onViewOnMap?: (dest: WorldLocation) => void;
  onOpenMap?: (dest: WorldLocation) => void;
  onPlanTrip?: ((dest: WorldLocation) => void) | ((cityName: string, loc?: WorldLocation) => void);
  onSelectPOI?: (poi: MapPOI) => void;
  onBookHotel?: (hotelName: string, price: number) => void;
  onBookStay?: (hotelName: string, price: number) => void;
  onBackToWorld?: () => void;
}

export const DestinationDashboard: React.FC<DestinationDashboardProps> = ({
  destination,
  pois,
  onViewOnMap,
  onOpenMap,
  onPlanTrip,
  onSelectPOI,
  onBookHotel,
  onBookStay,
  onBackToWorld,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'places' | 'hotels' | 'transport' | 'restaurants' | 'rentals' | 'alerts'>('overview');
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: string;
    rainProb: number;
    icon: string;
    advisory: string;
  } | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Safe caller functions that prevent "is not a function" errors
  const handleViewOnMap = (dest: WorldLocation) => {
    if (typeof onViewOnMap === 'function') {
      onViewOnMap(dest);
    } else if (typeof onOpenMap === 'function') {
      onOpenMap(dest);
    }
  };

  const handlePlanTrip = (dest: WorldLocation) => {
    if (typeof onPlanTrip === 'function') {
      // Handles both (dest: WorldLocation) and (cityName: string, loc?: WorldLocation) signatures safely
      try {
        (onPlanTrip as any)(dest.name, dest);
      } catch {
        (onPlanTrip as any)(dest);
      }
    }
  };

  const handleSelectPOI = (poi: MapPOI) => {
    if (typeof onSelectPOI === 'function') {
      onSelectPOI(poi);
    } else {
      handleViewOnMap(destination);
    }
  };

  const handleBookHotel = (hotelName: string, price: number) => {
    if (typeof onBookHotel === 'function') {
      onBookHotel(hotelName, price);
    } else if (typeof onBookStay === 'function') {
      onBookStay(hotelName, price);
    }
  };

  // Fetch live real-time weather from our Open-Meteo endpoint
  useEffect(() => {
    setIsLoadingWeather(true);
    fetch(`/api/weather?lat=${destination.lat}&lng=${destination.lng}`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoadingWeather(false);
        if (data.success) {
          setWeatherData({
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
      .catch((err) => {
        setIsLoadingWeather(false);
        console.warn("Weather load failed:", err);
      });
  }, [destination.lat, destination.lng]);

  const currencySymbol = destination.currencySymbol || "$";

  // Filter categorized POIs - fallback to dynamic world data generator if empty
  const effectivePois = useMemo(() => {
    if (pois && pois.length > 0) return pois;
    return generatePOIsForLocation(
      destination.name,
      destination.lat,
      destination.lng,
      destination.currency || 'USD',
      currencySymbol
    );
  }, [pois, destination, currencySymbol]);

  const attractions = effectivePois.filter((p) => p.category === 'attraction');
  const hotels = effectivePois.filter((p) => p.category === 'hotel');
  const restaurants = effectivePois.filter((p) => p.category === 'restaurant');
  const transitStations = effectivePois.filter((p) => p.category === 'train' || p.category === 'bus' || p.category === 'airport');
  const carRentals = effectivePois.filter((p) => p.category === 'rental');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* HEADER BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt={destination.name}
          className="w-full h-72 sm:h-80 object-cover object-center absolute inset-0 opacity-40 mix-blend-overlay"
        />

        <div className="relative z-20 p-6 sm:p-10 flex flex-col justify-between h-full min-h-[280px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
              <span>{destination.flag || '🇮🇳'}</span>
              <span>{destination.state ? `${destination.state}, India` : destination.country}</span>
              <span className="text-white/40">•</span>
              <span>Currency: {destination.currency || 'INR'} ({currencySymbol})</span>
            </div>

            {onBackToWorld && (
              <button
                id="btn-back-to-world"
                onClick={onBackToWorld}
                className="text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
              >
                ← All-India Destinations
              </button>
            )}
          </div>

          <div className="space-y-2 mt-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              Explore {destination.name}
              <span className="text-2xl sm:text-3xl">{destination.flag}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base line-clamp-2 leading-relaxed">
              {destination.description || `Discover top heritage attractions, culture, hotels, transport connectivity, and smart itineraries in ${destination.displayName || destination.name}.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-white/10">
            <button
              id="btn-dest-view-map"
              onClick={() => handleViewOnMap(destination)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              View on Interactive Map
            </button>

            <button
              id="btn-dest-plan-trip"
              onClick={() => handlePlanTrip(destination)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold shadow-lg shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Plan Trip with AI
            </button>

            {/* LIVE WEATHER WIDGET IN HEADER */}
            {weatherData && (
              <div className="ml-auto inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                <span className="text-2xl">{weatherData.icon}</span>
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{weatherData.temp}°C</span>
                    <span className="text-slate-300 font-normal">{weatherData.condition}</span>
                  </div>
                  <div className="text-[11px] text-blue-200">
                    Rain prob: {weatherData.rainProb}% • Wind: {weatherData.windSpeed}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HORIZONTAL NAV TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {[
          { key: 'overview', label: 'Overview', icon: Compass },
          { key: 'places', label: `Attractions (${attractions.length})`, icon: Ticket },
          { key: 'hotels', label: `Hotels (${hotels.length})`, icon: HotelIcon },
          { key: 'transport', label: `Transit & Stations (${transitStations.length})`, icon: Bus },
          { key: 'restaurants', label: `Restaurants (${restaurants.length})`, icon: Utensils },
          { key: 'rentals', label: `Car Rentals (${carRentals.length})`, icon: Car },
          { key: 'alerts', label: 'Local Alerts (2)', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`tab-dest-${tab.key}`}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* SMART WEATHER ADVISORY CARD */}
          {weatherData && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl border border-blue-100">
                  {weatherData.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">TRAVELIQ Live Weather Advisory for {destination.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-xl">{weatherData.advisory}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="px-3 py-1.5 bg-white rounded-lg border border-blue-100 font-semibold text-slate-700">
                  Humidity: {weatherData.humidity}%
                </div>
                <div className="px-3 py-1.5 bg-white rounded-lg border border-blue-100 font-semibold text-slate-700">
                  Feels Like: {weatherData.feelsLike}°C
                </div>
              </div>
            </div>
          )}

          {/* KEY ATTRACTIONS HIGHLIGHT */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🏛️</span> Top Tourist Places in {destination.name}
              </h3>
              <button
                onClick={() => setActiveTab('places')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View all ({attractions.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {attractions.slice(0, 3).map((poi) => (
                <div
                  key={poi.id}
                  id={`card-attraction-${poi.id}`}
                  onClick={() => handleSelectPOI(poi)}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={poi.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"}
                      alt={poi.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1">
                      <span>★</span> {poi.rating || 4.8}
                    </div>
                    {poi.isOpen !== undefined && (
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                        {poi.statusText || 'Open Today'}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {poi.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {poi.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">
                        {poi.entryFee !== undefined ? (poi.entryFee === 0 ? 'Free Entry' : `Ticket: ${currencySymbol}${poi.entryFee}`) : 'Ticket Available'}
                      </span>
                      <span className="text-blue-600 font-bold flex items-center gap-1">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HOTELS & STAYS PREVIEW */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🏨</span> Recommended Stays & Hotels
              </h3>
              <button
                onClick={() => setActiveTab('hotels')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View all ({hotels.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotels.slice(0, 2).map((hotel) => (
                <div
                  key={hotel.id}
                  id={`card-hotel-${hotel.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 hover:shadow-md transition-all"
                >
                  <img
                    src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                    alt={hotel.name}
                    className="w-28 h-28 rounded-xl object-cover"
                  />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900">{hotel.name}</h4>
                        <span className="text-xs font-bold text-amber-500">★ {hotel.rating || 4.7}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{hotel.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-sm font-black text-slate-900">{hotel.estimatedCost || `${currencySymbol}150/night`}</span>
                      </div>
                      <button
                        id={`btn-book-${hotel.id}`}
                        onClick={() => handleBookHotel(hotel.name, 150)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTRACTIONS */}
      {activeTab === 'places' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {attractions.map((poi) => (
            <div
              key={poi.id}
              id={`place-item-${poi.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44">
                  <img
                    src={poi.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"}
                    alt={poi.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-xs font-bold">
                    ★ {poi.rating || 4.8}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                    {poi.statusText || 'Open Today'}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">{poi.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{poi.description}</p>
                  {poi.operatingHours && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{poi.operatingHours}</span>
                    </div>
                  )}
                  {poi.weatherAdvisory && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                      💡 {poi.weatherAdvisory}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {poi.entryFee !== undefined ? (poi.entryFee === 0 ? 'Free' : `Fee: ${currencySymbol}${poi.entryFee}`) : 'Ticketed'}
                </span>
                <button
                  onClick={() => handleSelectPOI(poi)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Locate on Map
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: HOTELS */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all"
            >
              <img
                src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                alt={hotel.name}
                className="w-full sm:w-36 h-36 rounded-xl object-cover"
              />
              <div className="flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{hotel.name}</h4>
                    <span className="text-xs font-bold text-amber-500">★ {hotel.rating || 4.7}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{hotel.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-sm font-black text-slate-900">{hotel.estimatedCost || `${currencySymbol}150/night`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectPOI(hotel)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Map
                    </button>
                    <button
                      onClick={() => handleBookHotel(hotel.name, 150)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Book Stay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: TRANSIT */}
      {activeTab === 'transport' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Multimodal Public Transit Guide</h4>
              <p className="text-xs text-slate-300 mt-0.5">High-speed trains, metro lines, airport express, and public buses in {destination.name}.</p>
            </div>
            <button
              onClick={() => handleViewOnMap(destination)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold cursor-pointer text-white shadow-sm"
            >
              View Transit Lines on Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transitStations.map((st) => (
              <div key={st.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-lg">
                  {st.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-slate-900">{st.name}</h5>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      {st.statusText || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{st.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RESTAURANTS */}
      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((res) => (
            <div key={res.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-lg">
                {res.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-slate-900">{res.name}</h5>
                  <span className="text-xs font-bold text-amber-500">★ {res.rating || 4.7}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{res.description}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>Pricing: {res.priceRange || `${currencySymbol}${currencySymbol}`}</span>
                  <button
                    onClick={() => handleSelectPOI(res)}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    View on Map →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: CAR RENTALS */}
      {activeTab === 'rentals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {carRentals.map((rental) => (
            <div key={rental.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center text-lg">
                🚗
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-slate-900">{rental.name}</h5>
                  <span className="font-bold text-xs text-purple-700">{rental.priceRange}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{rental.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Instant contactless unlock</span>
                  <button
                    onClick={() => handleSelectPOI(rental)}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-purple-700"
                  >
                    Reserve Vehicle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 7: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm">Monument Pre-Booking Recommended</h5>
              <p className="text-xs text-amber-800 mt-1">
                Peak visitor queues occur between 11:00 AM and 3:00 PM. Book time-slotted online passes in advance to bypass long physical ticket queues.
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm">All Transit Lines Operating Normally</h5>
              <p className="text-xs text-blue-800 mt-1">
                Regional express rail and city metro routes in {destination.name} are running on standard scheduled frequencies with zero weather disruptions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
