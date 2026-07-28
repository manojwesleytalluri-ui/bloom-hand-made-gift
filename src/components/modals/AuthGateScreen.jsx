import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Lock, ShieldCheck, User, Mail, Phone, Key, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthGateScreen() {
  const { loginUser, registerUser } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Login Form State
  const [loginField, setLoginField] = useState(''); // Email or Mobile
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Register Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [regErrors, setRegErrors] = useState({});
  const [regErrorMsg, setRegErrorMsg] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (!loginField.trim() || !loginPassword.trim()) {
      setLoginError('Please enter your email/mobile and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const result = loginUser(loginField.trim(), loginPassword.trim());

      if (result.success) {
        setLoginSuccess('Login successful! Unlocking website...');
      } else {
        setLoginError(result.message || 'Invalid email or password.');
      }
    }, 800);
  };

  // Handle Register Input Change
  const handleRegChange = (field, value) => {
    setRegForm((prev) => ({ ...prev, [field]: value }));
    if (regErrors[field]) {
      setRegErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Validate Register Form
  const validateRegister = () => {
    const errors = {};
    if (!regForm.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!regForm.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required';
    } else if (!/^[6-9]\d{9}$/.test(regForm.mobileNumber.trim())) {
      errors.mobileNumber = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!regForm.email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    if (!regForm.password) {
      errors.password = 'Password is required';
    } else if (regForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (regForm.password !== regForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegErrorMsg('');
    setRegSuccessMsg('');

    if (!validateRegister()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const result = registerUser({
        fullName: regForm.fullName.trim(),
        mobileNumber: regForm.mobileNumber.trim(),
        email: regForm.email.trim(),
        password: regForm.password.trim()
      });

      if (result.success) {
        setRegSuccessMsg('Registration successful! Please log in with your credentials.');
        setLoginField(regForm.email.trim());
        setMode('login');
        setRegForm({ fullName: '', mobileNumber: '', email: '', password: '', confirmPassword: '' });
      } else {
        setRegErrorMsg(result.message || 'Registration failed.');
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/95 backdrop-blur-2xl overflow-y-auto animate-fadeIn">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full glass-panel border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-gold-lg space-y-6 my-auto">
        
        {/* Brand Crest Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center mx-auto text-gold-400">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-pearl-50 tracking-wide">
            Bloom Luxury Florist
          </h1>
          <p className="text-xs text-gold-300 font-serif uppercase tracking-widest">
            Member Authentication First Security Gate
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-obsidian-900 border border-gold-500/20 text-xs font-serif font-bold">
          <button
            onClick={() => {
              setMode('login');
              setLoginError('');
              setRegErrorMsg('');
            }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-gold-gradient text-obsidian-950 shadow-gold-sm'
                : 'text-pearl-300 hover:text-gold-400'
            }`}
          >
            Member Login
          </button>

          <button
            onClick={() => {
              setMode('register');
              setLoginError('');
              setRegErrorMsg('');
            }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-gold-gradient text-obsidian-950 shadow-gold-sm'
                : 'text-pearl-300 hover:text-gold-400'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* ========================================================= */}
        {/* LOGIN FORM                                                */}
        {/* ========================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs animate-fadeIn">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{loginSuccess}</span>
              </div>
            )}

            <div>
              <label className="text-pearl-300 block mb-1 font-medium">
                Email Address or Mobile Number *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter registered email or mobile"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-3 py-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-pearl-300 block mb-1 font-medium">
                Password *
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-gold-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-3 py-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Unlock Store'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* CREATE ACCOUNT / REGISTRATION FORM                        */}
        {/* ========================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs animate-fadeIn">
            {regErrorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{regErrorMsg}</span>
              </div>
            )}

            {regSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{regSuccessMsg}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="text-pearl-300 block mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={regForm.fullName}
                onChange={(e) => handleRegChange('fullName', e.target.value)}
                className={`w-full bg-obsidian-900 border ${
                  regErrors.fullName ? 'border-red-500' : 'border-gold-500/30'
                } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
              />
              {regErrors.fullName && <p className="text-[10px] text-red-400 mt-1">{regErrors.fullName}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-pearl-300 block mb-1 font-medium">Mobile Number (10 Digits) *</label>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={regForm.mobileNumber}
                onChange={(e) => handleRegChange('mobileNumber', e.target.value)}
                className={`w-full bg-obsidian-900 border ${
                  regErrors.mobileNumber ? 'border-red-500' : 'border-gold-500/30'
                } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
              />
              {regErrors.mobileNumber && <p className="text-[10px] text-red-400 mt-1">{regErrors.mobileNumber}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="text-pearl-300 block mb-1 font-medium">Email Address *</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={regForm.email}
                onChange={(e) => handleRegChange('email', e.target.value)}
                className={`w-full bg-obsidian-900 border ${
                  regErrors.email ? 'border-red-500' : 'border-gold-500/30'
                } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
              />
              {regErrors.email && <p className="text-[10px] text-red-400 mt-1">{regErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-pearl-300 block mb-1 font-medium">Password *</label>
              <input
                type="password"
                placeholder="Enter password (min 6 characters)"
                value={regForm.password}
                onChange={(e) => handleRegChange('password', e.target.value)}
                className={`w-full bg-obsidian-900 border ${
                  regErrors.password ? 'border-red-500' : 'border-gold-500/30'
                } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
              />
              {regErrors.password && <p className="text-[10px] text-red-400 mt-1">{regErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-pearl-300 block mb-1 font-medium">Confirm Password *</label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={regForm.confirmPassword}
                onChange={(e) => handleRegChange('confirmPassword', e.target.value)}
                className={`w-full bg-obsidian-900 border ${
                  regErrors.confirmPassword ? 'border-red-500' : 'border-gold-500/30'
                } rounded-xl p-2.5 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
              />
              {regErrors.confirmPassword && <p className="text-[10px] text-red-400 mt-1">{regErrors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Hashing & Creating Account...' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-gold-500/20 text-center">
          <p className="text-[11px] text-pearl-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Secure Session & CSRF Protection</span>
          </p>
        </div>

      </div>
    </div>
  );
}
