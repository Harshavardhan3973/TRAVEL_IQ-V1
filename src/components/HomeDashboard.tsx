import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  ArrowRight, 
  CloudRain, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  AlertTriangle,
  Hotel as HotelIcon,
  Bus,
  Navigation,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  AppView, 
  Destination, 
  Hotel, 
  TransportOption, 
  RealTimeAlert,
  CityWeather,
  WorldLocation
} from '../types';
import { POPULAR_WORLD_DESTINATIONS } from '../data/worldData';

interface HomeDashboardProps {
  destinations: Destination[];
  hotels: Hotel[];
  transports: TransportOption[];
  alerts: RealTimeAlert[];
  weather: CityWeather;
  onNavigate: (view: AppView) => void;
  onSelectDestination: (dest: Destination) => void;
  onSelectWorldDestination?: (worldLoc: WorldLocation) => void;
  onStartPlanTrip: (params: { destination: string; date: string; travelers: number }) => void;
  onRefreshLiveStatus: () => void;
  isStatusRefreshing: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  destinations,
  hotels,
  transports,
  alerts,
  weather,
  onNavigate,
  onSelectDestination,
  onSelectWorldDestination,
  onStartPlanTrip,
  onRefreshLiveStatus,
  isStatusRefreshing
}) => {
  const [searchDestination, setSearchDestination] = useState('Paris');
  const [travelDate, setTravelDate] = useState('2026-09-12');
  const [travelersCount, setTravelersCount] = useState(2);

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartPlanTrip({
      destination: searchDestination,
      date: travelDate,
      travelers: travelersCount
    });
  };

  const openCount = destinations.filter(d => d.status.state === 'open').length;
  const closedCount = destinations.filter(d => d.status.state === 'closed').length;
  const closingSoonCount = destinations.filter(d => d.status.state === 'closing_soon').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Hackathon Student Innovation Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-800/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded-full">
                Student Innovation Hackathon Entry
              </span>
              <span className="text-xs text-blue-200/80 font-medium">
                Unified Tourism Intelligence
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Eliminating the multi-app fatigue for travelers: Combining <strong className="text-white">Hotels + Tourist Places + Weather + Transport + Vehicles + Routes + AI Planning + Real-Time Alerts</strong> in a single cohesive engine.
            </p>
          </div>
          <button
            id="btn-banner-ai-planner"
            onClick={() => onNavigate('ai-planner')}
            className="self-start sm:self-center px-3.5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch AI Planner</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl min-h-[420px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600100397608-f010f443a6d9?auto=format&fit=crop&w=1800&q=85"
            alt="Mysore Palace illuminated"
            className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 sm:py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            🇮🇳 INCREDIBLE INDIA • TRAVELIQ ALL-INDIA TRAVEL APP
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover. Plan. Travel. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-teal-300 to-blue-300">
              Across Incredible India.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
            A single platform combining <strong>Hotels + Heritage Monuments + Weather & Monsoon Intel + Vande Bharat & IRCTC Trains + KSRTC/Volvo Buses + AI Trip Planning</strong> across all 28 states & 8 Union Territories.
          </p>

          {/* MAIN SEARCH & TRIP PLANNER FORM */}
          <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/30 text-slate-800 max-w-3xl mx-auto">
            <form onSubmit={handlePlanSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
              {/* Destination Input */}
              <div className="sm:col-span-4 text-left px-3 py-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Where do you want to go?
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <input
                    id="hero-input-destination"
                    type="text"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    placeholder="Bengaluru, Delhi, Jaipur, Goa, Manali..."
                    className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Travel Date */}
              <div className="sm:col-span-3 text-left px-3 py-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Travel Date
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                  <input
                    id="hero-input-date"
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Travelers */}
              <div className="sm:col-span-2 text-left px-3 py-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Travelers
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <select
                    id="hero-input-travelers"
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-hidden cursor-pointer"
                  >
                    <option value={1}>1 Solo</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Group</option>
                    <option value={5}>5+ Family</option>
                  </select>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="sm:col-span-3 flex flex-col sm:flex-row gap-1.5">
                <button
                  id="btn-hero-plan-my-trip"
                  type="submit"
                  className="flex-1 py-3 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Plan Trip</span>
                </button>
                <button
                  id="btn-hero-explore-map"
                  type="button"
                  onClick={() => onNavigate('routes-map')}
                  className="py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">India Map</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick popular tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Popular in India:</span>
            {POPULAR_WORLD_DESTINATIONS.slice(0, 7).map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setSearchDestination(item.name);
                  if (onSelectWorldDestination) onSelectWorldDestination(item);
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{item.flag}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ALL-INDIA POPULAR DESTINATIONS SHOWCASE */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇮🇳</span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Explore Destinations Across India
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Select any Indian destination across all 28 states & 8 Union Territories to view real-time weather, satellite maps, Vande Bharat connectivity, hotels, and attractions in Indian Rupees (₹).
            </p>
          </div>
          <button
            onClick={() => onNavigate('routes-map')}
            className="self-start sm:self-auto text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Open All-India Satellite Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {POPULAR_WORLD_DESTINATIONS.map((dest) => (
            <div
              key={dest.name}
              id={`card-dest-${dest.name.toLowerCase()}`}
              onClick={() => {
                if (onSelectWorldDestination) {
                  onSelectWorldDestination(dest);
                }
                onNavigate('routes-map');
              }}
              className="group bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{dest.flag}</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {dest.currencySymbol} ({dest.currency})
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {dest.state ? `${dest.state}, India` : dest.country}
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                  {dest.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:text-blue-700">
                <span>Explore Map</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. SMART RECOMMENDATION ENGINE CARD (KEY INNOVATION PROMPT MANDATE) */}
      <section className="bg-gradient-to-br from-amber-500/10 via-blue-500/5 to-emerald-500/10 border-2 border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/40">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Smart Recommendation Engine
                </h2>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase rounded-full border border-amber-300">
                  Key Innovation
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                TRAVELIQ synthesizes weather forecasts, live attraction operating statuses, crowd surges, and transit delays to recommend optimized actions.
              </p>
            </div>
          </div>
          <button
            id="btn-view-all-alerts"
            onClick={() => onNavigate('alerts')}
            className="self-start md:self-auto px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Live Alerts Center</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </button>
        </div>

        {/* Live Example Cards from Problem Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Example 1: Weather to Schedule */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-amber-600" />
                ⚠️ Rain expected tomorrow afternoon (Mysore 45% risk)
              </span>
              <span className="text-[10px] bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 font-semibold">Active Advisory</span>
            </div>
            <p className="text-xs font-extrabold text-slate-900 mt-1">
              TRAVELIQ Recommendation:
            </p>
            <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              “Visit <strong>Mysore Palace</strong> grounds and Chamundi Hill in the morning (08:30 AM – 12:30 PM), and move to indoor attractions like <strong>Jaganmohan Palace Art Gallery</strong> after 2:00 PM.”
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                id="btn-rec-indoor-places"
                onClick={() => onNavigate('explore')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Indoor Attractions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Example 2: Transit Disruption to Optimal Bus */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-blue-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-blue-600" />
                ⚠️ Chamundi Express Rail Delayed (Waitlist High)
              </span>
              <span className="text-[10px] bg-blue-50 px-1.5 py-0.5 rounded text-blue-700 font-semibold">Reroute Ready</span>
            </div>
            <p className="text-xs font-extrabold text-slate-900 mt-1">
              TRAVELIQ Recommended Transit:
            </p>
            <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
              <span><strong>KSRTC Airavat AC Express Bus</strong> via 10-Lane Expressway</span>
              <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">₹450 • 4h 10m</span>
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Departs in 20 mins from Satellite BS
              </span>
              <button
                id="btn-rec-book-bus"
                onClick={() => onNavigate('transport')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Compare Transport</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REAL-TIME TOURIST PLACE STATUS STRIP */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Real-Time Tourist Place Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status directly from regional tourist boards and sensor feeds
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {openCount} Open
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {closingSoonCount} Closing Soon
              </span>
              <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {closedCount} Closed
              </span>
            </div>
            <button
              id="btn-check-live-status-refresh"
              onClick={onRefreshLiveStatus}
              disabled={isStatusRefreshing}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className={`w-3.5 h-3.5 ${isStatusRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isStatusRefreshing ? 'Verifying...' : 'Check Live Status'}</span>
            </button>
          </div>
        </div>

        {/* Status preview cards carousel/grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {destinations.slice(0, 3).map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                  dest.status.state === 'open' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : dest.status.state === 'closed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    dest.status.state === 'open' ? 'bg-emerald-600' : dest.status.state === 'closed' ? 'bg-red-600' : 'bg-amber-600'
                  }`} />
                  {dest.status.label}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {dest.weather.temp}°C {dest.weather.icon}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                {dest.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {dest.city} • {dest.distanceKm} km away • ⭐ {dest.rating}
              </p>
              {dest.status.notice && (
                <p className="text-[11px] text-slate-600 mt-2 bg-white p-1.5 rounded border border-slate-100 line-clamp-1">
                  {dest.status.notice}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            id="btn-view-all-place-status"
            onClick={() => onNavigate('places')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Live Attraction Statuses & Hours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* QUICK WEATHER & DYNAMIC TRAVEL IMPACT STRIP */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shrink-0">
              ☀️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  {weather.city}
                </h3>
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded">
                  Live Station
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
                <span className="text-xl font-black text-slate-900">{weather.temp}°C</span>
                <span>Feels like {weather.feelsLike}°C</span>
                <span>• Rain Risk: {weather.rainProb}%</span>
                <span>• Humidity: {weather.humidity}%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 max-w-md">
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              Weather Influence on Recommendations
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              {weather.travelImpactNote}
            </p>
          </div>

          <button
            id="btn-view-full-weather"
            onClick={() => onNavigate('weather')}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors shrink-0 cursor-pointer self-start md:self-auto"
          >
            7-Day Forecast & Advisory →
          </button>
        </div>
      </section>

      {/* EXPLORE DESTINATIONS PREVIEW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Explore Destinations
            </h2>
            <p className="text-xs text-slate-500">
              Curated tourist places with real-time status and live weather
            </p>
          </div>
          <button
            id="btn-see-all-destinations"
            onClick={() => onNavigate('explore')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>See All Destinations ({destinations.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.slice(0, 3).map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image & Status Tag */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 ${
                    dest.status.state === 'open'
                      ? 'bg-emerald-600 text-white'
                      : dest.status.state === 'closed'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {dest.status.label}
                  </span>
                </div>

                {/* Rating and Distance */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    ⭐ {dest.rating} ({dest.reviewsCount.toLocaleString()})
                  </span>
                  <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    📍 {dest.city}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{dest.category}</span>
                    <span className="font-semibold text-slate-700">🌤️ {dest.weather.temp}°C</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {dest.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-700">
                    Entry: <strong className="text-slate-900">{dest.status.entryFee === 0 ? 'Free' : `₹${dest.status.entryFee}`}</strong>
                  </div>
                  <button
                    id={`btn-explore-${dest.id}`}
                    onClick={() => onSelectDestination(dest)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK COMPARISON GRID: HOTELS + TRANSPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotels Snippet */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HotelIcon className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Verified Hotels in Mysore
              </h3>
            </div>
            <button
              id="btn-home-view-hotels"
              onClick={() => onNavigate('hotels')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Hotels</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {hotels.slice(0, 2).map((h) => (
              <div
                key={h.id}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 flex items-center gap-3 transition-colors"
              >
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {h.name}
                    </h4>
                    {h.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                        {h.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {h.distanceFromDestination} • ⭐ {h.rating}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-extrabold text-blue-700">
                      ₹{h.pricePerNight.toLocaleString()}<span className="text-[10px] font-normal text-slate-500">/night</span>
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {h.availableRooms} rooms left
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transport Comparison Snippet */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Transport: Bangalore → Mysore
              </h3>
            </div>
            <button
              id="btn-home-view-transport"
              onClick={() => onNavigate('transport')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Compare All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Route comparison summary: Car vs Bus vs Train */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="block text-base">🚗</span>
                <span className="font-bold text-slate-800 block mt-1">Car / Cab</span>
                <span className="text-[11px] text-slate-500">3h 20m</span>
                <span className="text-xs font-extrabold text-slate-900 block mt-0.5">₹1,200</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/80 border-2 border-blue-500 relative">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-extrabold px-1.5 rounded-full">
                  Recommended
                </span>
                <span className="block text-base">🚌</span>
                <span className="font-bold text-blue-900 block mt-1">Express Bus</span>
                <span className="text-[11px] text-blue-700">4h 10m</span>
                <span className="text-xs font-extrabold text-blue-800 block mt-0.5">₹450</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="block text-base">🚆</span>
                <span className="font-bold text-slate-800 block mt-1">Intercity Train</span>
                <span className="text-[11px] text-slate-500">3h 40m</span>
                <span className="text-xs font-extrabold text-slate-900 block mt-0.5">₹600</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800">
                  Interactive Route & Map Hub
                </p>
                <p className="text-[11px] text-slate-500">
                  Visual POI pins for palace, hotels, railway, restaurants
                </p>
              </div>
              <button
                id="btn-home-open-map"
                onClick={() => onNavigate('routes-map')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Open Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
