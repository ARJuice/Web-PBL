'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Check, Heart } from 'lucide-react';
import { CupidEmblem } from '@/components/ui/CupidEmblem';
import { AFFILIATE_PRODUCTS } from '@/lib/mock-data';
import { AffiliateProduct, MatchMode } from '@/types/match';
import { FloatingHeartsBackground } from '@/components/ui/FloatingHeartsBackground';
import { BorderBeam } from '@/components/ui/BorderBeam';

interface MatchingScreenProps {
  onComplete: () => void;
  onCopyProductLink: (product: AffiliateProduct) => void;
  matchMode?: MatchMode;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({
  onComplete,
  onCopyProductLink,
  matchMode = 'INTERESTS',
}) => {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const statusMessages = [
    'Scanning active campus profiles...',
    'Filtering department, year, and mutual intents...',
    'Scoring Cupid interest compatibility matrix...',
    'Found a high-resonance campus peer...',
    'Generating confidential Valentine conversation room...',
  ];

  const currentStatusIndex = Math.min(
    statusMessages.length - 1,
    Math.floor(((10 - secondsLeft) / 10) * statusMessages.length)
  );

  // 10-second timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Product rotator every 3.5 seconds
  useEffect(() => {
    const rot = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % AFFILIATE_PRODUCTS.length);
    }, 3500);
    return () => clearInterval(rot);
  }, []);

  const product = AFFILIATE_PRODUCTS[currentProductIndex];

  const handleCopyLink = () => {
    if (!product) return;
    onCopyProductLink(product);
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const progressPercent = ((10 - secondsLeft) / 10) * 100;

  return (
    <div
      id="matching-screen-container"
      className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-rose-950 via-velvet-950 to-stone-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Floating Cupid Hearts Ambient Particle Canvas */}
      <FloatingHeartsBackground heartCount={32} speedMultiplier={0.9} />

      {/* Ambient background glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Countdown Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-rose-950/50 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300 shadow-sm"
          animate={{ width: `${progressPercent}%` }}
          transition={{ ease: 'linear', duration: 1 }}
        />
      </div>

      {/* Top Bar */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between text-xs text-rose-200/80 pt-2 relative z-10">
        <div className="flex items-center gap-2">
          <CupidEmblem size={28} glow={false} />
          <span className="font-serif font-bold tracking-wider uppercase text-[11px] text-rose-100">
            MATCH@ALL
          </span>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-rose-200 backdrop-blur-md">
          {matchMode === 'INTERESTS' ? '🎯 Cupid Interest Match' : '🎲 Random Serendipity'}
        </div>
      </div>

      {/* Main Radar Content */}
      <main className="max-w-md w-full mx-auto my-auto text-center relative z-10 py-6">
        {/* Radar concentric ripple effect */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-8">
          {/* Radar Circles */}
          <div className="absolute inset-0 rounded-full border border-rose-400/40 animate-ping opacity-60" />
          <div className="absolute -inset-4 rounded-full border border-rose-500/25 animate-pulse" />
          <div className="absolute -inset-10 rounded-full border border-rose-500/15" />

          {/* Central Cupid Icon with Orbiting Glow */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 border-2 border-rose-300/80 flex items-center justify-center shadow-2xl shadow-rose-500/60 overflow-hidden">
            <BorderBeam size={80} duration={4} colorFrom="#fda4af" colorTo="#fde047" borderWidth={2} />
            <CupidEmblem size={54} />
          </div>
        </div>

        {/* Searching Status Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
            <span>Finding Partner • {secondsLeft}s remaining</span>
          </div>

          <div className="min-h-[3.5rem] flex items-center justify-center px-2">
            <AnimatePresence mode="wait">
              <motion.h1
                key={statusMessages[currentStatusIndex]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md"
              >
                {statusMessages[currentStatusIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="text-xs text-rose-200/70 max-w-xs mx-auto">
            Looking through verified student profiles to calculate the sweetest connection.
          </p>
        </div>

        {/* Valentine's Pick Affiliate Card with BorderBeam & Glassmorphism */}
        {product && (
          <div className="mt-8 relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-5 text-left shadow-2xl overflow-hidden transition-all">
            <BorderBeam size={140} duration={7} colorFrom="#f43f5e" colorTo="#fbbf24" borderWidth={1.5} />
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-[10px] font-bold text-rose-200 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Valentine&apos;s Campus Pick
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {product.price}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-2xl object-cover border border-white/25 shrink-0 shadow-md"
              />

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate font-serif">
                  {product.name}
                </h4>
                <p className="text-[11px] text-rose-200/80 line-clamp-2 mt-0.5 leading-relaxed">
                  {product.description}
                </p>

                <button
                  id="matching-copy-affiliate-btn"
                  type="button"
                  onClick={handleCopyLink}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 border border-white/30 text-[11px] font-semibold text-rose-100 transition-all cursor-pointer shadow-sm"
                >
                  {copiedId === product.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-200">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-rose-300" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom note */}
      <div className="text-center text-[11px] text-rose-300/60 py-2 relative z-10 font-mono">
        Cupid algorithms active • MATCH@ALL Campus Edition
      </div>
    </div>
  );
};

export default MatchingScreen;
