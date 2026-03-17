'use client';

import { Award, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ACHIEVEMENTS, type Stats, type GameState } from '@/lib/game-constants';

interface AchievementsViewProps {
  stats: Stats;
  setGameState: (state: GameState) => void;
  playSound: (type: 'correct' | 'wrong' | 'click') => void;
}

export function AchievementsView({
  stats,
  setGameState,
  playSound,
}: AchievementsViewProps) {
  return (
    <motion.div 
      key="achievements"
      className="text-center w-full max-w-md space-y-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.1 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
        <Award className="text-primary w-6 h-6" />
        Achievements
      </h2>
      <p className="text-muted-foreground text-sm">
        {stats.unlockedAchievements.length} / {ACHIEVEMENTS.length} unlocked
      </p>
      
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = stats.unlockedAchievements.includes(achievement.id);
            return (
              <motion.div 
                key={achievement.id}
                className={`flex items-center gap-3 p-4 border-b border-border last:border-0 ${unlocked ? '' : 'opacity-50'}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: unlocked ? 1 : 0.5, x: 0 }}
                transition={{ duration: 0.08 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  unlocked ? 'bg-gradient-to-br from-primary to-accent' : 'bg-muted'
                }`}>
                  {unlocked ? (
                    <achievement.icon className="w-6 h-6 text-primary-foreground" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold">{achievement.name}</div>
                  <div className="text-sm text-muted-foreground">{achievement.description}</div>
                </div>
                {unlocked && <Check className="w-5 h-5 text-primary shrink-0" />}
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.button
        onClick={() => {
          playSound('click');
          setGameState('menu');
        }}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.06 }}
      >
        Back to Menu
      </motion.button>
    </motion.div>
  );
}
