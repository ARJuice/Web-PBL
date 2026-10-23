'use client';

import React from 'react';
import { Heart, Sparkles, MessageCircleHeart, Flame, User as UserIcon, LogOut, ArrowRightLeft } from 'lucide-react';
import { User } from '@/types/match';
import { DEMO_USERS } from '@/lib/mock-data';

interface NavbarProps {
  currentUser: User | null;
  activeView: 'landing' | 'dashboard' | 'chat' | 'onboarding' | 'matching';
  unreadTotal: number;
  onNavigate: (view: 'landing' | 'dashboard' | 'chat' | 'onboarding') => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  unreadTotal,
  onNavigate,
  onOpenSettings,
  onLogout,
  onSwitchUser,
  onOpenLogin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <button
          onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-98"
          id="navbar-brand-button"
        >
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-stone-900 group-hover:text-rose-600 transition-colors">
                MATCH<span className="text-rose-500 font-sans text-sm font-semibold">@SAHRDAYA</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-rose-50 text-rose-600 border border-rose-200">
                Valentine &apos;26
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden md:block leading-none">
              Meet someone worth talking to.
            </p>
          </div>
        </button>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Navigation Pills */}
              <nav className="flex items-center gap-1 bg-rose-50/80 p-1 rounded-2xl border border-rose-100">
                <button
                  id="nav-dashboard-tab"
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    activeView === 'dashboard'
                      ? 'bg-white text-rose-700 shadow-sm shadow-rose-200 font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Match</span>
                </button>
                <button
                  id="nav-chat-tab"
                  onClick={() => onNavigate('chat')}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    activeView === 'chat'
                      ? 'bg-white text-rose-700 shadow-sm shadow-rose-200 font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <MessageCircleHeart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Conversations</span>
                  {unreadTotal > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadTotal}
                    </span>
                  )}
                </button>
              </nav>

              {/* Multi-User Quick Switcher for Testing (as requested in spec section 46 & 62) */}
              <div className="hidden lg:flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-stone-200 text-xs">
                <ArrowRightLeft className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-400 text-[11px]">Test as:</span>
                {DEMO_USERS.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onSwitchUser(u)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all ${
                      currentUser.id === u.id
                        ? 'bg-rose-100 text-rose-800 font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {u.profile?.displayName.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Profile Pill & Settings */}
              <button
                id="navbar-profile-settings-btn"
                onClick={onOpenSettings}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-2xl bg-white border border-rose-200/80 hover:border-rose-300 shadow-sm hover:shadow transition-all group text-left"
              >
                {currentUser.profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.profile.avatarUrl}
                    alt={currentUser.profile.displayName}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                    {currentUser.profile?.displayName?.charAt(0) || 'S'}
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-stone-800 group-hover:text-rose-600 transition-colors flex items-center gap-1">
                    {currentUser.profile?.displayName || 'My Profile'}
                  </div>
                  <div className="text-[10px] text-stone-500 leading-tight">
                    {currentUser.profile?.year ? `Year ${currentUser.profile.year}` : 'Student'}
                  </div>
                </div>
              </button>

              <button
                id="navbar-logout-btn"
                onClick={onLogout}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-600 flex items-center justify-center transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="navbar-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>College Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
