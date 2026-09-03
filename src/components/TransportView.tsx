import React, { useState } from 'react';
import { 
  Bus, 
  Train, 
  Car, 
  Bike, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  IndianRupee, 
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar
} from 'lucide-react';
import { TransportOption, VehicleRental } from '../types';
import { VEHICLE_RENTALS } from '../data/transports';

interface TransportViewProps {
  transports: TransportOption[];
  onBookTransportSuccess: (transport: TransportOption) => void;
  onRentVehicleSuccess: (vehicle: VehicleRental) => void;
}

export const TransportView: React.FC<TransportViewProps> = ({
  transports,
  onBookTransportSuccess,
  onRentVehicleSuccess,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<'blr-mysore' | 'del-jaipur'>('blr-mysore');
  const [activeTab, setActiveTab] = useState<'compare' | 'rentals'>('compare');
  const [bookedTransportId, setBookedTransportId] = useState<string | null>(null);
  const [rentedVehicleId, setRentedVehicleId] = useState<string | null>(null);

  const filteredTransports = transports.filter(t => 
    selectedRoute === 'blr-mysore' ? t.destination.includes('Mysore') : t.destination.includes('Jaipur')
  );

  const handleBookTransport = (option: TransportOption) => {
    setBookedTransportId(option.id);
    setTimeout(() => {
      onBookTransportSuccess(option);
      setBookedTransportId(null);
      alert(`✅ Reserved ticket for ${option.providerName}! Booking saved to My Trips.`);
    }, 800);
  };

  const handleRentVehicle = (vehicle: VehicleRental) => {
    setRentedVehicleId(vehicle.id);
    setTimeout(() => {
      onRentVehicleSuccess(vehicle);
      setRentedVehicleId(null);
      alert(`✅ Reserved ${vehicle.name} (${vehicle.type})! Pickup details added to My Trips.`);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Bus className="w-4 h-4" />
            Intercity Mobility & Vehicle Fleet
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Transport & Route Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time transit comparison across buses, trains, and cabs with live delay monitoring and vehicle rentals.
          </p>
        </div>

        {/* Route Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Corridor:</span>
          <select
            id="select-transport-corridor"
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value as any)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="blr-mysore">Bangalore ↔ Mysore (145 km)</option>
            <option value="del-jaipur">Delhi ↔ Jaipur (280 km)</option>
          </select>
        </div>
      </div>

      {/* Top 3 Quick Glance Cards (Car vs Bus vs Train - Prompt Mandate) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Car / Cab */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
              🚗
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Door-to-door
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 mt-3">Car / Outstation Cab</h3>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-xl font-black text-slate-900">₹1,200</span>
              <span className="text-xs text-slate-500"> /seat</span>
            </div>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> 3h 20m
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg">
            Direct 10-Lane Expressway. Highest convenience for groups and luggage.
          </p>
        </div>

        {/* Bus (Recommended) */}
        <div className="bg-blue-50/60 rounded-2xl p-5 border-2 border-blue-500 shadow-sm relative overflow-hidden">
          <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-xs">
            ⭐ Recommended
          </span>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl">
              🚌
            </div>
          </div>
          <h3 className="text-base font-extrabold text-blue-950 mt-3">KSRTC Airavat Express Bus</h3>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-xl font-black text-blue-700">₹450</span>
              <span className="text-xs text-blue-600"> /person</span>
            </div>
            <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> 4h 10m
            </span>
          </div>
          <p className="text-xs text-blue-900 mt-2 bg-white/80 p-2 rounded-lg border border-blue-200">
            Departs every 15 mins. Smooth highway ride with verified seating & AC.
          </p>
        </div>

        {/* Train */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
              🚆
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              15m delay
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 mt-3">Intercity Superfast Rail</h3>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-xl font-black text-slate-900">₹600</span>
              <span className="text-xs text-slate-500"> /chair car</span>
            </div>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> 3h 40m
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg">
            Scenic rail corridor. Chamundi Express & Vande Bharat options available.
          </p>
        </div>
      </div>

      {/* Tabs: Public Transit Options vs Self-Drive & Bike Rentals */}
      <div className="flex border-b border-slate-200">
        <button
          id="tab-transport-compare"
          onClick={() => setActiveTab('compare')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'compare'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Scheduled Transit & Buses ({filteredTransports.length})
        </button>
        <button
          id="tab-transport-rentals"
          onClick={() => setActiveTab('rentals')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'rentals'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Self-Drive Cars, Bikes & Cabs ({VEHICLE_RENTALS.length})
        </button>
      </div>

      {activeTab === 'compare' ? (
        <div className="space-y-3">
          {filteredTransports.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                item.recommended
                  ? 'border-blue-400 bg-blue-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  item.type === 'Bus' ? 'bg-blue-100 text-blue-700' :
                  item.type === 'Train' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.type === 'Bus' ? '🚌' : item.type === 'Train' ? '🚆' : '🚗'}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {item.providerName}
                    </h3>
                    {item.recommended && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-extrabold uppercase rounded-full">
                        AI Recommended
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.status.includes('delay') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {item.vehicleModel} • {item.frequency}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                    <span>🕒 Departs: <strong>{item.departureTime}</strong></span>
                    <span>📍 Arrives: <strong>{item.arrivalTime}</strong></span>
                    <span>⏱️ Duration: <strong>{item.duration}</strong></span>
                  </div>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Per traveler</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{item.price.toLocaleString()}
                  </span>
                </div>

                <button
                  id={`btn-book-transit-${item.id}`}
                  onClick={() => handleBookTransport(item)}
                  disabled={bookedTransportId === item.id}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {bookedTransportId === item.id ? 'Reserving...' : 'Book Ticket'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Self Drive & Vehicle Fleet Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {VEHICLE_RENTALS.map((veh) => (
            <div
              key={veh.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={veh.image}
                  alt={veh.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                  {veh.type}
                </span>
                <span className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded">
                  ⭐ {veh.rating}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900">{veh.name}</h4>
                <div className="text-xs text-slate-500 space-y-0.5">
                  <p>⛽ {veh.fuelType} • 👥 {veh.seating}</p>
                  <p>📍 {veh.pickupLocation}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Rent Rate</span>
                    <span className="text-sm font-black text-slate-900">{veh.pricePerDay}</span>
                  </div>
                  <button
                    id={`btn-rent-vehicle-${veh.id}`}
                    onClick={() => handleRentVehicle(veh)}
                    disabled={rentedVehicleId === veh.id}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {rentedVehicleId === veh.id ? 'Holding...' : 'Rent Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
