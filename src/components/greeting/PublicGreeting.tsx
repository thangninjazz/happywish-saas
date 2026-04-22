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
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10"
          >
            {audio && (
              <button 
                onClick={toggleAudio}
                className="absolute top-6 right-6 p-3 rounded-full bg-background/50 backdrop-blur-md border shadow-sm hover:bg-background/80 transition-colors z-50"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            )}

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif mb-6" style={{ color: wish.theme_color }}>
                {wish.recipient_name}
              </h1>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="max-w-2xl bg-background/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border mb-12"
            >
              <p className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium">
                {wish.message}
              </p>
              
              {wish.sender_name && (
                <div className="mt-8 text-right">
                  <p className="text-muted-foreground text-sm uppercase tracking-widest">With love from</p>
                  <p className="text-2xl font-serif italic mt-1" style={{ color: wish.theme_color }}>
                    {wish.sender_name}
                  </p>
                </div>
              )}
            </motion.div>
            
            {/* Countdown / Event Date Widget (Basic) */}
            {wish.event_date && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 2 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card shadow-sm border text-sm font-medium"
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: wish.theme_color }} />
                Event Date: {new Date(wish.event_date).toLocaleDateString()}
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
