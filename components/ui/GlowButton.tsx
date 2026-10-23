'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

export interface GlowButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'rose' | 'gold' | 'velvet';
  glowEffect?: boolean;
}

export function GlowButton({
  children,
  className,
  variant = 'rose',
  glowEffect = true,
  ...props
}: GlowButtonProps) {
  const variantStyles = {
    rose: 'bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white shadow-rose-500/25 border-rose-400/30',
    gold: 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-velvet-950 shadow-amber-500/25 border-amber-300/40 font-semibold',
    velvet: 'bg-gradient-to-r from-velvet-950 via-rose-950 to-velvet-950 text-rose-100 shadow-rose-950/40 border-rose-900/50',
  };

  const glowColors = {
    rose: 'from-rose-500/50 via-pink-500/40 to-rose-600/50',
    gold: 'from-amber-400/60 via-yellow-400/50 to-amber-500/60',
    velvet: 'from-rose-900/40 via-velvet-950/50 to-pink-900/40',
  };

  return (
    <div className="relative inline-block group">
      {/* Dynamic Animated Glow Aura */}
      {glowEffect && (
        <div
          className={cn(
            'absolute -inset-1 rounded-2xl bg-gradient-to-r opacity-50 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:blur-xl',
            glowColors[variant]
          )}
        />
      )}

      {/* Interactive Button */}
      <motion.button
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          'relative flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium transition-all duration-300 shadow-lg border backdrop-blur-md cursor-pointer select-none',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    </div>
  );
}
