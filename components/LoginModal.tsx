'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Mail, X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DEMO_USERS } from '@/lib/mock-data';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();

    if (!clean) {
      setError('Please enter your college email address');
      return;
    }

    if (!clean.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // College domain validation
    if (!clean.endsWith('@sahrdaya.ac.in')) {
      setError('MATCH@SAHRDAYA is restricted to students with @sahrdaya.ac.in emails');
      return;
    }

    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(clean);
    }, 600);
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setError('');
  };

  return (
    <div
      id="login-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 overflow-hidden text-left"
      >
        {/* Ambient header glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              MATCH<span className="text-rose-500 font-sans text-sm font-semibold">@SAHRDAYA</span>
            </h2>
            <p className="text-xs text-stone-500">Sign in with your campus identity</p>
          </div>
        </div>

        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          Welcome to Sahrdaya&apos;s Valentine Matching platform. Enter your official Sahrdaya institutional email address to begin.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="college-email-input"
              className="block text-xs font-semibold text-stone-700 mb-1.5"
            >
              Your Sahrdaya Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="college-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="name@sahrdaya.ac.in"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-stone-50/60 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  error
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-rose-200/80 focus:ring-rose-200 focus:border-rose-400'
                }`}
                autoFocus
              />
            </div>
            {error ? (
              <p className="text-[11px] text-red-600 mt-1.5 font-medium">{error}</p>
            ) : (
              <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Must end with <code className="text-rose-600 font-mono">@sahrdaya.ac.in</code>
              </p>
            )}
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Connecting with Sahrdaya SSO...</span>
            ) : (
              <>
                <span>Continue with Sahrdaya Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-rose-100">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center justify-between">
            <span>Quick Demo Accounts</span>
            <span className="text-rose-600 font-normal">Click to fill</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickFill(u.email)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-50/80 hover:bg-rose-100 text-stone-700 hover:text-rose-800 text-xs font-medium border border-rose-200/60 transition-colors flex items-center gap-1.5"
              >
                <span>{u.profile?.displayName.split(' ')[0]}</span>
                <span className="text-[10px] text-rose-500 font-mono">
                  {u.email.split('@')[0]}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-stone-400 mt-3 text-center">
            Development Authentication (Phase 1) · Production Google OAuth integration planned for Phase 2
          </p>
        </div>
      </motion.div>
    </div>
  );
};
