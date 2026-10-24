'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, ShieldCheck, Clock, ArrowRight, Lock, GraduationCap } from 'lucide-react';
import { FloatingHeartsBackground } from '@/components/ui/FloatingHeartsBackground';
import { GlowButton } from '@/components/ui/GlowButton';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { TiltCard } from '@/components/ui/TiltCard';

interface LandingViewProps {
  onStart: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Floating Animated Hearts & Stardust Ambient Canvas */}
      <FloatingHeartsBackground heartCount={24} speedMultiplier={0.8} />

      {/* Ambient romantic backdrop glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-200/40 via-pink-100/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-rose-300/20 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-10 w-80 h-80 bg-pink-300/20 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 text-center">
        {/* Valentine Announcement Chip with BorderBeam */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-rose-200/80 shadow-md text-xs font-semibold text-rose-700 mb-6 backdrop-blur-md overflow-hidden"
        >
          <BorderBeam size={100} duration={6} colorFrom="#f43f5e" colorTo="#fbbf24" />
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Find Your Valentine Match</span>
        </motion.div>

        {/* Hero Display Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15] max-w-3xl mx-auto mb-6"
        >
          Meet someone worth talking to at{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500">
            Anywhere
            <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-rose-400 to-pink-400 rounded-full" />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
        >
          A Valentine-season social matching experience.
          Select your passions, choose your matching mode, and let Cupid introduce you to eligible peers everywhere.
        </motion.p>

        {/* Primary Glow CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10"
        >
          <GlowButton
            id="landing-cta-primary-btn"
            onClick={onStart}
            variant="rose"
            className="px-8 py-4 text-base font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get Started with Your Email</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </GlowButton>
        </motion.div>

        {/* Verified Email Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14 text-stone-700 text-xs font-medium"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-100 shadow-sm hover:border-rose-300 transition-colors">
            <GraduationCap className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Verified email only</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-100 shadow-sm hover:border-rose-300 transition-colors">
            <Lock className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Privacy Protected &amp; Moderated</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-100 shadow-sm hover:border-rose-300 transition-colors">
            <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Campus Exclusive Community</span>
          </div>
        </motion.div>

        {/* 3D Tilt + Spotlight Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left max-w-4xl mx-auto">
          {/* Card 1: Interest-Based */}
          <TiltCard maxTilt={10}>
            <SpotlightCard className="h-full" spotlightColor="rgba(244, 63, 94, 0.22)">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Interest-Based Matching
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Match by shared passions in coding, indie music, cinema, sports, or switch to pure serendipity with random mode.
              </p>
            </SpotlightCard>
          </TiltCard>

          {/* Card 2: 10-Second Suspense */}
          <TiltCard maxTilt={10}>
            <SpotlightCard className="h-full" spotlightColor="rgba(236, 72, 153, 0.22)">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4 shadow-sm">
                <Clock className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                The 10-Second Suspense
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Experience the deliberate Cupid search radar while exploring curated Valentine campus gift picks.
              </p>
            </SpotlightCard>
          </TiltCard>

          {/* Card 3: Campus Privacy */}
          <TiltCard maxTilt={10}>
            <SpotlightCard className="h-full" spotlightColor="rgba(245, 158, 11, 0.22)">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Campus Privacy &amp; Safety
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Restricted to verified email sign-in. Built-in instant block, report, and discreet DOB visibility controls.
              </p>
            </SpotlightCard>
          </TiltCard>
        </div>
      </div>

      {/* College Footer Badge */}
      <footer className="border-t border-rose-100 bg-white/60 backdrop-blur-sm py-6 text-center text-xs text-stone-500 relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800">MATCH@ALL</span>
            <span className="text-stone-300">·</span>
            <span>Meet someone worth talking to</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span>Confidential &amp; Student Moderated</span>
            <span>·</span>
            <span>Valentine Season 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
