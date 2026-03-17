'use client';

import { BarChart3, TrendingUp, Crown, Flame, Target, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import type { Stats, GameState, ColorTheme } from '@/lib/game-constants';
import { COLOR_THEMES } from '@/lib/game-constants';

interface StatsViewProps {
  stats: Stats;
  colorTheme: ColorTheme;
  setGameState: (state: GameState) => void;
  playSound: (type: 'correct' | 'wrong' | 'click') => void;
}

export function StatsView({
  stats,
  colorTheme,
  setGameState,
  playSound,
}: StatsViewProps) {
  const chartData = (stats.gameHistory || []).slice(-10).map((game, i) => ({
    name: `G${i + 1}`,
    score: game.score,
    accuracy: game.accuracy,
    streak: game.streak,
  }));

  return (
    <motion.div 
      key="stats"
      className="text-center w-full max-w-md space-y-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.1 }}
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
            transition={{ duration: 0.08 }}
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
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                />
                <Bar dataKey="score" fill={COLOR_THEMES[colorTheme].primary} radius={[4, 4, 0, 0]} />
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
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} stroke="currentColor" className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  cursor={{ stroke: 'hsl(var(--muted-foreground) / 0.3)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke={COLOR_THEMES[colorTheme].accent}
                  strokeWidth={2}
                  dot={{ fill: COLOR_THEMES[colorTheme].accent, strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: COLOR_THEMES[colorTheme].primary }}
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
        transition={{ duration: 0.06 }}
      >
        Back to Menu
      </motion.button>
    </motion.div>
  );
}
