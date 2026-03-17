'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Flame, Heart, Calendar, Trophy, MousePointerClick } from 'lucide-react';
import Image from 'next/image';

interface TutorialOverlayProps {
  onComplete: () => void;
}

const TUTORIAL_STEPS = [
  {
    icon: null, // Uses favicon
    title: 'Welcome to is it pink?',
    description: 'A simple color game that will test your perception. Can you tell which colors are truly pink?',
    tip: null,
  },
  {
    icon: MousePointerClick,
    title: 'How to Play',
    description: 'You\'ll see a color. Tap PINK if you think it\'s pink, or NOT PINK if it isn\'t. Use keyboard shortcuts A and D for faster play.',
    tip: 'Trust your instincts!',
  },
  {
    icon: Flame,
    title: 'Build Your Streak',
    description: 'Answer correctly in a row to build combos. The higher your streak, the bigger your score multiplier becomes.',
    tip: 'Reach 25+ for legendary effects!',
  },
  {
    icon: Heart,
    title: 'Watch Your Lives',
    description: 'You start with 3 lives in Classic mode. Wrong answers cost a life. In Timed mode, race against 60 seconds instead.',
    tip: 'Choose your mode wisely.',
  },
  {
    icon: Calendar,
    title: 'Daily Challenges',
    description: 'A unique challenge awaits you every day with special rules and difficulty. The same challenge for players worldwide!',
    tip: 'Check the calendar for upcoming challenges.',
  },
  {
    icon: Trophy,
    title: 'Ready to Play?',
    description: 'Unlock achievements, master all 50 challenges, and prove you\'re a true pink expert. Good luck!',
    tip: null,
  },
];

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

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
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Card */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl">
          {/* Top progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Header with skip */}
          <div className="flex items-center justify-between px-5 pt-4">
            <span className="text-xs font-medium text-muted-foreground">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </span>
            <button
              onClick={onComplete}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              Skip <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Icon */}
                <div className="flex justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {step.icon ? (
                      <step.icon className="w-8 h-8 text-primary" />
                    ) : (
                      <Image 
                        src="/favicon.png" 
                        alt="is it pink?" 
                        width={40} 
                        height={40}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-center text-foreground">
                  {step.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {step.description}
                </p>

                {/* Tip */}
                {step.tip && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5">
                    <p className="text-xs text-primary text-center font-medium">
                      {step.tip}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {!isFirstStep && (
                <motion.button
                  onClick={prevStep}
                  className="w-12 h-11 rounded-xl border border-border hover:bg-muted flex items-center justify-center transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              )}
              <motion.button
                onClick={nextStep}
                className="flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 bg-primary text-primary-foreground transition-all hover:brightness-110"
                whileTap={{ scale: 0.98 }}
              >
                {isLastStep ? "Let's Go!" : 'Next'}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-1.5 mt-4">
              {TUTORIAL_STEPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep 
                      ? 'bg-primary w-5' 
                      : index < currentStep 
                        ? 'bg-primary/50' 
                        : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
