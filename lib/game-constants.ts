import { Star, Award, Crown, Trophy, Flame, Zap, Eye, Heart, TrendingUp, Target, Calendar } from 'lucide-react';

// EASY PINKS - Obviously pink, clear magenta/pink hue
export const EASY_PINK_COLORS = [
  { hex: '#ff1493', name: 'Deep Pink' },
  { hex: '#ff69b4', name: 'Hot Pink' },
  { hex: '#ec4899', name: 'Pink 500' },
  { hex: '#db2777', name: 'Pink 600' },
  { hex: '#f472b6', name: 'Pink 400' },
  { hex: '#e91e8c', name: 'Electric Pink' },
  { hex: '#ff66b2', name: 'Flamingo Pink' },
  { hex: '#ff5ccd', name: 'Shocking Pink' },
  { hex: '#f0f', name: 'Magenta' },
  { hex: '#ff77a9', name: 'Tickle Me Pink' },
];

// MEDIUM PINKS - Still pink but slightly trickier
export const MEDIUM_PINK_COLORS = [
  { hex: '#ffc0cb', name: 'Classic Pink' },
  { hex: '#ffb6c1', name: 'Light Pink' },
  { hex: '#f9a8d4', name: 'Soft Pink' },
  { hex: '#ffa6c9', name: 'Carnation' },
  { hex: '#e75480', name: 'Dark Pink' },
  { hex: '#be185d', name: 'Magenta Rose' },
  { hex: '#ff85a2', name: 'Salmon Pink' },
  { hex: '#ffb7c5', name: 'Cherry Blossom' },
  { hex: '#ff6f91', name: 'Fiery Rose' },
  { hex: '#c71585', name: 'Medium Violet Red' },
];

// HARD PINKS - Subtle pinks that could be confused
export const HARD_PINK_COLORS = [
  { hex: '#fbcfe8', name: 'Pale Pink' },
  { hex: '#fce7f3', name: 'Lavender Pink' },
  { hex: '#f5d0e0', name: 'Piggy Pink' },
  { hex: '#ffb6d9', name: 'Cotton Candy' },
  { hex: '#d8a9c4', name: 'Pastel Pink' },
  { hex: '#e8b4c8', name: 'Fairy Tale' },
  { hex: '#de5d83', name: 'Blush' },
  { hex: '#b5485d', name: 'Popstar' },
  { hex: '#e88ca4', name: 'Mauvelous' },
  { hex: '#f19cbb', name: 'Amaranth Pink' },
];

// All pinks combined (for backward compatibility)
export const PINK_COLORS = [
  ...EASY_PINK_COLORS,
  ...MEDIUM_PINK_COLORS,
  ...HARD_PINK_COLORS,
];

// EASY NOT-PINKS - Clearly not pink at all
export const EASY_NOT_PINK_COLORS = [
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#f97316', name: 'Orange' },
  { hex: '#fbbf24', name: 'Amber' },
  { hex: '#06b6d4', name: 'Cyan' },
  { hex: '#22c55e', name: 'Green' },
  { hex: '#eab308', name: 'Yellow' },
  { hex: '#0ea5e9', name: 'Sky Blue' },
  { hex: '#14b8a6', name: 'Teal' },
  { hex: '#84cc16', name: 'Lime' },
];

