'use client';

import { Github, Trophy, Zap, Target, Heart, Info, Clock, Crown, ChevronRight, Calendar, Check, Award, BarChart3, Palette, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GameState } from '@/lib/game-constants';

interface MenuViewProps {
  highScore: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  setDifficulty: (d: 'easy' | 'normal' | 'hard' | 'extreme') => void;
  timedMode: boolean;
  setTimedMode: (value: boolean) => void;
  hasDoneDaily: boolean;
  startGame: (daily?: boolean) => void;
  setGameState: (state: GameState) => void;
  playSound: (type: 'correct' | 'wrong' | 'click') => void;
}

export function MenuView({
  highScore,
  difficulty,
  setDifficulty,
  timedMode,
  setTimedMode,
  hasDoneDaily,
  startGame,
  setGameState,
  playSound,
}: MenuViewProps) {
  return (
    <motion.div 
      key="menu"
      className="text-center w-full max-w-md space-y-4 sm:space-y-5 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.12 }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl shadow-primary/40 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
          </motion.div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-muted-foreground">Welcome to</h2>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">is it pink?</h1>
      </motion.div>

      {/* Daily Challenge Banner */}
      <motion.button
        onClick={() => {
          playSound('click');
          if (!hasDoneDaily) {
            startGame(true);
          }
        }}
        className={`w-full p-4 rounded-2xl border-2 text-left relative overflow-hidden ${
          hasDoneDaily 
            ? 'border-muted bg-muted/30 cursor-not-allowed' 
            : 'border-primary bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        whileHover={!hasDoneDaily ? { scale: 1.02 } : {}}
        whileTap={!hasDoneDaily ? { scale: 0.98 } : {}}
        disabled={hasDoneDaily}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasDoneDaily ? 'bg-muted' : 'bg-primary'}`}>
              {hasDoneDaily ? <Check className="w-6 h-6 text-muted-foreground" /> : <Calendar className="w-6 h-6 text-primary-foreground" />}
            </div>
            <div>
              <div className="font-bold text-lg">Daily Challenge</div>
              <div className="text-sm text-muted-foreground">
                {hasDoneDaily ? 'Completed! Come back tomorrow' : '20 colors, 1 life. Same for everyone!'}
              </div>
            </div>
          </div>
          {!hasDoneDaily && <ChevronRight className="w-5 h-5 text-primary" />}
        </div>
      </motion.button>

      <motion.div 
        className="bg-card p-4 sm:p-5 rounded-2xl border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
      >
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { icon: Target, text: 'Guess colors' },
            { icon: Zap, text: 'Build combos' },
            { icon: Heart, text: '3 lives' },
            { icon: Trophy, text: 'High scores' },
          ].map((item) => (
            <motion.div 
              key={item.text}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.08 }}
            >
              <item.icon className="text-primary shrink-0 w-4 h-4" />
              <span className="font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Difficulty</label>
          <div className="grid grid-cols-4 gap-2">
            {(['easy', 'normal', 'hard', 'extreme'] as const).map((d) => (
              <motion.button
                key={d}
                onClick={() => {
                  playSound('click');
                  setDifficulty(d);
                }}
                className={`py-2.5 rounded-xl font-semibold transition-all capitalize text-sm ${
                  difficulty === d
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.08 }}
              >
                {d}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Game Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              onClick={() => {
                playSound('click');
                setTimedMode(false);
              }}
              className={`py-3 rounded-xl font-semibold transition-all text-sm flex items-center justify-center gap-2 ${
                !timedMode
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.06 }}
            >
              <Heart className="w-4 h-4" /> Classic
            </motion.button>
            <motion.button
              onClick={() => {
                playSound('click');
                setTimedMode(true);
              }}
              className={`py-3 rounded-xl font-semibold transition-all text-sm flex items-center justify-center gap-2 ${
                timedMode
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.06 }}
            >
              <Clock className="w-4 h-4" /> Timed
            </motion.button>
          </div>
        </motion.div>

        <motion.button
          onClick={() => {
            playSound('click');
            startGame();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-90 transition-all text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgb(236 72 153 / 0.4)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.08 }}
        >
          Play Now <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-4 gap-2">
        <motion.button
          onClick={() => {
            playSound('click');
            setGameState('help');
          }}
          className="py-3 rounded-xl border border-border hover:bg-muted text-sm font-semibold flex items-center justify-center gap-1.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.08 }}
        >
          <Info className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={() => {
            playSound('click');
            setGameState('stats');
          }}
          className="py-3 rounded-xl border border-border hover:bg-muted text-sm font-semibold flex items-center justify-center gap-1.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.08 }}
        >
          <BarChart3 className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={() => {
            playSound('click');
            setGameState('achievements');
          }}
          className="py-3 rounded-xl border border-border hover:bg-muted text-sm font-semibold flex items-center justify-center gap-1.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.08 }}
        >
          <Award className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={() => {
            playSound('click');
            setGameState('settings');
          }}
          className="py-3 rounded-xl border border-border hover:bg-muted text-sm font-semibold flex items-center justify-center gap-1.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.08 }}
        >
          <Palette className="w-4 h-4" />
        </motion.button>
      </div>

      {highScore > 0 && (
        <motion.div 
          className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-xl border border-primary/20 flex items-center justify-between"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground font-medium">Personal Best</span>
          </div>
          <span className="font-bold text-primary text-xl">{highScore}</span>
        </motion.div>
      )}

      <motion.a
        href="https://github.com/RejectModders/is-it.pink"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-muted text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.08 }}
      >
        <Github className="w-4 h-4" />
        Open Source on GitHub
      </motion.a>
    </motion.div>
  );
}
