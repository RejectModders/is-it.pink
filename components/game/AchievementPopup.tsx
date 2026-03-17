'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ACHIEVEMENTS } from '@/lib/game-constants';

interface AchievementPopupProps {
  newAchievement: typeof ACHIEVEMENTS[number] | null;
}

export function AchievementPopup({ newAchievement }: AchievementPopupProps) {
  return (
    <AnimatePresence>
      {newAchievement && (
        <motion.div
          className="fixed top-20 left-1/2 z-[100] -translate-x-1/2"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
        >
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <newAchievement.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium opacity-80">Achievement Unlocked!</div>
              <div className="font-bold">{newAchievement.name}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
