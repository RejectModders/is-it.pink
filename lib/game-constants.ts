import { Star, Award, Crown, Trophy, Flame, Zap, Eye, Heart, TrendingUp, Target, Calendar } from 'lucide-react';

export const PINK_COLORS = [
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

export const NOT_PINK_COLORS = [
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

export type GameState = 'menu' | 'playing' | 'gameover' | 'help' | 'stats' | 'achievements' | 'daily' | 'settings';
export type SoundPack = keyof typeof SOUND_PACKS;
export type ColorTheme = keyof typeof COLOR_THEMES;
