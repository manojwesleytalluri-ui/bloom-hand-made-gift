import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Sparkles, Clock } from 'lucide-react';

export default function LiveChatWidget() {
  const {
    isChatOpen,
    setIsChatOpen,
    setIsTrackingOpen,
    isBookingOpen,
    setIsBookingOpen,
    isCheckoutOpen,
    isAdminOpen
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'concierge',
      text: 'Good evening. Welcome to Bloom Hand Made Gift. How may our VIP Concierge assist your luxury floral needs today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat when history changes
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping, isChatOpen]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (isChatOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isChatOpen]);

  if (isCheckoutOpen || isAdminOpen || isBookingOpen) return null;

  const chatbotReplies = (query) => {
    const q = query.toLowerCase();
    if (q.includes('track') || q.includes('order')) {
      setTimeout(() => setIsTrackingOpen(true), 1200);
      return 'I can help you view your live order status right away! Opening the tracking window...';
    }
    if (q.includes('book') || q.includes('wedding') || q.includes('consult')) {
      setTimeout(() => setIsBookingOpen(true), 1200);
      return 'Opening our VIP Consultation Booking Desk for you now to schedule a private session...';
    }
    if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
      return 'Our signature collections start at ₹25,000 for our Premium Velvet Boxes and go up to ₹10,00,000 for bespoke grand wedding arrangements. VIP Hand Delivery is complimentary.';
    }
    if (q.includes('delivery') || q.includes('shipping')) {
      return 'We offer VIP White-Glove hand delivery in Bhimavaram, Paris, London, Dubai, and Mumbai. Same-day delivery is available for orders placed before 12:00 PM.';
    }
    if (q.includes('botanical') || q.includes('flower') || q.includes('rose') || q.includes('peony')) {
      return 'We source only the rarest flora, including Grand Prix Ecuadorian 24K gold-dipped roses, French snow peonies, and rare white Phalaenopsis orchids.';
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return 'Good evening. How may our VIP Concierge assist your luxury floral needs today?';
    }
    return "I'd be delighted to assist you with that. Our Master Floral Architect is reviewing your bespoke request. Would you like to book a private consultation?";
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query || !query.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newHistory = [
      ...chatHistory,
      { id: Date.now(), sender: 'user', text: query.trim(), time: currentTime }
    ];
    setChatHistory(newHistory);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = chatbotReplies(query);
      setChatHistory([
        ...newHistory,
        {
          id: Date.now() + 1,
          sender: 'concierge',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  /* ──────────────────────────────────────────────────────────
     Inline style objects — guarantees 100% opacity even if
     Tailwind classes get overridden by glass-panel or other
     ancestor styles.
     ────────────────────────────────────────────────────────── */
  const solidBlack = {
    backgroundColor: '#050505',
    background: '#050505',
    opacity: 1,
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
  };

  const solidDarkGray = {
    backgroundColor: '#0a0a0a',
    background: '#0a0a0a',
    opacity: 1,
  };

  const solidCharcoal = {
    backgroundColor: '#1a1a1a',
    background: '#1a1a1a',
    opacity: 1,
  };

  const solidPill = {
    backgroundColor: '#141414',
    background: '#141414',
    opacity: 1,
  };

  const solidInput = {
    backgroundColor: '#000000',
    background: '#000000',
    opacity: 1,
  };

  return (
    <>
      {/* ═══ WhatsApp Floating Contact Button ═══ */}
      <a
        href="https://wa.me/180088825666?text=Hello%20Bloom%20Hand%20Made%20Gift%20VIP%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20floral%20arrangement."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-[99990] p-3 sm:p-3.5 rounded-full bg-emerald-700 text-pearl-50 border border-emerald-400/50 shadow-xl hover:scale-110 transition-all flex items-center gap-2 group"
        title="WhatsApp VIP Concierge"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="text-xs font-serif font-bold tracking-wider hidden group-hover:inline">WhatsApp VIP</span>
      </a>

      {/* ═══ VIP Concierge Floating Trigger Button ═══ */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99990] px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-glow hover:scale-105 transition-all flex items-center gap-2"
        aria-label="Toggle VIP Concierge Chat"
      >
        <Sparkles className="w-4 h-4 text-obsidian-950 animate-spin-slow" />
        <span>VIP Concierge</span>
      </button>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE: 100% OPAQUE FULL-SCREEN BACKDROP
          Covers the ENTIRE viewport with solid #050505 — hides
          hero text, flowers, decorative animations, everything.
          Only shown on screens < 768px (md breakpoint).
          ═══════════════════════════════════════════════════════════ */}
      {isChatOpen && (
        <div
          className="live-chat-backdrop fixed inset-0 z-[99998] md:bg-black/60 md:backdrop-blur-sm"
          onClick={() => setIsChatOpen(false)}
          style={{
            backgroundColor: '#050505',
            opacity: 1,
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════
          CHAT PANEL
          —  MOBILE: Full-screen takeover (fixed inset-0).
             Every pixel is #050505 solid matte black.
          —  DESKTOP: Floating card (420px, bottom-right).
          ═══════════════════════════════════════════════════════════ */}
      {isChatOpen && (
        <div
          className={[
            'live-chat-panel fixed z-[99999] flex flex-col overflow-hidden animate-fadeIn',
            // MOBILE: full-screen (no inset, no rounded corners, no margin)
            'inset-0',
            // DESKTOP: floating card with rounded corners
            'md:inset-auto md:bottom-20 md:right-6 md:w-[420px] md:h-[600px] md:max-h-[640px]',
            'md:rounded-[24px] md:border md:border-gold-500/40',
            'md:shadow-[0_35px_90px_rgba(0,0,0,0.9)]',
          ].join(' ')}
          style={solidBlack}
        >
          {/* ──── HEADER ──── */}
          <div
            className="live-chat-panel-header p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0"
            style={solidDarkGray}
          >
            <div className="flex items-center gap-3 sm:gap-[14px]">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-emerald-900 border border-gold-400/60 flex items-center justify-center text-obsidian-950 font-serif text-sm font-bold shadow-sm">
                  BH
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]"></span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="font-serif font-semibold text-lg text-white tracking-wide leading-tight">
                  Paris Atelier Concierge
                </h4>
                <span className="text-[13px] font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  Master Floral Architect • Online
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="w-10 h-10 rounded-full bg-[#181818] border border-white/10 text-[#cccccc] hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              style={{ backgroundColor: '#181818', opacity: 1 }}
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ──── QUICK ACTION PILLS ──── */}
          <div
            className="px-4 sm:px-5 py-3 border-b border-white/10 flex flex-wrap items-center gap-2.5 shrink-0"
            style={solidDarkGray}
          >
            {['Track My Order', 'Book Wedding Consultation', 'Custom Budget Quote'].map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => handleSend(pill)}
                className="px-4 py-2.5 rounded-full border border-gold-500/40 text-[13px] font-medium text-gold-300 hover:bg-gold-500/20 hover:border-gold-400 transition-all shadow-sm shrink-0 cursor-pointer"
                style={solidPill}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* ──── CHAT MESSAGES SCROLL AREA ──── */}
          <div
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm font-sans"
            style={solidBlack}
          >
            {chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={[
                      'p-4 rounded-2xl max-w-[88%] sm:max-w-[85%] text-[15px] sm:text-base leading-relaxed shadow-md',
                      isUser
                        ? 'bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-obsidian-950 font-semibold rounded-tr-sm border border-gold-300'
                        : 'border border-white/10 text-white font-normal rounded-tl-sm',
                    ].join(' ')}
                    style={isUser ? { opacity: 1 } : solidCharcoal}
                  >
                    {msg.text}
                  </div>

                  <span
                    className={`text-[11px] font-mono flex items-center gap-1 ${
                      isUser ? 'text-gold-400/80 pr-1' : 'text-[#e5e5e5]/70 pl-1'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{msg.time}</span>
                  </span>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start">
                <div
                  className="p-4 rounded-2xl rounded-tl-sm border border-white/10 text-gold-400 flex items-center gap-2"
                  style={solidCharcoal}
                >
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="text-[13px] text-pearl-300 font-serif ml-1">Concierge is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ──── INPUT FOOTER ──── */}
          <div
            className="live-chat-panel-footer p-3 sm:p-4 border-t border-white/10 flex items-center gap-3 shrink-0"
            style={solidDarkGray}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask VIP Concierge..."
              className="w-full h-12 border border-gold-500/40 rounded-full px-5 text-[15px] text-white placeholder-[#888888] outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
              style={solidInput}
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className="w-11 h-11 min-w-[44px] rounded-full bg-gold-gradient text-obsidian-950 font-bold flex items-center justify-center shadow-gold-sm hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-obsidian-950" />
            </button>
          </div>

          {/* ──── SAFE AREA SPACER (for iPhones with home indicator) ──── */}
          <div
            className="shrink-0 md:hidden"
            style={{ ...solidDarkGray, height: 'env(safe-area-inset-bottom, 0px)' }}
          />
        </div>
      )}
    </>
  );
}
