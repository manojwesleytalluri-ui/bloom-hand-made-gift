import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { validateBhimavaramDelivery } from '../../utils/bhimavaramDeliveryData';
import { generateInvoice } from '../../utils/invoiceGenerator';
import { verifyPaymentResponse } from '../../utils/paymentVerificationEngine';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Calendar,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Building,
  MapPin,
  QrCode,
  Download,
  Clock,
  Sparkles,
  Lock,
  FileText,
  BadgeCheck
} from 'lucide-react';

// Input sanitization helper to protect against XSS
const sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    cartTotalUSD,
    formatPrice,
    setIsTrackingOpen,
    addOrder,
    activeCheckoutAddress,
    setActiveCheckoutAddress
  } = useApp();

  // Multi-step state: 1 = Address & PIN, 2 = Order Summary, 3 = Payment Method, 4 = Confirmation
  const [step, setStep] = useState(1);

  // Address Form State - STARTS COMPLETELY EMPTY
  const [form, setForm] = useState({
    fullName: activeCheckoutAddress?.fullName || '',
    mobileNumber: activeCheckoutAddress?.mobileNumber || '',
    email: activeCheckoutAddress?.email || '',
    houseNo: activeCheckoutAddress?.houseNo || '',
    street: activeCheckoutAddress?.street || '',
    locality: activeCheckoutAddress?.locality || '',
    landmark: activeCheckoutAddress?.landmark || '',
    city: activeCheckoutAddress?.city || '',
    state: activeCheckoutAddress?.state || '',
    pinCode: activeCheckoutAddress?.pinCode || '',
    country: 'India',
    deliveryInstructions: activeCheckoutAddress?.deliveryInstructions || '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [pinStatus, setPinStatus] = useState({ isEligible: false, message: '', estimatedTime: '' });

  // Delivery slot selection
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('VIP 2-Hour Express (14:00 - 16:00)');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Paytm Official Gateway');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showPaytmModal, setShowPaytmModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Sync form with activeCheckoutAddress and run delivery check when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      setPaymentError('');
      setIsProcessing(false);
      setShowPaytmModal(false);
      setShowRazorpayModal(false);

      if (form.pinCode || form.locality || form.city) {
        const check = validateBhimavaramDelivery(form.pinCode, form.locality, form.city);
        setPinStatus({
          isEligible: check.isEligible,
          message: check.isEligible
            ? 'Delivery is available at your address.'
            : 'Sorry! Delivery is currently available only in Bhimavaram and surrounding service areas.',
          estimatedTime: check.estimatedTime
        });
      } else {
        setPinStatus({
          isEligible: false,
          message: 'Please enter your PIN Code and Area / Locality to check delivery availability.',
          estimatedTime: ''
        });
      }
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  // Handle Form Inputs with Real-Time Address Validation
  const handleInputChange = (field, value) => {
    const sanitizedVal = sanitize(value);
    const updatedForm = { ...form, [field]: sanitizedVal };
    setForm(updatedForm);

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }

    if (['pinCode', 'locality', 'city', 'street'].includes(field)) {
      const cleanPin = field === 'pinCode' ? sanitizedVal : updatedForm.pinCode;
      const cleanLocality = field === 'locality' ? sanitizedVal : updatedForm.locality;
      const cleanCity = field === 'city' ? sanitizedVal : updatedForm.city;

      if (!cleanPin && !cleanLocality && !cleanCity) {
        setPinStatus({
          isEligible: false,
          message: 'Please enter your PIN Code and Area / Locality to check delivery availability.',
          estimatedTime: ''
        });
      } else {
        const check = validateBhimavaramDelivery(cleanPin, cleanLocality, cleanCity);
        setPinStatus({
          isEligible: check.isEligible,
          message: check.isEligible
            ? 'Delivery is available at your address.'
            : 'Sorry! Delivery is currently available only in Bhimavaram and surrounding service areas.',
          estimatedTime: check.estimatedTime
        });

        if (check.isEligible) {
          setForm((prev) => ({
            ...prev,
            city: prev.city || 'Bhimavaram',
            state: prev.state || 'Andhra Pradesh'
          }));
        }
      }
    }
  };

  // Validate Shipping Address Form
  const validateForm = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!form.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required';
    } else if (!/^[6-9]\d{9}$/.test(form.mobileNumber.trim())) {
      errors.mobileNumber = 'Enter a valid 10-digit Indian mobile number';
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    if (!form.houseNo.trim()) errors.houseNo = 'House / Flat Number is required';
    if (!form.street.trim()) errors.street = 'Street / Road is required';
    if (!form.locality.trim()) errors.locality = 'Area / Locality is required';
    if (!form.city.trim()) errors.city = 'City / Town is required';
    if (!form.state.trim()) errors.state = 'State is required';
    if (!form.pinCode.trim()) errors.pinCode = 'PIN Code is required';

    const check = validateBhimavaramDelivery(form.pinCode, form.locality, form.city);
    if (!check.isEligible) {
      errors.pinCode = 'Delivery is not available at this address.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0 && check.isEligible;
  };

  const handleNextFromAddress = () => {
    if (!validateForm()) return;
    setActiveCheckoutAddress(form);
    setStep(2);
  };

  // Confetti Animation Trigger
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f3e5ab', '#0b4635', '#ffffff']
      });
    } catch (e) {
      // fallback
    }
  };

  // Helper to finalize order ONLY AFTER VERIFIED PAYMENT
  const finalizeOrderSuccess = (txnId, gatewayName = paymentMethod) => {
    setIsProcessing(true);
    setPaymentError('');

    setTimeout(() => {
      setIsProcessing(false);
      setShowPaytmModal(false);
      setShowRazorpayModal(false);

      const generatedId = `BLM-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder = {
        id: generatedId,
        client: form.fullName,
        customerInfo: {
          fullName: form.fullName,
          mobileNumber: form.mobileNumber,
          email: form.email
        },
        address: {
          flat: form.houseNo,
          street: form.street,
          locality: form.locality,
          landmark: form.landmark,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
          country: form.country,
          deliveryInstructions: form.deliveryInstructions
        },
        items: cart.length > 0 ? cart : [
          {
            id: 'bouq-1',
            name: 'The Imperial Grand Velvet Roses',
            quantity: 1,
            priceUSD: 450,
            variant: '100 Ecuadorian Stems in Black Velvet Box'
          }
        ],
        amountUSD: cartTotalUSD || 450,
        paymentMethod: gatewayName,
        paymentId: txnId,
        date: deliveryDate,
        timeSlot: timeSlot,
        status: 'Order Placed & Payment Confirmed',
        location: `${form.houseNo}, ${form.street}, ${form.locality}, ${form.city}, ${form.state} - ${form.pinCode}`,
        createdAt: new Date().toISOString()
      };

      addOrder(newOrder);
      setCreatedOrder(newOrder);
      clearCart();
      setStep(4);
      triggerConfetti();
    }, 1000);
  };

  // Payment Handler
  const handleInitiatePayment = () => {
    const check = validateBhimavaramDelivery(form.pinCode, form.locality, form.city);
    if (!check.isEligible) {
      setPaymentError('❌ Delivery Not Available: Sorry! Delivery is not available at this address.');
      return;
    }

    setPaymentError('');

    if (paymentMethod === 'Paytm Official Gateway') {
      setShowPaytmModal(true);
      return;
    }

    if (paymentMethod === 'Razorpay Gateway') {
      setShowRazorpayModal(true);
      return;
    }

    // Direct Payment simulation for UPI / Card
    setIsProcessing(true);
    setTimeout(() => {
      const verification = verifyPaymentResponse(paymentMethod, { status: 'SUCCESS' }, cartTotalUSD || 450);
      if (verification.isVerified && verification.status === 'SUCCESS') {
        finalizeOrderSuccess(verification.transactionId, paymentMethod);
      } else {
        setIsProcessing(false);
        setPaymentError(verification.message);
      }
    }, 1200);
  };

  // Handling Paytm Gateway Simulation Callback Responses
  const handlePaytmSimulate = (testStatus) => {
    setIsProcessing(true);
    setShowPaytmModal(false);

    setTimeout(() => {
      setIsProcessing(false);

      if (testStatus === 'SUCCESS') {
        const payload = {
          ORDERID: `BLM-${Date.now()}`,
          TXNID: `PAYTM-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          STATUS: 'TXN_SUCCESS',
          CHECKSUMHASH: 'PAYTM_HMAC_SHA256_VALID_CHECKSUM_TOKEN_88421'
        };
        const verification = verifyPaymentResponse('Paytm Official Gateway', payload, cartTotalUSD || 450);
        if (verification.isVerified) {
          finalizeOrderSuccess(verification.transactionId, 'Paytm Official Gateway');
        } else {
          setPaymentError(verification.message);
        }
      } else if (testStatus === 'FAILED') {
        const verification = verifyPaymentResponse('Paytm Official Gateway', { status: 'FAILED' }, cartTotalUSD || 450);
        setPaymentError(`❌ ${verification.message}`);
      } else if (testStatus === 'CANCELLED') {
        const verification = verifyPaymentResponse('Paytm Official Gateway', { status: 'CANCELLED' }, cartTotalUSD || 450);
        setPaymentError(`⚠️ ${verification.message}`);
      } else if (testStatus === 'PENDING') {
        const verification = verifyPaymentResponse('Paytm Official Gateway', { status: 'PENDING' }, cartTotalUSD || 450);
        setPaymentError(`⏳ ${verification.message}`);
      }
    }, 1000);
  };

  const handleRazorpaySimulateSuccess = () => {
    const verification = verifyPaymentResponse('Razorpay Gateway', { status: 'SUCCESS' }, cartTotalUSD || 450);
    finalizeOrderSuccess(verification.transactionId, 'Razorpay Gateway');
  };

  const handleRazorpaySimulateFailure = () => {
    setIsProcessing(false);
    setShowRazorpayModal(false);
    const verification = verifyPaymentResponse('Razorpay Gateway', { status: 'FAILED' }, cartTotalUSD || 450);
    setPaymentError(`❌ ${verification.message}`);
  };

  const handleRazorpayCancel = () => {
    setIsProcessing(false);
    setShowRazorpayModal(false);
    const verification = verifyPaymentResponse('Razorpay Gateway', { status: 'CANCELLED' }, cartTotalUSD || 450);
    setPaymentError(`⚠️ ${verification.message}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="glass-panel border border-gold-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-8 relative space-y-6 shadow-gold-lg my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Top Header & Close */}
        <div className="flex items-center justify-between border-b border-gold-500/20 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-pearl-50">
                Bloom Luxury Checkout
              </h2>
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider block">
                🌸 Secure Verification & Manual Address Form
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full bg-obsidian-900 border border-gold-500/30 text-pearl-300 hover:text-gold-400 transition-colors"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-between px-2 sm:px-6">
          {[
            { num: 1, label: 'Shipping Address' },
            { num: 2, label: 'Order Summary' },
            { num: 3, label: 'Sovereign Payment' },
            { num: 4, label: 'Confirmation' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-serif font-bold transition-all ${
                  step === s.num
                    ? 'bg-gold-gradient text-obsidian-950 shadow-gold-sm scale-110'
                    : step > s.num
                    ? 'bg-emerald-600 text-pearl-50'
                    : 'bg-obsidian-900 border border-gold-500/30 text-pearl-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span
                className={`hidden md:inline text-[11px] font-serif font-medium ${
                  step === s.num ? 'text-gold-300' : 'text-pearl-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* STEP 1: MANUAL SHIPPING ADDRESS FORM                       */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-pearl-50 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>Enter Recipient Delivery Address</span>
              </h3>
              <span className="text-[11px] text-pearl-400">* Required Fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full bg-obsidian-900 border ${
                    formErrors.fullName ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
                />
                {formErrors.fullName && <p className="text-[10px] text-red-400 mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Mobile Number *</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={form.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className={`w-full bg-obsidian-900 border ${
                    formErrors.mobileNumber ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
                />
                {formErrors.mobileNumber && <p className="text-[10px] text-red-400 mt-1">{formErrors.mobileNumber}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full bg-obsidian-900 border ${
                    formErrors.email ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
                />
                {formErrors.email && <p className="text-[10px] text-red-400 mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">House / Flat Number *</label>
                <input
                  type="text"
                  placeholder="Enter house or flat number"
                  value={form.houseNo}
                  onChange={(e) => handleInputChange('houseNo', e.target.value)}
                  className={`w-full bg-obsidian-900 border ${
                    formErrors.houseNo ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
                />
                {formErrors.houseNo && <p className="text-[10px] text-red-400 mt-1">{formErrors.houseNo}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Street / Road *</label>
                <input
                  type="text"
                  placeholder="Enter street or road name"
                  value={form.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={`w-full bg-obsidian-900 border ${
                    formErrors.street ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
                />
                {formErrors.street && <p className="text-[10px] text-red-400 mt-1">{formErrors.street}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Area / Locality *</label>
                <input
                  type="text"
                  placeholder="Enter area or locality name"
                  value={form.locality}
                  onChange={(e) => handleInputChange('locality', e.target.value)}
                  className={`w-full bg-obsidian-900 border ${
                    form.locality && !pinStatus.isEligible
                      ? 'border-red-500 text-red-200'
                      : form.locality && pinStatus.isEligible
                      ? 'border-emerald-500 text-emerald-200'
                      : formErrors.locality
                      ? 'border-red-500'
                      : 'border-gold-500/30'
                  } rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
                />
                {formErrors.locality && <p className="text-[10px] text-red-400 mt-1">{formErrors.locality}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter nearby landmark"
                  value={form.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-pearl-200 font-bold block mb-1">PIN Code *</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={form.pinCode}
                  onChange={(e) => handleInputChange('pinCode', e.target.value)}
                  className={`w-full bg-obsidian-900 border ${
                    form.pinCode && !pinStatus.isEligible
                      ? 'border-red-500 text-red-300 font-bold'
                      : form.pinCode && pinStatus.isEligible
                      ? 'border-emerald-500 text-emerald-300 font-bold'
                      : formErrors.pinCode
                      ? 'border-red-500'
                      : 'border-gold-500/30'
                  } rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
                />
                {formErrors.pinCode && <p className="text-[10px] text-red-400 mt-1">{formErrors.pinCode}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">City / Town *</label>
                <input
                  type="text"
                  placeholder="Enter city or town"
                  value={form.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full bg-obsidian-900 border ${
                    formErrors.city ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
                />
                {formErrors.city && <p className="text-[10px] text-red-400 mt-1">{formErrors.city}</p>}
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">State *</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={form.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`w-full bg-obsidian-900 border ${
                    formErrors.state ? 'border-red-500' : 'border-gold-500/30'
                  } rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors`}
                />
                {formErrors.state && <p className="text-[10px] text-red-400 mt-1">{formErrors.state}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-pearl-300 block mb-1 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gold-400" />
                  <span>Delivery Instructions (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter any special delivery notes or gate entry codes"
                  value={form.deliveryInstructions}
                  onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 transition-colors text-xs resize-none"
                />
              </div>

              {/* Live Delivery Eligibility Banner */}
              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-obsidian-900/90 border border-gold-500/20 space-y-2">
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs transition-colors ${
                    pinStatus.isEligible
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                      : form.pinCode || form.locality
                      ? 'bg-red-950/70 border-red-500/50 text-red-300'
                      : 'bg-obsidian-950 border-gold-500/20 text-pearl-300'
                  }`}
                >
                  {pinStatus.isEligible ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : form.pinCode || form.locality ? (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-xs sm:text-sm">{pinStatus.message}</p>
                    {pinStatus.isEligible && (
                      <p className="text-[11px] text-emerald-200/90 mt-0.5 font-serif">
                        🚀 {pinStatus.estimatedTime || 'Same-Day Hand Delivery in 45-90 Minutes.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Preferred Hand-Delivery Date:</label>
                <input
                  type="date"
                  value={deliveryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-pearl-100 outline-none"
                />
              </div>

              <div>
                <label className="text-pearl-300 block mb-1 font-medium">Express Slot:</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-pearl-100 outline-none"
                >
                  <option>VIP 2-Hour Express (14:00 - 16:00)</option>
                  <option>Morning Fresh Flowers (09:00 - 11:00)</option>
                  <option>Evening Sunset Hand Delivery (18:00 - 20:00)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gold-500/20">
              <div>
                <span className="text-[10px] text-pearl-400 uppercase tracking-widest block">Total Investment</span>
                <span className="font-serif font-bold text-xl text-gold-gradient">
                  {formatPrice(cartTotalUSD || 450)}
                </span>
              </div>

              <button
                onClick={handleNextFromAddress}
                disabled={!pinStatus.isEligible}
                className={`px-6 py-3 rounded-full font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                  pinStatus.isEligible
                    ? 'bg-gold-gradient text-obsidian-950 shadow-gold-sm hover:scale-[1.02]'
                    : 'bg-obsidian-900 border border-red-500/40 text-red-400 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{pinStatus.isEligible ? 'Continue to Summary' : 'Delivery Not Available'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: ORDER SUMMARY & REVIEW                            */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif font-bold text-base sm:text-lg text-pearl-50">Review Your Luxury Acquisition</h3>

            <div className="p-3.5 rounded-2xl bg-obsidian-900 border border-gold-500/20 flex items-start justify-between text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-widest block">Entered Delivery Address</span>
                <p className="font-serif font-bold text-pearl-100">{form.fullName} ({form.mobileNumber})</p>
                <p className="text-pearl-300">
                  {form.houseNo}, {form.street}, {form.locality}, {form.city}, {form.state} - {form.pinCode}
                </p>
                {form.deliveryInstructions && (
                  <p className="text-[11px] text-pearl-400 italic">Notes: "{form.deliveryInstructions}"</p>
                )}
                <p className="text-[11px] text-gold-300/80">
                  Date: {deliveryDate} | Slot: {timeSlot}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-[11px] text-gold-400 hover:underline font-serif"
              >
                Edit
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {(cart.length > 0 ? cart : [
                {
                  id: 'bouq-1',
                  name: 'The Imperial Grand Velvet Roses',
                  quantity: 1,
                  priceUSD: 450,
                  variant: '100 Ecuadorian Stems in Black Velvet Box'
                }
              ]).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-obsidian-900/60 border border-gold-500/10 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-serif font-bold text-pearl-100">{item.name}</h4>
                    <p className="text-[10px] text-gold-400">{item.variant}</p>
                    <span className="text-[11px] text-pearl-300">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-serif font-bold text-gold-300">
                    {formatPrice((item.priceUSD || 450) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900 border border-gold-500/20 space-y-2 text-xs">
              <div className="flex justify-between text-pearl-300">
                <span>Items Subtotal:</span>
                <span>{formatPrice(cartTotalUSD || 450)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>VIP Express Delivery:</span>
                <span className="font-bold uppercase">Complimentary</span>
              </div>
              <div className="flex justify-between text-pearl-300">
                <span>GST (18% Luxury Tax):</span>
                <span>{formatPrice((cartTotalUSD || 450) * 0.18)}</span>
              </div>
              <div className="pt-2 border-t border-gold-500/20 flex justify-between font-serif font-bold text-base text-gold-gradient">
                <span>Grand Total:</span>
                <span>{formatPrice((cartTotalUSD || 450) * 1.18)}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gold-500/20">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-pearl-300 hover:text-gold-400 flex items-center gap-1 font-serif"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Address</span>
              </button>

              <button
                onClick={() => setStep(3)}
                disabled={!pinStatus.isEligible}
                className="px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-gold-sm hover:scale-[1.02] transition-transform"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: SOVEREIGN PAYMENT METHODS & VERIFICATION          */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-pearl-50">Select Payment Method</h3>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
              </span>
            </div>

            {paymentError && (
              <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{paymentError}</p>
                  <p className="text-[10px] text-pearl-300 mt-0.5">Please try again or select a different payment option below.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'Paytm Official Gateway', title: 'Paytm Gateway', icon: BadgeCheck, badge: 'Official VIP' },
                { id: 'Razorpay Gateway', title: 'Razorpay Gateway', icon: CreditCard },
                { id: 'UPI / GPay / PhonePe', title: 'UPI / Google Pay', icon: QrCode, badge: 'Instant' },
                { id: 'Credit / Debit Card', title: 'Credit / Debit Card', icon: CreditCard },
                { id: 'Net Banking', title: 'Net Banking', icon: Building },
                { id: 'Paytm & Wallets', title: 'Paytm & Wallets', icon: Smartphone },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      setPaymentError('');
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-gold-sm'
                        : 'bg-obsidian-900 border-gold-500/20 text-pearl-300 hover:border-gold-500/40'
                    }`}
                  >
                    {method.badge && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/40">
                        {method.badge}
                      </span>
                    )}
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-gold-400' : 'text-pearl-400'}`} />
                    <span className="font-serif font-bold text-xs block">{method.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900 border border-gold-500/20 space-y-3">
              {paymentMethod === 'Paytm Official Gateway' && (
                <div className="space-y-2 text-xs">
                  <p className="text-pearl-200 font-serif">
                    Official Paytm Payment Gateway with server-side HMAC-SHA256 checksum verification.
                  </p>
                  <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-400/30 text-gold-300 text-[11px]">
                    🔒 Clicking "Pay Now" opens the Paytm Checksum verification simulation. Test Paytm Verified Success, Paytm Declined, or Cancelled.
                  </div>
                </div>
              )}

              {paymentMethod === 'Razorpay Gateway' && (
                <div className="space-y-2 text-xs">
                  <p className="text-pearl-200 font-serif">
                    Supports Razorpay Checkout, all major Credit/Debit Cards, International Cards, UPI, and Net Banking.
                  </p>
                  <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-400/30 text-gold-300 text-[11px]">
                    🔒 Clicking "Pay Now" will open the secure Razorpay payment simulation modal where you can test payment success, card decline, or cancellation.
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI / GPay / PhonePe' && (
                <div className="space-y-2 text-xs">
                  <label className="text-pearl-300 block font-medium">Enter your Virtual Payment Address (VPA / UPI ID):</label>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400 font-mono"
                  />
                  <p className="text-[10px] text-pearl-400">Google Pay, PhonePe, Paytm UPI & BHIM supported.</p>
                </div>
              )}

              {paymentMethod === 'Credit / Debit Card' && (
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-pearl-300 block mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="Enter card number"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-obsidian-950 border border-gold-500/30 rounded-xl p-2.5 text-pearl-100 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-pearl-300 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-obsidian-950 border border-gold-500/30 rounded-xl p-2.5 text-pearl-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-pearl-300 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="CVC"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        className="w-full bg-obsidian-950 border border-gold-500/30 rounded-xl p-2.5 text-pearl-100 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Net Banking' && (
                <div className="space-y-2 text-xs">
                  <label className="text-pearl-300 block">Select Popular Indian Bank:</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded-xl p-2.5 text-pearl-100 outline-none font-serif"
                  >
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'Paytm & Wallets' && (
                <div className="space-y-2 text-xs">
                  <label className="text-pearl-300 block">Select Preferred Wallet:</label>
                  <select
                    value={selectedWallet}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded-xl p-2.5 text-pearl-100 outline-none font-serif"
                  >
                    <option>Paytm Wallet</option>
                    <option>Amazon Pay</option>
                    <option>Mobikwik</option>
                    <option>PhonePe Wallet</option>
                  </select>
                </div>
              )}

            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gold-500/20">
              <button
                onClick={() => setStep(2)}
                disabled={isProcessing}
                className="text-xs text-pearl-300 hover:text-gold-400 flex items-center gap-1 font-serif"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Summary</span>
              </button>

              <button
                onClick={handleInitiatePayment}
                disabled={isProcessing || !pinStatus.isEligible}
                className={`px-8 py-3.5 rounded-full font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm transition-all ${
                  pinStatus.isEligible
                    ? 'bg-gold-gradient text-obsidian-950 hover:scale-[1.02]'
                    : 'bg-obsidian-900 text-red-400 cursor-not-allowed border border-red-500/30'
                }`}
              >
                {isProcessing
                  ? 'Verifying Checksum & Processing Payment...'
                  : `Pay ${formatPrice((cartTotalUSD || 450) * 1.18)}`}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: ORDER CONFIRMATION & TAX INVOICE DOWNLOAD        */}
        {/* ========================================================= */}
        {step === 4 && createdOrder && (
          <div className="text-center space-y-5 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-gold-400 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Acquisition Successful</span>
              <h3 className="font-serif font-bold text-2xl text-pearl-50">✅ Thank you for your order!</h3>
              <p className="text-xs text-pearl-200">
                Order Number: <strong className="text-gold-400 font-mono text-sm">{createdOrder.id}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900 border border-gold-500/20 text-left text-xs space-y-2 max-w-lg mx-auto">
              <div className="flex justify-between border-b border-gold-500/10 pb-2">
                <span className="text-pearl-300">Delivery Window:</span>
                <span className="font-bold text-gold-300">{createdOrder.date} ({createdOrder.timeSlot})</span>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 pb-2">
                <span className="text-pearl-300">Shipping Address:</span>
                <span className="font-bold text-pearl-100 text-right truncate max-w-[200px]">{createdOrder.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pearl-300">Payment Status:</span>
                <span className="font-bold text-emerald-400">SUCCESS ({createdOrder.paymentId})</span>
              </div>
            </div>

            <p className="text-xs text-pearl-300/80 max-w-md mx-auto">
              Your luxury arrangement has been assigned to our Master Floral Architect for crafting and immediate delivery.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => generateInvoice(createdOrder)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-obsidian-900 border border-gold-400 text-gold-300 font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gold-500/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
              </button>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsTrackingOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-sm hover:scale-[1.02] transition-transform"
              >
                <span>Track Order Live</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* SIMULATED PAYTM OFFICIAL GATEWAY MODAL POPUP */}
      {showPaytmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-2xl animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white relative">
            <button
              onClick={() => {
                setShowPaytmModal(false);
                setIsProcessing(false);
                setPaymentError('❌ Paytm Payment Unconfirmed: Order was NOT placed. Please try payment again.');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Close & Cancel Payment"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-700 pb-3 pr-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-xs text-white">
                  Paytm
                </div>
                <div>
                  <h4 className="font-bold text-sm">Paytm Official Gateway</h4>
                  <p className="text-[10px] text-slate-400">Merchant: Bloom Luxury Florist Pvt Ltd</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                ₹{Math.round((cartTotalUSD || 450) * 1.18 * 83).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>Select Paytm response simulation:</p>

              <div className="space-y-2">
                <button
                  onClick={() => handlePaytmSimulate('SUCCESS')}
                  className="w-full p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-between transition-colors shadow-lg"
                >
                  <span>Paytm Verified Success ✅</span>
                  <span>(Pay & Place Order)</span>
                </button>

                <button
                  onClick={() => handlePaytmSimulate('FAILED')}
                  className="w-full p-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold flex items-center justify-between transition-colors"
                >
                  <span>Paytm Payment Failed ❌</span>
                  <span>(Declined - No Order Placed)</span>
                </button>

                <button
                  onClick={() => handlePaytmSimulate('CANCELLED')}
                  className="w-full p-3 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white font-bold flex items-center justify-between transition-colors"
                >
                  <span>Paytm Cancelled ⚠️</span>
                  <span>(User Cancelled - No Order Placed)</span>
                </button>

                <button
                  onClick={() => handlePaytmSimulate('PENDING')}
                  className="w-full p-3 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold flex items-center justify-between transition-colors"
                >
                  <span>Paytm Pending ⏳</span>
                  <span>(Pending - No Order Placed)</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    setShowPaytmModal(false);
                    setIsProcessing(false);
                    setPaymentError('❌ Paytm Payment Cancelled: Order was NOT placed.');
                  }}
                  className="text-xs text-slate-400 hover:text-red-400 underline font-medium"
                >
                  Cancel Paytm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED RAZORPAY GATEWAY MODAL POPUP */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-2xl animate-fadeIn">
          <div className="bg-slate-900 border border-blue-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs">
                  RZP
                </div>
                <div>
                  <h4 className="font-bold text-sm">Razorpay Checkout Simulation</h4>
                  <p className="text-[10px] text-slate-400">Bloom Luxury Florist</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                ₹{Math.round((cartTotalUSD || 450) * 1.18 * 83).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>Test simulation controls for verifying checkout robustness:</p>

              <div className="space-y-2">
                <button
                  onClick={handleRazorpaySimulateSuccess}
                  className="w-full p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-between transition-colors"
                >
                  <span>Simulate Payment Success ✅</span>
                  <span>(TXN Approved)</span>
                </button>

                <button
                  onClick={handleRazorpaySimulateFailure}
                  className="w-full p-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold flex items-center justify-between transition-colors"
                >
                  <span>Simulate Payment Failure ❌</span>
                  <span>(Card Declined)</span>
                </button>

                <button
                  onClick={handleRazorpayCancel}
                  className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-between transition-colors"
                >
                  <span>Cancel Transaction ⚠️</span>
                  <span>(Close Popup)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
