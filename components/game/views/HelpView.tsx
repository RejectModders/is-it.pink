'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GameState } from '@/lib/game-constants';

interface HelpViewProps {
  setGameState: (state: GameState) => void;
  playSound: (type: 'correct' | 'wrong' | 'click') => void;
}

export function HelpView({
  setGameState,
  playSound,
}: HelpViewProps) {
  return (
    <motion.div 
      key="help"
      className="text-center w-full max-w-md space-y-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.1 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
        <Sparkles className="text-primary w-6 h-6" />
        How to Play
      </h2>
      
      <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border text-left space-y-4 text-sm">
        {[
          { title: 'The Goal', content: 'A color appears. You decide: is it pink or not? Sounds easy... but watch out for tricky imposters!' },
          { title: 'Controls', content: <><span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">A</span> / <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">Left</span> = Pink  |  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">D</span> / <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">Right</span> = Not Pink</> },
          { title: 'Streaks & Multipliers', content: 'Correct answers in a row increase your multiplier up to 5x! One wrong answer resets it.' },
          { title: 'Game Modes', content: <><strong>Classic:</strong> 3 lives, survive as long as you can. <strong>Timed:</strong> 60 seconds, score as high as possible. <strong>Daily:</strong> 20 colors, 1 life, same for everyone!</> },
          { title: 'Color Blind Mode', content: 'Toggle the eye icon in the header to always show color names and hex codes.' },
        ].map((item) => (
          <motion.div 
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.08 }}
          >
            <h3 className="font-bold mb-1 text-primary">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.content}</p>
          </motion.div>
        ))}
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
