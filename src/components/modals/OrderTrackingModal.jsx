import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateInvoice } from '../../utils/invoiceGenerator';
import { X, CheckCircle2, Clock, MapPin, Truck, ShieldCheck, Download, Package, ChevronDown, Lock } from 'lucide-react';

export default function OrderTrackingModal() {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    formatPrice,
    currentUser,
    setIsAuthOpen,
    setAuthMode
  } = useApp();

  if (!isTrackingOpen) return null;

  // Determine current active order for logged-in user
  const currentOrder = activeTrackingOrder || (orders.length > 0 ? orders[0] : null);

  const trackingStages = [
    { title: 'Order Placed', time: '14:20 PM', status: 'completed' },
    { title: 'Payment Confirmed', time: '14:21 PM', status: 'completed' },
    { title: 'Preparing Handmade Gift', time: '14:45 PM', status: 'active' },
    { title: 'Packed in Signature Box', time: 'Est. 15:15 PM', status: 'upcoming' },
    { title: 'Shipped from Atelier', time: 'Est. 15:35 PM', status: 'upcoming' },
    { title: 'Out for VIP White-Glove Delivery', time: 'Est. 15:45 PM', status: 'upcoming' },
    { title: 'Delivered to Recipient', time: 'Est. 16:00 PM', status: 'upcoming' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="glass-panel border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative space-y-6 shadow-gold-lg my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-obsidian-900 border border-gold-500/30 text-pearl-300 hover:text-gold-400 transition-colors"
          aria-label="Close Order Tracking"
        >
          <X className="w-5 h-5" />
        </button>

        {!currentOrder || orders.length === 0 ? (
          /* Clean empty state for new visitors and users with no orders */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-400">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-pearl-50">No Verified Orders Found</h3>
              <p className="text-xs text-pearl-300 font-light max-w-xs mx-auto">
                {currentUser
                  ? 'You have not placed any orders with this account yet.'
                  : 'Please sign in to your account to view your private order history and live delivery tracking.'}
              </p>
            </div>
            {!currentUser && (
              <button
                onClick={() => {
                  setIsTrackingOpen(false);
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
                className="px-6 py-2.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-transform"
              >
                Sign In to View Orders
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Header & Order Switcher Dropdown */}
            <div className="border-b border-gold-500/20 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">
                    Live VIP Order Tracking
                  </span>
                  <h3 className="font-serif font-bold text-xl text-pearl-50">
                    Order #{currentOrder.id}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold font-serif animate-pulse">
                  {currentOrder.status || 'In Preparation'}
                </span>
              </div>

              {/* Order Switcher if user has multiple orders */}
              {orders.length > 1 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-pearl-300 font-serif">Select Order:</span>
                  <select
                    value={currentOrder.id}
                    onChange={(e) => {
                      const selected = orders.find((o) => o.id === e.target.value);
                      if (selected) setActiveTrackingOrder(selected);
                    }}
                    className="bg-obsidian-900 border border-gold-500/30 rounded-xl px-3 py-1.5 text-xs text-gold-300 outline-none font-mono"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.client} ({o.date})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Order Details Brief Box */}
            <div className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-gold-500/20 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-pearl-300">Recipient:</span>
                <span className="font-bold text-pearl-100">{currentOrder.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pearl-300">Delivery Address:</span>
                <span className="font-bold text-pearl-100 truncate max-w-[200px]">{currentOrder.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pearl-300">Order Amount:</span>
                <span className="font-bold text-gold-gradient">{formatPrice(currentOrder.amountUSD)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pearl-300">Payment Ref:</span>
                <span className="font-mono text-emerald-400 text-[10px]">{currentOrder.paymentId}</span>
              </div>
            </div>

            {/* Timeline Stages */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-xs uppercase text-gold-400 tracking-wider">
                Live Status Roadmap
              </h4>

              <div className="relative pl-6 space-y-4 border-l-2 border-gold-500/30 ml-2">
                {trackingStages.map((stage, idx) => (
                  <div key={idx} className="relative flex items-center justify-between text-xs">
                    <div
                      className={`absolute -left-[31px] w-4 h-4 rounded-full border flex items-center justify-center ${
                        stage.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-400 text-obsidian-950'
                          : stage.status === 'active'
                          ? 'bg-gold-400 border-gold-300 text-obsidian-950 animate-pulse'
                          : 'bg-obsidian-900 border-gold-500/30 text-pearl-500'
                      }`}
                    >
                      {stage.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                    </div>

                    <span
                      className={`font-serif ${
                        stage.status === 'completed'
                          ? 'text-pearl-100 font-semibold'
                          : stage.status === 'active'
                          ? 'text-gold-300 font-bold'
                          : 'text-pearl-400 font-light'
                      }`}
                    >
                      {stage.title}
                    </span>

                    <span className="text-[10px] font-mono text-pearl-400">{stage.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Tax Invoice Button */}
            <button
              onClick={() => generateInvoice(currentOrder)}
              className="w-full py-3 rounded-2xl bg-obsidian-900 border border-gold-500/40 hover:border-gold-400 text-gold-300 font-serif font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-gold-sm"
            >
              <Download className="w-4 h-4 text-gold-400" />
              <span>Download Official VIP Tax Invoice (PDF)</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
