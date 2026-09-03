import React, { useState } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Sun, 
  Compass, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Clock
} from 'lucide-react';
import { CityWeather } from '../types';
import { WEATHER_DATA } from '../data/weather';

interface WeatherViewProps {
  currentCityWeather: CityWeather;
  onNavigate: (view: any) => void;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  currentCityWeather,
  onNavigate,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Mysore');
  const cityWeather = WEATHER_DATA[selectedCity] || currentCityWeather;

  return (
    <div className="space-y-6 pb-12">
      {/* Header and City Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4" />
            Meteorological Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Real-Time Weather & Travel Influence
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Live atmospheric telemetry actively optimizes your sightseeing schedules to prevent weather disruptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Destination:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {Object.keys(WEATHER_DATA).map((cityName) => (
              <button
                key={cityName}
                id={`btn-weather-city-${cityName.toLowerCase()}`}
                onClick={() => setSelectedCity(cityName)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedCity === cityName
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Weather Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Current Weather Card */}
        <div className="lg:col-span-7 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-1 rounded-full">
                  Live Station Feed
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {cityWeather.city}
                </h2>
              </div>
              <div className="text-5xl sm:text-6xl">
                {cityWeather.hourly[3]?.icon || '🌤️'}
              </div>
            </div>

            <div className="flex items-baseline gap-4 mt-6">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tight">
                {cityWeather.temp}°C
              </span>
              <div className="space-y-0.5 text-blue-100 text-sm font-semibold">
                <p>Feels like {cityWeather.feelsLike}°C</p>
                <p className="text-white font-bold">{cityWeather.condition}</p>
              </div>
            </div>
          </div>

          {/* Current Weather Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/15 text-xs">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase">
                <CloudRain className="w-3.5 h-3.5" />
                Rain Probability
              </div>
              <p className="text-base font-black text-white mt-1">
                {cityWeather.rainProb}%
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase">
                <Droplets className="w-3.5 h-3.5" />
                Humidity
              </div>
              <p className="text-base font-black text-white mt-1">
                {cityWeather.humidity}%
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase">
                <Wind className="w-3.5 h-3.5" />
                Wind Speed
              </div>
              <p className="text-base font-black text-white mt-1">
                {cityWeather.windSpeed}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase">
                <Sun className="w-3.5 h-3.5" />
                Air Quality / UV
              </div>
              <p className="text-base font-black text-white mt-1 truncate">
                {cityWeather.airQuality.split(' ')[0]} (UV {cityWeather.uvIndex})
              </p>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Dynamic Travel Recommendation Influence */}
        <div className="lg:col-span-5 bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  TRAVELIQ Weather Adaptation Engine
                </h3>
                <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-200/60 px-1.5 py-0.2 rounded">
                  Proactive Schedule Adjustment
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-2xs space-y-2">
              <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Active Recommendation for {selectedCity}:
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {cityWeather.travelImpactNote}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800">Key Recommended Slots Today:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <strong>08:30 - 12:30:</strong> Outdoor Palaces & Viewpoints (Dry, 26°C)
                </div>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                  <strong>14:00 - 17:00:</strong> Indoor Museums & Silk Mills (Protected)
                </div>
              </div>
            </div>
          </div>

          <button
            id="btn-weather-adjust-itinerary"
            onClick={() => onNavigate('ai-planner')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Weather-Protected AI Trip</span>
          </button>
        </div>
      </div>

      {/* TODAY'S HOURLY FORECAST SLIDER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Today's Hourly Forecast ({selectedCity})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Sunrise: {cityWeather.sunrise} • Sunset: {cityWeather.sunset}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {cityWeather.hourly.map((h, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center transition-colors ${
                h.rainProb > 40
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500">{h.time}</div>
              <div className="text-2xl my-1.5">{h.icon}</div>
              <div className="text-sm font-extrabold text-slate-900">{h.temp}°C</div>
              <div className="text-[10px] text-slate-500 mt-1 truncate">{h.condition}</div>
              <div className={`text-[10px] font-bold mt-1 px-1 py-0.5 rounded ${
                h.rainProb > 40 ? 'bg-amber-100 text-amber-800' : 'text-slate-400'
              }`}>
                💧 {h.rainProb}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-7 DAY FORECAST */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h3 className="font-extrabold text-base text-slate-900">
            7-Day Tourism Weather Outlook
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
          {cityWeather.daily.map((d, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-2 hover:border-blue-400 transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-slate-900">{d.day}</div>
                <div className="text-[10px] text-slate-500">{d.date}</div>
              </div>

              <div className="text-3xl text-center py-1">{d.icon}</div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900">{d.high}°</span>
                  <span className="text-slate-400">{d.low}°</span>
                </div>
                <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                  Rain: {d.rainProb}%
                </div>
              </div>

              {d.advisory && (
                <div className="text-[10px] text-slate-600 bg-white p-1.5 rounded border border-slate-200 line-clamp-2">
                  💡 {d.advisory}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
