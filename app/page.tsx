'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

import {
  PINK_COLORS,
  NOT_PINK_COLORS,
  EASY_PINK_COLORS,
  MEDIUM_PINK_COLORS,
  EASY_NOT_PINK_COLORS,
  MEDIUM_NOT_PINK_COLORS,
  MOTIVATIONAL_MESSAGES,
  ACHIEVEMENTS,
  SOUND_PACKS,
  COLOR_THEMES,
  type Particle,
  type Stats,
  type GameState,
  type SoundPack,
  type ColorTheme,
  type GameStats,
} from '@/lib/game-constants';
import { generateThemeColors, getDailySequence, getDailyChallenge, getChallengeSequence, getChallengeForDate, getLocalDateString, validateStats, calculateDailyStreak } from '@/lib/game-utils';
import { type DailyChallenge, DAILY_CHALLENGES } from '@/lib/game-constants';

import {
  GameHeader,
  GameFooter,
  ShareModal,
  AchievementPopup,
  Particles,
  Confetti,
  MenuView,
  PlayingView,
  GameOverView,
  StatsView,
  AchievementsView,
  SettingsView,
  HelpView,
  CalendarView,
  TutorialOverlay,
  ErrorBoundary,
} from '@/components/game';

// URL-navigable views (secondary screens)
const URL_VIEWS = ['stats', 'achievements', 'settings', 'help', 'calendar'] as const;
type UrlView = typeof URL_VIEWS[number];

function isUrlView(view: string): view is UrlView {
  return URL_VIEWS.includes(view as UrlView);
}

