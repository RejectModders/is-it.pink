'use client';

import { Star, Zap, Heart, Flame, Calendar, Clock, Target, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayingViewProps {
  score: number;
  lives: number;
  streak: number;
  multiplier: number;
  highScore: number;
  accuracy: number;
  currentColor: string;
  currentColorName: string;
  message: string;
  colorKey: number;
  timedMode: boolean;
  timeLeft: number;
  isDailyMode: boolean;
  dailyIndex: number;
  dailySequenceLength: number;
  colorBlindMode: boolean;
  showColorName: boolean;
  pulseCorrect: boolean;
  isTransitioning: boolean;
  colorBoxRef: React.RefObject<HTMLDivElement>;
  handleGuess: (guess: 'pink' | 'notpink', e?: React.MouseEvent) => void;
  dailyTimeLeft: number | null;
  dailyChallengeName?: string;
}

function StatCard({ icon: Icon, label, value, color = 'text-foreground' }: { icon: React.ElementType, label: string, value: string | number, color?: string }) {
  return (
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
}

export function PlayingView({
  score,
  lives,
  streak,
  multiplier,
  highScore,
  accuracy,
  currentColor,
  currentColorName,
  message,
  colorKey,
  timedMode,
  timeLeft,
  isDailyMode,
  dailyIndex,
  dailySequenceLength,
  colorBlindMode,
  showColorName,
  pulseCorrect,
  isTransitioning,
  colorBoxRef,
  handleGuess,
  dailyTimeLeft,
  dailyChallengeName,
}: PlayingViewProps) {
  return (
    <motion.div 
      key="playing"
      className="w-full max-w-lg space-y-4 sm:space-y-5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {/* Daily Progress */}
      {isDailyMode && (
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">
              {dailyChallengeName ? `${dailyChallengeName}: ` : 'Daily: '}{dailyIndex + 1} / {dailySequenceLength}
            </span>
          </div>
          {dailyTimeLeft !== null && (
            <div className="flex justify-center">
              <motion.div 
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${dailyTimeLeft <= 1 ? 'bg-destructive/20 border-destructive/50' : 'bg-accent/10 border-accent/30'} border`}
                animate={dailyTimeLeft <= 1 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3, repeat: dailyTimeLeft <= 1 ? Infinity : 0 }}
              >
                <Clock className={`w-4 h-4 ${dailyTimeLeft <= 1 ? 'text-destructive' : 'text-accent'}`} />
                <span className={`text-sm font-bold tabular-nums ${dailyTimeLeft <= 1 ? 'text-destructive' : 'text-accent'}`}>
                  {dailyTimeLeft.toFixed(1)}s
                </span>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <StatCard icon={Star} label="Score" value={score} color="text-primary" />
        <StatCard 
          icon={timedMode && !isDailyMode ? Clock : Heart} 
          label={timedMode && !isDailyMode ? 'Time' : 'Lives'} 
          value={timedMode && !isDailyMode ? `${timeLeft}s` : lives} 
          color={timedMode && !isDailyMode && timeLeft <= 10 ? 'text-destructive' : (lives <= 1 ? 'text-destructive' : '')} 
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
          transition={{ duration: 0.06 }}
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
          transition={{ duration: 0.06 }}
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
  );
}
