'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Github, Moon, Sun, Trophy, Zap, Target, Award, Info, Volume2, VolumeX, Share2, Heart, Sparkles, RotateCcw, Flame, Star, TrendingUp, Clock, Crown, ChevronRight, Eye, Calendar, Lock, X, Copy, Check, Twitter, MessageCircle, Link2, Vibrate, Music, Palette, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

const PINK_COLORS = [
  { hex: '#ec4899', name: 'Hot Pink' },
  { hex: '#db2777', name: 'Deep Pink' },
  { hex: '#be185d', name: 'Magenta Pink' },
  { hex: '#f472b6', name: 'Light Pink' },
  { hex: '#fbcfe8', name: 'Pale Pink' },
  { hex: '#fce7f3', name: 'Blush Pink' },
  { hex: '#f9a8d4', name: 'Soft Pink' },
  { hex: '#ff1493', name: 'Neon Pink' },
  { hex: '#ff69b4', name: 'Bright Pink' },
  { hex: '#ffc0cb', name: 'Classic Pink' },
  { hex: '#ffb6d9', name: 'Cotton Candy' },
  { hex: '#ff85a2', name: 'Salmon Pink' },
  { hex: '#e91e8c', name: 'Electric Pink' },
  { hex: '#ff66b2', name: 'Flamingo' },
  { hex: '#ffa6c9', name: 'Carnation Pink' },
  { hex: '#e75480', name: 'Dark Pink' },
];

const NOT_PINK_COLORS = [
  { hex: '#f97316', name: 'Orange' },
  { hex: '#fbbf24', name: 'Amber' },
  { hex: '#a855f7', name: 'Purple' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#06b6d4', name: 'Cyan' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#ef4444', name: 'Red' },
  { hex: '#6b7280', name: 'Gray' },
  { hex: '#d946ef', name: 'Fuchsia' },
  { hex: '#ff6b9d', name: 'Salmon' },
  { hex: '#ffa3c1', name: 'Peach' },
  { hex: '#dda0dd', name: 'Plum' },
  { hex: '#ff7f50', name: 'Coral' },
  { hex: '#c084fc', name: 'Lavender' },
  { hex: '#fb7185', name: 'Rose Red' },
  { hex: '#e879f9', name: 'Orchid' },
  { hex: '#f0abfc', name: 'Mauve' },
  { hex: '#c4b5fd', name: 'Periwinkle' },
];

const MOTIVATIONAL_MESSAGES = {
  correct: ['NAILED IT!', 'PERFECT!', 'YOU GOT THIS!', 'ABSOLUTELY RIGHT!', 'LEGENDARY!', 'SPOT ON!', 'GENIUS!', 'INCREDIBLE!', 'PINK MASTER!', 'AMAZING!', 'FLAWLESS!', 'UNSTOPPABLE!'],
  wrong: ['OOPS!', 'NOT QUITE!', 'GOTCHA!', 'NICE TRY!', 'CLOSE ONE!', 'TRICKED YA!', 'PLOT TWIST!', 'FOOLED!'],
};

const ACHIEVEMENTS = [
  { id: 'first_game', name: 'First Steps', description: 'Play your first game', icon: Star, requirement: (s: Stats) => s.totalGames >= 1 },
  { id: 'score_100', name: 'Century', description: 'Score 100 points in one game', icon: Award, requirement: (s: Stats) => s.bestScore >= 100 },
  { id: 'score_500', name: 'Pink Master', description: 'Score 500 points in one game', icon: Crown, requirement: (s: Stats) => s.bestScore >= 500 },
  { id: 'score_1000', name: 'Legendary', description: 'Score 1000 points in one game', icon: Trophy, requirement: (s: Stats) => s.bestScore >= 1000 },
  { id: 'streak_5', name: 'On Fire', description: 'Get a 5 streak', icon: Flame, requirement: (s: Stats) => s.longestStreak >= 5 },
  { id: 'streak_10', name: 'Unstoppable', description: 'Get a 10 streak', icon: Zap, requirement: (s: Stats) => s.longestStreak >= 10 },
  { id: 'streak_20', name: 'Perfect Eye', description: 'Get a 20 streak', icon: Eye, requirement: (s: Stats) => s.longestStreak >= 20 },
  { id: 'games_10', name: 'Dedicated', description: 'Play 10 games', icon: Heart, requirement: (s: Stats) => s.totalGames >= 10 },
  { id: 'games_50', name: 'Addict', description: 'Play 50 games', icon: TrendingUp, requirement: (s: Stats) => s.totalGames >= 50 },
  { id: 'accuracy_90', name: 'Sharp Eye', description: 'Achieve 90% accuracy in a game', icon: Target, requirement: (s: Stats, g?: GameStats) => g ? (g.totalGuesses > 10 && (g.correctGuesses / g.totalGuesses) >= 0.9) : false },
  { id: 'daily_complete', name: 'Daily Grind', description: 'Complete a daily challenge', icon: Calendar, requirement: (s: Stats) => s.dailiesCompleted >= 1 },
  { id: 'daily_10', name: 'Committed', description: 'Complete 10 daily challenges', icon: Calendar, requirement: (s: Stats) => s.dailiesCompleted >= 10 },
];

// Sound Packs
const SOUND_PACKS = {
  classic: {
    name: 'Classic',
    description: 'Original game sounds',
    correct: { freq: [523, 659, 784], type: 'sine' as OscillatorType },
    wrong: { freq: [200, 150], type: 'sawtooth' as OscillatorType },
  },
  arcade: {
    name: 'Arcade',
    description: 'Retro 8-bit sounds',
    correct: { freq: [440, 550, 660, 880], type: 'square' as OscillatorType },
    wrong: { freq: [150, 100, 80], type: 'square' as OscillatorType },
  },
  soft: {
    name: 'Soft',
    description: 'Gentle, calming tones',
    correct: { freq: [392, 494], type: 'sine' as OscillatorType },
    wrong: { freq: [220, 196], type: 'sine' as OscillatorType },
  },
  synth: {
    name: 'Synth',
    description: 'Modern synth sounds',
    correct: { freq: [330, 415, 494, 660], type: 'triangle' as OscillatorType },
    wrong: { freq: [185, 147], type: 'triangle' as OscillatorType },
  },
};

// Color Themes
const COLOR_THEMES = {
  pink: {
    name: 'Pink',
    primary: '#ec4899',
    accent: '#db2777',
    description: 'Classic pink theme',
  },
  ocean: {
    name: 'Ocean',
    primary: '#0ea5e9',
    accent: '#0284c7',
    description: 'Cool ocean vibes',
  },
  forest: {
    name: 'Forest',
    primary: '#10b981',
    accent: '#059669',
    description: 'Fresh and natural',
  },
  sunset: {
    name: 'Sunset',
    primary: '#f97316',
    accent: '#ea580c',
    description: 'Warm sunset colors',
  },
  lavender: {
    name: 'Lavender',
    primary: '#a855f7',
    accent: '#9333ea',
    description: 'Soft purple tones',
  },
  midnight: {
    name: 'Midnight',
    primary: '#6366f1',
    accent: '#4f46e5',
    description: 'Deep night blue',
  },
};

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  type: 'circle' | 'star' | 'heart';
}

