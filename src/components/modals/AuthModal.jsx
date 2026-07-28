import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, Phone, User, Key, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthOpen,
    setIsAuthOpen,
    authMode,
    setAuthMode,
    loginUser,
    registerUser,
    pendingAction,
    executePendingAction
  } = useApp();

  // Login state
  const [loginField, setLoginField] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regForm, setRegForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [regErrors, setRegErrors] = useState({});
  const [regErrorMsg, setRegErrorMsg] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginField.trim() || !loginPassword.trim()) {
      setLoginError('Please enter your email/mobile and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = loginUser(loginField, loginPassword);

      if (res.success) {
        setSuccessMsg('✨ Login Successful! Resuming your session...');
        setTimeout(() => {
          setSuccessMsg('');
          setIsAuthOpen(false);
          executePendingAction();
        }, 1000);
      } else {
        setLoginError(res.message || 'Invalid email or password.');
      }
    }, 700);
  };

  const validateReg = () => {
    const errors = {};
    if (!regForm.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!regForm.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required';
    } else if (!/^[6-9]\d{9}$/.test(regForm.mobileNumber.trim())) {
      errors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!regForm.email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    if (!regForm.password) {
      errors.password = 'Password is required';
    } else if (regForm.password.length < 6) {
      errors.password = 'Min 6 characters';
    }

    if (regForm.password !== regForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegErrorMsg('');

    if (!validateReg()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = registerUser({
        fullName: regForm.fullName.trim(),
        mobileNumber: regForm.mobileNumber.trim(),
        email: regForm.email.trim(),
        password: regForm.password.trim()
      });

      if (res.success) {
        // Auto log in after registration
        loginUser(regForm.email.trim(), regForm.password.trim());
        setSuccessMsg('🎉 Account Created & Logged In! Resuming...');
        setTimeout(() => {
          setSuccessMsg('');
          setIsAuthOpen(false);
          executePendingAction();
        }, 1000);
      } else {
        setRegErrorMsg(res.message || 'Registration failed.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel border border-gold-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 relative space-y-5 shadow-gold-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 text-pearl-300 hover:text-gold-400 p-1 rounded-full bg-obsidian-900 border border-gold-500/30"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 mx-auto rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-pearl-50">
            {authMode === 'login' ? 'VIP Member Login' : 'Create VIP Account'}
          </h3>
          <p className="text-xs text-pearl-300 font-light">
            Bloom Luxury Florist & Bespoke Gift Atelier
          </p>
        </div>

        {/* Action-Triggered Contextual Alert Banner */}
        {pendingAction && (
          <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-400/40 text-gold-300 text-xs flex items-start gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Account Required to Continue</p>
              <p className="text-[11px] text-pearl-200 mt-0.5">
                {pendingAction.type === 'ADD_TO_CART'
                  ? 'Please sign in or create an account to add items to your cart and proceed to checkout.'
                  : pendingAction.type === 'OPEN_CHECKOUT'
                  ? 'Please sign in to proceed with VIP checkout and order confirmation.'
                  : 'Please sign in to view your orders and track live delivery.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-full bg-obsidian-900 border border-gold-500/20 text-xs font-serif font-bold">
          <button
            onClick={() => {
              setAuthMode('login');
              setLoginError('');
            }}
            className={`py-2 rounded-full transition-all ${
              authMode === 'login'
                ? 'bg-gold-gradient text-obsidian-950 shadow-gold-sm'
                : 'text-pearl-300 hover:text-gold-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setRegErrorMsg('');
            }}
            className={`py-2 rounded-full transition-all ${
              authMode === 'register'
                ? 'bg-gold-gradient text-obsidian-950 shadow-gold-sm'
                : 'text-pearl-300 hover:text-gold-400'
            }`}
          >
            Create Account
          </button>
        </div>

        {successMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs text-center font-serif font-bold flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        ) : authMode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs animate-fadeIn">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-pearl-300 block mb-1 font-medium">Email or Mobile Number *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter registered email or mobile"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-9 pr-3 py-2.5 text-pearl-100 outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="text-pearl-300 block mb-1 font-medium">Password *</label>
              <div className="relative">
                <Key className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-9 pr-3 py-2.5 text-pearl-100 outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Log In & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 text-xs animate-fadeIn">
            {regErrorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{regErrorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-pearl-300 block mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                className={`w-full bg-obsidian-900 border ${
                  regErrors.fullName ? 'border-red-500' : 'border-gold-500/30'
                } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400`}
              />
              {regErrors.fullName && <p className="text-[10px] text-red-400 mt-0.5">{regErrors.fullName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Mobile (10 Digits) *</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Mobile number"
                  value={regForm.mobileNumber}
                  onChange={(e) => setRegForm({ ...regForm, mobileNumber: e.target.value })}
                  className={`w-full bg-obsidian-900 border ${
                    regErrors.mobileNumber ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400`}
                />
                {regErrors.mobileNumber && <p className="text-[10px] text-red-400 mt-0.5">{regErrors.mobileNumber}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className={`w-full bg-obsidian-900 border ${
                    regErrors.email ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400`}
                />
                {regErrors.email && <p className="text-[10px] text-red-400 mt-0.5">{regErrors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Password *</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  className={`w-full bg-obsidian-900 border ${
                    regErrors.password ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400`}
                />
                {regErrors.password && <p className="text-[10px] text-red-400 mt-0.5">{regErrors.password}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Confirm Password *</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                  className={`w-full bg-obsidian-900 border ${
                    regErrors.confirmPassword ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400`}
                />
                {regErrors.confirmPassword && <p className="text-[10px] text-red-400 mt-0.5">{regErrors.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Creating Account...' : 'Register & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
