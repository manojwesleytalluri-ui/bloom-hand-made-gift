import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, Send, PhoneCall, Sparkles, CheckCircle2, Compass } from 'lucide-react';

export default function LiveChatWidget() {
  const { isChatOpen, setIsChatOpen, setIsTrackingOpen, isBookingOpen, setIsBookingOpen, isCheckoutOpen, isAdminOpen } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'concierge', text: 'Good evening. Welcome to Bloom Hand Made Gift. How may our VIP Concierge assist your floral needs today?' }
  ]);

  const [isTyping, setIsTyping] = useState(false);

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
      return 'Our signature collections start at $390 for our Premium Boxes and go up to $1,800 for custom-designed glass cloches. Delivery is included.';
    }
    if (q.includes('delivery') || q.includes('shipping')) {
      return 'We offer VIP White-Glove hand delivery in Paris, London, Dubai, and Mumbai. Same-day delivery is available for orders placed before 12:00 PM.';
    }
    if (q.includes('botanical') || q.includes('flower') || q.includes('rose') || q.includes('peony')) {
      return 'We source only the rarest flora, including Grand Prix Ecuadorian gold-accented roses, French snow peonies, and white Phalaenopsis orchids.';
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return 'Good evening. How may our VIP Concierge assist your luxury floral needs today?';
    }
    return "I'd be delighted to assist you with that. Our Master Floral Architect is reviewing your bespoke request. Would you like to book a private consultation?";
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query) return;

    const newHistory = [...chatHistory, { sender: 'user', text: query }];
    setChatHistory(newHistory);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = chatbotReplies(query);
      setChatHistory([...newHistory, { sender: 'concierge', text: reply }]);
    }, 1000);
  };

  return (
    <>
      {/* WhatsApp Floating Contact Button */}
      <a
        href="https://wa.me/180088825666?text=Hello%20Bloom%20Hand%20Made%20Gift%20VIP%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20floral%20arrangement."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-6 z-40 p-3.5 rounded-full bg-emerald-700 text-pearl-50 border border-emerald-400/50 shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group"
        title="WhatsApp VIP Concierge"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="text-xs font-serif font-bold tracking-wider hidden group-hover:inline">WhatsApp VIP</span>
      </a>

      {/* Live Concierge Floating Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-glow hover:scale-105 transition-transform flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-obsidian-950 animate-spin-slow" />
        <span>VIP Concierge</span>
      </button>

      {/* Chat Window Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-panel border border-gold-500/40 rounded-3xl p-5 space-y-4 shadow-gold-lg animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400 font-serif text-xs font-bold">
                BH
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-pearl-50">Paris Atelier Concierge</h4>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online Now
                </span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-pearl-300 hover:text-gold-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Suggestion Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Track My Order', 'Book Wedding Consultation', 'Custom Budget Quote'].map((pill) => (
              <button
                key={pill}
                onClick={() => handleSend(pill)}
                className="px-2.5 py-1 rounded-full bg-obsidian-900 border border-gold-500/20 text-[10px] text-gold-300 hover:border-gold-500/40"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto space-y-3 pr-1 text-xs">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[85%] font-light leading-relaxed ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-gold-500 text-obsidian-950 font-medium'
                    : 'bg-obsidian-900 border border-gold-500/20 text-pearl-100'
                }`}
              >
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div className="p-3 rounded-2xl max-w-[85%] bg-obsidian-900 border border-gold-500/20 text-gold-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-2 border-t border-gold-500/20">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask VIP Concierge..."
              className="w-full bg-obsidian-900 border border-gold-500/30 rounded-full px-4 py-2 text-xs text-pearl-100 placeholder-pearl-400 outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-full bg-gold-gradient text-obsidian-950 font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
