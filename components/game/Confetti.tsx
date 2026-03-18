'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { COLOR_THEMES, type ColorTheme } from '@/lib/game-constants';

interface ConfettiProps {
  showConfetti: boolean;
  colorTheme: ColorTheme;
}

// Pre-generate confetti pieces to avoid recalculating on every render
const generateConfettiPieces = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    rotate: Math.random() * 720 - 360,
    xOffset: Math.random() * 200 - 100,
    duration: 1.2 + Math.random() * 0.4,
    colorIndex: Math.floor(Math.random() * 4),
    delay: Math.random() * 0.15,
  }));
};

export function Confetti({ showConfetti, colorTheme }: ConfettiProps) {
  // Memoize confetti pieces - only regenerate when showConfetti becomes true
  const pieces = useMemo(() => {
    if (!showConfetti) return [];
    // Reduced from 50 to 20 pieces for better performance
    return generateConfettiPieces(20);
  }, [showConfetti]);

  const colors = useMemo(() => [
    COLOR_THEMES[colorTheme].primary,
    COLOR_THEMES[colorTheme].accent,
    '#fbbf24',
    '#10b981'
  ], [colorTheme]);

  return (
    <AnimatePresence>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-2 h-2 rounded-sm will-change-transform"
              style={{
                left: `${piece.left}%`,
                backgroundColor: colors[piece.colorIndex],
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{ 
                y: '100vh',
                opacity: 0, 
                rotate: piece.rotate,
                x: piece.xOffset,
              }}
              transition={{ 
                duration: piece.duration, 
                ease: 'easeOut',
                delay: piece.delay,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
