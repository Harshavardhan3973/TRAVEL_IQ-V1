import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Utensils, 
  Hotel as HotelIcon, 
  Fuel, 
  Cross, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { RouteOption, MapPOI } from '../types';
import { ROUTE_OPTIONS, MAP_POIS } from '../data/routes';

interface RoutesMapViewProps {
  onSelectPOI?: (poi: MapPOI) => void;
}

export const RoutesMapView: React.FC<RoutesMapViewProps> = ({
  onSelectPOI
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(ROUTE_OPTIONS[0].id);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(MAP_POIS[0]);

  const currentRoute = ROUTE_OPTIONS.find(r => r.id === selectedRouteId) || ROUTE_OPTIONS[0];

  const filteredPOIs = MAP_POIS.filter(poi => {
    if (activeCategory === 'all') return true;
    return poi.category === activeCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Navigation className="w-4 h-4" />
            Live Wayfinding & Multi-Route Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Routes & Interactive POI Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time traffic telemetry, toll costs, food stops, and geo-tagged attraction waypoints between Bangalore and Mysore.
          </p>
        </div>

        {/* Route selector buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {ROUTE_OPTIONS.map((route) => (
            <button
              key={route.id}
              id={`btn-route-option-${route.id}`}
              onClick={() => setSelectedRouteId(route.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedRouteId === route.id
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {route.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Route Details Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Visual Map Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg flex flex-col relative min-h-[500px]">
          {/* Map Controls Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Category Filter Pills (pointer events active) */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 pointer-events-auto shadow-md">
              {[
                { id: 'all', label: 'All POIs' },
                { id: 'attraction', label: 'Attractions' },
                { id: 'hotel', label: 'Hotels' },
                { id: 'restaurant', label: 'Food & Refreshment' },
                { id: 'fuel', label: 'Fuel / EV' },
                { id: 'hospital', label: 'Medical' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Live Traffic Badge */}
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold pointer-events-auto flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                currentRoute.trafficCondition === 'Smooth Traffic' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`} />
              <span className="text-white">{currentRoute.trafficCondition}</span>
            </div>
          </div>

          {/* SIMULATED MAP SVG CANVAS WITH HIGH RESOLUTION VECTOR CORRIDOR */}
          <div className="relative w-full flex-1 flex items-center justify-center p-6 bg-radial from-slate-900 via-slate-950 to-slate-950">
            {/* Subtle grid pattern background */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(#60a5fa 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Simulated Road & Nodes SVG */}
            <svg className="w-full h-full min-h-[380px] max-h-[460px]" viewBox="0 0 700 400" fill="none">
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Highway Corridor Line */}
              <path
                d={selectedRouteId === 'blr-mysore-exp' 
                  ? "M 100 80 Q 250 140, 360 210 T 600 320" 
                  : "M 100 80 Q 200 240, 350 280 T 600 320"}
                stroke="#1e293b"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d={selectedRouteId === 'blr-mysore-exp' 
                  ? "M 100 80 Q 250 140, 360 210 T 600 320" 
                  : "M 100 80 Q 200 240, 350 280 T 600 320"}
                stroke="url(#routeGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={selectedRouteId === 'blr-mysore-exp' ? "none" : "8 6"}
                filter="url(#glow)"
              />

              {/* Start Point: Bangalore */}
              <g transform="translate(100, 80)">
                <circle r="14" fill="#3b82f6" fillOpacity="0.3" className="animate-ping" />
                <circle r="8" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                <text x="-35" y="-14" fill="#93c5fd" fontSize="12" fontWeight="800">
                  Bangalore (Start)
                </text>
              </g>

              {/* Midway waypoint: Maddur Food & Tender Coconut */}
              <g transform="translate(320, 185)">
                <circle r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                <text x="-40" y="-10" fill="#fcd34d" fontSize="10" fontWeight="700">
                  Maddur (Stopover)
                </text>
              </g>

              {/* Heritage stop: Srirangapatna */}
              <g transform="translate(480, 260)">
                <circle r="6" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                <text x="12" y="4" fill="#c4b5fd" fontSize="10" fontWeight="700">
                  Srirangapatna
                </text>
              </g>

              {/* Destination Point: Mysore */}
              <g transform="translate(600, 320)">
                <circle r="16" fill="#10b981" fillOpacity="0.3" className="animate-ping" />
                <circle r="9" fill="#10b981" stroke="#fff" strokeWidth="2" />
                <text x="-25" y="24" fill="#6ee7b7" fontSize="12" fontWeight="800">
                  Mysore (Destination)
                </text>
              </g>
            </svg>

            {/* INTERACTIVE POI PINS LAYER */}
            {filteredPOIs.map((poi) => (
              <div
                key={poi.id}
                onClick={() => setSelectedPOI(poi)}
                style={{
                  position: 'absolute',
                  top: `${poi.lat}%`,
                  left: `${poi.lng}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`z-20 p-2 rounded-full cursor-pointer transition-all duration-200 group ${
                  selectedPOI?.id === poi.id
                    ? 'scale-125 ring-4 ring-white/50 bg-blue-500 text-white shadow-xl'
                    : 'hover:scale-110 bg-slate-800/90 text-white border border-white/20'
                }`}
                title={poi.name}
              >
                <span className="text-sm select-none">{poi.icon}</span>

                {/* Floating tooltip label */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-950 text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-md pointer-events-none z-30">
                  {poi.name}
                </div>
              </div>
            ))}
          </div>

          {/* Selected POI card overlay at bottom */}
          {selectedPOI && (
            <div className="p-4 bg-slate-950/90 backdrop-blur-md border-t border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedPOI.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white">{selectedPOI.name}</h4>
                    <span className="text-[10px] font-bold uppercase bg-blue-600 px-2 py-0.5 rounded-full">
                      {selectedPOI.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{selectedPOI.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs shrink-0">
                {selectedPOI.rating && (
                  <span className="text-amber-400 font-bold">⭐ {selectedPOI.rating}</span>
                )}
                {selectedPOI.priceRange && (
                  <span className="text-emerald-400 font-semibold">{selectedPOI.priceRange}</span>
                )}
                <span className="text-slate-400">{selectedPOI.operatingHours}</span>
              </div>
            </div>
          )}
        </div>

        {/* Route Details & Itinerary Waypoints Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Route Summary Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase">
                  Selected Route
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Toll: {currentRoute.tollCost}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {currentRoute.name}
              </h3>
              <p className="text-xs text-slate-500">
                {currentRoute.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Distance</span>
                <span className="text-base font-black text-blue-900">{currentRoute.distance}</span>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Travel Time</span>
                <span className="text-base font-black text-emerald-900">{currentRoute.estimatedTime}</span>
              </div>
            </div>

            {/* Highway Stops Checklist */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-800">
                Key Highway Stops & Highlights:
              </h4>
              <div className="space-y-1.5">
                {currentRoute.keyStops.map((stop, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{stop}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency & Assistance Module */}
          <div className="bg-gradient-to-br from-red-50 to-slate-50 rounded-2xl p-4 border border-red-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-black text-red-700">
              <Cross className="w-4 h-4 text-red-600" />
              Expressway Tourist Help & SOS
            </div>
            <p className="text-slate-600">
              NHAI Expressway 24/7 Patrol Helpline: <strong>1033</strong>
            </p>
            <p className="text-slate-600">
              Mysore Tourist Police Desk: <strong>+91 821 2418100</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
