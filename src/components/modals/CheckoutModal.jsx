import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { X, CreditCard, Calendar, Truck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotalUSD,
    formatPrice,
    setIsTrackingOpen,
    addOrder
  } = useApp();

  const [step, setStep] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('2026-07-26');
  const [timeSlot, setTimeSlot] = useState('VIP 2-Hour Express (14:00 - 16:00)');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isCheckoutOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f3e5ab', '#0b4635', '#ffffff']
    });
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedId = `BLM-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newOrder = {
        id: generatedId,
        client: 'Lady Eleanor Vance',
        product: cart.map(item => `${item.name} (x${item.quantity})`).join(', '),
        amountUSD: cartTotalUSD,
        date: deliveryDate,
        timeSlot: timeSlot,
        status: 'In Preparation',
        location: '740 Fifth Avenue, Penthouse 42B, New York, NY'
      };
      
      addOrder(newOrder);
      setOrderId(generatedId);
      setStep(3);
      triggerConfetti();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel border border-gold-500/40 rounded-3xl max-w-xl w-full p-8 relative space-y-6 shadow-gold-lg max-h-[90vh] overflow-y-auto">
        <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-pearl-300 hover:text-gold-400">
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-3 border-b border-gold-500/20 pb-4">
          <span className={`text-xs font-serif font-bold ${step === 1 ? 'text-gold-400' : 'text-pearl-400'}`}>
            1. Delivery & Date
          </span>
          <span className="text-pearl-500">→</span>
          <span className={`text-xs font-serif font-bold ${step === 2 ? 'text-gold-400' : 'text-pearl-400'}`}>
            2. Sovereign Payment
          </span>
          <span className="text-pearl-500">→</span>
          <span className={`text-xs font-serif font-bold ${step === 3 ? 'text-gold-400' : 'text-pearl-400'}`}>
            3. Confirmation
          </span>
        </div>

        {/* Step 1: Delivery Address & Date Picker */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-xl text-pearl-50">Delivery Address & Date</h3>
            
            <div className="space-y-2">
              <label className="text-xs text-pearl-300 block">Recipient Address:</label>
              <input
                type="text"
                defaultValue="740 Fifth Avenue, Penthouse 42B, New York, NY"
                className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-xs text-pearl-100 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-pearl-300 block">Delivery Date:</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-xs text-pearl-100 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-pearl-300 block">VIP Time Window:</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-xs text-pearl-100 outline-none"
                >
                  <option>VIP 2-Hour Express (14:00 - 16:00)</option>
                  <option>Morning Gala Slot (09:00 - 11:00)</option>
                  <option>Sunset Champagne Delivery (18:00 - 20:00)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-gold-500/20">
              <span className="font-serif font-bold text-lg text-gold-gradient">
                {formatPrice(cartTotalUSD)}
              </span>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-xl text-pearl-50">Select Sovereign Payment Method</h3>

            <div className="grid grid-cols-2 gap-3">
              {['Credit Card', 'Apple Pay', 'Wire Transfer', 'UPI Instant'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3.5 rounded-2xl border text-xs font-serif font-bold text-left transition-all ${
                    paymentMethod === method
                      ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-gold-sm'
                      : 'bg-obsidian-900 border-gold-500/20 text-pearl-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {paymentMethod === 'Credit Card' && (
              <div className="space-y-2 pt-2">
                <input
                  type="text"
                  placeholder="Card Number: 4532 •••• •••• 8892"
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-xs text-pearl-100 outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-xs text-pearl-100 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-xs text-pearl-100 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center border-t border-gold-500/20">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-pearl-300 hover:text-gold-400 font-serif"
              >
                ← Back to Address
              </button>
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="px-8 py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm"
              >
                {isProcessing ? 'Processing Transaction...' : `Pay ${formatPrice(cartTotalUSD)}`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Confirmation */}
        {step === 3 && (
          <div className="text-center space-y-4 py-4 animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-gold-400 mx-auto animate-bounce" />
            <h3 className="font-serif font-bold text-2xl text-pearl-50">Acquisition Confirmed!</h3>
            <p className="text-xs text-pearl-200">
              Order ID: <strong className="text-gold-400">{orderId}</strong>
            </p>
            <p className="text-xs text-pearl-300/80 font-light max-w-sm mx-auto">
              Your floral arrangement has been assigned to our Master Floral Designer. VIP White-Glove hand delivery is scheduled for <strong>{deliveryDate}</strong>.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsTrackingOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest"
              >
                Track Live Order →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
