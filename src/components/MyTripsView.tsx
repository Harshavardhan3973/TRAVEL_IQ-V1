import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Bookmark, 
  Hotel as HotelIcon, 
  Bus, 
  Sparkles, 
  Clock, 
  Trash2, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Settings
} from 'lucide-react';
import { UserProfile, UserTrip, Destination, Hotel } from '../types';

interface MyTripsViewProps {
  user: UserProfile | null;
  savedDestinations: Destination[];
  bookedHotels: Hotel[];
  onOpenAuth: () => void;
  onNavigate: (view: any) => void;
  onRemoveSavedPlace: (id: string) => void;
  onCancelTrip: (id: string) => void;
  onEditPreferences?: () => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  user,
  savedDestinations,
  bookedHotels,
  onOpenAuth,
  onNavigate,
  onRemoveSavedPlace,
  onCancelTrip,
  onEditPreferences,
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'saved' | 'hotels' | 'preferences'>('trips');

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
          🧳
        </div>
        <h2 className="text-xl font-black text-slate-900">
          Sign In to Access Your Unified Trips
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Save itineraries, monitor real-time changes to your booked attractions, and keep hotel vouchers handy.
        </p>
        <button
          id="btn-login-mytrips-gate"
          onClick={onOpenAuth}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
        >
          Log In or Create Account
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                  Verified Traveler
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {user.phone}
                  </span>
                )}
                <span className="bg-slate-100 px-2 py-0.2 rounded font-semibold text-slate-700">
                  Style: {user.budgetPreference}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-print-itinerary"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Print Summary</span>
            </button>
            <button
              id="btn-new-plan-from-profile"
              onClick={() => onNavigate('ai-planner')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>New AI Plan</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 mt-6 pt-2">
          <button
            id="tab-profile-trips"
            onClick={() => setActiveTab('trips')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'trips'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Trips ({user.trips.length})
          </button>
          <button
            id="tab-profile-saved"
            onClick={() => setActiveTab('saved')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Attractions ({savedDestinations.length})
          </button>
          <button
            id="tab-profile-hotels"
            onClick={() => setActiveTab('hotels')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'hotels'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Hotel Bookings ({bookedHotels.length})
          </button>
          <button
            id="tab-profile-preferences"
            onClick={() => setActiveTab('preferences')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Travel Preferences
          </button>
        </div>
      </div>

      {/* Tab: My Trips */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          {user.trips.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <p className="text-3xl mb-2">🗺️</p>
              <h3 className="text-sm font-bold text-slate-900">No active trips planned yet</h3>
              <p className="text-xs text-slate-500 mt-1">Use our AI Planner to generate an itinerary adapted to live weather & opening hours.</p>
              <button
                onClick={() => onNavigate('ai-planner')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Plan a Trip Now
              </button>
            </div>
          ) : (
            user.trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {trip.status}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        🗓️ {trip.dates}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {trip.title} ({trip.destination})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      Est. Budget: <strong className="text-slate-900 font-black">₹{trip.estimatedBudget.toLocaleString()}</strong>
                    </span>
                    <button
                      onClick={() => onCancelTrip(trip.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Cancel/Remove trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Accommodations</span>
                    <strong className="text-slate-900 block mt-0.5">{trip.hotelBooked || 'Not Selected'}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Transport</span>
                    <strong className="text-slate-900 block mt-0.5">{trip.transport || 'Express Bus'}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Places Monitored</span>
                    <strong className="text-slate-900 block mt-0.5">{trip.placesCount} Attractions</strong>
                  </div>
                </div>

                {trip.itinerarySummary && (
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900">
                    <strong>Live Itinerary Note:</strong> {trip.itinerarySummary}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Saved Attractions */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedDestinations.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-slate-200">
              <p className="text-3xl mb-2">📌</p>
              <h3 className="text-sm font-bold text-slate-900">No saved places yet</h3>
              <p className="text-xs text-slate-500 mt-1">Browse the Explore Destinations view and tap the bookmark icon.</p>
              <button
                onClick={() => onNavigate('explore')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Browse Attractions
              </button>
            </div>
          ) : (
            savedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => onRemoveSavedPlace(dest.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{dest.name}</h4>
                  <p className="text-xs text-slate-500">📍 {dest.city} • ⭐ {dest.rating}</p>
                  <p className="text-[11px] text-emerald-700 font-bold">{dest.status.label}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Hotel Bookings */}
      {activeTab === 'hotels' && (
        <div className="space-y-4">
          {bookedHotels.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <p className="text-3xl mb-2">🏨</p>
              <h3 className="text-sm font-bold text-slate-900">No confirmed hotel stays yet</h3>
              <p className="text-xs text-slate-500 mt-1">Discover verified hotels near Mysore Palace with free cancellation.</p>
              <button
                onClick={() => onNavigate('hotels')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Find Hotels
              </button>
            </div>
          ) : (
            bookedHotels.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src={h.image} alt={h.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Confirmed Voucher
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">{h.name}</h4>
                    <p className="text-xs text-slate-500">{h.roomType} • {h.location}</p>
                    <p className="text-xs text-blue-700 font-bold mt-0.5">₹{h.pricePerNight} / night</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-emerald-600 font-bold block">Free Cancellation Active</span>
                  <button
                    onClick={() => alert(`Showing voucher for ${h.name} (Ref: TIQ-HTL-${h.id})`)}
                    className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    View Voucher
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Travel Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Personalized Travel Profile &amp; Preferences
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active travel settings used to customize your recommendations, smart itineraries, and budgets.
              </p>
            </div>
            {onEditPreferences && (
              <button
                id="btn-edit-travel-profile-preferences"
                onClick={onEditPreferences}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Edit Preferences</span>
              </button>
            )}
          </div>

          {user.travelProfile ? (
            <div className="space-y-6">
              {/* Route & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Route Journey</span>
                  <div className="text-base font-black text-slate-900 mt-1 flex items-center gap-2">
                    <span>{user.travelProfile.startingLocation}</span>
                    <span className="text-blue-600">→</span>
                    <span className="text-blue-700">{user.travelProfile.destination}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-1">
                    Dates: {user.travelProfile.startDate} to {user.travelProfile.endDate} ({user.travelProfile.availableDays} Days)
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Allocated Budget</span>
                  <div className="text-base font-black text-emerald-950 mt-1">
                    ₹{user.travelProfile.budgetAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-emerald-800 font-medium mt-1">
                    Travelers: {user.travelProfile.travelersCount} ({user.travelProfile.travelersType})
                  </div>
                </div>
              </div>

              {/* Preferences Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Travel Style</span>
                  <div className="text-xs font-black text-slate-900 mt-0.5">{user.travelProfile.travelStyle}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Trip Priority</span>
                  <div className="text-xs font-black text-slate-900 mt-0.5">{user.travelProfile.tripPriority}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Stay Preference</span>
                  <div className="text-xs font-black text-slate-900 mt-0.5">{user.travelProfile.hotelPreference}</div>
                </div>
                <div className="col-span-2 sm:col-span-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Transport Mode</span>
                  <div className="text-xs font-black text-slate-900 mt-0.5">
                    {user.travelProfile.transportPreference.join(' + ')}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Interested Themes &amp; Experiences
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.travelProfile.interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                      ✓ {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Interested Experiences
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.travelPreferences.map((pref, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                      ✓ {pref}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Budget Philosophy
                </label>
                <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg">
                  {user.budgetPreference} Tier
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
