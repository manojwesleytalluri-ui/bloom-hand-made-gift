import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateInvoice } from '../../utils/invoiceGenerator';
import { X, CheckCircle2, Clock, MapPin, Truck, ShieldCheck, Download, Package, ChevronDown } from 'lucide-react';

export default function OrderTrackingModal() {
  const { isTrackingOpen, setIsTrackingOpen, orders, activeTrackingOrder, setActiveTrackingOrder, formatPrice } = useApp();

  if (!isTrackingOpen) return null;

  // Determine current active order (either user selected or latest created order)
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

        {/* Header & Order Switcher Dropdown */}
        <div className="border-b border-gold-500/20 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">
                Live VIP Order Tracking
              </span>
              <h3 className="font-serif font-bold text-xl text-pearl-50">
                Order #{currentOrder ? currentOrder.id : 'BLM-889421'}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold font-serif animate-pulse">
              {currentOrder ? (currentOrder.status || 'In Preparation') : 'In Preparation'}
            </span>
          </div>

          {/* Order Switcher if user has multiple orders */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-pearl-300 font-serif">Select Order:</span>
              <select
                value={currentOrder?.id || ''}
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
        {currentOrder && (
          <div className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-gold-500/20 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-pearl-300">Recipient:</span>
              <span className="font-bold text-pearl-100">{currentOrder.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pearl-300">Delivery Address:</span>
              <span className="font-bold text-pearl-100 truncate max-w-[220px]">{currentOrder.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pearl-300">Total Investment:</span>
              <span className="font-bold text-gold-300 font-serif">
                {formatPrice(currentOrder.amountUSD || 450)}
              </span>
            </div>
          </div>
        )}

        {/* Timeline Stages */}
        <div className="space-y-3.5 relative py-1">
          {trackingStages.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.status === 'completed'
                      ? 'bg-gold-500 text-obsidian-950'
                      : step.status === 'active'
                      ? 'bg-emerald-500 text-pearl-50 animate-pulse ring-4 ring-emerald-500/20'
                      : 'bg-obsidian-900 border border-gold-500/20 text-pearl-400'
                  }`}
                >
                  {step.status === 'completed' ? '✓' : idx + 1}
                </div>
                {idx < trackingStages.length - 1 && <div className="w-0.5 h-6 bg-gold-500/20 my-1"></div>}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-serif font-bold ${step.status === 'active' ? 'text-gold-300' : 'text-pearl-100'}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-pearl-400">{step.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Driver & Delivery Concierge Card */}
        <div className="p-4 rounded-2xl bg-obsidian-900 border border-gold-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-serif font-bold text-pearl-50 block">Concierge Vehicle #7</span>
              <span className="text-[10px] text-pearl-400">Driver: Jean-Paul (Uniformed VIP White-Glove)</span>
            </div>
          </div>
          <span className="text-xs font-serif font-bold text-gold-400 bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20">
            ETA: 20 Mins
          </span>
        </div>

        {/* Action Buttons */}
        {currentOrder && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => generateInvoice(currentOrder)}
              className="px-5 py-2.5 rounded-full bg-obsidian-900 border border-gold-400/40 text-gold-300 font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gold-500/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Tax Invoice</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
