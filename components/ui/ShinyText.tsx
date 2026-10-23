'use client';

import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

/**
 * ShinyText: ReactBits-inspired shimmer text effect with animated metallic gloss.
 */
export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-stone-900 via-rose-500 to-stone-900 bg-[length:200%_auto] ${
        disabled ? '' : 'animate-shimmer'
      } ${className}`}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
};
