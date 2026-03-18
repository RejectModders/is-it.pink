'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Play, Timer, Heart, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { DAILY_CHALLENGES, DAILY_LAUNCH_DATE, type DailyChallenge, type GameState, type Stats } from '@/lib/game-constants';
import { getChallengeForDate, getLocalDateString } from '@/lib/game-utils';

interface CalendarViewProps {
  setGameState: (state: GameState) => void;
  startPreview: (challenge: DailyChallenge) => void;
  playSound: (type: 'correct' | 'wrong' | 'click') => void;
  todayDate: string;
  stats: Stats;
}

export function CalendarView({ setGameState, startPreview, playSound, todayDate, stats }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedChallenge, setSelectedChallenge] = useState<DailyChallenge | null>(null);
  
  const today = new Date();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const prevMonth = () => {
    playSound('click');
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedChallenge(null);
  };
  
  const nextMonth = () => {
    playSound('click');
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedChallenge(null);
  };
  
  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-500 border-red-500/30';
    }
  };
  
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth.getMonth() && 
           today.getFullYear() === currentMonth.getFullYear();
  };
  
  const isBeforeLaunch = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < DAILY_LAUNCH_DATE;
  };
  
  const isTodaysChallenge = (day: number) => {
    return isToday(day);
  };
  
  const getDateString = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return getLocalDateString(date);
  };
  
  const isDailyDone = (day: number) => {
    const dateStr = getDateString(day);
    return stats.lastDailyDate === dateStr;
  };

  return (
    <motion.div 
      key="calendar"
      className="text-center w-full max-w-md space-y-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.12 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => { playSound('click'); setGameState('menu'); }}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Challenge Calendar
        </h1>
        <div className="w-9" />
      </div>
      
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button 
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-card rounded-2xl border border-border p-3">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-xs text-muted-foreground font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before first of month */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const challenge = getChallengeForDate(date);
            const isCurrentDay = isToday(day);
            const isDisabled = isBeforeLaunch(day);
            const isDone = isDailyDone(day);
            const isClickable = !isDisabled && (isCurrentDay || !isDone);
            
            return (
              <motion.button
                key={day}
                onClick={() => {
                  if (isClickable) {
                    playSound('click');
                    setSelectedChallenge(challenge);
                  }
                }}
                disabled={isDisabled}
                className={`aspect-square rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                  isDisabled 
                    ? 'opacity-30 cursor-not-allowed' 
                    : isDone && !isCurrentDay
                      ? 'opacity-60 bg-muted/50'
                      : selectedChallenge?.id === challenge.id
                        ? 'bg-primary text-primary-foreground'
                        : isCurrentDay
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'hover:bg-muted'
                }`}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                <span>{day}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  challenge.difficulty === 'easy' ? 'bg-green-500' :
                  challenge.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                } ${isDisabled ? 'opacity-30' : ''}`} />
                {isDone && isCurrentDay && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">✓</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Selected Challenge Info */}
      {selectedChallenge && (
        <motion.div 
          className="bg-card rounded-2xl border border-border p-4 space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">{selectedChallenge.name}</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border capitalize ${getDifficultyColor(selectedChallenge.difficulty)}`}>
              {selectedChallenge.difficulty}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">{selectedChallenge.description}</p>
          
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-primary" />
              <span>{selectedChallenge.rounds} rounds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{selectedChallenge.lives} {selectedChallenge.lives === 1 ? 'life' : 'lives'}</span>
            </div>
            {selectedChallenge.timeLimit && (
              <div className="flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-accent" />
                <span>{selectedChallenge.timeLimit}s/round</span>
              </div>
            )}
          </div>
          
          {(() => {
            // Check if this selected challenge is today's and already done
            const todayChallenge = getChallengeForDate(new Date());
            const isThisToday = selectedChallenge.id === todayChallenge.id && 
              stats.lastDailyDate === new Date().toISOString().split('T')[0];
            
            if (isThisToday) {
              return (
                <div className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                  stats.lastDailyResult === 'completed' 
                    ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-500 border border-red-500/30'
                }`}>
                  {stats.lastDailyResult === 'completed' ? 'Completed!' : 'Failed'} - Come back tomorrow
                </div>
              );
            }
            
            return (
              <>
                <motion.button
                  onClick={() => {
                    playSound('click');
                    startPreview(selectedChallenge);
                  }}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-4 h-4" />
                  Practice This Challenge
                </motion.button>
                
                <p className="text-xs text-muted-foreground">
                  Practice mode - stats won&apos;t be saved
                </p>
              </>
            );
          })()}
        </motion.div>
      )}
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Easy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Hard</span>
        </div>
      </div>
    </motion.div>
  );
}