// MEDIUM NOT-PINKS - Could trick some people
export const MEDIUM_NOT_PINK_COLORS = [
  { hex: '#ef4444', name: 'Red' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#a855f7', name: 'Purple' },
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#dc2626', name: 'Crimson' },
  { hex: '#b91c1c', name: 'Dark Red' },
  { hex: '#7c3aed', name: 'Grape' },
  { hex: '#9333ea', name: 'Amethyst' },
  { hex: '#6b7280', name: 'Gray' },
  { hex: '#f43f5e', name: 'Rose' },
];

// HARD NOT-PINKS - Tricky colors that look pink-ish but aren't technically pink
export const HARD_NOT_PINK_COLORS = [
  { hex: '#d946ef', name: 'Fuchsia' },      // More purple than pink
  { hex: '#e879f9', name: 'Orchid' },       // Purple-leaning
  { hex: '#c084fc', name: 'Lavender' },     // Light purple
  { hex: '#f0abfc', name: 'Mauve' },        // Purple with pink tint
  { hex: '#dda0dd', name: 'Plum' },         // Purple fruit color
  { hex: '#ff7f50', name: 'Coral' },        // Orange-red
  { hex: '#fa8072', name: 'Salmon' },       // Orange-red fish
  { hex: '#ff6347', name: 'Tomato' },       // Red-orange
  { hex: '#c4b5fd', name: 'Periwinkle' },   // Blue-purple
  { hex: '#f472b6', name: 'Pinkish' },      // This is actually pink but testing edge
];

// All not-pinks combined (for backward compatibility)
export const NOT_PINK_COLORS = [
  ...EASY_NOT_PINK_COLORS,
  ...MEDIUM_NOT_PINK_COLORS,
  ...HARD_NOT_PINK_COLORS.slice(0, -1), // Remove the "Pinkish" which is actually pink
];

export const MOTIVATIONAL_MESSAGES = {
  correct: ['NAILED IT!', 'PERFECT!', 'YOU GOT THIS!', 'ABSOLUTELY RIGHT!', 'LEGENDARY!', 'SPOT ON!', 'GENIUS!', 'INCREDIBLE!', 'PINK MASTER!', 'AMAZING!', 'FLAWLESS!', 'UNSTOPPABLE!'],
  wrong: ['OOPS!', 'NOT QUITE!', 'GOTCHA!', 'NICE TRY!', 'CLOSE ONE!', 'TRICKED YA!', 'PLOT TWIST!', 'FOOLED!'],
};

export const ACHIEVEMENTS = [
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

export const SOUND_PACKS = {
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

export const COLOR_THEMES = {
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

export interface Particle {
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

export interface Stats {
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

export interface GameStats {
  totalGuesses: number;
  correctGuesses: number;
}

export type GameState = 'menu' | 'playing' | 'gameover' | 'help' | 'stats' | 'achievements' | 'daily' | 'settings' | 'calendar';
export type SoundPack = keyof typeof SOUND_PACKS;
export type ColorTheme = keyof typeof COLOR_THEMES;

// 50 Daily Challenge Types
export interface DailyChallenge {
  id: number;
  name: string;
  description: string;
  rounds: number;
  lives: number;
  timeLimit?: number; // seconds per round, undefined = no limit
  pinkRatio: number; // 0-1, chance of pink appearing
  difficulty: 'easy' | 'medium' | 'hard';
  modifier?: 'inverted' | 'speed' | 'marathon' | 'precision' | 'chaos';
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  // Easy challenges (1-15)
  { id: 1, name: 'Warm Up', description: 'A gentle start - mostly pinks!', rounds: 15, lives: 3, pinkRatio: 0.7, difficulty: 'easy' },
  { id: 2, name: 'Pink Paradise', description: 'Pinks everywhere!', rounds: 20, lives: 5, pinkRatio: 0.8, difficulty: 'easy' },
  { id: 3, name: 'Beginner\'s Luck', description: 'Extra lives to help you out', rounds: 15, lives: 5, pinkRatio: 0.5, difficulty: 'easy' },
  { id: 4, name: 'Chill Vibes', description: 'Take your time, no rush', rounds: 25, lives: 4, pinkRatio: 0.5, difficulty: 'easy' },
  { id: 5, name: 'Sunday Stroll', description: 'A relaxing challenge', rounds: 20, lives: 4, pinkRatio: 0.6, difficulty: 'easy' },
  { id: 6, name: 'Soft Start', description: 'Ease into pink detection', rounds: 12, lives: 3, pinkRatio: 0.65, difficulty: 'easy' },
  { id: 7, name: 'Pink Primer', description: 'Learn to love pink', rounds: 18, lives: 4, pinkRatio: 0.55, difficulty: 'easy' },
  { id: 8, name: 'Easy Breezy', description: 'Light and simple', rounds: 15, lives: 4, pinkRatio: 0.6, difficulty: 'easy' },
  { id: 9, name: 'Comfort Zone', description: 'Stay comfortable', rounds: 20, lives: 5, pinkRatio: 0.55, difficulty: 'easy' },
  { id: 10, name: 'Training Day', description: 'Build your skills', rounds: 16, lives: 4, pinkRatio: 0.5, difficulty: 'easy' },
  { id: 11, name: 'Gentle Giant', description: 'Many rounds, many chances', rounds: 30, lives: 6, pinkRatio: 0.5, difficulty: 'easy' },
  { id: 12, name: 'Pink Promise', description: 'Trust the pink', rounds: 15, lives: 3, pinkRatio: 0.7, difficulty: 'easy' },
  { id: 13, name: 'Safety Net', description: 'Lots of lives to spare', rounds: 20, lives: 7, pinkRatio: 0.45, difficulty: 'easy' },
  { id: 14, name: 'Rookie Run', description: 'For the newcomers', rounds: 12, lives: 4, pinkRatio: 0.6, difficulty: 'easy' },
  { id: 15, name: 'Light Touch', description: 'Barely a challenge', rounds: 10, lives: 3, pinkRatio: 0.7, difficulty: 'easy' },
  
  // Medium challenges (16-35)
  { id: 16, name: 'Balanced Act', description: 'Equal parts pink and not', rounds: 20, lives: 3, pinkRatio: 0.5, difficulty: 'medium' },
  { id: 17, name: 'Quick Thinker', description: 'Speed round!', rounds: 15, lives: 2, timeLimit: 3, pinkRatio: 0.5, difficulty: 'medium', modifier: 'speed' },
  { id: 18, name: 'Tricky Colors', description: 'Not everything is as it seems', rounds: 20, lives: 2, pinkRatio: 0.4, difficulty: 'medium' },
  { id: 19, name: 'Pink or Swim', description: 'Sink or swim time', rounds: 25, lives: 2, pinkRatio: 0.5, difficulty: 'medium' },
  { id: 20, name: 'The Deceiver', description: 'Many imposters among us', rounds: 20, lives: 3, pinkRatio: 0.35, difficulty: 'medium' },
  { id: 21, name: 'Marathon Lite', description: 'A longer journey', rounds: 35, lives: 4, pinkRatio: 0.5, difficulty: 'medium', modifier: 'marathon' },
  { id: 22, name: 'Precision Mode', description: 'Every answer counts', rounds: 15, lives: 1, pinkRatio: 0.5, difficulty: 'medium', modifier: 'precision' },
  { id: 23, name: 'Color Chaos', description: 'Expect the unexpected', rounds: 20, lives: 3, pinkRatio: 0.45, difficulty: 'medium', modifier: 'chaos' },
  { id: 24, name: 'Mind Games', description: 'Trust your instincts', rounds: 18, lives: 2, pinkRatio: 0.4, difficulty: 'medium' },
  { id: 25, name: 'Steady Hands', description: 'Stay calm under pressure', rounds: 20, lives: 2, timeLimit: 5, pinkRatio: 0.5, difficulty: 'medium', modifier: 'speed' },
  { id: 26, name: 'Pink Detective', description: 'Find the real pinks', rounds: 22, lives: 3, pinkRatio: 0.4, difficulty: 'medium' },
  { id: 27, name: 'No Second Chances', description: 'One life, medium length', rounds: 15, lives: 1, pinkRatio: 0.55, difficulty: 'medium', modifier: 'precision' },
  { id: 28, name: 'The Grind', description: 'Endurance test', rounds: 40, lives: 5, pinkRatio: 0.5, difficulty: 'medium', modifier: 'marathon' },
  { id: 29, name: 'Faker Alert', description: 'Many fakes, stay sharp', rounds: 20, lives: 3, pinkRatio: 0.3, difficulty: 'medium' },
  { id: 30, name: 'Snap Decision', description: 'Quick choices required', rounds: 18, lives: 2, timeLimit: 4, pinkRatio: 0.5, difficulty: 'medium', modifier: 'speed' },
  { id: 31, name: 'Twilight Zone', description: 'Colors get weird', rounds: 25, lives: 3, pinkRatio: 0.45, difficulty: 'medium', modifier: 'chaos' },
  { id: 32, name: 'Double Trouble', description: 'Twice the challenge', rounds: 30, lives: 3, pinkRatio: 0.45, difficulty: 'medium' },
  { id: 33, name: 'Pressure Cooker', description: 'Heat is on', rounds: 20, lives: 2, timeLimit: 4, pinkRatio: 0.45, difficulty: 'medium', modifier: 'speed' },
  { id: 34, name: 'The Test', description: 'Prove yourself', rounds: 25, lives: 2, pinkRatio: 0.4, difficulty: 'medium' },
  { id: 35, name: 'Wild Card', description: 'Anything goes', rounds: 22, lives: 3, pinkRatio: 0.5, difficulty: 'medium', modifier: 'chaos' },
  
  // Hard challenges (36-50)
  { id: 36, name: 'Nightmare Mode', description: 'Only for the brave', rounds: 25, lives: 1, pinkRatio: 0.35, difficulty: 'hard', modifier: 'precision' },
  { id: 37, name: 'Speed Demon', description: 'Blink and you miss it', rounds: 20, lives: 2, timeLimit: 2, pinkRatio: 0.5, difficulty: 'hard', modifier: 'speed' },
  { id: 38, name: 'Imposter Invasion', description: 'Pinks are rare', rounds: 25, lives: 2, pinkRatio: 0.25, difficulty: 'hard' },
  { id: 39, name: 'Ultimate Marathon', description: '50 rounds of madness', rounds: 50, lives: 3, pinkRatio: 0.45, difficulty: 'hard', modifier: 'marathon' },
  { id: 40, name: 'Lightning Round', description: 'React instantly', rounds: 15, lives: 1, timeLimit: 2, pinkRatio: 0.5, difficulty: 'hard', modifier: 'speed' },
  { id: 41, name: 'Pure Chaos', description: 'Total randomness', rounds: 30, lives: 2, pinkRatio: 0.4, difficulty: 'hard', modifier: 'chaos' },
  { id: 42, name: 'The Gauntlet', description: 'Run the gauntlet', rounds: 35, lives: 2, pinkRatio: 0.4, difficulty: 'hard' },
  { id: 43, name: 'Perfection Required', description: 'No mistakes allowed', rounds: 20, lives: 1, pinkRatio: 0.45, difficulty: 'hard', modifier: 'precision' },
  { id: 44, name: 'Extreme Speed', description: '1.5 seconds per round', rounds: 18, lives: 2, timeLimit: 1.5, pinkRatio: 0.5, difficulty: 'hard', modifier: 'speed' },
  { id: 45, name: 'Color Blindness', description: 'The hardest colors', rounds: 25, lives: 2, pinkRatio: 0.35, difficulty: 'hard' },
  { id: 46, name: 'The Impossible', description: 'Can you beat it?', rounds: 30, lives: 1, pinkRatio: 0.4, difficulty: 'hard', modifier: 'precision' },
  { id: 47, name: 'Chaos Marathon', description: 'Long and unpredictable', rounds: 45, lives: 3, pinkRatio: 0.4, difficulty: 'hard', modifier: 'chaos' },
  { id: 48, name: 'Final Boss', description: 'The ultimate test', rounds: 25, lives: 1, timeLimit: 3, pinkRatio: 0.35, difficulty: 'hard', modifier: 'speed' },
  { id: 49, name: 'Legendary', description: 'Become a legend', rounds: 40, lives: 2, pinkRatio: 0.35, difficulty: 'hard' },
  { id: 50, name: 'Pink Master', description: 'Master all pinks', rounds: 30, lives: 1, timeLimit: 2.5, pinkRatio: 0.4, difficulty: 'hard', modifier: 'speed' },
];
