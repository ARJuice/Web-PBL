'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Mail, X, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { BorderBeam } from '@/components/ui/BorderBeam';

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

  const clean = email.trim().toLowerCase();
  const hasAt = clean.includes('@');
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clean) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(clean);
    }, 700);
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
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 overflow-hidden text-left"
      >
        <BorderBeam size={160} duration={8} colorFrom="#f43f5e" colorTo="#fbcfe8" />
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
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                MATCH<span className="text-rose-500 font-sans text-sm font-semibold">@ALL</span>
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase bg-rose-50 text-rose-600 border border-rose-200">
                Campus Portal
              </span>
            </div>
            <p className="text-xs text-stone-500">Meet someone worth talking to</p>
          </div>
        </div>

        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          Welcome to the MATCH@ALL Valentine Matching platform. Enter your email address to sign in or get started.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="college-email-input"
              className="block text-xs font-semibold text-stone-700 mb-1.5"
            >
              Institutional Email
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
                placeholder="you@college.edu"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-stone-50/60 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-60 ${
                  error
                    ? 'border-red-300 focus:ring-red-200'
                    : isValidEmail
                    ? 'border-emerald-300 focus:ring-emerald-200'
                    : 'border-rose-200/80 focus:ring-rose-200 focus:border-rose-400'
                }`}
                autoFocus
              />
            </div>

            {/* Validation / Guidance Text */}
            <div className="mt-2 text-[11px] leading-tight">
              {error ? (
                <p className="text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </p>
              ) : isValidEmail ? (
                <p className="text-emerald-600 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span>Verified email address</span>
                </p>
              ) : hasAt ? (
                <p className="text-amber-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Add the domain after the @ (e.g. college.edu)</span>
                </p>
              ) : (
                <p className="text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Enter your email address to sign in or get started</span>
                </p>
              )}
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Continue to Matching</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security & Moderation Footer */}
        <div className="mt-6 pt-5 border-t border-rose-100 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Encrypted &amp; Student Moderated</span>
          </div>
          <span className="text-stone-400 font-medium">MATCH@ALL</span>
        </div>
      </motion.div>
    </div>
  );
};
