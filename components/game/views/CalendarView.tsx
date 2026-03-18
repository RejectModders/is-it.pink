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
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  
  const today = new Date();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const prevMonth = () => {
    if (!canGoPrevMonth()) return;
    playSound('click');
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedChallenge(null);
    setSelectedDay(null);
  };
  
  const nextMonth = () => {
    playSound('click');
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedChallenge(null);
    setSelectedDay(null);
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

  const isPastDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayMidnight;
  };
  
  const getDateString = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return getLocalDateString(date);
  };
  
  const isDailyDone = (day: number) => {
    const dateStr = getDateString(day);
    return stats.lastDailyDate === dateStr;
  };
  
  const isDailyCompleted = (day: number) => {
    const dateStr = getDateString(day);
    return stats.completedDailies?.includes(dateStr) ?? false;
  };
  
  // Check if we can go to previous month (not before launch month)
  const canGoPrevMonth = () => {
    const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const launchMonth = new Date(DAILY_LAUNCH_DATE.getFullYear(), DAILY_LAUNCH_DATE.getMonth(), 1);
    return prevMonthDate >= launchMonth;
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
          disabled={!canGoPrevMonth()}
          className={`p-2 rounded-lg transition-colors ${canGoPrevMonth() ? 'hover:bg-muted' : 'opacity-30 cursor-not-allowed'}`}
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
            const isPast = !isCurrentDay && isPastDay(day);
            const isDone = isDailyDone(day);
            const isCompleted = isDailyCompleted(day);
            const isSelected = selectedChallenge?.id === challenge.id && 
              getDateString(day) === (selectedDay ?? '');
            
            return (
              <motion.button
                key={day}
                onClick={() => {
                  if (!isDisabled) {
                    playSound('click');
                    setSelectedChallenge(challenge);
                    setSelectedDay(getDateString(day));
                  }
                }}
                disabled={isDisabled}
                className={`aspect-square rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                  isDisabled
                    ? 'opacity-25 cursor-not-allowed'
                    : isPast
                      ? 'opacity-60 hover:opacity-80 hover:bg-muted'
                      : isSelected
                        ? 'bg-primary text-primary-foreground'
                        : isCurrentDay
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'hover:bg-muted'
                }`}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
              >
                <span>{day}</span>
                {isDisabled ? (
                  <span className="text-[8px] text-muted-foreground">N/A</span>
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    challenge.difficulty === 'easy' ? 'bg-green-500' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                )}
                {/* Checkmark for completed dailies (today or past) */}
                {(isCompleted || (isDone && isCurrentDay)) && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[9px] text-white font-bold">&#10003;</span>
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
            <div>
              <h3 className="font-bold text-lg">{selectedChallenge.name}</h3>
              {selectedDay && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedDay === getLocalDateString()
                    ? 'Today'
                    : selectedDay < getLocalDateString()
                      ? 'Past challenge'
                      : new Date(selectedDay + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
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
            const todayStr = getLocalDateString();
            const isThisToday = selectedDay === todayStr;
            const isThisPast = selectedDay !== null && selectedDay < todayStr;

            // Today and already done
            if (isThisToday && stats.lastDailyDate === todayStr) {
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

            // Past day - viewable but not practicable
            if (isThisPast) {
              return (
                <div className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-muted/50 text-muted-foreground border border-border">
                  This challenge has passed
                </div>
              );
            }

            // Today (not done yet) or future
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
                  {isThisToday ? 'Play Today\'s Challenge' : 'Practice This Challenge'}
                </motion.button>
                <p className="text-xs text-muted-foreground">
                  {isThisToday ? 'This is today\'s real daily challenge' : 'Practice mode - stats won\'t be saved'}
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
