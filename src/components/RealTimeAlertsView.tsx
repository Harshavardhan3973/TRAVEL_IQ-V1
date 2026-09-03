import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CloudRain, 
  Bus, 
  Landmark, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Filter,
  Bell,
  ArrowRight
} from 'lucide-react';
import { RealTimeAlert } from '../types';

interface RealTimeAlertsViewProps {
  alerts: RealTimeAlert[];
  onDismissAlert?: (id: string) => void;
  onNavigate: (view: any) => void;
}

export const RealTimeAlertsView: React.FC<RealTimeAlertsViewProps> = ({
  alerts,
  onDismissAlert,
  onNavigate,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter(a => {
    const matchesType = selectedType === 'all' ? true : a.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' ? true : a.severity === selectedSeverity;
    return matchesType && matchesSeverity;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            Live Intelligence & Advisory Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Real-Time Travel & Safety Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Official bulletins synthesized from state meteorological departments, traffic police control, and archaeological surveys.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            id="select-alerts-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Alert Types ({alerts.length})</option>
            <option value="weather">🌦️ Weather Alerts</option>
            <option value="tourist_place">🏛️ Tourist Place Closures</option>
            <option value="transport">🚌 Transport & Road Delays</option>
            <option value="emergency">🚨 Emergency & Crowd Notices</option>
          </select>

          <select
            id="select-alerts-severity"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Advisory</option>
            <option value="info">🔵 Informational</option>
          </select>
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isHigh = alert.severity === 'high';
          const isMed = alert.severity === 'medium';

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isHigh
                  ? 'border-red-300 bg-red-50/20'
                  : isMed
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-blue-200 bg-blue-50/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  isHigh ? 'bg-red-100 text-red-700' : isMed ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {alert.type === 'weather' ? <CloudRain className="w-6 h-6" /> :
                   alert.type === 'transport' ? <Bus className="w-6 h-6" /> :
                   alert.type === 'tourist_place' ? <Landmark className="w-6 h-6" /> :
                   <ShieldAlert className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : isMed
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>
                      {alert.severity} priority
                    </span>

                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {alert.timestamp}
                    </span>

                    {alert.affectedDestination && (
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        📍 {alert.affectedDestination}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {alert.message}
                  </p>

                  {alert.suggestedAction && (
                    <div className="mt-2 p-2.5 bg-white/90 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-blue-600 font-bold">TRAVELIQ Smart Solution:</span>
                      <span>{alert.suggestedAction}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {alert.suggestedAction && (
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    id={`btn-alert-action-${alert.id}`}
                    onClick={() => {
                      if (alert.type === 'transport') onNavigate('transport');
                      else if (alert.type === 'weather') onNavigate('weather');
                      else onNavigate('explore');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Follow Alternative</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
