import React, { useState } from 'react';
import { Heart, MessageCircle, ExternalLink, Camera, Sparkles } from 'lucide-react';

export default function InstagramGallerySection() {
  const [hoveredPost, setHoveredPost] = useState(null);

  const posts = [
    {
      id: 'ig-1',
      image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&q=80&w=800',
      likes: '4.8k',
      comments: '342',
      caption: 'Grand Prix Ecuadorian Red Velvet Roses with 24K gold foil trim. #BloomHandMadeGift',
      aspectClass: 'row-span-2'
    },
    {
      id: 'ig-2',
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=800',
      likes: '6.2k',
      comments: '512',
      caption: 'Royal wedding installation at Villa d\'Este, Lake Como. White orchids & peonies.',
      aspectClass: ''
    },
    {
      id: 'ig-3',
      image: '/assets/images/eternal_rose_cloche_1785003145770.png',
      likes: '3.9k',
      comments: '219',
      caption: 'L\'Éternel 5-Year Preserved Rose under hand-blown crystal. Paris Atelier.',
      aspectClass: ''
    },
    {
      id: 'ig-4',
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800',
      likes: '7.1k',
      comments: '890',
      caption: 'The Sovereign Hamper pairing Dom Pérignon Vintage with rare black orchids.',
      aspectClass: ''
    },
    {
      id: 'ig-5',
      image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&q=80&w=800',
      likes: '5.4k',
      comments: '412',
      caption: 'Behind the scenes at our Paris atelier. Master florists at work. #AtelierLife',
      aspectClass: 'row-span-2'
    },
    {
      id: 'ig-6',
      image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=800',
      likes: '8.3k',
      comments: '645',
      caption: 'Moonlit garden party arrangements. Soft peach roses with golden candlelight.',
      aspectClass: ''
    }
  ];

  return (
    <section id="gallery" className="py-28 relative bg-obsidian-950 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-obsidian-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-obsidian-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-serif uppercase tracking-[0.2em]">
              <Camera className="w-3.5 h-3.5" />
              <span>Editorial Lookbook</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pearl-50">
              Follow Our <span className="text-gold-gradient italic">Atelier Journey</span>
            </h2>
            <p className="text-sm text-pearl-200/50 font-light max-w-md">
              A curated visual diary from our ateliers in Paris, Dubai, and London.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="px-7 py-3.5 rounded-full border border-gold-500/30 text-gold-300 hover:bg-gold-500/10 hover:border-gold-500/50 text-xs font-serif font-bold uppercase tracking-[0.15em] flex items-center gap-2.5 transition-all duration-500 backdrop-blur-md"
          >
            <Camera className="w-4 h-4 text-gold-400" />
            <span>@bloomhandmadegift</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Masonry-Style Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={`group relative rounded-[1.5rem] overflow-hidden cursor-pointer ${post.aspectClass}`}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Image */}
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110"
                loading="lazy"
              />

              {/* Permanent Subtle Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/50 via-transparent to-transparent" />

              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-obsidian-950/70 backdrop-blur-sm transition-all duration-500 flex flex-col justify-between p-5 ${
                hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
              }`}>
                {/* Top Stats */}
                <div className="flex items-center justify-between text-gold-400 text-xs font-bold">
                  <span className="flex items-center gap-1.5 bg-obsidian-950/40 backdrop-blur-md rounded-full px-3 py-1.5">
                    <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
                    <span className="text-pearl-100">{post.likes}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-obsidian-950/40 backdrop-blur-md rounded-full px-3 py-1.5">
                    <MessageCircle className="w-3.5 h-3.5 fill-current text-gold-400" />
                    <span className="text-pearl-100">{post.comments}</span>
                  </span>
                </div>

                {/* Caption */}
                <div className="space-y-2">
                  <p className="text-xs text-pearl-100 font-light line-clamp-3 leading-relaxed">
                    {post.caption}
                  </p>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-gold-400 uppercase tracking-[0.2em] font-serif font-semibold bg-gold-500/10 rounded-full px-3 py-1 border border-gold-500/20">
                      View on Instagram
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
