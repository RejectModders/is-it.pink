'use client';

import { Github, Trophy, Heart, Share2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GameState } from '@/lib/game-constants';

interface GameOverViewProps {
  score: number;
  highScore: number;
  maxStreak: number;
  accuracy: number;
  isDailyMode: boolean;
  startGame: (daily?: boolean) => void;
  setGameState: (state: GameState) => void;
  setShowShareModal: (show: boolean) => void;
  playSound: (type: 'correct' | 'wrong' | 'click') => void;
}

export function GameOverView({
  score,
  highScore,
  maxStreak,
  accuracy,
  isDailyMode,
  startGame,
  setGameState,
  setShowShareModal,
  playSound,
}: GameOverViewProps) {
  return (
    <motion.div 
      key="gameover"
      className="text-center w-full max-w-md space-y-4 sm:space-y-5 py-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.12 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          {score >= highScore && score > 0 ? (
            <Trophy className="w-10 h-10 text-primary-foreground" />
          ) : (
            <Heart className="w-10 h-10 text-primary-foreground" />
          )}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-1">
          {isDailyMode ? 'Daily Complete!' : 'Game Over'}
        </h2>
        <p className="text-muted-foreground">
          {score >= highScore && score > 0 ? 'New high score!' : 'Better luck next time!'}
        </p>
      </motion.div>

      <motion.div 
        className="bg-card p-4 sm:p-5 rounded-2xl border border-border space-y-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
      >
        {[
          { label: 'Final Score', value: score, highlight: true },
          { label: 'Best Streak', value: maxStreak },
          { label: 'Accuracy', value: `${accuracy}%` },
          { label: 'Personal Best', value: highScore, isPrimary: true },
        ].map((item, i) => (
          <div key={item.label} className={`flex justify-between items-center py-3 ${i < 3 ? 'border-b border-border' : ''}`}>
            <span className="text-muted-foreground">{item.label}</span>
            <span className={`font-bold text-xl ${item.highlight ? 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent' : ''} ${item.isPrimary ? 'text-primary' : ''}`}>
              {item.value}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <motion.button
          onClick={() => {
            playSound('click');
            startGame(isDailyMode ? false : undefined);
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.06 }}
        >
          <RotateCcw className="w-5 h-5" /> {isDailyMode ? 'Play Classic' : 'Play Again'}
        </motion.button>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={() => {
              playSound('click');
              setGameState('menu');
            }}
            className="py-3 rounded-xl border border-border hover:bg-muted transition-colors font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.06 }}
          >
            Menu
          </motion.button>
          <motion.button
            onClick={() => {
              playSound('click');
              setShowShareModal(true);
            }}
            className="py-3 rounded-xl border border-border hover:bg-muted transition-colors font-semibold flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.06 }}
          >
            <Share2 className="w-4 h-4" /> Share
          </motion.button>
        </div>
      </motion.div>

      <motion.a
        href="https://github.com/RejectModders/is-it.pink"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.06 }}
      >
        <Github className="w-4 h-4" />
        Star on GitHub
      </motion.a>
    </motion.div>
  );
}
