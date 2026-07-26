import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, Shield, Sparkles } from 'lucide-react';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, user, setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      name: name || 'Lady Eleanor Vance',
      email: email || 'eleanor.vance@royal-luxury.com',
      tier: 'VIP Sovereign Member',
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsAuthOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel border border-gold-500/40 rounded-3xl max-w-md w-full p-8 relative space-y-6 shadow-gold-lg">
        <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-pearl-300 hover:text-gold-400">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-pearl-50">
            {authMode === 'login' ? 'Sovereign Portal Login' : 'Register VIP Membership'}
          </h3>
          <p className="text-xs text-pearl-300 font-light">Access private collections, order tracking, and bespoke consultations.</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-obsidian-900 p-1 rounded-full border border-gold-500/20">
          <button
            onClick={() => setAuthMode('login')}
            className={`py-2 rounded-full text-xs font-serif font-bold transition-all ${
              authMode === 'login' ? 'bg-gold-500 text-obsidian-950' : 'text-pearl-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`py-2 rounded-full text-xs font-serif font-bold transition-all ${
              authMode === 'register' ? 'bg-gold-500 text-obsidian-950' : 'text-pearl-300'
            }`}
          >
            Register
          </button>
        </div>

        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500 text-emerald-300 text-xs text-center font-serif font-bold">
            ✨ Authentication Successful! Welcome, {user.name}.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="text-xs text-pearl-300 block mb-1">Full Name & Honorific:</label>
                <div className="flex items-center gap-2 bg-obsidian-900 border border-gold-500/30 rounded-xl px-3 py-2 text-xs">
                  <User className="w-4 h-4 text-gold-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lady Eleanor Vance"
                    className="w-full bg-transparent outline-none text-pearl-100 placeholder-pearl-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-pearl-300 block mb-1">Email Address:</label>
              <div className="flex items-center gap-2 bg-obsidian-900 border border-gold-500/30 rounded-xl px-3 py-2 text-xs">
                <Mail className="w-4 h-4 text-gold-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleanor.vance@royal-luxury.com"
                  className="w-full bg-transparent outline-none text-pearl-100 placeholder-pearl-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-pearl-300 block mb-1">Password:</label>
              <div className="flex items-center gap-2 bg-obsidian-900 border border-gold-500/30 rounded-xl px-3 py-2 text-xs">
                <Lock className="w-4 h-4 text-gold-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent outline-none text-pearl-100 placeholder-pearl-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-transform"
            >
              {authMode === 'login' ? 'Enter Sovereign Portal' : 'Create VIP Membership'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
