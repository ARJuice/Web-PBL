'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, MessageCircleHeart, X, Calendar, ArrowRight } from 'lucide-react';
import { Match } from '@/types/match';
import { triggerRomanticConfetti } from '@/lib/confetti';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { GlowButton } from '@/components/ui/GlowButton';

interface MatchResultModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (conversationId: string) => void;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({
  match,
  isOpen,
  onClose,
  onStartChat,
}) => {
  useEffect(() => {
    if (isOpen && match) {
      triggerRomanticConfetti();
    }
  }, [isOpen, match]);

  if (!isOpen || !match) return null;

  const candidate = match.candidateProfile;
  const scorePercent = Math.round((match.score || 0.75) * 100);

  return (
    <div
      id="match-result-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200/90 overflow-hidden text-center backdrop-blur-xl"
      >
        {/* Animated perimeter BorderBeam */}
        <BorderBeam size={180} duration={6} colorFrom="#f43f5e" colorTo="#fbbf24" borderWidth={2} />

        {/* Ambient celebratory radial glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-rose-300/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors z-20 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebratory Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-bold tracking-wider uppercase mb-5 border border-rose-200/70 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>IT&apos;S A MATCH!</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        </div>

        {/* Match Avatar with glowing ring */}
        <div className="relative w-28 h-28 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 blur-md opacity-60 animate-pulse" />
          {candidate.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={candidate.avatarUrl}
              alt={candidate.displayName}
              className="relative w-28 h-28 rounded-full object-cover ring-4 ring-rose-200 shadow-xl"
            />
          ) : (
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center text-4xl font-bold ring-4 ring-rose-200 shadow-xl">
              {candidate.displayName.charAt(0)}
            </div>
          )}
          <div className="absolute bottom-0 right-1 w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-center border-2 border-white shadow-md">
            <Heart className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* Candidate Info */}
        <h3 className="font-serif text-2xl font-bold text-stone-900">
          {candidate.displayName}, {candidate.year ? `${candidate.year}${candidate.year === 1 ? 'st' : candidate.year === 2 ? 'nd' : candidate.year === 3 ? 'rd' : 'th'} Year` : ''}
        </h3>

        {/* Optional DOB if user permitted display */}
        {candidate.showDob && candidate.dateOfBirth && (
          <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3 text-rose-400" />
            <span>Born {candidate.dateOfBirth}</span>
          </p>
        )}

        {/* Bio Quote */}
        {candidate.bio && (
          <p className="text-xs text-stone-600 italic mt-2.5 mb-4 px-4 line-clamp-2">
            &ldquo;{candidate.bio}&rdquo;
          </p>
        )}

        {/* Animated Compatibility Score with CountUpNumber */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-200/80 text-xs font-semibold text-rose-800 mb-4 shadow-sm">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-bounce" />
          <span className="font-bold">
            <CountUpNumber value={scorePercent} duration={1.6} suffix="%" /> Cupid Match Resonance
          </span>
        </div>

        {/* Shared Interests Badges */}
        {match.sharedInterests.length > 0 && (
          <div className="mb-6">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Shared Passions ({match.sharedInterests.length})
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {match.sharedInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/70 text-xs font-medium shadow-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Start Chatting CTA */}
        <div className="w-full">
          <GlowButton
            id="match-result-start-chat-btn"
            onClick={() => onStartChat(match.conversationId)}
            variant="rose"
            className="w-full py-4 text-base font-bold"
          >
            <MessageCircleHeart className="w-4 h-4" />
            <span>Start Chatting</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </GlowButton>
        </div>
      </motion.div>
    </div>
  );
};
