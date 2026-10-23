'use client';

import React from 'react';
import { Heart, MessageCircleHeart, Flame, LogOut, Settings } from 'lucide-react';
import { User } from '@/types/match';
import { ShinyText } from '@/components/ui/ShinyText';

interface NavbarProps {
  currentUser: User | null;
  activeView: 'landing' | 'dashboard' | 'chat' | 'onboarding' | 'matching';
  unreadTotal: number;
  onNavigate: (view: 'landing' | 'dashboard' | 'chat' | 'onboarding') => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  unreadTotal,
  onNavigate,
  onOpenSettings,
  onLogout,
  onOpenLogin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-rose-100 transition-all">
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
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-rose-50 text-rose-600 border border-rose-200">
                <ShinyText text="Valentine '26" speed={3} className="font-bold" />
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

              {/* Student Profile Pill & Badges */}
              <button
                id="navbar-profile-settings-btn"
                onClick={onOpenSettings}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-2xl bg-white border border-rose-200/80 hover:border-rose-300 shadow-xs hover:shadow transition-all group text-left"
                title="Profile & Settings"
              >
                {currentUser.profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.profile.avatarUrl}
                    alt={currentUser.profile.displayName}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 flex items-center justify-center font-bold text-xs ring-1 ring-rose-200">
                    {currentUser.profile?.displayName?.charAt(0) || 'S'}
                  </div>
                )}
                <div className="hidden sm:flex flex-col">
                  <div className="text-xs font-semibold text-stone-800 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                    <span>{currentUser.profile?.displayName || 'My Profile'}</span>
                  </div>
                  <div className="text-[10px] font-medium text-rose-600 leading-none">
                    {currentUser.profile?.year ? `Year ${currentUser.profile.year}` : 'Student'}
                  </div>
                </div>
              </button>

              {/* Settings Action Button */}
              <button
                id="navbar-settings-btn"
                onClick={onOpenSettings}
                className="w-8 h-8 rounded-xl bg-stone-100/90 hover:bg-rose-50 text-stone-600 hover:text-rose-600 border border-stone-200/60 hover:border-rose-200 flex items-center justify-center transition-colors"
                title="Settings"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Sign Out Action Button */}
              <button
                id="navbar-logout-btn"
                onClick={onLogout}
                className="w-8 h-8 rounded-xl bg-stone-100/90 hover:bg-rose-50 text-stone-600 hover:text-rose-600 border border-stone-200/60 hover:border-rose-200 flex items-center justify-center transition-colors"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="navbar-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-98"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
