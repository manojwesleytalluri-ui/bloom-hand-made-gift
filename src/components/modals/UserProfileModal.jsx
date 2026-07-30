import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Mail, Phone, Calendar, Clock, MapPin, Package, ShieldCheck, LogOut, Award, Check, Home, Briefcase, Trash2, Star, Plus } from 'lucide-react';

export default function UserProfileModal() {
  const {
    isProfileOpen,
    setIsProfileOpen,
    currentUser,
    logoutUser,
    activeCheckoutAddress,
    userAddresses,
    removeAddress,
    makeAddressDefault,
    setIsCheckoutOpen,
    orders,
    formatPrice,
    setIsTrackingOpen
  } = useApp();

  if (!isProfileOpen || !currentUser) return null;

  const currentLoginFormatted = currentUser.currentLoginDate
    ? new Date(currentUser.currentLoginDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const lastLoginFormatted = currentUser.lastLoginDate
    ? new Date(currentUser.lastLoginDate).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'First Active Session';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="glass-panel border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative space-y-6 shadow-gold-lg my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsProfileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-obsidian-900 border border-gold-500/30 text-pearl-300 hover:text-gold-400 transition-colors"
          aria-label="Close Profile"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 border-b border-gold-500/20 pb-5">
          <div className="w-16 h-16 rounded-full bg-gold-gradient p-0.5 shadow-gold-sm shrink-0">
            <div className="w-full h-full rounded-full bg-obsidian-950 flex items-center justify-center font-serif font-bold text-xl text-gold-400">
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-[10px] uppercase font-bold tracking-widest mb-1">
              <Award className="w-3 h-3" />
              <span>{currentUser.tier || 'VIP Sovereign Member'}</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-pearl-50">{currentUser.fullName}</h3>
            <p className="text-xs text-pearl-300 font-mono">{currentUser.email}</p>
          </div>
        </div>

        {/* Login Timestamp Info */}
        <div className="p-4 rounded-2xl bg-obsidian-900 border border-gold-500/20 space-y-2 text-xs">
          <div className="flex items-center justify-between text-pearl-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>Logged in on:</span>
            </span>
            <strong className="text-gold-300">{currentLoginFormatted}</strong>
          </div>

          <div className="flex items-center justify-between text-pearl-300 pt-1 border-t border-gold-500/10">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-400" />
              <span>Last Login:</span>
            </span>
            <strong className="text-pearl-100">{lastLoginFormatted}</strong>
          </div>
        </div>

        {/* Account Details List */}
        <div className="space-y-3 text-xs">
          <h4 className="font-serif font-bold text-pearl-100 uppercase tracking-wider text-[11px]">Account & Contact Info</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="p-3 rounded-xl bg-obsidian-900/60 border border-gold-500/10 flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold-400" />
              <div>
                <span className="text-[10px] text-pearl-400 block">Mobile Number</span>
                <span className="font-bold text-pearl-100">{currentUser.mobileNumber || 'Not provided'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-900/60 border border-gold-500/10 flex items-center gap-3">
              <Mail className="w-4 h-4 text-gold-400" />
              <div>
                <span className="text-[10px] text-pearl-400 block">Email Address</span>
                <span className="font-bold text-pearl-100">{currentUser.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-pearl-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span>Saved Delivery Addresses ({userAddresses ? userAddresses.length : 0})</span>
            </h4>

            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="text-[10px] text-gold-400 hover:underline font-serif font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add / Manage</span>
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {!userAddresses || userAddresses.length === 0 ? (
              <div className="p-3.5 rounded-2xl bg-obsidian-900 border border-gold-500/20 text-pearl-400 italic text-center">
                No saved address yet. Address will be saved upon placing your first order.
              </div>
            ) : (
              userAddresses.map((addr) => (
                <div key={addr.addressId} className="p-3 rounded-2xl bg-obsidian-900 border border-gold-500/20 space-y-1.5 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-pearl-100">{addr.fullName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-gold-300 text-[9px] uppercase font-bold tracking-wider">
                        {addr.addressType || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold uppercase tracking-wider">
                          ✓ Default
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => makeAddressDefault(addr.addressId)}
                          className="p-1 rounded bg-obsidian-950 border border-gold-500/20 text-pearl-300 hover:text-gold-400 text-[10px]"
                          title="Set as Default"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeAddress(addr.addressId)}
                        className="p-1 rounded bg-obsidian-950 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[10px]"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-pearl-300">
                    {addr.houseNumber || addr.houseNo}, {addr.street}{addr.landmark ? `, Near ${addr.landmark}` : ''}, {addr.area || addr.locality}, {addr.city}, {addr.state} - {addr.pinCode}
                  </p>
                  <p className="text-[10px] text-pearl-400 font-mono">
                    Phone: {addr.phone || addr.mobileNumber}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order History Brief */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-pearl-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-gold-400" />
              <span>My Orders ({orders.length})</span>
            </h4>
            {orders.length > 0 && (
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsTrackingOpen(true);
                }}
                className="text-[11px] text-gold-400 hover:underline font-serif"
              >
                Track Orders →
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto">
            {orders.length === 0 ? (
              <p className="p-3 rounded-xl bg-obsidian-900/40 text-pearl-400 text-center italic">No orders placed yet.</p>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/10 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-gold-300 block">{ord.id}</span>
                    <span className="text-[10px] text-pearl-300">{ord.date}</span>
                  </div>
                  <span className="font-serif font-bold text-emerald-400">{formatPrice(ord.amountUSD)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Logout Action */}
        <div className="pt-3 border-t border-gold-500/20 flex justify-between items-center">
          <span className="text-[10px] text-pearl-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Authenticated Session</span>
          </span>

          <button
            onClick={() => {
              setIsProfileOpen(false);
              logoutUser();
            }}
            className="px-5 py-2 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900 hover:text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Session</span>
          </button>
        </div>

      </div>
    </div>
  );
}
