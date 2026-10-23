'use client';

import React, { useEffect, useRef } from 'react';

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  scale: number;
}

interface FloatingHeartsBackgroundProps {
  className?: string;
  heartCount?: number;
  speedMultiplier?: number;
  interactive?: boolean;
}

export function FloatingHeartsBackground({
  className = '',
  heartCount = 28,
  speedMultiplier = 1,
  interactive = true,
}: FloatingHeartsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const colors = [
      'rgba(244, 63, 94, ',  // Rose-500
      'rgba(251, 113, 133, ', // Rose-400
      'rgba(253, 164, 175, ', // Rose-300
      'rgba(244, 114, 182, ', // Pink-400
      'rgba(251, 191, 36, ',  // Amber-400 (Gold Sparkles)
    ];

    const particles: HeartParticle[] = [];

    function createParticle(initialY?: number): HeartParticle {
      return {
        x: Math.random() * width,
        y: initialY ?? height + Math.random() * 50,
        size: Math.random() * 14 + 10,
        speedY: (Math.random() * 0.8 + 0.3) * speedMultiplier,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.45 + 0.15,
        fadeSpeed: (Math.random() * 0.003 + 0.001),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        scale: 1,
      };
    }

    // Populate initial hearts across vertical viewport
    for (let i = 0; i < heartCount; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    function drawHeart(x: number, y: number, size: number, color: string, opacity: number, rotation: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.15);
      // bottom right curve
      ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fillStyle = `${color}${opacity})`;
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.y -= p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.4 + p.speedX;
        p.rotation += p.rotationSpeed;

        // Subtle interactive mouse repulsion
        if (interactive && mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const angle = Math.atan2(dy, dx);
            const force = (120 - dist) * 0.02;
            p.x += Math.cos(angle) * force;
            p.y += Math.sin(angle) * force;
          }
        }

        // Reset if float out of top
        if (p.y < -40 || p.x < -30 || p.x > width + 30) {
          particles[index] = createParticle();
        }

        drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [heartCount, speedMultiplier, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
