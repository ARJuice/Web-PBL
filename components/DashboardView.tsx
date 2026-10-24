'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Sparkles,
  Flame,
  MessageCircleHeart,
  Settings,
  ChevronRight,
  ShieldCheck,
  Zap,
  Users,
} from 'lucide-react';
import { Conversation, Match, MatchMode, User } from '@/types/match';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { TiltCard } from '@/components/ui/TiltCard';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { GlowButton } from '@/components/ui/GlowButton';
import { ShinyText } from '@/components/ui/ShinyText';

interface DashboardViewProps {
  currentUser: User;
  matches: Match[];
  conversations: Conversation[];
  onFindMatch: () => void;
  onToggleMatchMode: (newMode: MatchMode) => void;
  onOpenEditInterests: () => void;
  onOpenChat: (conversationId: string) => void;
  onOpenSettings: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  matches,
  conversations,
  onFindMatch,
  onToggleMatchMode,
  onOpenEditInterests,
  onOpenChat,
  onOpenSettings,
}) => {
  const profile = currentUser.profile;
  const isInterestMode = profile?.matchMode === 'INTERESTS';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Card & Find My Match Action (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero Card with Spotlight Effect and BorderBeam */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative"
          >
            <SpotlightCard
              spotlightColor="rgba(244, 63, 94, 0.16)"
              className="p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100/90 shadow-xl shadow-rose-900/5 relative overflow-hidden text-left"
            >
              {/* Subtle dynamic border ray */}
              <BorderBeam size={220} duration={9} colorFrom="#f43f5e" colorTo="#fbcfe8" />

              {/* Ambient blush gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-200/40 via-pink-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  {profile?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-rose-100 shadow-md transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                      {profile?.displayName?.charAt(0) || 'S'}
                    </div>
                  )}
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
                      Hey, {profile?.displayName?.split(' ')[0] || 'Student'}
                      <span className="text-xl">👋</span>
                    </h1>
                    <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                      <span>Year {profile?.year || 1}</span>
                      <span>·</span>
                      <span className="font-medium text-rose-700">
                        {profile?.intent?.replace(/_/g, ' ')}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  id="edit-profile-shortcut-btn"
                  onClick={onOpenSettings}
                  className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200/80 transition-all hover:shadow-xs active:scale-95"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Bio Quote */}
              {profile?.bio && (
                <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-stone-700 italic mb-6 relative z-10 leading-relaxed">
                  &ldquo;{profile.bio}&rdquo;
                </div>
              )}

              {/* Current Profile Summary Badges */}
              <div className="space-y-3 mb-7 relative z-10">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-stone-500">Looking for:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-100/70 text-rose-800 font-semibold border border-rose-200/50">
                    {profile?.intent}
                  </span>

                  <span className="text-stone-300">|</span>

                  <span className="font-semibold text-stone-500">Mode:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-100/70 text-rose-800 font-semibold border border-rose-200/50">
                    {isInterestMode ? 'Interest-based' : 'Random match'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-semibold text-stone-500 mr-1">
                    Interests ({profile?.interests.length || 0}):
                  </span>
                  {profile?.interests.map((i) => (
                    <motion.span
                      key={i.id}
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100/90 text-stone-700 text-xs font-medium border border-stone-200/60 shadow-xs cursor-default"
                    >
                      <span>{i.emoji}</span>
                      <span>{i.name}</span>
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* MAIN MATCH BUTTON WITH GLOW & PARTICLES */}
              <div className="space-y-3 relative z-10 pt-4 border-t border-rose-100">
                <GlowButton
                  id="dashboard-find-match-btn"
                  onClick={onFindMatch}
                  variant="rose"
                  className="w-full py-4 text-base font-bold flex items-center justify-center gap-2.5 group"
                >
                  <Flame className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
                  <span>Find My Match</span>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </GlowButton>

                {/* Interest Matching Toggle directly below main Match button */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="toggle-interest-mode-checkbox"
                      type="checkbox"
                      checked={isInterestMode}
                      onChange={(e) =>
                        onToggleMatchMode(e.target.checked ? 'INTERESTS' : 'RANDOM')
                      }
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-rose-300 cursor-pointer accent-rose-500"
                    />
                    <span className="text-stone-700 font-medium">
                      Match based on my interests
                    </span>
                  </label>

                  <button
                    id="dashboard-edit-interests-btn"
                    onClick={onOpenEditInterests}
                    className="text-rose-600 hover:text-rose-800 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
                  >
                    Edit my interests
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Valentine Event Live Tracker with Animated CountUpNumber */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50/70 to-rose-50/50 border border-rose-100 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white text-rose-500 flex items-center justify-center shadow-xs border border-rose-100 shrink-0">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <ShinyText text="Cupid Matching Engine Active" speed={4} className="font-bold" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Over{' '}
                  <span className="font-bold text-rose-600">
                    <CountUpNumber value={142} duration={2} />+
                  </span>{' '}
                  students paired across CS, Biotech, ECE &amp; Civil.
                </div>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-rose-600 bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-2xs">
              Valentine &apos;26
            </span>
          </div>
        </div>

        {/* Right Column: Matches & Conversation List (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <SpotlightCard
            spotlightColor="rgba(244, 63, 94, 0.12)"
            className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-xl shadow-rose-900/5 text-left"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-100">
              <div>
                <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <MessageCircleHeart className="w-5 h-5 text-rose-500" />
                  <span>Your Matches &amp; Chats</span>
                </h2>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  <span className="font-bold text-rose-600">
                    <CountUpNumber value={matches.length} duration={1} />
                  </span>{' '}
                  active connection{matches.length === 1 ? '' : 's'}
                </p>
              </div>

              {matches.length > 0 && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200/50">
                  <CountUpNumber value={matches.length} duration={1} /> Total
                </span>
              )}
            </div>

            {/* Matches & Conversations List */}
            {matches.length === 0 ? (
              // Empty State
              <div className="py-10 text-center px-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-base font-bold text-stone-800 mb-1">
                  No matches yet
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-5 leading-relaxed">
                  Ready to meet someone new? Your first campus match is just one click away.
                </p>
                <button
                  onClick={onFindMatch}
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  Find My Match
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {matches.map((match) => {
                  const conv = conversations.find((c) => c.matchId === match.id);
                  const isBlocked = match.status === 'BLOCKED';
                  const candidate = match.candidateProfile;

                  return (
                    <TiltCard
                      key={match.id}
                      maxTilt={4}
                      className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 ${
                        isBlocked
                          ? 'bg-stone-50 border-stone-200 opacity-60'
                          : 'bg-rose-50/40 hover:bg-rose-50/90 border-rose-100 hover:border-rose-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          {candidate.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={candidate.avatarUrl}
                              alt={candidate.displayName}
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-200"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-200 to-pink-200 text-rose-700 flex items-center justify-center font-bold text-sm">
                              {candidate.displayName.charAt(0)}
                            </div>
                          )}
                          {!isBlocked && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                              {candidate.displayName}
                            </span>
                            <span className="text-[10px] text-stone-500 shrink-0">
                              · Year {candidate.year}
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {isBlocked
                              ? 'This connection is blocked'
                              : conv?.lastMessage?.content ||
                                `Shared: ${match.sharedInterests.slice(0, 2).join(', ')}`}
                          </p>

                          {/* Cupid Match Compatibility Pill with CountUp */}
                          {!isBlocked && match.score && (
                            <div className="mt-1 flex items-center gap-1">
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200/50">
                                <CountUpNumber
                                  value={Math.round(match.score * 100)}
                                  duration={1.2}
                                />
                                % Compatibility
                              </span>
                              {match.sharedInterests.length > 0 && (
                                <span className="text-[10px] text-stone-400">
                                  · {match.sharedInterests.length} shared
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      {!isBlocked && (
                        <button
                          onClick={() => onOpenChat(match.conversationId)}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-500 text-xs font-semibold shadow-xs transition-all flex items-center gap-1 shrink-0 hover:scale-105 active:scale-95"
                          aria-label={`Open chat with ${candidate.displayName}`}
                        >
                          <span>Chat</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </TiltCard>
                  );
                })}
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
