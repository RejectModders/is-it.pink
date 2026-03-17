'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { COLOR_THEMES, type ColorTheme } from '@/lib/game-constants';

interface ConfettiProps {
  showConfetti: boolean;
  colorTheme: ColorTheme;
}

export function Confetti({ showConfetti, colorTheme }: ConfettiProps) {
  return (
    <AnimatePresence>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: [COLOR_THEMES[colorTheme].primary, COLOR_THEMES[colorTheme].accent, '#fbbf24', '#10b981'][Math.floor(Math.random() * 4)],
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{ 
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800, 
                opacity: 0, 
                rotate: Math.random() * 720 - 360,
                x: Math.random() * 200 - 100,
              }}
              transition={{ duration: 1 + Math.random() * 0.5, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
