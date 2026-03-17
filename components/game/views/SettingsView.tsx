'use client';

import { Palette, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { SOUND_PACKS, COLOR_THEMES, type SoundPack, type ColorTheme, type GameState } from '@/lib/game-constants';

interface SettingsViewProps {
  soundPack: SoundPack;
  setSoundPack: (pack: SoundPack) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  setGameState: (state: GameState) => void;
  playSound: (type: 'correct' | 'wrong' | 'click') => void;
}

export function SettingsView({
  soundPack,
  setSoundPack,
  colorTheme,
  setColorTheme,
  setGameState,
  playSound,
}: SettingsViewProps) {
  return (
    <motion.div 
      key="settings"
      className="text-center w-full max-w-md space-y-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.1 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
        <Palette className="text-primary w-6 h-6" />
        Customize
      </h2>
      
      {/* Sound Packs */}
      <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border text-left">
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Sound Pack</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(SOUND_PACKS) as SoundPack[]).map((pack) => (
            <motion.button
              key={pack}
              onClick={() => {
                setSoundPack(pack);
                localStorage.setItem('pinkGameSoundPack', pack);
                playSound('correct');
              }}
              className={`p-3 rounded-xl text-left transition-all ${
                soundPack === pack
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.06 }}
            >
              <div className="font-semibold text-sm">{SOUND_PACKS[pack].name}</div>
              <div className={`text-xs ${soundPack === pack ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {SOUND_PACKS[pack].description}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color Themes */}
      <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border text-left">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Color Theme</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(COLOR_THEMES) as ColorTheme[]).map((theme) => (
            <motion.button
              key={theme}
              onClick={() => {
                setColorTheme(theme);
                localStorage.setItem('pinkGameTheme', theme);
                playSound('click');
              }}
              className={`p-3 rounded-xl text-left transition-all relative overflow-hidden ${
                colorTheme === theme
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : ''
              }`}
              style={{ 
                background: `linear-gradient(135deg, ${COLOR_THEMES[theme].primary}20, ${COLOR_THEMES[theme].accent}20)` 
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.06 }}
            >
              <div 
                className="w-full h-2 rounded-full mb-2"
                style={{ background: `linear-gradient(to right, ${COLOR_THEMES[theme].primary}, ${COLOR_THEMES[theme].accent})` }}
              />
              <div className="font-semibold text-sm text-card-foreground">{COLOR_THEMES[theme].name}</div>
              <div className="text-xs text-muted-foreground">{COLOR_THEMES[theme].description}</div>
            </motion.button>
          ))}
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
