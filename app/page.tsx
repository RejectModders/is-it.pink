'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import {
  PINK_COLORS,
  NOT_PINK_COLORS,
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
import { generateThemeColors, getDailySequence } from '@/lib/game-utils';

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
} from '@/components/game';

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
      setTimeout(() => setPulseCorrect(false), 200);
      
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
      setTimeout(() => setShakeScreen(false), 300);
    }

    if (isDailyMode && dailyIndex >= dailySequence.length - 1) {
      setTimeout(() => {
        setGameState('gameover');
        saveStats();
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

  return (
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
                startGame={startGame}
                setGameState={setGameState}
                playSound={playSound}
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
                showColorName={showColorName}
                pulseCorrect={pulseCorrect}
                isTransitioning={isTransitioning}
                colorBoxRef={colorBoxRef}
                handleGuess={handleGuess}
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
  );
}
