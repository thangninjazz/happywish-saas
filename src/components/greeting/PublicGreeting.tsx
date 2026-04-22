'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Play, Pause } from 'lucide-react';
import Image from 'next/image';

export interface Wish {
  music_url?: string;
  theme_color: string;
  recipient_name: string;
  wish_media?: { url: string }[];
  message: string;
  sender_name?: string;
  event_date?: string;
  templates?: {
    slug: string;
    title: string;
    category: string;
  };
}

interface PublicGreetingProps {
  wish: Wish;
  isPreview?: boolean;
}

const PublicGreeting = memo(function PublicGreeting({ wish, isPreview = false }: PublicGreetingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [ytId, setYtId] = useState<string | null>(null);

  const templateSlug = wish.templates?.slug || 'birthday-classic';

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    if (wish.music_url) {
      const id = getYoutubeId(wish.music_url);
      if (id) {
        setYtId(id);
      } else {
        const a = new Audio(wish.music_url);
        a.loop = true;
        setAudio(a);
      }
    }
    
    return () => {
      if (audio) audio.pause();
    };
  }, [wish.music_url]);

  const handleOpenGift = useCallback(() => {
    setIsOpen(true);
    if (templateSlug === 'birthday-classic' || templateSlug === 'baby-cute') {
      triggerConfetti();
    }
    setIsPlaying(true);
    if (audio) {
      audio.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [audio, templateSlug]);

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

  const toggleAudio = useCallback(() => {
    if (ytId) {
      setIsPlaying(prev => !prev);
      return;
    }
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(prev => !prev);
  }, [ytId, audio, isPlaying]);

  // Define background icons/particles based on template
  const renderBackgroundParticles = () => {
    let particles = [];
    let icon = '✨';
    
    if (templateSlug === 'wedding-romantic') icon = '❤️';
    if (templateSlug === 'birthday-classic') icon = '🎈';
    if (templateSlug === 'baby-cute') icon = '🧸';
    if (templateSlug === 'anniversary-elegant') icon = '⭐';

    for (let i = 0; i < 20; i++) {
      particles.push(
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
            opacity: [0, 0.7, 0],
            rotate: Math.random() * 360 
          }}
          transition={{ 
            duration: Math.random() * 15 + 10, 
            repeat: Infinity, 
            delay: Math.random() * 20,
            ease: "linear" 
          }}
          className="absolute text-2xl"
          style={{ color: wish.theme_color, filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' }}
        >
          {icon}
        </motion.div>
      );
    }
    return particles;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]" style={{ backgroundColor: isOpen ? wish.theme_color + '10' : '#0a0a0a' }}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="gift-box"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white"
          >
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut" 
              }}
              className="cursor-pointer group"
              onClick={handleOpenGift}
            >
              <div className="bg-primary/20 p-10 rounded-full border border-primary/30 backdrop-blur-md group-hover:bg-primary/40 transition-all shadow-[0_0_60px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_100px_rgba(124,58,237,0.7)]">
                <Gift size={100} className="text-primary-foreground group-hover:scale-110 transition-transform" />
              </div>
            </motion.div>
            <h2 className="mt-12 text-2xl font-light tracking-[0.5em] uppercase opacity-70">A special surprise for</h2>
            <p className="mt-4 text-4xl font-serif italic text-primary" style={{ color: wish.theme_color }}>{wish.recipient_name}</p>
            <p className="mt-16 text-sm opacity-40 animate-bounce">Tap the gift box</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10"
          >
            {ytId && isPlaying && (
              <div className="hidden">
                <iframe
                  width="0"
                  height="0"
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}`}
                  allow="autoplay"
                ></iframe>
              </div>
            )}

            {(audio || ytId) && (
              <button 
                onClick={toggleAudio}
                className="fixed top-6 right-6 p-4 rounded-full bg-background/30 backdrop-blur-lg border border-white/20 shadow-xl hover:bg-background/60 transition-all z-50 text-foreground"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            )}

            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mb-12"
            >
              <span className="text-sm tracking-[0.4em] uppercase opacity-60 mb-4 block" style={{ color: wish.theme_color }}>Happy {wish.templates?.category || 'Birthday'}</span>
              <h1 className="text-6xl md:text-9xl font-serif mb-4 leading-tight" style={{ color: wish.theme_color }}>
                {wish.recipient_name}
              </h1>
              <div className="h-1.5 w-32 mx-auto rounded-full" style={{ backgroundColor: wish.theme_color }} />
            </motion.div>

            {/* Image Gallery - Polaroids style */}
            {wish.wish_media && wish.wish_media.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 1.2 }}
                className="flex gap-8 mb-16 overflow-x-auto py-8 px-10 no-scrollbar max-w-full"
              >
                {wish.wish_media.map((media: any, idx: number) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                    className="relative flex-shrink-0 w-72 h-[26rem] bg-white p-4 pb-16 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-b-[20px] border-white"
                    style={{ 
                        transform: `rotate(${idx % 2 === 0 ? (idx + 1) * 2 : (idx + 1) * -2}deg)`,
                        transition: 'transform 0.5s ease'
                    }}
                  >
                    <div className="relative w-full h-full overflow-hidden">
                        <Image 
                        src={media.url} 
                        alt={`Memory ${idx + 1}`} 
                        fill
                        className="object-cover" 
                        />
                    </div>
                    <div className="absolute bottom-4 left-0 w-full text-center text-zinc-400 font-serif italic">
                        {new Date(wish.event_date || Date.now()).getFullYear()}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="max-w-3xl bg-black/40 backdrop-blur-2xl p-12 md:p-16 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 mb-16 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 opacity-30 bg-gradient-to-r from-transparent via-white to-transparent" />
              <p className="text-3xl md:text-4xl leading-relaxed whitespace-pre-wrap text-foreground font-serif italic font-light">
                "{wish.message}"
              </p>
              
              {wish.sender_name && (
                <div className="mt-16 text-right">
                  <p className="text-muted-foreground text-xs uppercase tracking-[0.5em] mb-4">Forever yours,</p>
                  <p className="text-5xl font-serif italic" style={{ color: wish.theme_color }}>
                    {wish.sender_name}
                  </p>
                </div>
              )}
            </motion.div>
            
            {wish.event_date && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.2 }}
                className="px-12 py-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-base font-light tracking-[0.3em] uppercase"
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
           {/* Abstract shapes */}
           <div className="absolute top-[10%] left-[-5%] w-[40rem] h-[40rem] rounded-full filter blur-[120px] opacity-20 animate-pulse" style={{ backgroundColor: wish.theme_color }} />
           <div className="absolute bottom-[10%] right-[-5%] w-[40rem] h-[40rem] rounded-full filter blur-[120px] opacity-20 animate-pulse animation-delay-2000" style={{ backgroundColor: wish.theme_color }} />
           
           <div className="absolute inset-0 overflow-hidden">
             {renderBackgroundParticles()}
           </div>
        </div>
      )}
    </div>
  );
});

export { PublicGreeting };
