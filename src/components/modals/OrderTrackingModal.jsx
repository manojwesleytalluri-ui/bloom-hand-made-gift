import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, Clock, MapPin, Truck, ShieldCheck } from 'lucide-react';

export default function OrderTrackingModal() {
  const { isTrackingOpen, setIsTrackingOpen } = useApp();

  if (!isTrackingOpen) return null;

  const timelineSteps = [
    { title: 'Order Placed & Payment Verified', time: '14:20 PM', status: 'completed' },
    { title: 'Handcrafted by Master Floral Architect', time: '14:45 PM', status: 'completed' },
    { title: 'Quality & Temperature Control Inspection', time: '15:10 PM', status: 'active' },
    { title: 'Out for VIP White-Glove Hand Delivery', time: 'Est. 15:40 PM', status: 'upcoming' },
    { title: 'Delivered with Wax Seal Letter', time: 'Est. 16:00 PM', status: 'upcoming' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel border border-gold-500/40 rounded-3xl max-w-lg w-full p-8 relative space-y-6 shadow-gold-lg">
        <button onClick={() => setIsTrackingOpen(false)} className="absolute top-4 right-4 text-pearl-300 hover:text-gold-400">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between border-b border-gold-500/20 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">Live VIP Order Status</span>
            <h3 className="font-serif font-bold text-xl text-pearl-50">Order #BLM-889421</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400 text-gold-300 text-xs font-bold font-serif">
            In Preparation
          </span>
        </div>

        {/* Timeline */}
        <div className="space-y-4 relative py-2">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.status === 'completed'
                      ? 'bg-gold-500 text-obsidian-950'
                      : step.status === 'active'
                      ? 'bg-emerald-600 text-pearl-50 animate-pulse'
                      : 'bg-obsidian-900 border border-gold-500/20 text-pearl-400'
                  }`}
                >
                  {step.status === 'completed' ? '✓' : idx + 1}
                </div>
                {idx < timelineSteps.length - 1 && <div className="w-0.5 h-8 bg-gold-500/20 my-1"></div>}
              </div>

              <div>
                <h4 className={`text-xs font-serif font-bold ${step.status === 'active' ? 'text-gold-300' : 'text-pearl-100'}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-pearl-400">{step.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Courier Map Info Box */}
        <div className="p-4 rounded-2xl bg-obsidian-900 border border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-serif font-bold text-pearl-50 block">Concierge Vehicle #7</span>
              <span className="text-[10px] text-pearl-400">Driver: Jean-Paul (Uniformed VIP Service)</span>
            </div>
          </div>
          <span className="text-xs font-serif font-bold text-gold-400">ETA: 20 Mins</span>
        </div>

      </div>
    </div>
  );
}
