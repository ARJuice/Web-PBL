'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, X, Calendar, Check, LogOut, Heart } from 'lucide-react';
import { Gender, Intent, MatchMode, User, UserProfile } from '@/types/match';
import { ALL_INTERESTS } from '@/lib/mock-data';
import { BorderBeam } from '@/components/ui/BorderBeam';

interface SettingsModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSaveProfile,
  onLogout,
}) => {
  const profile = currentUser.profile;

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [year, setYear] = useState(profile?.year || 1);
  const [bio, setBio] = useState(profile?.bio || '');
  const [gender, setGender] = useState<Gender>(profile?.gender || 'PREFER_NOT_TO_SAY');
  const [intent, setIntent] = useState<Intent>(profile?.intent || 'DATING');
  const [matchMode, setMatchMode] = useState<MatchMode>(profile?.matchMode || 'INTERESTS');
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth || '2004-02-14');
  const [showDob, setShowDob] = useState(profile?.showDob ?? false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updated: UserProfile = {
      ...profile,
      displayName: displayName.trim() || profile.displayName,
      year,
      bio: bio.trim(),
      gender,
      intent,
      matchMode,
      showDob,
      dateOfBirth: showDob ? dateOfBirth : undefined,
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto text-left overflow-hidden"
      >
        <BorderBeam size={180} duration={8} colorFrom="#f43f5e" colorTo="#fbcfe8" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
          <Settings className="w-4 h-4" />
          <span>MATCH@ALL SETTINGS</span>
        </div>

        <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
          Profile &amp; Preferences
        </h3>
        <p className="text-xs text-stone-500 mb-5">
          Update how you appear to other campus students.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              College Year
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    year === y
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Year {y}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              maxLength={250}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
            />
          </div>

          {/* DOB and Privacy */}
          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                Date of Birth
              </span>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="px-2 py-0.5 rounded border border-rose-200 bg-white text-stone-800 text-xs"
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-rose-200/50">
              <span className="text-stone-600">Show DOB on match card</span>
              <input
                type="checkbox"
                checked={showDob}
                onChange={(e) => setShowDob(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-500"
              />
            </div>
          </div>

          {/* Intent */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Intent
            </label>
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value as Intent)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white"
            >
              <option value="DATING">Dating &amp; Romance 🌹</option>
              <option value="FRIENDSHIP">Friendship 🤝</option>
              <option value="PARTNER">Long-term Partner 💍</option>
              <option value="LIKE_MINDED_FRIEND">Like-Minded Peer ✨</option>
              <option value="JUST_CHAT">Casual Chat ☕</option>
            </select>
          </div>

          {/* Matching Mode */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Default Matching Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMatchMode('INTERESTS')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                  matchMode === 'INTERESTS'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                Interest-based
              </button>
              <button
                type="button"
                onClick={() => setMatchMode('RANDOM')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                  matchMode === 'RANDOM'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                Random match
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-rose-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="save-settings-btn"
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-semibold shadow-sm hover:from-rose-600 hover:to-rose-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
