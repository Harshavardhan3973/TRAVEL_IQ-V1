import React, { useState, useMemo } from 'react';
import { 
  Hotel as HotelIcon, 
  MapPin, 
  Star, 
  Check, 
  SlidersHorizontal, 
  Search, 
  ShieldCheck, 
  Wifi, 
  Coffee, 
  Waves, 
  Sparkles,
  X,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Hotel } from '../types';

interface HotelsViewProps {
  hotels: Hotel[];
  onBookHotelSuccess: (hotel: Hotel, details: { checkIn: string; checkOut: string; guests: number }) => void;
}

export const HotelsView: React.FC<HotelsViewProps> = ({
  hotels,
  onBookHotelSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(7000);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [selectedAmenity, setSelectedAmenity] = useState<string>('All');
  const [onlyAvailableRooms, setOnlyAvailableRooms] = useState<boolean>(false);

  // Selected hotel for detail & booking modal
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingCheckIn, setBookingCheckIn] = useState('2026-09-12');
  const [bookingCheckOut, setBookingCheckOut] = useState('2026-09-14');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const amenitiesList = ['All', 'Swimming Pool', 'Breakfast', 'Wi-Fi', 'Free Cancellation'];

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const matchesSearch = 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrice = h.pricePerNight <= maxPrice;
      const matchesRating = h.rating >= minRating;

      const matchesAmenity = 
        selectedAmenity === 'All' ? true :
        selectedAmenity === 'Swimming Pool' ? h.amenities.some(a => a.toLowerCase().includes('pool')) :
        selectedAmenity === 'Breakfast' ? h.amenities.some(a => a.toLowerCase().includes('breakfast')) :
        selectedAmenity === 'Wi-Fi' ? h.amenities.some(a => a.toLowerCase().includes('wi-fi')) :
        h.amenities.some(a => a.toLowerCase().includes('cancellation') || h.cancellationPolicy.includes('Free'));

      const matchesRooms = onlyAvailableRooms ? h.availableRooms > 0 : true;

      return matchesSearch && matchesPrice && matchesRating && matchesAmenity && matchesRooms;
    });
  }, [hotels, searchQuery, maxPrice, minRating, selectedAmenity, onlyAvailableRooms]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;
    
    setIsBookingSuccess(true);
    setTimeout(() => {
      onBookHotelSuccess(selectedHotel, {
        checkIn: bookingCheckIn,
        checkOut: bookingCheckOut,
        guests: bookingGuests
      });
      setIsBookingSuccess(false);
      setSelectedHotel(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <HotelIcon className="w-4 h-4" />
            Direct Hotel Discovery & Availability
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Verified Stays & Resorts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Compare distance from top attractions (Mysore Palace, Zoo, Chamundi), live room vacancy, and bundled travel perks.
          </p>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 pt-6 border-t border-slate-100 items-end">
          {/* Search bar */}
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Search Hotel or Landmark
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                id="input-hotels-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hotel name, neighborhood..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              <span>Max Price / Night</span>
              <span className="text-blue-700 font-extrabold text-xs">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              id="slider-hotel-max-price"
              type="range"
              min={1500}
              max={8000}
              step={250}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Rating filter */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Min Rating
            </label>
            <select
              id="select-hotel-rating"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value={4.0}>⭐ 4.0 & above</option>
              <option value={4.4}>⭐ 4.4 & above</option>
              <option value={4.6}>⭐ 4.6 & above (Top)</option>
            </select>
          </div>

          {/* Room Availability toggle */}
          <div className="md:col-span-3 flex items-center gap-2 pb-1">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                id="checkbox-available-rooms-only"
                type="checkbox"
                checked={onlyAvailableRooms}
                onChange={(e) => setOnlyAvailableRooms(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>Rooms Available Only</span>
            </label>
          </div>
        </div>

        {/* Amenity Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 mt-3 border-t border-slate-100 pb-1">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">Amenities:</span>
          {amenitiesList.map((amenity) => {
            const isSelected = selectedAmenity === amenity;
            return (
              <button
                key={amenity}
                id={`btn-amenity-${amenity.toLowerCase().replace(' ', '-')}`}
                onClick={() => setSelectedAmenity(amenity)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Image & Badges */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Scarcity Badge / Top badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {hotel.badge && (
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider ${
                    hotel.availableRooms <= 2
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {hotel.badge}
                  </span>
                )}
              </div>

              {/* Distance from Destination Tag */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-300" />
                  {hotel.distanceFromDestination}
                </span>
                <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md text-amber-300 font-bold">
                  ⭐ {hotel.rating}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="truncate">{hotel.location}</span>
                  <span className={`font-bold ${hotel.availableRooms <= 2 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {hotel.availableRooms} rooms left
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                  {hotel.name}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {hotel.roomType}
                </p>

                {/* Amenities chips */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {hotel.amenities.slice(0, 4).map((am, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                    >
                      {am}
                    </span>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <span className="text-[10px] text-slate-400 py-0.5">
                      +{hotel.amenities.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 line-through block">
                    {hotel.originalPrice ? `₹${hotel.originalPrice.toLocaleString()}` : ''}
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    ₹{hotel.pricePerNight.toLocaleString()}
                    <span className="text-[10px] font-normal text-slate-500"> /night</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`btn-hotel-details-${hotel.id}`}
                    onClick={() => setSelectedHotel(hotel)}
                    className="px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    id={`btn-hotel-book-${hotel.id}`}
                    onClick={() => setSelectedHotel(hotel)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HOTEL DETAILS & BOOKING MODAL */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Image Header */}
            <div className="relative h-56 shrink-0 overflow-hidden">
              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <button
                id="btn-close-hotel-modal"
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs text-blue-200 font-semibold">
                  {selectedHotel.distanceFromDestination}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {selectedHotel.name}
                </h2>
                <p className="text-xs text-slate-300">
                  {selectedHotel.address}
                </p>
              </div>
            </div>

            {/* Modal Body & Booking Form */}
            <div className="p-6 space-y-5 text-slate-800">
              {isBookingSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Booking Confirmed with TRAVELIQ!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your stay at <strong>{selectedHotel.name}</strong> for {bookingCheckIn} to {bookingCheckOut} ({bookingGuests} guests) has been added to <strong>My Trips</strong>.
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 py-1.5 px-3 rounded-lg inline-block">
                    Free cancellation guaranteed • Voucher issued
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  {/* Hotel Attributes & Cancellation Policy */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-bold uppercase">Room Tier</span>
                      <strong className="text-slate-900">{selectedHotel.roomType}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-bold uppercase">Cancellation</span>
                      <span className="text-emerald-700 font-bold">{selectedHotel.cancellationPolicy}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-bold uppercase">Status</span>
                      <span className="text-blue-700 font-bold">{selectedHotel.availableRooms} rooms available</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-2">Included Amenities:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedHotel.amenities.map((am, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{am}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Dates and Travelers Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Check-In Date
                      </label>
                      <input
                        id="input-book-checkin"
                        type="date"
                        value={bookingCheckIn}
                        onChange={(e) => setBookingCheckIn(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Check-Out Date
                      </label>
                      <input
                        id="input-book-checkout"
                        type="date"
                        value={bookingCheckOut}
                        onChange={(e) => setBookingCheckOut(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Guests
                      </label>
                      <select
                        id="select-book-guests"
                        value={bookingGuests}
                        onChange={(e) => setBookingGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 cursor-pointer"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                      </select>
                    </div>
                  </div>

                  {/* Total & Confirm Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">Total for 2 nights (incl. taxes):</span>
                      <span className="text-xl font-black text-slate-900">
                        ₹{(selectedHotel.pricePerNight * 2).toLocaleString()}
                      </span>
                    </div>

                    <button
                      id="btn-confirm-hotel-booking"
                      type="submit"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm & Book Room</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