function IsItPinkGame() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Internal game state (playing, gameover, menu)
  const [internalGameState, setInternalGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  
  // Derive full gameState from URL params + internal state
  const urlView = searchParams.get('view');
  const gameState: GameState = urlView && isUrlView(urlView) ? urlView : internalGameState;
  
  // Navigation function that handles both URL and state changes
  const setGameState = useCallback((newState: GameState) => {
    if (isUrlView(newState)) {
      // URL-based navigation for secondary views
      router.push(`/?view=${newState}`, { scroll: false });
    } else {
      // State-based navigation for game flow (menu, playing, gameover)
      // Only push to router if we're currently on a URL view
      if (urlView) {
        router.push('/', { scroll: false });
      }
      setInternalGameState(newState);
    }
  }, [router, urlView]);
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
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [dailyTimeLeft, setDailyTimeLeft] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewChallenge, setPreviewChallenge] = useState<DailyChallenge | null>(null);
  const [soundPack, setSoundPack] = useState<SoundPack>('classic');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('pink');
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true); // Default true to avoid flash
  
  const colorBoxRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastTickRef = useRef<number>(0);

  // Apply theme colors
  useEffect(() => {
    const theme = COLOR_THEMES[colorTheme];
    const root = document.documentElement;
    const colors = generateThemeColors(theme.primary, theme.accent, darkMode);
    
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--ring', theme.primary);
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
    const savedTutorial = localStorage.getItem('pinkGameTutorialSeen');
    
    if (saved) setHighScore(parseInt(saved));
if (savedStats) {
  try {
    const parsed = JSON.parse(savedStats);
    if (validateStats(parsed)) {
      setStats({
        ...parsed,
        dailiesCompleted: parsed.dailiesCompleted || 0,
        unlockedAchievements: parsed.unlockedAchievements || [],
        gameHistory: parsed.gameHistory || [],
        completedDailies: parsed.completedDailies || [],
      });
    } else {
      console.warn('[v0] Invalid stats data, using defaults');
    }
  } catch (e) {
    console.error('[v0] Failed to parse stats:', e);
  }
}
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedSound) setSoundEnabled(JSON.parse(savedSound));
    if (savedColorBlind) setColorBlindMode(JSON.parse(savedColorBlind));
    if (savedHaptic !== null) setHapticEnabled(JSON.parse(savedHaptic));
    if (savedSoundPack && SOUND_PACKS[savedSoundPack as SoundPack]) setSoundPack(savedSoundPack as SoundPack);
    if (savedTheme && COLOR_THEMES[savedTheme as ColorTheme]) setColorTheme(savedTheme as ColorTheme);
    
    // Show tutorial for first-time users
    if (!savedTutorial) {
      setShowTutorial(true);
      setHasSeenTutorial(false);
    } else {
      setHasSeenTutorial(true);
    }
    
    if (!savedDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    const today = getLocalDateString();
    setTodayDate(today);
    setDailySequence(getDailySequence(today));
    setDailyChallenge(getDailyChallenge(today));
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

  // Persist sound settings
  useEffect(() => {
    localStorage.setItem('pinkGameSound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Persist haptic settings
  useEffect(() => {
    localStorage.setItem('pinkGameHaptic', JSON.stringify(hapticEnabled));
  }, [hapticEnabled]);

  // Persist color blind mode
  useEffect(() => {
    localStorage.setItem('pinkGameColorBlind', JSON.stringify(colorBlindMode));
  }, [colorBlindMode]);

  // Persist sound pack
  useEffect(() => {
    localStorage.setItem('pinkGameSoundPack', soundPack);
  }, [soundPack]);

  // Persist color theme
  useEffect(() => {
    localStorage.setItem('pinkGameTheme', colorTheme);
  }, [colorTheme]);

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

  // Timer for daily challenge per-round time limit
  useEffect(() => {
    if (!isDailyMode || gameState !== 'playing' || !dailyTimeLeft || dailyTimeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setDailyTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 0.1) {
          // Time ran out - treat as wrong answer
          handleGuess(false);
          return dailyChallenge?.timeLimit || null;
        }
        return prev - 0.1;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [isDailyMode, gameState, dailyTimeLeft]);

  // Timer sound effects - play ticking sounds when time is low
  useEffect(() => {
    if (!soundEnabled || gameState !== 'playing') return;
    
    // For daily challenge time limit
    if (dailyTimeLeft !== null && dailyTimeLeft > 0 && dailyTimeLeft <= 3) {
      const now = Date.now();
      const interval = dailyTimeLeft <= 1 ? 200 : 500; // Faster ticks when very low
      if (now - lastTickRef.current >= interval) {
        lastTickRef.current = now;
        // Play tick sound
        try {
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          }
          const ctx = audioContextRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(dailyTimeLeft <= 1 ? 1200 : 800, ctx.currentTime);
          osc.type = dailyTimeLeft <= 1 ? 'square' : 'sine';
          gain.gain.setValueAtTime(dailyTimeLeft <= 1 ? 0.06 : 0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.05);
        } catch {
          // Audio not supported
        }
      }
    }
    
    // For timed mode
    if (timedMode && !isDailyMode && timeLeft > 0 && timeLeft <= 10) {
      const now = Date.now();
      const interval = timeLeft <= 3 ? 300 : 1000;
      if (now - lastTickRef.current >= interval) {
        lastTickRef.current = now;
        try {
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          }
          const ctx = audioContextRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(timeLeft <= 3 ? 1000 : 700, ctx.currentTime);
          osc.type = timeLeft <= 3 ? 'square' : 'sine';
          gain.gain.setValueAtTime(timeLeft <= 3 ? 0.05 : 0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.06);
        } catch {
          // Audio not supported
        }
      }
    }
  }, [dailyTimeLeft, timeLeft, soundEnabled, gameState, timedMode, isDailyMode]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    if (!hapticEnabled || !navigator.vibrate) return;
    
    switch (type) {
      case 'light': navigator.vibrate(10); break;
      case 'medium': navigator.vibrate(25); break;
      case 'heavy': navigator.vibrate([50, 30, 50]); break;
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
      
      const achievement = ACHIEVEMENTS.find(a => a.id === newUnlocks[0]);
      if (achievement) {
        setNewAchievement(achievement);
        triggerHaptic('heavy');
        setTimeout(() => setNewAchievement(null), 3000);
      }
    }
  }, [hapticEnabled]);

  const saveStats = useCallback((dailyResult?: 'completed' | 'failed') => {
    // Skip saving stats in preview mode
    if (isPreviewMode) return;
    
    const gameAccuracy = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 0;
    const newGameEntry = {
      date: new Date().toISOString(),
      score,
      accuracy: gameAccuracy,
      streak: maxStreak,
    };

    // Track completed dailies history
    const existingCompletedDailies = stats.completedDailies || [];
    const shouldAddToCompleted = isDailyMode && dailyResult === 'completed' && !existingCompletedDailies.includes(todayDate);
    
    const newStats: Stats = {
      totalGames: stats.totalGames + 1,
      bestScore: Math.max(stats.bestScore, score),
      totalCorrect: stats.totalCorrect + correctGuesses,
      totalGuesses: stats.totalGuesses + totalGuesses,
      longestStreak: Math.max(stats.longestStreak, maxStreak),
      dailiesCompleted: stats.dailiesCompleted + (isDailyMode && !dailyCompleted && dailyResult === 'completed' ? 1 : 0),
      unlockedAchievements: stats.unlockedAchievements,
      lastDailyDate: isDailyMode ? todayDate : stats.lastDailyDate,
      lastDailyResult: isDailyMode ? dailyResult : stats.lastDailyResult,
      dailyBestScore: isDailyMode ? Math.max(stats.dailyBestScore || 0, score) : stats.dailyBestScore,
      gameHistory: [...(stats.gameHistory || []).slice(-29), newGameEntry],
      completedDailies: shouldAddToCompleted 
        ? [...existingCompletedDailies, todayDate] 
        : existingCompletedDailies,
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
  }, [stats, score, correctGuesses, totalGuesses, maxStreak, highScore, isDailyMode, todayDate, dailyCompleted, checkAchievements, isPreviewMode]);

  const generateColor = useCallback(() => {
    if (isDailyMode) {
      if (dailyIndex < dailySequence.length) {
        const current = dailySequence[dailyIndex];
        setCurrentColor(current.color.hex);
        setCurrentColorName(current.color.name);
        setIsPink(current.isPink);
        setColorKey(prev => prev + 1);
      }
      return;
    }
    
    let pinkChance = 0.6;
    if (difficulty === 'easy') pinkChance = 0.7;
    else if (difficulty === 'hard') pinkChance = 0.5;
    else if (difficulty === 'extreme') pinkChance = 0.4;
    
    const isPinkColor = Math.random() < pinkChance;
    
    // Use difficulty-based color arrays for clearer distinctions
    let colorArray;
    if (difficulty === 'easy') {
      colorArray = isPinkColor ? EASY_PINK_COLORS : EASY_NOT_PINK_COLORS;
    } else if (difficulty === 'normal') {
      const pinks = [...EASY_PINK_COLORS, ...MEDIUM_PINK_COLORS];
      const notPinks = [...EASY_NOT_PINK_COLORS, ...MEDIUM_NOT_PINK_COLORS];
      colorArray = isPinkColor ? pinks : notPinks;
    } else {
      // Hard and extreme use all colors
      colorArray = isPinkColor ? PINK_COLORS : NOT_PINK_COLORS;
    }
    
    const selected = colorArray[Math.floor(Math.random() * colorArray.length)];
    
    setCurrentColor(selected.hex);
    setCurrentColorName(selected.name);
    setIsPink(isPinkColor);
    setColorKey(prev => prev + 1);
  }, [difficulty, isDailyMode, dailyIndex, dailySequence]);

  const startGame = (daily = false) => {
    setIsDailyMode(daily);
    setGameState('playing');
    setScore(0);
    
    // Use daily challenge settings if in daily mode
    if (daily && dailyChallenge) {
      setLives(dailyChallenge.lives);
      setDailyTimeLeft(dailyChallenge.timeLimit || null);
    } else {
      setLives(timedMode ? 999 : 3);
      setDailyTimeLeft(null);
    }
    
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
    setIsPreviewMode(false);
    setPreviewChallenge(null);
  };

  // Start a preview/practice game for any challenge (doesn't affect stats)
  const startPreview = (challenge: DailyChallenge) => {
    setIsPreviewMode(true);
    setPreviewChallenge(challenge);
    setIsDailyMode(true); // Use daily mode mechanics
    setGameState('playing');
    setScore(0);
    setLives(challenge.lives);
    setDailyTimeLeft(challenge.timeLimit || null);
    setStreak(0);
    setMaxStreak(0);
    setMultiplier(1);
    setTotalGuesses(0);
    setCorrectGuesses(0);
    setTimeLeft(0);
    setDailyIndex(0);
    
    // Generate a new random sequence for this practice (using random seed offset)
    const previewSequence = getChallengeSequence(challenge, Date.now());
    setDailySequence(previewSequence);
    
    const current = previewSequence[0];
    setCurrentColor(current.color.hex);
    setCurrentColorName(current.color.name);
    setIsPink(current.isPink);
    setColorKey(prev => prev + 1);
  };

const createParticles = (isCorrect: boolean, color: string, clientX?: number, clientY?: number, currentStreak?: number) => {
  const newParticles: Particle[] = [];
  
  // Scale particles based on streak level
  const streakLevel = currentStreak || 0;
  let baseCount = isCorrect ? 25 : 12;
  let speedMultiplier = 1;
  let sizeMultiplier = 1;
  
  if (streakLevel >= 25) {
    baseCount = 60;
    speedMultiplier = 1.8;
    sizeMultiplier = 1.5;
  } else if (streakLevel >= 20) {
    baseCount = 50;
    speedMultiplier = 1.5;
    sizeMultiplier = 1.3;
  } else if (streakLevel >= 15) {
    baseCount = 40;
    speedMultiplier = 1.3;
    sizeMultiplier = 1.2;
  } else if (streakLevel >= 10) {
    baseCount = 35;
    speedMultiplier = 1.2;
    sizeMultiplier = 1.1;
  }
  
  const count = isCorrect ? baseCount : 12;
  const centerX = clientX || window.innerWidth / 2;
  const centerY = clientY || window.innerHeight / 2;
  const types: ('circle' | 'star' | 'heart')[] = isCorrect ? ['circle', 'star', 'heart'] : ['circle'];
  
  // Special colors for high streaks
  const getParticleColor = () => {
    if (!isCorrect) return '#ef4444';
    if (streakLevel >= 25) {
      const goldColors = ['#fbbf24', '#f59e0b', '#fcd34d', color];
      return goldColors[Math.floor(Math.random() * goldColors.length)];
    }
    if (streakLevel >= 20) {
      const purpleColors = ['#a855f7', '#c084fc', '#e879f9', color];
      return purpleColors[Math.floor(Math.random() * purpleColors.length)];
    }
    if (streakLevel >= 15) {
      const orangeColors = ['#f97316', '#fb923c', '#fdba74', color];
      return orangeColors[Math.floor(Math.random() * orangeColors.length)];
    }
    return color;
  };
  
  for (let i = 0; i < count; i++) {
  const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
  const speed = (isCorrect ? 8 : 4) * (0.5 + Math.random() * 0.5) * speedMultiplier;
  
  newParticles.push({
  id: particleIdRef.current++,
  x: centerX,
  y: centerY,
  vx: Math.cos(angle) * speed,
  vy: Math.sin(angle) * speed - (isCorrect ? 3 : 1) * speedMultiplier,
  color: getParticleColor(),
  size: (6 + Math.random() * 10) * sizeMultiplier,
  rotation: Math.random() * 360,
  type: types[Math.floor(Math.random() * types.length)],
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const playSound = (type: 'correct' | 'wrong' | 'click' | 'tick' | 'urgentTick') => {
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
      } else if (type === 'tick') {
        // Subtle tick sound for timer countdown
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'urgentTick') {
        // Urgent tick sound when time is very low
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.type = 'square';
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
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
      createParticles(true, currentColor, e?.clientX, e?.clientY, streak + 1);
      setPulseCorrect(true);
      setTimeout(() => setPulseCorrect(false), 200);
      
      if (isDailyMode) {
        setDailyIndex(prev => prev + 1);
      }
    } else {
      if (!timedMode || isDailyMode) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameover');
            saveStats(isDailyMode ? 'failed' : undefined);
          }
          return newLives;
        });
      }
      
      setStreak(0);
      setMultiplier(1);
      createParticles(false, '#ef4444', e?.clientX, e?.clientY);
      setShakeScreen(true);
      triggerHaptic('heavy');
      setTimeout(() => setShakeScreen(false), 300);
    }

    if (isDailyMode && dailyIndex >= dailySequence.length - 1) {
      setTimeout(() => {
        setGameState('gameover');
        saveStats('completed');
      }, 400);
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
            // Reset timer for next round
            if (dailyChallenge?.timeLimit) {
              setDailyTimeLeft(dailyChallenge.timeLimit);
            }
          }
        } else {
          generateColor();
        }
        setIsTransitioning(false);
      }
    }, 400);

    setTimeout(() => setMessage(''), 600);
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
  
  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setHasSeenTutorial(true);
    localStorage.setItem('pinkGameTutorialSeen', 'true');
  };
  
  return (
    <ErrorBoundary>
      <div className={`min-h-screen min-h-[100dvh] transition-colors duration-100 ${shakeScreen ? 'animate-shake' : ''}`}>
        <div className="min-h-screen min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-hidden">
        {/* Background Pattern */}
        <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />
        </div>

        <AchievementPopup newAchievement={newAchievement} />
        
        <ShareModal
          showShareModal={showShareModal}
          setShowShareModal={setShowShareModal}
          shareText={shareText}
          copied={copied}
          copyToClipboard={copyToClipboard}
          shareToTwitter={shareToTwitter}
          shareToWhatsApp={shareToWhatsApp}
        />

        <Confetti showConfetti={showConfetti} colorTheme={colorTheme} />
        <Particles particles={particles} />

        {/* Tutorial Overlay for First-Time Users */}
        <AnimatePresence>
          {showTutorial && (
            <TutorialOverlay onComplete={handleTutorialComplete} />
          )}
        </AnimatePresence>

        <GameHeader
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          colorBlindMode={colorBlindMode}
          setColorBlindMode={setColorBlindMode}
          hapticEnabled={hapticEnabled}
          setHapticEnabled={setHapticEnabled}
          playSound={playSound}
          triggerHaptic={triggerHaptic}
        />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {gameState === 'menu' && (
              <MenuView
                highScore={highScore}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                timedMode={timedMode}
                setTimedMode={setTimedMode}
                hasDoneDaily={hasDoneDaily}
                dailyResult={stats.lastDailyResult}
                startGame={startGame}
                setGameState={setGameState}
                playSound={playSound}
                dailyChallenge={dailyChallenge}
              />
            )}

            {gameState === 'settings' && (
              <SettingsView
                soundPack={soundPack}
                setSoundPack={setSoundPack}
                colorTheme={colorTheme}
                setColorTheme={setColorTheme}
                setGameState={setGameState}
                playSound={playSound}
              />
            )}

            {gameState === 'achievements' && (
              <AchievementsView
                stats={stats}
                setGameState={setGameState}
                playSound={playSound}
              />
            )}

            {gameState === 'stats' && (
              <StatsView
                stats={stats}
                colorTheme={colorTheme}
                setGameState={setGameState}
                playSound={playSound}
              />
            )}

            {gameState === 'help' && (
              <HelpView
                setGameState={setGameState}
                playSound={playSound}
              />
            )}

            {gameState === 'calendar' && (
<CalendarView
  setGameState={setGameState}
  startPreview={startPreview}
  playSound={playSound}
  todayDate={todayDate}
  stats={stats}
  />
            )}

            {gameState === 'playing' && (
              <PlayingView
                score={score}
                lives={lives}
                streak={streak}
                multiplier={multiplier}
                highScore={highScore}
                accuracy={accuracy}
                currentColor={currentColor}
                currentColorName={currentColorName}
                message={message}
                colorKey={colorKey}
                timedMode={timedMode}
                timeLeft={timeLeft}
                isDailyMode={isDailyMode}
                dailyIndex={dailyIndex}
                dailySequenceLength={dailySequence.length}
                colorBlindMode={colorBlindMode}
                pulseCorrect={pulseCorrect}
                isTransitioning={isTransitioning}
                colorBoxRef={colorBoxRef}
                handleGuess={handleGuess}
                dailyTimeLeft={dailyTimeLeft}
                dailyChallengeName={isPreviewMode ? previewChallenge?.name : dailyChallenge?.name}
                isPreviewMode={isPreviewMode}
              />
            )}

            {gameState === 'gameover' && (
              <GameOverView
                score={score}
                highScore={highScore}
                maxStreak={maxStreak}
                accuracy={accuracy}
                isDailyMode={isDailyMode}
                startGame={startGame}
                setGameState={setGameState}
                setShowShareModal={setShowShareModal}
                playSound={playSound}
              />
            )}
          </AnimatePresence>
        </main>

          <GameFooter />
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Wrap with Suspense for useSearchParams
export default function IsItPink() {
  return (
    <Suspense fallback={
      <div className="min-h-screen min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="text-primary text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    }>
      <IsItPinkGame />
    </Suspense>
  );
}
