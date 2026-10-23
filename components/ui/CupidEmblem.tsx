'use client';

import React from 'react';

interface CupidEmblemProps {
  size?: number;
  glow?: boolean;
  className?: string;
}

export const CupidEmblem: React.FC<CupidEmblemProps> = ({
  size = 32,
  glow = true,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-rose-400/40 blur-md animate-pulse pointer-events-none"
          style={{ transform: 'scale(1.3)' }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        <defs>
          <linearGradient id="cupidGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Left Wing */}
        <path
          d="M32 45 C20 30 6 36 10 52 C12 60 22 64 34 54 C31 63 20 70 28 73 C35 75 42 66 43 56 Z"
          fill="url(#wingGrad)"
          stroke="#f43f5e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Right Wing */}
        <path
          d="M68 45 C80 30 94 36 90 52 C88 60 78 64 66 54 C69 63 80 70 72 73 C65 75 58 66 57 56 Z"
          fill="url(#wingGrad)"
          stroke="#f43f5e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Central Cupid Heart */}
        <path
          d="M50 78 C50 78 24 60 24 41 C24 30.5 32.5 22 43 22 C47.5 22 50 25 50 25 C50 25 52.5 22 57 22 C67.5 22 76 30.5 76 41 C76 60 50 78 50 78 Z"
          fill="url(#cupidGrad)"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Golden Cupid Arrow traversing through heart */}
        <g stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round">
          {/* Arrow shaft */}
          <line x1="20" y1="72" x2="80" y2="28" />
          {/* Arrow head */}
          <polyline points="73,26 82,27 80,36" fill="none" strokeWidth="2.5" />
          {/* Arrow feathers */}
          <line x1="20" y1="72" x2="16" y2="67" />
          <line x1="24" y1="75" x2="20" y2="70" />
          <line x1="23" y1="78" x2="27" y2="74" />
        </g>

        {/* Sparkle glint on heart */}
        <circle cx="39" cy="34" r="3" fill="#fff" opacity="0.8" />
        <circle cx="43" cy="39" r="1.5" fill="#fff" opacity="0.6" />
      </svg>
    </div>
  );
};
