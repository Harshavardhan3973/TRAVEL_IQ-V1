import React from 'react';
import { 
  Compass, 
  MapPin, 
  Hotel, 
  Bus, 
  CloudSun, 
  Sparkles, 
  BookmarkCheck, 
  Bell, 
  User as UserIcon, 
  Menu, 
  X,
  ShieldAlert,
  Navigation,
  LogOut
} from 'lucide-react';
import { AppView, UserProfile, RealTimeAlert } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate?: (view: AppView) => void;
  setCurrentView?: (view: AppView) => void;
  currentUser?: UserProfile | null;
  user?: UserProfile | null;
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  alerts: RealTimeAlert[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  setCurrentView,
  currentUser,
  user,
  onOpenLogin,
  onOpenSignup,
  onOpenAuth,
  onLogout,
  alerts
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const activeUser = currentUser !== undefined ? currentUser : user;
  const navigate = onNavigate || setCurrentView || (() => {});

  const handleOpenLogin = () => {
    if (onOpenLogin) onOpenLogin();
    else if (onOpenAuth) onOpenAuth('login');
  };

  const handleOpenSignup = () => {
    if (onOpenSignup) onOpenSignup();
    else if (onOpenAuth) onOpenAuth('signup');
  };

  const unreadAlertsCount = alerts.length;

  const navItems = [
    { id: 'home' as AppView, label: 'Home', icon: Compass },
    { id: 'explore' as AppView, label: 'Explore', icon: MapPin },
    { id: 'places' as AppView, label: 'Live Status', icon: ShieldAlert },
    { id: 'weather' as AppView, label: 'Weather', icon: CloudSun },
    { id: 'hotels' as AppView, label: 'Hotels', icon: Hotel },
    { id: 'transport' as AppView, label: 'Transport', icon: Bus },
    { id: 'routes-map' as AppView, label: 'Explore Map', icon: Navigation, badge: 'Satellite' },
    { id: 'ai-planner' as AppView, label: 'AI Planner', icon: Sparkles, badge: 'Smart' },
    { id: 'my-trips' as AppView, label: 'My Trips', icon: BookmarkCheck },
  ];

  const handleNavClick = (view: AppView) => {
    navigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Alert Ticker for Emergency / Real-time updates */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            LIVE INTEL
          </span>
          <p className="truncate text-slate-300 text-xs">
            🌧️ Western Ghats &amp; Kerala monsoon intel active • 🚆 Vande Bharat Express on-time telemetry • 🏛️ Taj Mahal open sunrise-sunset • 🚗 Bengaluru-Mysuru Expressway normal
          </p>
        </div>
        <button 
          id="btn-nav-view-alerts"
          onClick={() => handleNavClick('alerts')}
          className="text-amber-400 hover:text-amber-300 font-semibold shrink-0 text-xs flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>All-India Alerts</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
        </button>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button 
              id="btn-logo-home"
              onClick={() => handleNavClick('home')} 
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                IQ
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  TRAVEL<span className="text-blue-600">IQ</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase">India</span>
                </span>
                <span className="hidden sm:block text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                  Incredible India • One App. Every Journey.
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-bold rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Alerts Bell & User Auth */}
          <div className="flex items-center gap-2.5">
            {/* Real-Time Alerts Center Button */}
            <button
              id="btn-header-alerts"
              onClick={() => handleNavClick('alerts')}
              aria-label="View Alerts"
              className={`relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer ${
                currentView === 'alerts' ? 'bg-amber-50 text-amber-700' : ''
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Profile / Auth Button */}
            {activeUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-header-profile"
                  onClick={() => handleNavClick('my-trips')}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer ${
                    currentView === 'my-trips' ? 'bg-blue-50 border-blue-300' : 'bg-white'
                  }`}
                >
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <span className="hidden md:inline text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {activeUser.name.split(' ')[0]}
                  </span>
                </button>
                <button
                  id="btn-header-logout"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-header-login"
                  onClick={handleOpenLogin}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  id="btn-header-signup"
                  onClick={handleOpenSignup}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {activeUser ? (
              <div className="w-full flex items-center justify-between">
                <button
                  id="mobile-btn-profile"
                  onClick={() => handleNavClick('my-trips')}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                >
                  <img src={activeUser.avatar} alt={activeUser.name} className="w-8 h-8 rounded-full" />
                  <span>{activeUser.name}</span>
                </button>
                <button
                  id="mobile-btn-logout"
                  onClick={onLogout}
                  className="text-xs text-red-600 font-semibold px-2 py-1 hover:bg-red-50 rounded cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  id="mobile-btn-login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenLogin();
                  }}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
                >
                  Log In
                </button>
                <button
                  id="mobile-btn-signup"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenSignup();
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-white bg-blue-600 rounded-lg cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