interface Stats {
  totalGames: number;
  bestScore: number;
  totalCorrect: number;
  totalGuesses: number;
  longestStreak: number;
  dailiesCompleted: number;
  unlockedAchievements: string[];
  lastDailyDate?: string;
  dailyBestScore?: number;
  gameHistory: Array<{ date: string; score: number; accuracy: number; streak: number }>;
}

interface GameStats {
  totalGuesses: number;
  correctGuesses: number;
}

type GameState = 'menu' | 'playing' | 'gameover' | 'help' | 'stats' | 'achievements' | 'daily' | 'settings';
type SoundPack = keyof typeof SOUND_PACKS;
type ColorTheme = keyof typeof COLOR_THEMES;

// Helper function to convert hex to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Helper to generate complimentary colors for themes
function generateThemeColors(primary: string, accent: string, isDark: boolean) {
  const hslPrimary = hexToHSL(primary);
  const hslAccent = hexToHSL(accent);
  
  return {
    primary: `hsl(${hslPrimary.h}, ${hslPrimary.s}%, ${isDark ? Math.min(hslPrimary.l + 15, 85) : hslPrimary.l}%)`,
    primaryForeground: isDark ? '#1a0f16' : '#ffffff',
    accent: `hsl(${hslAccent.h}, ${hslAccent.s}%, ${isDark ? Math.min(hslAccent.l + 10, 80) : hslAccent.l}%)`,
    accentForeground: isDark ? '#1a0f16' : '#ffffff',
    ring: primary,
  };
}

