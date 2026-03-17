'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Target, Flame, Heart, Star, Calendar, Trophy } from 'lucide-react';
import Image from 'next/image';

interface TutorialOverlayProps {
  onComplete: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: 'Welcome!',
    subtitle: 'is it pink?',
    description: 'Test your color perception by identifying which colors are actually pink.',
    visual: 'welcome',
    accent: '#ec4899',
  },
  {
    title: 'Gameplay',
    subtitle: 'Simple but tricky',
    description: 'See a color, decide: PINK or NOT PINK. Use buttons or keyboard (A / D keys).',
    visual: 'gameplay',
    accent: '#3b82f6',
  },
  {
    title: 'Streaks',
    subtitle: 'Chain your wins',
    description: 'Consecutive correct answers build your streak. Higher streaks = bigger multipliers and epic effects!',
    visual: 'streaks',
    accent: '#f97316',
  },
  {
    title: 'Lives',
    subtitle: 'Three chances',
    description: 'Classic mode gives 3 lives. Timed mode has unlimited lives but only 60 seconds!',
    visual: 'lives',
    accent: '#ef4444',
  },
  {
    title: 'Daily Challenge',
    subtitle: 'New every day',
    description: 'Unique daily challenge with special rules. Same for everyone worldwide!',
    visual: 'daily',
    accent: '#8b5cf6',
  },
  {
    title: 'Ready?',
    subtitle: 'Let\'s go!',
    description: 'Earn achievements, climb the ranks, and become a true pink master.',
    visual: 'ready',
    accent: '#eab308',
  },
];

function TutorialVisual({ type, accent }: { type: string; accent: string }) {
  switch (type) {
    case 'welcome':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src="/favicon.png" alt="is it pink?" width={120} height={120} className="drop-shadow-2xl" />
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      );
    case 'gameplay':
      return (
        <div className="relative w-full h-full flex items-center justify-center gap-4">
          <motion.div
            className="w-24 h-24 rounded-2xl shadow-lg"
            style={{ backgroundColor: '#ec4899' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="flex flex-col gap-2">
            <motion.div
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.5 }}
            >
              PINK
            </motion.div>
            <div className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-bold opacity-50">
              NOT PINK
            </div>
          </div>
        </div>
      );
    case 'streaks':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="flex items-end gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="w-8 rounded-t-lg"
                style={{ 
                  height: `${i * 16}px`, 
                  background: `linear-gradient(to top, #f97316, #ef4444)` 
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            ))}
          </div>
          <motion.div
            className="absolute top-2 right-4"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Flame className="w-10 h-10 text-orange-500" />
          </motion.div>
          <motion.span 
            className="absolute bottom-2 text-3xl font-black text-orange-500"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            x5
          </motion.span>
        </div>
      );
    case 'lives':
      return (
        <div className="relative w-full h-full flex items-center justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15, type: 'spring' }}
            >
              <Heart className="w-12 h-12 text-red-500 fill-red-500 drop-shadow-lg" />
            </motion.div>
          ))}
        </div>
      );
    case 'daily':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              1
            </motion.div>
          </motion.div>
        </div>
      );
    case 'ready':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute w-40 h-40"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-yellow-400"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-60px)`,
                }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-lg" />
          </motion.div>
        </div>
      );
    default:
      return null;
  }
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const nextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-background/98 backdrop-blur-xl" />
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${step.accent}40 0%, transparent 50%)`,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Skip button */}
        <motion.button
          onClick={onComplete}
          className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground text-sm flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-muted/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip <X className="w-4 h-4" />
        </motion.button>

        {/* Main card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 overflow-hidden shadow-2xl">
          {/* Visual area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`visual-${currentStep}`}
              className="h-48 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${step.accent}15 0%, transparent 100%)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TutorialVisual type={step.visual} accent={step.accent} />
            </motion.div>
          </AnimatePresence>

          {/* Content */}
          <div className="p-6">
            {/* Progress bar */}
            <div className="flex gap-1.5 mb-6">
              {TUTORIAL_STEPS.map((_, index) => (
                <motion.div
                  key={index}
                  className="h-1 rounded-full flex-1 overflow-hidden bg-muted"
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: step.accent }}
                    initial={{ width: index < currentStep ? '100%' : '0%' }}
                    animate={{ width: index <= currentStep ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Title */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{step.subtitle}</p>
                  <h2 className="text-2xl font-bold" style={{ color: step.accent }}>{step.title}</h2>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3">
              {!isFirstStep && (
                <motion.button
                  onClick={prevStep}
                  className="w-12 h-12 rounded-xl border border-border hover:bg-muted flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
              )}
              <motion.button
                onClick={nextStep}
                className="flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 text-white transition-all"
                style={{ backgroundColor: step.accent }}
                whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                {isLastStep ? "Start Playing" : 'Continue'}
                {!isLastStep && <ChevronRight className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <p className="text-center text-muted-foreground/60 text-xs mt-4 font-medium">
          {currentStep + 1} / {TUTORIAL_STEPS.length}
        </p>
      </motion.div>
    </motion.div>
  );
}
