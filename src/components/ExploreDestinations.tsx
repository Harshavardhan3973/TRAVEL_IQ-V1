import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  SlidersHorizontal, 
  ShieldCheck, 
  Clock, 
  CloudSun, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Destination } from '../types';

interface ExploreDestinationsProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onPlanTrip: (cityName: string) => void;
}

export const ExploreDestinations: React.FC<ExploreDestinationsProps> = ({
  destinations,
  onSelectDestination,
  onPlanTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'name'>('rating');

  const categories = ['All', 'Heritage', 'Nature', 'Spiritual', 'Cultural', 'Indoor Safe'];

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesSearch = 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'All' ? true :
        selectedCategory === 'Indoor Safe' ? dest.isIndoor :
        dest.category === selectedCategory;

      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'open' ? (dest.status.state === 'open' || dest.status.state === 'closing_soon') :
        dest.status.state === 'closed';

      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return a.name.localeCompare(b.name);
    });
  }, [destinations, searchQuery, selectedCategory, statusFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Live Attraction Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Explore Tourist Places & Monuments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time operating statuses, live weather, crowd indices, and ticket prices for all prominent tourist attractions.
          </p>
        </div>

        {/* Search and Quick Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6">
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="input-explore-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by monument name, city (Mysore, Jaipur), keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Status Quick Toggle */}
          <div className="md:col-span-3">
            <select
              id="select-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Operating Statuses</option>
              <option value="open">🟢 Open / Closing Soon Only</option>
              <option value="closed">🔴 Temporarily Closed Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <select
              id="select-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="rating">Sort by: Top Rated (⭐ 4.5+)</option>
              <option value="distance">Sort by: Nearest Distance</option>
              <option value="name">Sort by: Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-100 mt-4 pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`filter-cat-${cat.toLowerCase().replace(' ', '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Tourist Destination Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Image Header with Status & Weather Overlays */}
            <div className="relative h-48 sm:h-52 overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

              {/* Status Indicator (Open/Closed/Closing Soon) */}
              <div className="absolute top-3 left-3">
                <span className={`text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 ${
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

              {/* Weather Chip */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <span>{dest.weather.icon}</span>
                <span>{dest.weather.temp}°C</span>
              </div>

              {/* City & Rating Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                  📍 {dest.city} • {dest.distanceKm} km
                </span>
                <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-amber-300">
                  ⭐ {dest.rating}
                </span>
              </div>
            </div>

            {/* Destination Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-blue-600">{dest.category}</span>
                  <span>{dest.status.crowdLevel} Crowd</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {dest.tagline}
                </p>
                {dest.status.notice && (
                  <p className="text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded-md border border-amber-200/60 mt-2 line-clamp-1">
                    ⚠️ {dest.status.notice}
                  </p>
                )}
              </div>

              {/* Card Footer with Price and CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase">Entry Fee</span>
                  <span className="font-extrabold text-slate-900">
                    {dest.status.entryFee === 0 ? 'Free' : `₹${dest.status.entryFee}`}
                  </span>
                </div>
                <button
                  id={`btn-explore-view-${dest.id}`}
                  onClick={() => onSelectDestination(dest)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Explore Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto">
          <p className="text-3xl mb-2">🔍</p>
          <h3 className="text-sm font-bold text-slate-900">No destinations match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or searching for "Mysore" or "Palace".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setStatusFilter('all'); }}
            className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
