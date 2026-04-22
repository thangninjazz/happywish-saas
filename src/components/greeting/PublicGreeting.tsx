'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Play, Pause } from 'lucide-react';
import Image from 'next/image';

interface PublicGreetingProps {
  wish: any;
  isPreview?: boolean;
}

export function PublicGreeting({ wish, isPreview = false }: PublicGreetingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Basic music handling (Mock for now, normally use audio API or iframe for YT)
    if (wish.music_url) {
      // If it's a direct MP3 url, we can use HTMLAudioElement
      // If YouTube, need an iframe embed. We'll simulate a basic audio for now
      const a = new Audio('/music/sample.mp3'); // Mock path
      a.loop = true;
      setAudio(a);
    }
    
    return () => {
      if (audio) audio.pause();
    };
  }, [wish.music_url]);

  const handleOpenGift = () => {
    setIsOpen(true);
    triggerConfetti();
    if (audio) {
      audio.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const toggleAudio = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: isOpen ? wish.theme_color + '15' : '#0a0a0a' }}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="gift-box"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white"
          >
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="cursor-pointer group"
              onClick={handleOpenGift}
            >
              <div className="bg-primary/20 p-8 rounded-full border border-primary/30 backdrop-blur-md group-hover:bg-primary/40 transition-all shadow-[0_0_50px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_80px_rgba(124,58,237,0.6)]">
                <Gift size={80} className="text-primary-foreground group-hover:scale-110 transition-transform" />
              </div>
            </motion.div>
            <h2 className="mt-8 text-2xl font-light tracking-widest uppercase opacity-80">A gift for you</h2>
            <p className="mt-2 text-xl font-medium">{wish.recipient_name}</p>
            <p className="mt-12 text-sm opacity-50 animate-pulse">Tap to open</p>
          </motion.div>
        ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-8xl font-serif mb-2 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent" style={{ color: wish.theme_color }}>
                {wish.recipient_name}
              </h1>
              <div className="h-1 w-24 mx-auto rounded-full" style={{ backgroundColor: wish.theme_color }} />
            </motion.div>

            {/* Image Gallery */}
            {wish.wish_media && wish.wish_media.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="flex gap-4 mb-12 overflow-x-auto py-4 px-2 no-scrollbar max-w-full"
              >
                {wish.wish_media.map((media: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500"
                    style={{ transform: `rotate(${idx % 2 === 0 ? '2deg' : '-2deg'})` }}
                  >
                    <img src={media.url} alt="Memory" className="w-full h-full object-cover" />
                  </div>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="max-w-2xl bg-white/10 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/20 mb-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent" />
              <p className="text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap text-foreground font-serif italic">
                "{wish.message}"
              </p>
              
              {wish.sender_name && (
                <div className="mt-10 text-right">
                  <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] mb-2">With all my love</p>
                  <p className="text-3xl font-serif italic" style={{ color: wish.theme_color }}>
                    {wish.sender_name}
                  </p>
                </div>
              )}
            </motion.div>
            
            {/* Countdown / Event Date Widget (Premium) */}
            {wish.event_date && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 2 }}
                className="px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-sm font-light tracking-[0.2em] uppercase"
              >
                {new Date(wish.event_date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating background elements */}
      {isOpen && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
           {/* Abstract shapes based on theme color */}
           <div className="absolute top-[10%] left-[20%] w-64 h-64 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob" style={{ backgroundColor: wish.theme_color }} />
           <div className="absolute top-[40%] right-[20%] w-72 h-72 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-2000" style={{ backgroundColor: wish.theme_color }} />
           <div className="absolute bottom-[10%] left-[40%] w-80 h-80 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000" style={{ backgroundColor: wish.theme_color }} />
           
           {/* Particles/Hearts effect */}
           <div className="absolute inset-0 overflow-hidden">
             {[...Array(15)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ 
                   x: Math.random() * 100 + '%', 
                   y: '110%', 
                   scale: Math.random() * 0.5 + 0.5,
                   opacity: 0 
                 }}
                 animate={{ 
                   y: '-10%', 
                   opacity: [0, 0.5, 0],
                   rotate: 360 
                 }}
                 transition={{ 
                   duration: Math.random() * 10 + 10, 
                   repeat: Infinity, 
                   delay: Math.random() * 20,
                   ease: "linear" 
                 }}
                 className="absolute text-2xl"
                 style={{ color: wish.theme_color }}
               >
                 ✨
               </motion.div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}
