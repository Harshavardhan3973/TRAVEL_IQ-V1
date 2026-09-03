import React, { useState } from 'react';
import { 
  AppView, 
  Destination, 
  Hotel, 
  TransportOption, 
  VehicleRental, 
  UserProfile, 
  UserTrip,
  WorldLocation,
  AITripPlan
} from './types';

import { DESTINATIONS_DATA } from './data/destinations';
import { HOTELS_DATA } from './data/hotels';
import { TRANSPORTS_DATA } from './data/transports';
import { WEATHER_DATA } from './data/weather';
import { REAL_TIME_ALERTS } from './data/alerts';
import { POPULAR_WORLD_DESTINATIONS } from './data/worldData';

import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { ExploreDestinations } from './components/ExploreDestinations';
import { DestinationDashboard } from './components/DestinationDashboard';
import { PlaceStatusView } from './components/PlaceStatusView';
import { WeatherView } from './components/WeatherView';
import { HotelsView } from './components/HotelsView';
import { TransportView } from './components/TransportView';
import { RoutesMapView } from './components/RoutesMapView';
import { ExploreMapView } from './components/ExploreMapView';
import { AIPlannerView } from './components/AIPlannerView';
import { RealTimeAlertsView } from './components/RealTimeAlertsView';
import { MyTripsView } from './components/MyTripsView';
import { DestinationModal } from './components/DestinationModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS_DATA);
  const [hotels, setHotels] = useState<Hotel[]>(HOTELS_DATA);
  const [transports] = useState<TransportOption[]>(TRANSPORTS_DATA);
  const [alerts, setAlerts] = useState(REAL_TIME_ALERTS);
  const [weather] = useState(WEATHER_DATA['Mysore']);
  const [activeTripPlan, setActiveTripPlan] = useState<AITripPlan | null>(null);

  // All-India destination state
  const [selectedWorldLocation, setSelectedWorldLocation] = useState<WorldLocation>(POPULAR_WORLD_DESTINATIONS[0]); // Bengaluru, Karnataka

  // Selected destination modal (legacy/places)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Auth modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr-demo-1',
    name: 'Arjun Sharma',
    email: 'arjun.traveler@traveliq.in',
    phone: '+91 98450 12345',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    travelPreferences: ['Heritage & History', 'Local Cuisine', 'Nature & Wildlife'],
    budgetPreference: 'Comfort',
    savedPlaceIds: ['mysore-palace', 'chamundi-hill'],
    bookedHotelIds: ['hotel-grand-mercure'],
    notificationsEnabled: true,
    trips: [
      {
        id: 'trip-mysore-1',
        title: 'Mysore Heritage & Palace Weekend',
        destination: 'Mysore',
        dates: '12–14 September (2 Days)',
        hotelBooked: 'Grand Mercure Mysore (Deluxe King)',
        transport: 'KSRTC Airavat AC Express Bus',
        placesCount: 5,
        estimatedBudget: 4850,
        status: 'Upcoming',
        itinerarySummary: 'Palace tour at 09:00 AM, indoor Jaganmohan Art Gallery in afternoon during expected rainfall.'
      }
    ]
  });

  // Trip planner initial params
  const [plannerParams, setPlannerParams] = useState<{ destination: string; date: string; travelers: number }>({
    destination: 'Mysore',
    date: '2026-09-12',
    travelers: 2,
  });

  // Live status refresh animation simulation
  const [isStatusRefreshing, setIsStatusRefreshing] = useState(false);

  const handleRefreshLiveStatus = () => {
    setIsStatusRefreshing(true);
    setTimeout(() => {
      // Toggle a simulated status update
      setDestinations((prev) =>
        prev.map((d) => {
          if (d.id === 'mysore-palace') {
            return {
              ...d,
              status: {
                ...d.status,
                lastChecked: 'Just now (live radar sync)',
                crowdLevel: 'Moderate'
              }
            };
          }
          return d;
        })
      );
      setIsStatusRefreshing(false);
    }, 900);
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleToggleSavePlace = (destId: string) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }

    setCurrentUser((prev) => {
      if (!prev) return null;
      const isAlreadySaved = prev.savedPlaceIds.includes(destId);
      const newSaved = isAlreadySaved
        ? prev.savedPlaceIds.filter((id) => id !== destId)
        : [...prev.savedPlaceIds, destId];
      return {
        ...prev,
        savedPlaceIds: newSaved,
      };
    });
  };

  const handleSaveTrip = (newTrip: UserTrip) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        trips: [newTrip, ...prev.trips],
      };
    });
    setCurrentView('my-trips');
  };

  const handleCancelTrip = (tripId: string) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        trips: prev.trips.filter((t) => t.id !== tripId),
      };
    });
  };

  const handleBookHotelSuccess = (hotel: Hotel, details: { checkIn: string; checkOut: string; guests: number }) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    // Add to booked hotels
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updatedHotelIds = Array.from(new Set([...prev.bookedHotelIds, hotel.id]));
      const newTripItem: UserTrip = {
        id: `trip-hotel-${Date.now()}`,
        title: `Stay at ${hotel.name}`,
        destination: hotel.city,
        dates: `${details.checkIn} to ${details.checkOut}`,
        hotelBooked: `${hotel.name} (${hotel.roomType})`,
        transport: 'Self-arranged',
        placesCount: 2,
        estimatedBudget: hotel.pricePerNight * 2,
        status: 'Upcoming',
        itinerarySummary: `Confirmed reservation for ${details.guests} guests. Voucher active.`
      };
      return {
        ...prev,
        bookedHotelIds: updatedHotelIds,
        trips: [newTripItem, ...prev.trips]
      };
    });
  };

  const handleBookTransportSuccess = (transport: TransportOption) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    const newTripItem: UserTrip = {
      id: `trip-trans-${Date.now()}`,
      title: `${transport.type} Travel to ${transport.destination}`,
      destination: transport.destination,
      dates: 'Upcoming',
      hotelBooked: 'Pending',
      transport: `${transport.providerName} (${transport.departureTime} - ${transport.arrivalTime})`,
      placesCount: 3,
      estimatedBudget: transport.price,
      status: 'Upcoming',
      itinerarySummary: `Verified transport corridor ticket. Departs from ${transport.origin}.`
    };
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        trips: [newTripItem, ...prev.trips]
      };
    });
  };

  const handleRentVehicleSuccess = (vehicle: VehicleRental) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    const newTripItem: UserTrip = {
      id: `trip-veh-${Date.now()}`,
      title: `${vehicle.name} Rental`,
      destination: 'Mysore',
      dates: 'Upcoming Self-Drive',
      hotelBooked: 'Self-booked',
      transport: `${vehicle.name} (${vehicle.type}, ${vehicle.fuelType})`,
      placesCount: 4,
      estimatedBudget: 2400,
      status: 'Upcoming',
      itinerarySummary: `Vehicle reserved at ${vehicle.pickupLocation}. Contact host upon arrival.`
    };
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        trips: [newTripItem, ...prev.trips]
      };
    });
  };

  const handleStartPlanTrip = (params: { destination: string; date: string; travelers: number }) => {
    setPlannerParams(params);
    setCurrentView('ai-planner');
  };

  // Derive saved destination objects
  const savedDestinationObjects = destinations.filter((d) =>
    currentUser?.savedPlaceIds.includes(d.id)
  );

  // Derive booked hotel objects
  const bookedHotelObjects = hotels.filter((h) =>
    currentUser?.bookedHotelIds.includes(h.id)
  );

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col antialiased">
      {/* GLOBAL NAVBAR */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        alerts={alerts}
        currentUser={currentUser}
        onOpenLogin={() => handleOpenAuth('login')}
        onOpenSignup={() => handleOpenAuth('signup')}
        onLogout={handleLogout}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'home' && (
          <HomeDashboard
            destinations={destinations}
            hotels={hotels}
            transports={transports}
            alerts={alerts}
            weather={weather}
            onNavigate={setCurrentView}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onSelectWorldDestination={(loc) => {
              setSelectedWorldLocation(loc);
              setCurrentView('routes-map');
            }}
            onStartPlanTrip={handleStartPlanTrip}
            onRefreshLiveStatus={handleRefreshLiveStatus}
            isStatusRefreshing={isStatusRefreshing}
          />
        )}

        {currentView === 'explore' && (
          <DestinationDashboard
            destination={selectedWorldLocation}
            onViewOnMap={(loc) => {
              setSelectedWorldLocation(loc);
              setCurrentView('routes-map');
            }}
            onOpenMap={(loc) => {
              setSelectedWorldLocation(loc);
              setCurrentView('routes-map');
            }}
            onPlanTrip={(cityName, loc) => {
              const nameStr = typeof cityName === 'string' ? cityName : (cityName as any)?.name || 'Bengaluru';
              setPlannerParams({ destination: nameStr, date: '2026-09-12', travelers: 2 });
              if (loc) setSelectedWorldLocation(loc);
              setCurrentView('ai-planner');
            }}
            onSelectPOI={(poi) => {
              setSelectedWorldLocation({
                name: poi.name,
                displayName: poi.name,
                country: selectedWorldLocation.country,
                flag: selectedWorldLocation.flag,
                lat: poi.lat,
                lng: poi.lng,
                currency: selectedWorldLocation.currency,
                currencySymbol: selectedWorldLocation.currencySymbol,
                popularPOIs: [poi.name],
                timezone: selectedWorldLocation.timezone
              });
              setCurrentView('routes-map');
            }}
            onBookStay={(hotelName, price) => {
              handleBookHotelSuccess(hotelName, {
                checkIn: '2026-09-15',
                checkOut: '2026-09-17',
                guests: 2,
              });
            }}
            onBookHotel={(hotelName, price) => {
              handleBookHotelSuccess(hotelName, {
                checkIn: '2026-09-15',
                checkOut: '2026-09-17',
                guests: 2,
              });
            }}
            onBackToWorld={() => setCurrentView('world-hub')}
          />
        )}

        {currentView === 'places' && (
          <PlaceStatusView
            destinations={destinations}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onRefreshLiveStatus={handleRefreshLiveStatus}
            isStatusRefreshing={isStatusRefreshing}
          />
        )}

        {currentView === 'weather' && (
          <WeatherView
            currentCityWeather={weather}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'hotels' && (
          <HotelsView
            hotels={hotels}
            onBookHotelSuccess={handleBookHotelSuccess}
          />
        )}

        {currentView === 'transport' && (
          <TransportView
            transports={transports}
            onBookTransportSuccess={handleBookTransportSuccess}
            onRentVehicleSuccess={handleRentVehicleSuccess}
          />
        )}

        {currentView === 'routes-map' && (
          <ExploreMapView
            destinations={destinations}
            hotels={hotels}
            activeTripPlan={activeTripPlan}
            initialLocation={selectedWorldLocation}
            onSelectDestination={(loc) => setSelectedWorldLocation(loc)}
            onSelectHotel={() => setCurrentView('hotels')}
            onOpenBookingModal={(hotelName, price) =>
              handleBookHotelSuccess(hotelName, {
                checkIn: '2026-09-15',
                checkOut: '2026-09-17',
                guests: 2,
              })
            }
            onExploreDestination={(loc) => {
              setSelectedWorldLocation(loc);
              setCurrentView('explore');
            }}
            onStartAIPlan={(city, loc) => {
              setPlannerParams({ destination: city, date: '2026-09-12', travelers: 2 });
              if (loc) setSelectedWorldLocation(loc);
              setCurrentView('ai-planner');
            }}
          />
        )}

        {currentView === 'ai-planner' && (
          <AIPlannerView
            initialDestination={plannerParams.destination}
            initialDate={plannerParams.date}
            initialTravelers={plannerParams.travelers}
            initialWorldLocation={selectedWorldLocation}
            onSaveTrip={handleSaveTrip}
            onViewOnMap={(plan) => {
              setActiveTripPlan(plan);
              setCurrentView('routes-map');
            }}
          />
        )}

        {currentView === 'alerts' && (
          <RealTimeAlertsView
            alerts={alerts}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'my-trips' && (
          <MyTripsView
            user={currentUser}
            savedDestinations={savedDestinationObjects}
            bookedHotels={bookedHotelObjects}
            onOpenAuth={() => handleOpenAuth('login')}
            onNavigate={setCurrentView}
            onRemoveSavedPlace={handleToggleSavePlace}
            onCancelTrip={handleCancelTrip}
          />
        )}
      </main>

      {/* DESTINATION DETAIL MODAL */}
      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onPlanTripToDestination={(destName) => {
          setPlannerParams({ destination: destName, date: '2026-09-12', travelers: 2 });
          setCurrentView('ai-planner');
        }}
        onToggleSave={handleToggleSavePlace}
        isSaved={currentUser ? currentUser.savedPlaceIds.includes(selectedDestination?.id || '') : false}
      />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  TQ
                </div>
                <span className="font-extrabold text-base tracking-tight text-white">TRAVELIQ</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Student Innovation
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 max-w-md">
                One App. Every Journey. Consolidating hotels, tourist places, live weather, intercity transport, routes & AI itineraries.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <button onClick={() => setCurrentView('home')} className="hover:text-white cursor-pointer">Home</button>
              <button onClick={() => setCurrentView('explore')} className="hover:text-white cursor-pointer">Destinations</button>
              <button onClick={() => setCurrentView('places')} className="hover:text-white cursor-pointer">Live Status</button>
              <button onClick={() => setCurrentView('weather')} className="hover:text-white cursor-pointer">Weather</button>
              <button onClick={() => setCurrentView('hotels')} className="hover:text-white cursor-pointer">Hotels</button>
              <button onClick={() => setCurrentView('transport')} className="hover:text-white cursor-pointer">Transport</button>
              <button onClick={() => setCurrentView('routes-map')} className="hover:text-white cursor-pointer">Routes & Map</button>
              <button onClick={() => setCurrentView('ai-planner')} className="hover:text-white cursor-pointer">AI Planner</button>
              <button onClick={() => setCurrentView('alerts')} className="hover:text-white cursor-pointer">Live Alerts</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © 2026 TRAVELIQ — Smart Tourism & Travel Super App. Built for Hackathon Student Innovation.
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Attraction Sensor Feed: Online • Mysore & Jaipur Region Active
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
