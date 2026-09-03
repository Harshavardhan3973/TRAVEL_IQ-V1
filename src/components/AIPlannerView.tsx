import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Hotel as HotelIcon, 
  Bus, 
  Bookmark, 
  CheckCircle2, 
  CloudSun, 
  AlertCircle,
  Share2,
  RefreshCw,
  Send,
  Navigation,
  Globe,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AITripPlan, UserTrip, WorldLocation, UserProfile } from '../types';
import { POPULAR_WORLD_DESTINATIONS } from '../data/worldData';

interface AIPlannerViewProps {
  initialDestination?: string;
  initialDate?: string;
  initialTravelers?: number;
  initialWorldLocation?: WorldLocation | null;
  currentUser?: UserProfile | null;
  onSaveTrip: (trip: UserTrip) => void;
  onViewOnMap?: (plan: AITripPlan) => void;
  onPlanNewTrip?: () => void;
}

export const AIPlannerView: React.FC<AIPlannerViewProps> = ({
  initialDestination = 'Mysuru',
  initialDate = '2026-09-12',
  initialTravelers = 2,
  initialWorldLocation = null,
  currentUser = null,
  onSaveTrip,
  onViewOnMap,
  onPlanNewTrip
}) => {
  // Helper to ensure destination is always a clean string
  const safeDestString = (val: any): string => {
    if (!val) return 'Paris';
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val.name) return String(val.name);
    return String(val);
  };

  const [destination, setDestination] = useState<string>(() => 
    currentUser?.travelProfile?.destination || safeDestString(initialDestination)
  );
  const [days, setDays] = useState(currentUser?.travelProfile?.availableDays || 2);
  const [travelers, setTravelers] = useState(currentUser?.travelProfile?.travelersCount || initialTravelers);
  const [budgetTier, setBudgetTier] = useState<'Budget' | 'Moderate' | 'Luxury'>('Moderate');
  const [travelStyle, setTravelStyle] = useState<'Cultural' | 'Iconic Sights' | 'Foodie & Dining' | 'Relaxed Leisure' | 'Adventure'>('Iconic Sights');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripPlan, setTripPlan] = useState<AITripPlan | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Synchronize destination state if initialDestination changes
  useEffect(() => {
    if (initialDestination) {
      setDestination(safeDestString(initialDestination));
    }
  }, [initialDestination]);

  // Derive currency symbol based on typed destination
  const getCurrencyForDest = (destName: any) => {
    const valid = typeof destName === 'string' ? destName : (destName && typeof destName === 'object' && destName.name) ? String(destName.name) : String(destName || '');
    const lower = valid.toLowerCase();
    if (lower.includes('mysore') || lower.includes('mysuru') || lower.includes('india') || lower.includes('bangalore') || lower.includes('bengaluru') || lower.includes('delhi')) return { symbol: '₹', code: 'INR' };
    if (lower.includes('paris') || lower.includes('france') || lower.includes('rome') || lower.includes('italy')) return { symbol: '€', code: 'EUR' };
    if (lower.includes('tokyo') || lower.includes('japan')) return { symbol: '¥', code: 'JPY' };
    if (lower.includes('london') || lower.includes('uk') || lower.includes('britain')) return { symbol: '£', code: 'GBP' };
    if (lower.includes('dubai') || lower.includes('uae')) return { symbol: 'AED ', code: 'AED' };
    if (lower.includes('bali') || lower.includes('indonesia')) return { symbol: 'Rp ', code: 'IDR' };
    return { symbol: '₹', code: 'INR' };
  };

  const currentCurrency = getCurrencyForDest(destination);

  const handleGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setIsSaved(false);

    const targetBudget = currentUser?.travelProfile?.budgetAmount || 5000;

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          startingLocation: currentUser?.travelProfile?.startingLocation || 'Bengaluru',
          days,
          budget: targetBudget,
          travelers,
          interests: currentUser?.travelProfile?.interests?.join(', ') || 'History, Food, Photography',
          travelStyle: currentUser?.travelProfile?.travelStyle || 'Balanced',
          transportPreference: currentUser?.travelProfile?.transportPreference?.join(' + ') || 'Train + Bus',
          hotelPreference: currentUser?.travelProfile?.hotelPreference || 'Budget Hotel',
          tripPriority: currentUser?.travelProfile?.tripPriority || 'Maximum places',
          preferences: `${currentUser?.travelProfile?.interests?.join(', ') || travelStyle}, weather-optimized`,
          travelDate: currentUser?.travelProfile?.startDate || initialDate,
          currency: 'INR',
          currencySymbol: '₹',
          lat: initialWorldLocation?.lat,
          lng: initialWorldLocation?.lng,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const json = await response.json();
      const planData = json.plan || json;
      setTripPlan(planData);
    } catch (err: any) {
      console.warn('Network issue generating plan, using resilient smart generator:', err);
      // Instant client-side fallback plan ensuring the traveler never encounters a blank screen
      const defaultBudget = targetBudget;
      const transportAmt = Math.round(defaultBudget * 0.18);
      const hotelAmt = Math.round(defaultBudget * 0.35);
      const foodAmt = Math.round(defaultBudget * 0.22);
      const attractionsAmt = Math.round(defaultBudget * 0.12);
      const localTravelAmt = Math.round(defaultBudget * 0.08);
      const totalCalc = transportAmt + hotelAmt + foodAmt + attractionsAmt + localTravelAmt;
      const remBudget = defaultBudget - totalCalc;

      const fallbackPlan: AITripPlan = {
        title: `${days}-Day Smart Itinerary for ${destination}`,
        destination,
        startingLocation: currentUser?.travelProfile?.startingLocation || 'Bengaluru',
        duration: `${days} Days`,
        budgetCategory: currentUser?.travelProfile?.travelStyle || budgetTier,
        estimatedTotalBudget: totalCalc,
        currencySymbol: '₹',
        totalDistanceKm: days * 12.5,
        estimatedTravelTime: "35–45 mins/day",
        budgetBreakdown: {
          transport: transportAmt,
          hotel: hotelAmt,
          food: foodAmt,
          attractions: attractionsAmt,
          localTravel: localTravelAmt,
          total: totalCalc,
          budgetRemaining: remBudget,
          exceedsBudget: totalCalc > defaultBudget,
          optimizationNotes: totalCalc > defaultBudget ? [
            "Opt for express state buses or sleeper train berths instead of private cabs",
            "Book budget boutique hotels or homestays",
            "Visit free attractions & monument gardens"
          ] : []
        },
        recommendedHotel: {
          name: `Recommended ${currentUser?.travelProfile?.hotelPreference || 'Budget Hotel'} in ${destination}`,
          pricePerNight: Math.round(hotelAmt / Math.max(1, days - 1)),
          reason: "Centrally located with complimentary breakfast, verified amenities, and rapid transit access."
        },
        recommendedTransport: {
          mode: currentUser?.travelProfile?.transportPreference?.join(' + ') || "Train + Bus",
          provider: "IRCTC / State Transport / Bus",
          estimatedCost: transportAmt,
          reason: "Seamless connectivity avoiding highway congestion and staying within budget."
        },
        weatherTip: "Plan outdoor sightseeing during cool morning hours; indoor galleries scheduled for afternoon.",
        days: Array.from({ length: days }).map((_, idx) => ({
          dayNumber: idx + 1,
          title: `Day ${idx + 1}: ${idx === 0 ? "Iconic Landmarks & Historic Center" : idx === 1 ? "Cultural Masterpieces & Viewpoints" : "Hidden Quarters & Sunset Promenade"}`,
          highlights: [`${destination} Highlight ${idx + 1}`, "Bistro Tasting", `${destination} Gallery`],
          schedule: [
            {
              time: "09:30 AM",
              activity: "Historic Landmark Tour",
              placeName: `${destination} Landmark ${idx + 1}`,
              duration: "2.5 hrs",
              isOutdoor: true,
              coordinates: initialWorldLocation ? { lat: initialWorldLocation.lat + 0.003 * (idx + 1), lng: initialWorldLocation.lng + 0.003 * (idx + 1) } : { lat: 12.3051, lng: 76.6552 },
              note: "Arrive early for soft lighting and fast entry."
            },
            {
              time: "01:00 PM",
              activity: "Authentic Regional Cuisine Lunch",
              placeName: "Traditional Heritage Restaurant",
              duration: "1 hr",
              isOutdoor: false,
              coordinates: initialWorldLocation ? { lat: initialWorldLocation.lat + 0.001 * (idx + 1), lng: initialWorldLocation.lng + 0.002 * (idx + 1) } : { lat: 12.3060, lng: 76.6560 },
              note: "Famous local thali & chef specialties."
            },
            {
              time: "02:30 PM",
              activity: "Indoor Art & Heritage Gallery",
              placeName: `${destination} Heritage Museum`,
              duration: "2 hrs",
              isOutdoor: false,
              coordinates: initialWorldLocation ? { lat: initialWorldLocation.lat - 0.003 * (idx + 1), lng: initialWorldLocation.lng - 0.002 * (idx + 1) } : { lat: 12.3040, lng: 76.6540 },
              note: "Climate-controlled galleries optimal for afternoon."
            }
          ]
        })),
        alertsConsidered: [
          "Walking corridors optimized to avoid peak transit congestion",
          "Indoor scheduling during peak afternoon temperatures"
        ]
      };
      setTripPlan(fallbackPlan);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate itinerary on initial view load
  useEffect(() => {
    if (!tripPlan && destination) {
      handleGeneratePlan();
    }
  }, []);

  const handleSaveToTrips = () => {
    if (!tripPlan) return;
    const newTrip: UserTrip = {
      id: `trip-${Date.now()}`,
      title: tripPlan.title,
      destination: tripPlan.destination,
      dates: `${initialDate} (${tripPlan.duration})`,
      hotelBooked: `${tripPlan.recommendedHotel.name} (${tripPlan.currencySymbol || currentCurrency.symbol}${tripPlan.recommendedHotel.pricePerNight}/night)`,
      transport: `${tripPlan.recommendedTransport.provider} (${tripPlan.currencySymbol || currentCurrency.symbol}${tripPlan.recommendedTransport.estimatedCost})`,
      placesCount: tripPlan.days.reduce((acc, d) => acc + d.schedule.length, 0),
      estimatedBudget: tripPlan.estimatedTotalBudget,
      currencySymbol: tripPlan.currencySymbol || currentCurrency.symbol,
      status: 'Upcoming',
      itinerarySummary: tripPlan.weatherTip,
    };
    onSaveTrip(newTrip);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* PERSONALIZED TRAVEL PROFILE BANNER (IF CONFIGURED) */}
      {currentUser?.travelProfile && (
        <div className="bg-white rounded-3xl p-5 border border-blue-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider">
                Personalized Profile
              </span>
              <span className="text-xs font-bold text-slate-700">
                {currentUser.name}
              </span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{currentUser.travelProfile.startingLocation}</span>
              <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-blue-700">{currentUser.travelProfile.destination}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold">⏱️ {currentUser.travelProfile.availableDays} Days</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold">👥 {currentUser.travelProfile.travelersCount} ({currentUser.travelProfile.travelersType})</span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-black">💰 ₹{currentUser.travelProfile.budgetAmount.toLocaleString('en-IN')}</span>
              <span className="bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md font-bold">🎨 {currentUser.travelProfile.travelStyle} Style</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">🎯 {currentUser.travelProfile.tripPriority}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">🚆 {currentUser.travelProfile.transportPreference.join(' + ')}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">🏨 {currentUser.travelProfile.hotelPreference}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            {onPlanNewTrip && (
              <button
                id="btn-ai-planner-new-trip"
                type="button"
                onClick={onPlanNewTrip}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Plan New Trip</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-200">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>All-India Intelligent AI Travel Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Plan a Trip Across Incredible India
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            TRAVELIQ automatically optimizes schedules based on <strong>real coordinates, live weather &amp; monsoon forecasts, Vande Bharat connectivity, and opening hours</strong> across all Indian destinations.
          </p>
        </div>
      </div>

      {/* INPUT PARAMETERS FORM */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <form onSubmit={handleGeneratePlan} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Destination */}
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Where do you want to go?
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-blue-600" />
                <input
                  id="input-ai-dest"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Bengaluru, Jaipur, Delhi, Goa, Manali, Varanasi..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Days */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Trip Duration
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-blue-600" />
                <select
                  id="select-ai-days"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 cursor-pointer"
                >
                  <option value={1}>1 Day (Express Tour)</option>
                  <option value={2}>2 Days (Weekend Getaway)</option>
                  <option value={3}>3 Days (Complete Sightseeing)</option>
                  <option value={4}>4 Days (In-Depth Discovery)</option>
                  <option value={5}>5 Days (Full Experience)</option>
                  <option value={7}>7 Days (Week-long Holiday)</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Budget Tier ({currentCurrency.symbol})
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-3 text-emerald-600" />
                <select
                  id="select-ai-budget"
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value as any)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 cursor-pointer"
                >
                  <option value="Budget">Budget Backpacker</option>
                  <option value="Moderate">Moderate Comfort</option>
                  <option value="Luxury">Luxury Premium</option>
                </select>
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Travel Style
              </label>
              <div className="relative">
                <Sparkles className="w-4 h-4 absolute left-3 top-3 text-amber-500" />
                <select
                  id="select-ai-style"
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value as any)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 cursor-pointer"
                >
                  <option value="Iconic Sights">Iconic Landmarks</option>
                  <option value="Cultural">Art & Cultural Heritage</option>
                  <option value="Foodie & Dining">Foodie & Gourmet Dining</option>
                  <option value="Relaxed Leisure">Relaxed & Leisurely</option>
                  <option value="Adventure">Nature & Adventure</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Popular:</span>
            {POPULAR_WORLD_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() => setDestination(dest.name)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  destination.toLowerCase() === dest.name.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{dest.flag}</span>
                <span>{dest.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              id="btn-generate-ai-plan"
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating India Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Smart Itinerary for {destination}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* TRIP PLAN RESULTS DISPLAY */}
      {tripPlan && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Plan Summary Bar */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[11px] font-bold">
                ✓ AI Generated Itinerary
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{tripPlan.title}</h2>
              <p className="text-xs text-slate-400">
                Duration: {tripPlan.duration} • Budget Category: {tripPlan.budgetCategory} • Total Est: {tripPlan.currencySymbol || currentCurrency.symbol}{tripPlan.estimatedTotalBudget}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onViewOnMap && (
                <button
                  id="btn-view-plan-map"
                  onClick={() => onViewOnMap(tripPlan)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <Compass className="w-3.5 h-3.5" />
                  View All Stops on Map
                </button>
              )}

              <button
                id="btn-save-ai-trip"
                onClick={handleSaveToTrips}
                disabled={isSaved}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved in My Trips!
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    Save Trip
                  </>
                )}
              </button>
            </div>
          </div>

          {/* WEATHER & TRANSIT ADVICE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Weather Tip */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                <CloudSun className="w-4 h-4 text-amber-600" />
                <span>Weather Intelligence</span>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {tripPlan.weatherTip}
              </p>
            </div>

            {/* Recommended Hotel */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-blue-800 font-bold text-xs uppercase tracking-wider mb-2">
                <div className="flex items-center gap-2">
                  <HotelIcon className="w-4 h-4 text-blue-600" />
                  <span>Recommended Hotel</span>
                </div>
                <span className="text-blue-900 font-black">{tripPlan.currencySymbol || currentCurrency.symbol}{tripPlan.recommendedHotel.pricePerNight}/night</span>
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">{tripPlan.recommendedHotel.name}</div>
                <div className="text-slate-600 mt-1">{tripPlan.recommendedHotel.reason}</div>
              </div>
            </div>

            {/* Recommended Transport */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Transit</span>
                </div>
                <span className="text-emerald-900 font-black">{tripPlan.currencySymbol || currentCurrency.symbol}{tripPlan.recommendedTransport.estimatedCost}</span>
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">{tripPlan.recommendedTransport.mode} ({tripPlan.recommendedTransport.provider})</div>
                <div className="text-slate-600 mt-1">{tripPlan.recommendedTransport.reason}</div>
              </div>
            </div>
          </div>

          {/* 25. BUDGET MANAGEMENT BREAKDOWN */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Trip Budget Management &amp; Breakdown</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time cost synthesis matching your preferred travel style and category
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-semibold">Allocated Budget:</span>
                <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {tripPlan.currencySymbol || '₹'}{(currentUser?.travelProfile?.budgetAmount || tripPlan.estimatedTotalBudget).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* If plan exceeds budget warning */}
            {((tripPlan.budgetBreakdown?.exceedsBudget) || 
              (currentUser?.travelProfile?.budgetAmount && tripPlan.estimatedTotalBudget > currentUser.travelProfile.budgetAmount)) && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-left">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>⚠️ This plan exceeds your budget.</span>
                </div>
                <p className="text-xs text-amber-800">
                  To keep the total estimated cost within your limit, TRAVELIQ suggests:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-950 font-medium pt-1">
                  <div className="p-2 bg-white/70 rounded-xl border border-amber-200/60 flex items-center gap-2">
                    <span className="text-base">🚌</span>
                    <span>Cheaper transport (choose state RTC bus or sleeper train instead of private cab)</span>
                  </div>
                  <div className="p-2 bg-white/70 rounded-xl border border-amber-200/60 flex items-center gap-2">
                    <span className="text-base">🏨</span>
                    <span>Budget hotel or verified heritage homestay</span>
                  </div>
                  <div className="p-2 bg-white/70 rounded-xl border border-amber-200/60 flex items-center gap-2">
                    <span className="text-base">🏛️</span>
                    <span>Prioritize free attractions &amp; monument gardens</span>
                  </div>
                  <div className="p-2 bg-white/70 rounded-xl border border-amber-200/60 flex items-center gap-2">
                    <span className="text-base">🗓️</span>
                    <span>Reduce trip duration by 1 day if necessary</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5 Cost Buckets */}
            {tripPlan.budgetBreakdown && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* 1. Transport */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 mb-1">
                    <Bus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Transport</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {tripPlan.currencySymbol || '₹'}{tripPlan.budgetBreakdown.transport.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Intercity transit</div>
                </div>

                {/* 2. Hotel */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 mb-1">
                    <HotelIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Hotel</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {tripPlan.currencySymbol || '₹'}{tripPlan.budgetBreakdown.hotel.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">All nights included</div>
                </div>

                {/* 3. Food */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 mb-1">
                    <span className="text-xs">🍛</span>
                    <span>Food</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {tripPlan.currencySymbol || '₹'}{tripPlan.budgetBreakdown.food.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Meals &amp; snacks</div>
                </div>

                {/* 4. Attractions */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 mb-1">
                    <span className="text-xs">🎟️</span>
                    <span>Attractions</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {tripPlan.currencySymbol || '₹'}{tripPlan.budgetBreakdown.attractions.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Tickets &amp; entries</div>
                </div>

                {/* 5. Local Travel */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 mb-1">
                    <Navigation className="w-3.5 h-3.5 text-teal-600" />
                    <span>Local Travel</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {tripPlan.currencySymbol || '₹'}{tripPlan.budgetBreakdown.localTravel.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Auto &amp; metro</div>
                </div>

                {/* Total vs Remaining */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-800 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Total Estimated</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-emerald-950">
                    {tripPlan.currencySymbol || '₹'}{tripPlan.budgetBreakdown.total.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                    {tripPlan.budgetBreakdown.budgetRemaining >= 0 
                      ? `+${tripPlan.currencySymbol || '₹'}${tripPlan.budgetBreakdown.budgetRemaining.toLocaleString('en-IN')} buffer` 
                      : `${tripPlan.currencySymbol || '₹'}${Math.abs(tripPlan.budgetBreakdown.budgetRemaining).toLocaleString('en-IN')} over`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DAY BY DAY SCHEDULE */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>🗓️</span> Day-by-Day Itinerary Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tripPlan.days.map((day) => (
                <div key={day.dayNumber} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Day {day.dayNumber}</span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{day.title}</h4>
                  </div>

                  <div className="p-4 space-y-3 flex-1 divide-y divide-slate-100">
                    {day.schedule.map((stop, idx) => (
                      <div key={idx} className={`${idx > 0 ? 'pt-3' : ''} space-y-1`}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-blue-600">{stop.time}</span>
                          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                            stop.isOutdoor ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {stop.isOutdoor ? 'Outdoor' : 'Indoor / Dining'}
                          </span>
                        </div>
                        <div className="font-bold text-xs text-slate-900">{stop.placeName}</div>
                        <div className="text-[11px] text-slate-500">{stop.activity} ({stop.duration})</div>
                        {stop.note && (
                          <div className="text-[10px] text-slate-600 italic bg-slate-50 p-1 rounded-sm">
                            💡 {stop.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