// Seeded random for daily challenge
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDailySequence(date: string): Array<{ color: { hex: string; name: string }; isPink: boolean }> {
  const seed = date.split('-').reduce((acc, val) => acc + parseInt(val), 0) * 12345;
  const sequence: Array<{ color: { hex: string; name: string }; isPink: boolean }> = [];
  
  for (let i = 0; i < 20; i++) {
    const rand = seededRandom(seed + i * 1000);
    const isPink = rand < 0.5;
    const colorArray = isPink ? PINK_COLORS : NOT_PINK_COLORS;
    const colorIndex = Math.floor(seededRandom(seed + i * 2000) * colorArray.length);
    sequence.push({ color: colorArray[colorIndex], isPink });
  }
  
  return sequence;
}

export default function IsItPink() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentColor, setCurrentColor] = useState('#ec4899');
  const [currentColorName, setCurrentColorName] = useState('Hot Pink');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPink, setIsPink] = useState(true);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [stats, setStats] = useState<Stats>({ 
    totalGames: 0, 
    bestScore: 0, 
    totalCorrect: 0, 
    totalGuesses: 0, 
    longestStreak: 0,
    dailiesCompleted: 0,
    unlockedAchievements: [],
    gameHistory: [],
  });
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard' | 'extreme'>('normal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showColorName, setShowColorName] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timedMode, setTimedMode] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [pulseCorrect, setPulseCorrect] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [colorKey, setColorKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null);
  const [isDailyMode, setIsDailyMode] = useState(false);
  const [dailySequence, setDailySequence] = useState<Array<{ color: { hex: string; name: string }; isPink: boolean }>>([]);
  const [dailyIndex, setDailyIndex] = useState(0);
  const [todayDate, setTodayDate] = useState('');
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [soundPack, setSoundPack] = useState<SoundPack>('classic');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('pink');
  
  const colorBoxRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Apply theme colors
  useEffect(() => {
    const theme = COLOR_THEMES[colorTheme];
    const root = document.documentElement;
    const isDark = darkMode;
    
    // Generate theme colors
    const colors = generateThemeColors(theme.primary, theme.accent, isDark);
    
    // Apply to CSS custom properties (using hex for direct application)
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--ring', theme.primary);
    
    // Also set primary-foreground for buttons
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--accent-foreground', colors.accentForeground);
  }, [colorTheme, darkMode]);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem('pinkGameHighScore');
    const savedStats = localStorage.getItem('pinkGameStats');
    const savedDarkMode = localStorage.getItem('pinkGameDarkMode');
    const savedSound = localStorage.getItem('pinkGameSound');
    const savedColorBlind = localStorage.getItem('pinkGameColorBlind');
    const savedHaptic = localStorage.getItem('pinkGameHaptic');
    const savedSoundPack = localStorage.getItem('pinkGameSoundPack');
    const savedTheme = localStorage.getItem('pinkGameTheme');
    
    if (saved) setHighScore(parseInt(saved));
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats({
        ...parsed,
        dailiesCompleted: parsed.dailiesCompleted || 0,
        unlockedAchievements: parsed.unlockedAchievements || [],
        gameHistory: parsed.gameHistory || [],
      });
    }
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedSound) setSoundEnabled(JSON.parse(savedSound));
    if (savedColorBlind) setColorBlindMode(JSON.parse(savedColorBlind));
    if (savedHaptic !== null) setHapticEnabled(JSON.parse(savedHaptic));
    if (savedSoundPack && SOUND_PACKS[savedSoundPack as SoundPack]) setSoundPack(savedSoundPack as SoundPack);
    if (savedTheme && COLOR_THEMES[savedTheme as ColorTheme]) setColorTheme(savedTheme as ColorTheme);
    
    if (!savedDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    // Set up daily challenge
    const today = new Date().toISOString().split('T')[0];
    setTodayDate(today);
    setDailySequence(getDailySequence(today));
  }, []);

  // Apply dark mode
  useEffect(() => {
    localStorage.setItem('pinkGameDarkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Timer for timed mode
  useEffect(() => {
    if (!timedMode || gameState !== 'playing' || timeLeft <= 0 || isDailyMode) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameover');
          saveStats();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timedMode, gameState, timeLeft, isDailyMode]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    if (!hapticEnabled || !navigator.vibrate) return;
    
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate([50, 30, 50]);
        break;
    }
  };

  const checkAchievements = useCallback((currentStats: Stats, gameStats?: GameStats) => {
    const newUnlocks: string[] = [];
    
    ACHIEVEMENTS.forEach(achievement => {
      if (!currentStats.unlockedAchievements.includes(achievement.id)) {
        if (achievement.requirement(currentStats, gameStats)) {
          newUnlocks.push(achievement.id);
        }
      }
    });
    
    if (newUnlocks.length > 0) {
      const updatedStats = {
        ...currentStats,
        unlockedAchievements: [...currentStats.unlockedAchievements, ...newUnlocks],
      };
      setStats(updatedStats);
      localStorage.setItem('pinkGameStats', JSON.stringify(updatedStats));
      
      // Show first new achievement
      const achievement = ACHIEVEMENTS.find(a => a.id === newUnlocks[0]);
      if (achievement) {
        setNewAchievement(achievement);
        triggerHaptic('heavy');
        setTimeout(() => setNewAchievement(null), 3000);
      }
    }
  }, [hapticEnabled]);

  const saveStats = useCallback(() => {
    const gameAccuracy = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 0;
    const newGameEntry = {
      date: new Date().toISOString(),
      score,
      accuracy: gameAccuracy,
      streak: maxStreak,
    };

    const newStats: Stats = {
      totalGames: stats.totalGames + 1,
      bestScore: Math.max(stats.bestScore, score),
      totalCorrect: stats.totalCorrect + correctGuesses,
      totalGuesses: stats.totalGuesses + totalGuesses,
      longestStreak: Math.max(stats.longestStreak, maxStreak),
      dailiesCompleted: stats.dailiesCompleted + (isDailyMode && !dailyCompleted ? 1 : 0),
      unlockedAchievements: stats.unlockedAchievements,
      lastDailyDate: isDailyMode ? todayDate : stats.lastDailyDate,
      dailyBestScore: isDailyMode ? Math.max(stats.dailyBestScore || 0, score) : stats.dailyBestScore,
      gameHistory: [...(stats.gameHistory || []).slice(-29), newGameEntry],
    };
    
    if (isDailyMode && !dailyCompleted) {
      setDailyCompleted(true);
    }
    
    setStats(newStats);
    localStorage.setItem('pinkGameStats', JSON.stringify(newStats));
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('pinkGameHighScore', score.toString());
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    checkAchievements(newStats, { totalGuesses, correctGuesses });
  }, [stats, score, correctGuesses, totalGuesses, maxStreak, highScore, isDailyMode, todayDate, dailyCompleted, checkAchievements]);

  const generateColor = useCallback(() => {
    if (isDailyMode) {
      if (dailyIndex < dailySequence.length) {
        const current = dailySequence[dailyIndex];
        setCurrentColor(current.color.hex);
        setCurrentColorName(current.color.name);
        setIsPink(current.isPink);
        setShowColorName(false);
        setColorKey(prev => prev + 1);
      }
      return;
    }
    
    let pinkChance = 0.6;
    
    if (difficulty === 'easy') pinkChance = 0.7;
    else if (difficulty === 'hard') pinkChance = 0.5;
    else if (difficulty === 'extreme') pinkChance = 0.4;
    
    const isPinkColor = Math.random() < pinkChance;
    const colorArray = isPinkColor ? PINK_COLORS : NOT_PINK_COLORS;
    const selected = colorArray[Math.floor(Math.random() * colorArray.length)];
    
    setCurrentColor(selected.hex);
    setCurrentColorName(selected.name);
    setIsPink(isPinkColor);
    setShowColorName(false);
    setColorKey(prev => prev + 1);
  }, [difficulty, isDailyMode, dailyIndex, dailySequence]);

  const startGame = (daily = false) => {
    setIsDailyMode(daily);
    setGameState('playing');
    setScore(0);
    setLives(daily ? 1 : (timedMode ? 999 : 3));
    setStreak(0);
    setMaxStreak(0);
    setMultiplier(1);
    setTotalGuesses(0);
    setCorrectGuesses(0);
    setTimeLeft(timedMode && !daily ? 60 : 0);
    setDailyIndex(0);
    
    if (daily) {
      const current = dailySequence[0];
      setCurrentColor(current.color.hex);
      setCurrentColorName(current.color.name);
      setIsPink(current.isPink);
      setColorKey(prev => prev + 1);
    } else {
      generateColor();
    }
  };

  const createParticles = (isCorrect: boolean, color: string, clientX?: number, clientY?: number) => {
    const newParticles: Particle[] = [];
    const count = isCorrect ? 25 : 12;
    const centerX = clientX || window.innerWidth / 2;
    const centerY = clientY || window.innerHeight / 2;
    
    const types: ('circle' | 'star' | 'heart')[] = isCorrect ? ['circle', 'star', 'heart'] : ['circle'];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = (isCorrect ? 8 : 4) * (0.5 + Math.random() * 0.5);
      
      newParticles.push({
        id: particleIdRef.current++,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isCorrect ? 3 : 1),
        color: isCorrect ? color : '#ef4444',
        size: 6 + Math.random() * 10,
        rotation: Math.random() * 360,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const playSound = (type: 'correct' | 'wrong' | 'click') => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const pack = SOUND_PACKS[soundPack];
      
      if (type === 'correct') {
        pack.correct.freq.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          osc.type = pack.correct.type;
          gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.15);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.15);
        });
      } else if (type === 'wrong') {
        pack.wrong.freq.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          osc.type = pack.wrong.type;
          gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.2);
        });
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      // Audio not supported
    }
  };

  const handleGuess = (guess: 'pink' | 'notpink', e?: React.MouseEvent) => {
    if (gameState !== 'playing' || isTransitioning) return;

    const isCorrect = (guess === 'pink' && isPink) || (guess === 'notpink' && !isPink);
    const msgPool = isCorrect ? MOTIVATIONAL_MESSAGES.correct : MOTIVATIONAL_MESSAGES.wrong;
    const msg = msgPool[Math.floor(Math.random() * msgPool.length)];
    setMessage(msg);
    setShowColorName(true);
    setIsTransitioning(true);

    setTotalGuesses(prev => prev + 1);
    playSound(isCorrect ? 'correct' : 'wrong');
    triggerHaptic(isCorrect ? 'light' : 'medium');

    if (isCorrect) {
      const points = 10 * multiplier;
      setScore(prev => prev + Math.round(points));
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      setCorrectGuesses(prev => prev + 1);
      setMultiplier(prev => Math.min(prev + 0.5, 5));
      createParticles(true, currentColor, e?.clientX, e?.clientY);
      setPulseCorrect(true);
      setTimeout(() => setPulseCorrect(false), 300);
      
      if (isDailyMode) {
        setDailyIndex(prev => prev + 1);
      }
    } else {
      if (!timedMode || isDailyMode) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0 || (isDailyMode && dailyIndex >= dailySequence.length - 1)) {
            setGameState('gameover');
            saveStats();
          }
          return newLives;
        });
      }
      
      setStreak(0);
      setMultiplier(1);
      createParticles(false, '#ef4444', e?.clientX, e?.clientY);
      setShakeScreen(true);
      triggerHaptic('heavy');
      setTimeout(() => setShakeScreen(false), 400);
    }

    // Check if daily is complete
    if (isDailyMode && dailyIndex >= dailySequence.length - 1) {
      setTimeout(() => {
        setGameState('gameover');
        saveStats();
      }, 700);
      return;
    }

    setTimeout(() => {
      if (gameState === 'playing') {
        if (isDailyMode) {
          const nextIndex = dailyIndex + (isCorrect ? 1 : 0);
          if (nextIndex < dailySequence.length) {
            const next = dailySequence[nextIndex];
            setCurrentColor(next.color.hex);
            setCurrentColorName(next.color.name);
            setIsPink(next.isPink);
            setColorKey(prev => prev + 1);
          }
        } else {
          generateColor();
        }
        setIsTransitioning(false);
      }
    }, 700);

    setTimeout(() => setMessage(''), 1200);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState === 'playing' && !isTransitioning) {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') handleGuess('pink');
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') handleGuess('notpink');
    } else if (gameState === 'gameover' || gameState === 'menu') {
      if (e.key === ' ' || e.key === 'Enter') startGame();
    }
  }, [gameState, isTransitioning]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Particle animation
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.25,
            vx: p.vx * 0.99,
            size: p.size * 0.97,
            rotation: p.rotation + 5,
          }))
          .filter(p => p.y < window.innerHeight + 100 && p.size > 1);
        return updated.length > 0 ? updated : [];
      });
    }, 20);
    return () => clearInterval(interval);
  }, [particles.length]);

  const shareText = `I scored ${score} points in "is it pink?" ${isDailyMode ? '(Daily Challenge)' : ''} with a ${maxStreak} streak! Can you beat me? Play at https://is-it.pink`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    triggerHaptic('light');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const accuracy = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 0;
  const hasDoneDaily = stats.lastDailyDate === todayDate;

  // Prepare chart data
  const chartData = (stats.gameHistory || []).slice(-10).map((game, i) => ({
    name: `G${i + 1}`,
    score: game.score,
    accuracy: game.accuracy,
    streak: game.streak,
  }));

  const renderParticle = (p: Particle) => {
    const style = {
      left: `${p.x}px`,
      top: `${p.y}px`,
      transform: `rotate(${p.rotation}deg)`,
    };

    if (p.type === 'star') {
      return (
        <Star
          key={p.id}
          className="fixed pointer-events-none"
          style={{ ...style, color: p.color, width: p.size, height: p.size }}
          fill={p.color}
        />
      );
    }
    if (p.type === 'heart') {
      return (
        <Heart
          key={p.id}
          className="fixed pointer-events-none"
          style={{ ...style, color: p.color, width: p.size, height: p.size }}
          fill={p.color}
        />
      );
    }
    return (
      <div
        key={p.id}
        className="fixed rounded-full pointer-events-none"
        style={{
          ...style,
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.color,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
        }}
      />
    );
  };

  const StatCard = ({ icon: Icon, label, value, color = 'text-foreground' }: { icon: React.ElementType, label: string, value: string | number, color?: string }) => (
    <motion.div 
      className="bg-card p-3 sm:p-4 rounded-2xl border border-border text-center relative overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-muted-foreground" />
      <div className="text-[10px] sm:text-xs text-muted-foreground uppercase font-medium tracking-wide">{label}</div>
      <div className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen min-h-[100dvh] transition-colors duration-300 ${shakeScreen ? 'animate-shake' : ''}`}>
      <div className="min-h-screen min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-hidden">
        {/* Background Pattern */}
        <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />
        </div>

        {/* Achievement Popup */}
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

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              className="fixed inset-0 z-[90] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
              <motion.div
                className="relative bg-card border border-border rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <button
                  onClick={() => setShowShareModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Share Your Score
                </h3>
                
                <div className="bg-muted p-4 rounded-xl mb-4 text-sm">
                  {shareText}
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <motion.button
                    onClick={shareToTwitter}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                    <span className="text-xs font-medium">Twitter</span>
                  </motion.button>
                  <motion.button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                    <span className="text-xs font-medium">WhatsApp</span>
                  </motion.button>
                  <motion.button
                    onClick={copyToClipboard}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                    <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                  </motion.button>
                </div>
                
                <motion.button
                  onClick={copyToClipboard}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link2 className="w-4 h-4" />
                  {copied ? 'Copied to Clipboard!' : 'Copy Link'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti Effect */}
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
                    y: window.innerHeight + 100, 
                    opacity: 0, 
                    rotate: Math.random() * 720 - 360,
                    x: Math.random() * 200 - 100,
                  }}
                  transition={{ duration: 2 + Math.random() * 2, ease: 'easeOut', delay: Math.random() * 0.5 }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {particles.map(renderParticle)}
        </div>

        {/* Header */}
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
            onClick={() => gameState !== 'playing' && setGameState('menu')}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
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
            >
              <Github className="w-4 h-4" />
              GitHub
            </motion.a>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {gameState === 'menu' && (
              <motion.div 
                key="menu"
                className="text-center w-full max-w-md space-y-4 sm:space-y-5 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
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
                  transition={{ delay: 0.15 }}
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
                  transition={{ delay: 0.2 }}
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { icon: Target, text: 'Guess colors' },
                      { icon: Zap, text: 'Build combos' },
                      { icon: Heart, text: '3 lives' },
                      { icon: Trophy, text: 'High scores' },
                    ].map((item, i) => (
                      <motion.div 
                        key={item.text}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
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
                  transition={{ delay: 0.4 }}
                >
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Difficulty</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['easy', 'normal', 'hard', 'extreme'] as const).map((d, i) => (
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
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                        >
                          {d}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
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
                      >
                        <Clock className="w-4 h-4" /> Timed
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => {
                      playSound('click');
                      startGame();
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-90 transition-all text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgb(236 72 153 / 0.4)' }}
                    whileTap={{ scale: 0.98 }}
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
                    className="py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-semibold flex items-center justify-center gap-1.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Info className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      playSound('click');
                      setGameState('stats');
                    }}
                    className="py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-semibold flex items-center justify-center gap-1.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      playSound('click');
                      setGameState('achievements');
                    }}
                    className="py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-semibold flex items-center justify-center gap-1.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Award className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      playSound('click');
                      setGameState('settings');
                    }}
                    className="py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-semibold flex items-center justify-center gap-1.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Palette className="w-4 h-4" />
                  </motion.button>
                </div>

                {highScore > 0 && (
                  <motion.div 
                    className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-xl border border-primary/20 flex items-center justify-between"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
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
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Github className="w-4 h-4" />
                  Open Source on GitHub
                </motion.a>
              </motion.div>
            )}

            {gameState === 'settings' && (
              <motion.div 
                key="settings"
                className="text-center w-full max-w-md space-y-4 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
                >
                  Back to Menu
                </motion.button>
              </motion.div>
            )}

            {gameState === 'achievements' && (
              <motion.div 
                key="achievements"
                className="text-center w-full max-w-md space-y-4 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
                    {ACHIEVEMENTS.map((achievement, i) => {
                      const unlocked = stats.unlockedAchievements.includes(achievement.id);
                      return (
                        <motion.div 
                          key={achievement.id}
                          className={`flex items-center gap-3 p-4 border-b border-border last:border-0 ${unlocked ? '' : 'opacity-50'}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: unlocked ? 1 : 0.5, x: 0 }}
                          transition={{ delay: i * 0.05 }}
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
                >
                  Back to Menu
                </motion.button>
              </motion.div>
            )}

            {gameState === 'help' && (
              <motion.div 
                key="help"
                className="text-center w-full max-w-md space-y-4 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
                  ].map((item, i) => (
                    <motion.div 
                      key={item.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
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
                >
                  Back to Menu
                </motion.button>
              </motion.div>
            )}

            {gameState === 'stats' && (
              <motion.div 
                key="stats"
                className="text-center w-full max-w-md space-y-4 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
                  <BarChart3 className="text-primary w-6 h-6" />
                  Statistics
                </h2>
                
                <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border space-y-1">
                  {[
                    { label: 'Games Played', value: stats.totalGames, icon: TrendingUp },
                    { label: 'Best Score', value: stats.bestScore, icon: Crown, highlight: true },
                    { label: 'Longest Streak', value: stats.longestStreak, icon: Flame },
                    { label: 'Total Correct', value: stats.totalCorrect, icon: Target },
                    { label: 'Overall Accuracy', value: `${stats.totalGuesses > 0 ? Math.round((stats.totalCorrect / stats.totalGuesses) * 100) : 0}%`, icon: Award },
                    { label: 'Dailies Completed', value: stats.dailiesCompleted, icon: Calendar },
                  ].map((item, i) => (
                    <motion.div 
                      key={item.label}
                      className={`flex justify-between items-center py-3 ${i < 5 ? 'border-b border-border' : ''}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <span className={`font-bold text-lg ${item.highlight ? 'text-primary' : ''}`}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Score History Chart */}
                {chartData.length > 0 && (
                  <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border">
                    <h3 className="font-bold mb-3 text-left flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Recent Games - Scores
                    </h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} stroke="var(--muted-foreground)" />
                          <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} stroke="var(--muted-foreground)" />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'var(--card)', 
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              fontSize: '12px',
                              color: 'var(--card-foreground)'
                            }}
                            labelStyle={{ color: 'var(--card-foreground)' }}
                          />
                          <Bar dataKey="score" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Accuracy Trend Chart */}
                {chartData.length > 0 && (
                  <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border">
                    <h3 className="font-bold mb-3 text-left flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Recent Games - Accuracy %
                    </h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} stroke="var(--muted-foreground)" />
                          <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} domain={[0, 100]} stroke="var(--muted-foreground)" />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'var(--card)', 
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              fontSize: '12px',
                              color: 'var(--card-foreground)'
                            }}
                            labelStyle={{ color: 'var(--card-foreground)' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="accuracy" 
                            stroke="var(--accent)" 
                            strokeWidth={2}
                            dot={{ fill: 'var(--accent)', strokeWidth: 0, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <motion.button
                  onClick={() => {
                    playSound('click');
                    setGameState('menu');
                  }}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Menu
                </motion.button>
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div 
                key="playing"
                className="w-full max-w-lg space-y-4 sm:space-y-5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Daily Progress */}
                {isDailyMode && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold">Daily Challenge: {dailyIndex + 1} / {dailySequence.length}</span>
                    </div>
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  <StatCard icon={Star} label="Score" value={score} color="text-primary" />
                  <StatCard 
                    icon={timedMode && !isDailyMode ? Clock : Heart} 
                    label={timedMode && !isDailyMode ? 'Time' : 'Lives'} 
                    value={timedMode && !isDailyMode ? `${timeLeft}s` : (isDailyMode ? '1' : lives)} 
                    color={timedMode && !isDailyMode && timeLeft <= 10 ? 'text-destructive' : ''} 
                  />
                  <StatCard icon={Flame} label="Streak" value={streak} color="text-accent" />
                  <StatCard icon={Zap} label="Multi" value={`${multiplier.toFixed(1)}x`} />
                </div>

                {/* Streak Badge */}
                <AnimatePresence>
                  {streak >= 5 && (
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                    >
                      <motion.div 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/50"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Flame className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary">STREAK FIRE! {streak}</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Color Box */}
                <motion.div
                  key={colorKey}
                  ref={colorBoxRef}
                  className={`w-full aspect-[4/3] sm:aspect-[3/2] rounded-3xl border-4 border-primary/20 flex flex-col items-center justify-center text-center p-4 sm:p-6 relative overflow-hidden ${pulseCorrect ? 'scale-[1.02]' : ''}`}
                  style={{ 
                    backgroundColor: currentColor,
                    boxShadow: `0 25px 80px ${currentColor}50, 0 0 0 4px ${currentColor}20`,
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={message || 'default'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-white text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg text-balance"
                    >
                      {message || 'Is this pink?'}
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Color Blind Mode Info */}
                  {colorBlindMode && (
                    <motion.div 
                      className="mt-3 text-white/90 text-sm font-semibold drop-shadow-md bg-black/30 px-4 py-2 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {currentColorName} ({currentColor.toUpperCase()})
                    </motion.div>
                  )}
                  
                  <AnimatePresence>
                    {showColorName && !colorBlindMode && (
                      <motion.div 
                        className="mt-2 text-white/90 text-sm sm:text-base font-semibold drop-shadow-md bg-black/20 px-3 py-1 rounded-full"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {currentColorName}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <motion.button
                    onClick={(e) => handleGuess('pink', e)}
                    disabled={isTransitioning}
                    className="py-4 sm:py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-base sm:text-lg shadow-lg shadow-primary/30 disabled:opacity-50 relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">Pink (A)</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </motion.button>
                  <motion.button
                    onClick={(e) => handleGuess('notpink', e)}
                    disabled={isTransitioning}
                    className="py-4 sm:py-5 rounded-2xl bg-accent text-accent-foreground font-bold text-base sm:text-lg shadow-lg shadow-accent/30 disabled:opacity-50 relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">Not Pink (D)</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </motion.button>
                </div>

                {/* Accuracy */}
                <div className="text-center text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {accuracy}% accuracy</span>
                  <span className="flex items-center gap-1"><Crown className="w-3 h-3" /> Best: {highScore}</span>
                </div>
              </motion.div>
            )}

            {gameState === 'gameover' && (
              <motion.div 
                key="gameover"
                className="text-center w-full max-w-md space-y-4 sm:space-y-5 py-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
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
                  transition={{ delay: 0.2 }}
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
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => {
                      playSound('click');
                      startGame(isDailyMode ? false : undefined);
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Github className="w-4 h-4" />
                  Star on GitHub
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer 
          className="border-t border-border p-3 sm:p-4 text-center text-xs sm:text-sm text-muted-foreground bg-card/50 backdrop-blur-xl"
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <p>
            Made with <span className="text-primary">love</span> by{' '}
            <a href="https://github.com/RejectModders" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
              RejectModders
            </a>
            {' | '}
            <a href="https://github.com/RejectModders/is-it.pink" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Open Source
            </a>
          </p>
        </motion.footer>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-10px) rotate(-1deg); }
          20% { transform: translateX(10px) rotate(1deg); }
          30% { transform: translateX(-8px) rotate(-0.5deg); }
          40% { transform: translateX(8px) rotate(0.5deg); }
          50% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          70% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          90% { transform: translateX(-2px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
