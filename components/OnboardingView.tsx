'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Check, ArrowRight, ArrowLeft, Calendar, User as UserIcon, Shield, SlidersHorizontal, Flame } from 'lucide-react';
import { ALL_INTERESTS } from '@/lib/mock-data';
import { Gender, Intent, Interest, MatchMode, User, UserProfile } from '@/types/match';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { GlowButton } from '@/components/ui/GlowButton';

interface OnboardingViewProps {
  currentUser: User;
  onComplete: (profile: UserProfile) => void;
}

const INTENT_OPTIONS: { value: Intent; label: string; desc: string; emoji: string }[] = [
  { value: 'DATING', label: 'Dating & Romance', desc: 'Looking for a Valentine date or romantic connection', emoji: '🌹' },
  { value: 'FRIENDSHIP', label: 'Friendship', desc: 'Expand your circle and hang out between lectures', emoji: '🤝' },
  { value: 'PARTNER', label: 'Long-term Partner', desc: 'Seeking genuine, lasting campus companionship', emoji: '💍' },
  { value: 'LIKE_MINDED_FRIEND', label: 'Like-Minded Peer', desc: 'Share specific hobbies, coding, or creative crafts', emoji: '✨' },
  { value: 'JUST_CHAT', label: 'Casual Chat', desc: 'Lighthearted conversations and banter', emoji: '☕' },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MAN', label: 'Man' },
  { value: 'WOMAN', label: 'Woman' },
  { value: 'NON_BINARY', label: 'Non-Binary' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  currentUser,
  onComplete,
}) => {
  const existing = currentUser.profile;

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Form states
  const [displayName, setDisplayName] = useState(existing?.displayName || currentUser.email.split('@')[0]);
  const [year, setYear] = useState<number>(existing?.year || 2);
  const [bio, setBio] = useState(
    existing?.bio || 'Student passionate about learning, good music, and good company.'
  );
  const [gender, setGender] = useState<Gender>(existing?.gender || 'PREFER_NOT_TO_SAY');
  const [dateOfBirth, setDateOfBirth] = useState(existing?.dateOfBirth || '2004-02-14');
  const [showDob, setShowDob] = useState(existing?.showDob ?? false);
  const [intent, setIntent] = useState<Intent>(existing?.intent || 'DATING');
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(
    existing?.interests || [ALL_INTERESTS[0], ALL_INTERESTS[1], ALL_INTERESTS[9]]
  );
  const [matchMode, setMatchMode] = useState<MatchMode>(existing?.matchMode || 'INTERESTS');
  const [error, setError] = useState('');

  const toggleInterest = (interest: Interest) => {
    if (selectedInterests.some((i) => i.id === interest.id)) {
      if (selectedInterests.length <= 1) {
        setError('Please keep at least 1 interest selected');
        return;
      }
      setSelectedInterests(selectedInterests.filter((i) => i.id !== interest.id));
      setError('');
    } else {
      if (selectedInterests.length >= 8) {
        setError('You can select up to 8 interests');
        return;
      }
      setSelectedInterests([...selectedInterests, interest]);
      setError('');
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!displayName.trim()) {
        setError('Please enter your display name');
        return;
      }
      if (!bio.trim()) {
        setError('Please write a short bio');
        return;
      }
    } else if (step === 3) {
      if (selectedInterests.length === 0) {
        setError('Please choose at least 1 interest');
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete profile
      const finalProfile: UserProfile = {
        displayName: displayName.trim(),
        year,
        bio: bio.trim(),
        gender,
        showDob,
        dateOfBirth: showDob ? dateOfBirth : undefined,
        intent,
        matchMode,
        interests: selectedInterests,
        avatarUrl:
          existing?.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      };
      onComplete(finalProfile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setError('');
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SpotlightCard
        spotlightColor="rgba(244, 63, 94, 0.12)"
        className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-xl shadow-rose-900/5 text-left relative overflow-hidden"
      >
        <BorderBeam size={200} duration={10} colorFrom="#f43f5e" colorTo="#fbcfe8" />

        {/* Progress Bar & Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-600 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Profile Setup
            </span>
            <span>Step {step} of {totalSteps}</span>
          </div>
          <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Contents */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1.5">
                  Introduce yourself to campus
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  This is how you will appear to fellow students.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Arjun Krishna"
                  className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  College Year
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[1, 2, 3, 4].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYear(y)}
                      className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        year === y
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-rose-50'
                      }`}
                    >
                      {y}
                      <span className="text-[10px] block font-normal opacity-80">
                        {y === 1 ? '1st Year' : y === 2 ? '2nd Year' : y === 3 ? '3rd Year' : 'Final Year'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Short Bio (Bio quote for matches)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={250}
                  placeholder="Tell campus what you love doing, your branch, or a fun icebreaker..."
                  className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white resize-none"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>Keep it friendly & genuine</span>
                  <span>{bio.length}/250</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1.5">
                  Gender &amp; Personal Info
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  Configure your identity and optional date of birth visibility.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Gender Identity (Optional self-selection)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {GENDER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setGender(opt.value)}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between ${
                        gender === opt.value
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-semibold'
                          : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {gender === opt.value && (
                        <Check className="w-4 h-4 text-rose-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date of Birth & Privacy Toggle (as specified in Phase 1 section 13) */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-semibold text-stone-800">Date of Birth</span>
                  </div>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-rose-200 bg-white text-stone-800"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-rose-200/50">
                  <div>
                    <div className="text-xs font-semibold text-stone-800">
                      Show my date of birth to matches
                    </div>
                    <div className="text-[11px] text-stone-500">
                      When turned off, only your college year is displayed.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDob}
                      onChange={(e) => setShowDob(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                  </label>
                </div>
              </div>

              {/* Intent Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  What are you hoping for this Valentine season?
                </label>
                <div className="space-y-2">
                  {INTENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setIntent(opt.value)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        intent === opt.value
                          ? 'bg-rose-50 border-rose-400 text-stone-900 shadow-sm'
                          : 'bg-stone-50/60 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opt.emoji}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-stone-900">
                            {opt.label}
                          </div>
                          <div className="text-[11px] text-stone-500">{opt.desc}</div>
                        </div>
                      </div>
                      {intent === opt.value && <Check className="w-4 h-4 text-rose-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1.5">
                  Select your interests
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  Cupid uses these to pair you with high-compatibility peers ({selectedInterests.length} selected).
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {ALL_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.some((i) => i.id === interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border-rose-600 shadow-sm shadow-rose-500/20'
                          : 'bg-stone-50 hover:bg-rose-50/60 text-stone-700 border-stone-200 hover:border-rose-200'
                      }`}
                    >
                      <span>{interest.emoji}</span>
                      <span>{interest.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1.5">
                  Matching Mode Preference
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  You can toggle this at any time directly on your dashboard.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setMatchMode('INTERESTS')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                    matchMode === 'INTERESTS'
                      ? 'bg-rose-50/80 border-rose-400 text-stone-900 shadow-sm'
                      : 'bg-stone-50/50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-rose-500 flex items-center justify-center shrink-0">
                    {matchMode === 'INTERESTS' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <span>Match based on my interests</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 font-semibold">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      Our Cupid matchmaking algorithm scores mutual passions like coding, indie music, cinema, and photography to find highly compatible students.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMatchMode('RANDOM')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                    matchMode === 'RANDOM'
                      ? 'bg-rose-50/80 border-rose-400 text-stone-900 shadow-sm'
                      : 'bg-stone-50/50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-rose-500 flex items-center justify-center shrink-0">
                    {matchMode === 'RANDOM' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-stone-900">
                      Random eligible match
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      Pure serendipity! Cupid randomly selects an eligible student from any branch or year without filtering by interest overlap.
                    </p>
                  </div>
                </button>
              </div>

              {/* Ready to go banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-100/70 to-pink-50 border border-rose-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div className="text-xs text-stone-700">
                  <span className="font-semibold text-stone-900">You are ready!</span> You can match asynchronously, view your matches, and start real-time conversations.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 pt-6 border-t border-rose-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step === totalSteps ? (
            <GlowButton
              type="button"
              id="onboarding-next-btn"
              onClick={handleNext}
              variant="rose"
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span>Complete &amp; Enter Dashboard</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </GlowButton>
          ) : (
            <button
              type="button"
              id="onboarding-next-btn"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
};
