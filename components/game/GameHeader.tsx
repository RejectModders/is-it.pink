'use client';

import { Github, Moon, Sun, Volume2, VolumeX, Eye, Vibrate } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface GameHeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  colorBlindMode: boolean;
  setColorBlindMode: (value: boolean) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (value: boolean) => void;
  playSound: (type: 'correct' | 'wrong' | 'click') => void;
  triggerHaptic: (type: 'light' | 'medium' | 'heavy') => void;
}

export function GameHeader({
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  colorBlindMode,
  setColorBlindMode,
  hapticEnabled,
  setHapticEnabled,
  playSound,
  triggerHaptic,
}: GameHeaderProps) {
  return (
    <motion.header 
      className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-40"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div 
        className="flex items-center gap-2 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.06 }}
      >
        <Image 
            src="/favicon.png" 
            alt="is it pink?" 
            width={36} 
            height={36}
            loading="eager"
            className="w-8 h-8 sm:w-9 sm:h-9"
          />
        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">is it pink?</h1>
      </motion.div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <motion.button
          onClick={() => {
            playSound('click');
            setColorBlindMode(!colorBlindMode);
            localStorage.setItem('pinkGameColorBlind', JSON.stringify(!colorBlindMode));
          }}
          className={`p-2 sm:p-2.5 rounded-xl transition-colors ${colorBlindMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          title="Color blind mode"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.08 }}
        >
          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setHapticEnabled(!hapticEnabled);
            localStorage.setItem('pinkGameHaptic', JSON.stringify(!hapticEnabled));
            if (!hapticEnabled) triggerHaptic('light');
          }}
          className={`p-2 sm:p-2.5 rounded-xl transition-colors ${hapticEnabled ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          title="Haptic feedback"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.08 }}
        >
          <Vibrate className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
        
        <motion.button
          onClick={() => {
            playSound('click');
            setSoundEnabled(!soundEnabled);
            localStorage.setItem('pinkGameSound', JSON.stringify(!soundEnabled));
          }}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-muted transition-colors"
          title="Toggle sound"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.08 }}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
        </motion.button>
        
        <motion.button
          onClick={() => {
            playSound('click');
            setDarkMode(!darkMode);
          }}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-muted transition-colors"
          title="Toggle dark mode"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.08 }}
        >
          {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </motion.button>
        
        <motion.a
          href="https://github.com/RejectModders/is-it.pink"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-medium text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.06 }}
        >
          <Github className="w-4 h-4" />
          GitHub
        </motion.a>
      </div>
    </motion.header>
  );
}
