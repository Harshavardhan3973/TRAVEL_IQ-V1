import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  RotateCw, 
  IndianRupee, 
  Users, 
  CloudSun, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Destination } from '../types';

interface PlaceStatusViewProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onRefreshLiveStatus: () => void;
  isStatusRefreshing: boolean;
}

export const PlaceStatusView: React.FC<PlaceStatusViewProps> = ({
  destinations,
  onSelectDestination,
  onRefreshLiveStatus,
  isStatusRefreshing,
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'open' | 'closing_soon' | 'closed'>('all');

  const openList = destinations.filter(d => d.status.state === 'open');
  const closingSoonList = destinations.filter(d => d.status.state === 'closing_soon');
  const closedList = destinations.filter(d => d.status.state === 'closed');

  const displayList = destinations.filter(d => {
    if (selectedStatusTab === 'all') return true;
    return d.status.state === selectedStatusTab;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Live Status Trigger */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Attraction Telemetry Feed
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Real-Time Tourist Place Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Instant verification of opening hours, entry gates, sudden maintenance closures, and live crowd density.
            </p>
          </div>

          <button
            id="btn-check-live-status-hero"
            onClick={onRefreshLiveStatus}
            disabled={isStatusRefreshing}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 ${isStatusRefreshing ? 'animate-spin' : ''}`} />
            <span>{isStatusRefreshing ? 'Verifying with Sensor Feeds...' : 'Check Live Status Now'}</span>
          </button>
        </div>

        {/* Live Status Statistics Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <button
            id="tab-status-all"
            onClick={() => setSelectedStatusTab('all')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatusTab === 'all'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Tracked</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{destinations.length} Places</div>
            <div className="text-[11px] text-slate-500">Live monitored</div>
          </button>

          <button
            id="tab-status-open"
            onClick={() => setSelectedStatusTab('open')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatusTab === 'open'
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              🟢 Open
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">{openList.length} Places</div>
            <div className="text-[11px] text-emerald-600 font-medium">Ready for visitors</div>
          </button>

          <button
            id="tab-status-closing"
            onClick={() => setSelectedStatusTab('closing_soon')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatusTab === 'closing_soon'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              🟡 Closing Soon
            </div>
            <div className="text-xl font-black text-amber-700 mt-0.5">{closingSoonList.length} Place</div>
            <div className="text-[11px] text-amber-700 font-medium">Under 1 hour entry</div>
          </button>

          <button
            id="tab-status-closed"
            onClick={() => setSelectedStatusTab('closed')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatusTab === 'closed'
                ? 'bg-red-50 border-red-500 ring-2 ring-red-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-700 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              🔴 Closed
            </div>
            <div className="text-xl font-black text-red-700 mt-0.5">{closedList.length} Place</div>
            <div className="text-[11px] text-red-600 font-medium">Temporary maintenance</div>
          </button>
        </div>
      </div>

      {/* Main Attraction Cards with High-Visibility Telemetry */}
      <div className="space-y-4">
        {displayList.map((dest) => (
          <div
            key={dest.id}
            className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
              dest.status.state === 'closed'
                ? 'border-red-200 bg-red-50/20'
                : dest.status.state === 'closing_soon'
                ? 'border-amber-200 bg-amber-50/20'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            {/* Left: Image & Identity */}
            <div className="flex items-start gap-4">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    dest.status.state === 'open'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : dest.status.state === 'closed'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      dest.status.state === 'open' ? 'bg-emerald-600 animate-pulse' : dest.status.state === 'closed' ? 'bg-red-600' : 'bg-amber-600 animate-pulse'
                    }`} />
                    {dest.status.state === 'open' ? '🟢 Open Now' : dest.status.state === 'closed' ? '🔴 Closed' : '🟡 Closing Soon'}
                  </span>

                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {dest.city} ({dest.distanceKm} km)
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-600 max-w-xl line-clamp-1">
                  {dest.tagline}
                </p>

                {dest.status.notice && (
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 max-w-xl">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{dest.status.notice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Metrics Grid (Opening hours, Entry fee, Weather, Crowd level) */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs w-full md:w-auto">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 min-w-[120px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Opening Hours</span>
                  <span className="font-bold text-slate-900 block mt-0.5 truncate" title={dest.status.openingHours}>
                    {dest.status.openingHours.split('(')[0]}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 min-w-[90px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Entry Fee</span>
                  <span className="font-extrabold text-emerald-700 block mt-0.5">
                    {dest.status.entryFee === 0 ? 'Free' : `₹${dest.status.entryFee}`}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 min-w-[90px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Weather</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {dest.weather.temp}°C {dest.weather.icon}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 min-w-[100px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Crowd Level</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${
                      dest.status.crowdLevel === 'Low' ? 'bg-emerald-500' : dest.status.crowdLevel === 'Moderate' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    {dest.status.crowdLevel}
                  </span>
                </div>
              </div>

              <button
                id={`btn-status-view-details-${dest.id}`}
                onClick={() => onSelectDestination(dest)}
                className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer text-center"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
