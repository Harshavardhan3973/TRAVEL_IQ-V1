import React from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Clock, 
  IndianRupee, 
  CloudSun, 
  Users, 
  Sparkles, 
  Navigation, 
  CheckCircle2, 
  Share2, 
  Bookmark,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { Destination } from '../types';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  onPlanTripToDestination: (destName: string) => void;
  onToggleSave: (destId: string) => void;
  isSaved: boolean;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onPlanTripToDestination,
  onToggleSave,
  isSaved,
}) => {
  if (!destination) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${destination.name} on TRAVELIQ`,
        text: `Check out ${destination.name} in ${destination.city} with live status: ${destination.status.label}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header Image with Floating Badges */}
        <div className="relative h-64 sm:h-72 shrink-0 overflow-hidden">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close & Action buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              id="btn-dest-share"
              onClick={handleShare}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
              title="Share destination"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="btn-dest-save"
              onClick={() => onToggleSave(destination.id)}
              className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                isSaved ? 'bg-amber-500 text-white' : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save destination'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              id="btn-dest-close"
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 ${
              destination.status.state === 'open'
                ? 'bg-emerald-600 text-white'
                : destination.status.state === 'closed'
                ? 'bg-red-600 text-white'
                : 'bg-amber-500 text-white'
            }`}>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {destination.status.label}
            </span>
          </div>

          {/* Bottom Title bar */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-1">
              <span>{destination.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-300" />
                {destination.city}, {destination.state} ({destination.distanceKm} km from city center)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {destination.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-1 mt-0.5">
              {destination.tagline}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Live Status Warning / Info Bar */}
          {destination.status.notice && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Live Status Notice:</strong> {destination.status.notice}
              </div>
            </div>
          )}

          {/* Real-time Telemetry Grid: Hours, Entry Fee, Weather, Crowd */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Opening Hours
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
                {destination.status.openingHours}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                Entry Fee
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">
                {destination.status.entryFee === 0 ? 'Free Entry' : `₹${destination.status.entryFee} / Person`}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                Live Weather
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">
                {destination.weather.temp}°C • {destination.weather.condition}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                Crowd Level
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  destination.status.crowdLevel === 'Low' ? 'bg-emerald-500' : destination.status.crowdLevel === 'Moderate' ? 'bg-blue-500' : 'bg-red-500'
                }`} />
                {destination.status.crowdLevel}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
              Overview & Significance
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Key Highlights */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Key Highlights & Experience
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {destination.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optimal Visiting Window */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                TRAVELIQ AI Recommendation
              </span>
              <p className="text-xs text-blue-900 mt-1">
                <strong>Best Time to Visit:</strong> {destination.bestTimeToVisit}
              </p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Suggested duration: {destination.suggestedDuration} • {destination.isIndoor ? 'Indoor shelter suitable during rain' : 'Outdoor monument'}
              </p>
            </div>
            <button
              id="btn-plan-trip-for-this-place"
              onClick={() => {
                onClose();
                onPlanTripToDestination(destination.city);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan Trip Here</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Last verified: <span className="font-semibold text-slate-700">{destination.status.lastChecked}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-modal-cancel"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Close
            </button>
            <button
              id="btn-modal-plan"
              onClick={() => {
                onClose();
                onPlanTripToDestination(destination.city);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Include in My Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
