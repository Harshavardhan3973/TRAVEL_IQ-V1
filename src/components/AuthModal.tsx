import React, { useState } from 'react';
import { X, Mail, Phone, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('traveller.mysore@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'Heritage & History',
    'Local Cuisine'
  ]);
  const [budgetTier, setBudgetTier] = useState<'Budget' | 'Comfort' | 'Luxury'>('Comfort');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const travelPreferenceOptions = [
    'Heritage & History',
    'Nature & Wildlife',
    'Local Cuisine',
    'Spiritual & Temples',
    'Adventure & Trekking',
    'Art & Handicrafts'
  ];

  const togglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier || !loginPassword) {
      setErrorMessage('Please enter your email/phone and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const mockUser: UserProfile = {
        id: 'usr-101',
        name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Arjun Sharma',
        email: loginIdentifier.includes('@') ? loginIdentifier : 'arjun.sharma@traveliq.in',
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
            title: 'My Mysore Trip',
            destination: 'Mysore',
            dates: '12–14 September',
            hotelBooked: 'Grand Mercure Mysore (Deluxe King)',
            transport: 'KSRTC Airavat Express Bus',
            placesCount: 6,
            estimatedBudget: 4850,
            status: 'Upcoming',
            itinerarySummary: 'Palace tour in morning, Jaganmohan Art Gallery in afternoon, evening Brindavan fountain show.'
          }
        ]
      };
      onLoginSuccess(mockUser);
      onClose();
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !signupEmail || !signupPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: fullName,
        email: signupEmail,
        phone: signupPhone || '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        travelPreferences: selectedPreferences,
        budgetPreference: budgetTier,
        savedPlaceIds: ['mysore-palace'],
        bookedHotelIds: [],
        notificationsEnabled: true,
        trips: []
      };
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const googleUser: UserProfile = {
        id: 'usr-google-99',
        name: 'Priya Narayanan',
        email: 'priya.traveler@gmail.com',
        phone: '+91 94480 88990',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        travelPreferences: ['Heritage & History', 'Art & Handicrafts', 'Local Cuisine'],
        budgetPreference: 'Comfort',
        savedPlaceIds: ['mysore-palace', 'jaganmohan-palace'],
        bookedHotelIds: ['hotel-radisson-blu'],
        notificationsEnabled: true,
        trips: [
          {
            id: 'trip-mysore-1',
            title: 'My Mysore Trip',
            destination: 'Mysore',
            dates: '12–14 September',
            hotelBooked: 'Radisson Blu Plaza Mysore',
            transport: 'KSRTC Airavat Express Bus',
            placesCount: 6,
            estimatedBudget: 4850,
            status: 'Upcoming',
            itinerarySummary: '2-Day Smart Itinerary considering afternoon rainfall protection.'
          }
        ]
      };
      onLoginSuccess(googleUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 text-white relative">
          <button
            id="btn-auth-close"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Student Innovation Super App
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {mode === 'login' ? 'Welcome to TRAVELIQ' : 'Join TRAVELIQ'}
          </h2>
          <p className="text-blue-100 text-xs mt-1">
            {mode === 'login'
              ? 'Access live attraction status, real-time alerts & AI planning.'
              : 'One single platform for your entire travel journey.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1">
          <button
            id="tab-auth-login"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Log In
          </button>
          <button
            id="tab-auth-signup"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {/* Quick Demo Test Bar */}
          <div className="mb-4 p-2.5 bg-blue-50/80 border border-blue-200/70 rounded-xl flex items-center justify-between">
            <div className="text-xs text-blue-900">
              <span className="font-bold">⚡ Quick Test:</span> 1-Click login as traveler
            </div>
            <button
              id="btn-quick-demo-login"
              type="button"
              onClick={handleGoogleSignIn}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-md shadow-2xs transition-colors cursor-pointer"
            >
              Demo Login
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-email"
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="name@example.com or 9845012345"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered contact!')}
                    className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    required
                  />
                </div>
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Logging in...' : 'Log In to Tourism Dashboard'}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                  <span className="bg-white px-2">Or continue with</span>
                </div>
              </div>

              <button
                id="btn-google-login"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Sign-In</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rohith Gowda"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="input-signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="input-signup-phone"
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="input-signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    id="input-signup-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Travel Preferences */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Travel Preferences (select what you enjoy)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {travelPreferenceOptions.map((pref) => {
                    const isSelected = selectedPreferences.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => togglePreference(pref)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Budget Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Budget', 'Comfort', 'Luxury'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setBudgetTier(tier)}
                      className={`py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                        budgetTier === tier
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-submit-signup"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account & Enter Dashboard'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
