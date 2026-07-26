import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, Sparkles, CheckCircle2, User, Phone, MapPin } from 'lucide-react';

export default function BookingModal() {
  const { isBookingOpen, setIsBookingOpen } = useApp();
  const [bookingDate, setBookingDate] = useState('2026-07-28');
  const [bookingTime, setBookingTime] = useState('14:00 PM');
  const [consultationType, setConsultationType] = useState('In-Person Flagship Atelier');
  const [occasion, setOccasion] = useState('Royal Wedding');
  const [isBooked, setIsBooked] = useState(false);

  if (!isBookingOpen) return null;

  const handleBook = (e) => {
    e.preventDefault();
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setIsBookingOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel border border-gold-500/40 rounded-3xl max-w-lg w-full p-8 relative space-y-6 shadow-gold-lg">
        <button onClick={() => setIsBookingOpen(false)} className="absolute top-4 right-4 text-pearl-300 hover:text-gold-400">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-pearl-50">Book VIP Floral Consultation</h3>
          <p className="text-xs text-pearl-300 font-light">Schedule a private session with our Master Floral Architect.</p>
        </div>

        {isBooked ? (
          <div className="p-6 rounded-2xl bg-gold-500/20 border border-gold-400 text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-gold-400 mx-auto" />
            <h4 className="font-serif font-bold text-lg text-pearl-50">Consultation Scheduled!</h4>
            <p className="text-xs text-pearl-200">
              Confirmed for <strong>{bookingDate}</strong> at <strong>{bookingTime}</strong> ({consultationType}).
            </p>
            <p className="text-[11px] text-gold-300">Your VIP Concierge confirmation reference is #CONF-9921.</p>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="text-xs text-pearl-300 block mb-1">Occasion / Event Type:</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-xs text-pearl-100 outline-none"
              >
                <option value="Royal Wedding">Royal Wedding & Grand Gala</option>
                <option value="Anniversary Monument">Anniversary Monument</option>
                <option value="Private Yacht Installation">Private Yacht / Estate Installation</option>
                <option value="Corporate Sovereign Gift">Corporate Sovereign Gift</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-pearl-300 block mb-1">Preferred Date:</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-xs text-pearl-100 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-pearl-300 block mb-1">Time Slot:</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-xs text-pearl-100 outline-none"
                >
                  <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                  <option value="14:00 PM">14:00 PM (Afternoon Slot)</option>
                  <option value="17:30 PM">17:30 PM (Evening Slot)</option>
                  <option value="20:00 PM">20:00 PM (VIP Private Sunset)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-pearl-300 block mb-1">Consultation Location / Format:</label>
              <div className="grid grid-cols-2 gap-2">
                {['In-Person Flagship Atelier', 'Private Video Call'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setConsultationType(fmt)}
                    className={`p-3 rounded-xl border text-xs text-center font-medium ${
                      consultationType === fmt ? 'bg-gold-500/20 border-gold-400 text-gold-300 font-bold' : 'bg-obsidian-900 border-gold-500/20 text-pearl-300'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-transform"
            >
              Confirm VIP Appointment Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
