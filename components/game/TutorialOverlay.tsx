'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Sparkles, Target, Flame, Heart, Star, Zap, Calendar } from 'lucide-react';
import Image from 'next/image';

interface TutorialOverlayProps {
  onComplete: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to is it pink?',
    description: 'Test your color perception skills by identifying which colors are actually pink!',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-500',
    tip: 'Ready to become a pink master?',
  },
  {
    title: 'How to Play',
    description: 'A color will appear on screen. Decide if it\'s PINK or NOT PINK. Tap the correct button or use keyboard shortcuts (A for Pink, D for Not Pink).',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    tip: 'Trust your instincts - some colors are tricky!',
  },
  {
    title: 'Build Streaks',
    description: 'Get consecutive correct answers to build a streak. Higher streaks unlock awesome visual effects and bigger point multipliers!',
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    tip: '15+ streak = Unstoppable, 20+ = Godlike, 25+ = Legendary!',
  },
  {
    title: 'Lives & Scoring',
    description: 'You start with 3 lives in Classic mode. Each correct answer gives you points multiplied by your streak bonus. Try to beat your high score!',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    tip: 'Timed mode gives unlimited lives but only 60 seconds!',
  },
  {
    title: 'Daily Challenges',
    description: 'Every day features a unique challenge with different rules - varied rounds, lives, time limits, and pink ratios. Same challenge for everyone!',
    icon: Calendar,
    color: 'from-purple-500 to-indigo-500',
    tip: 'Practice any challenge from the Calendar view!',
  },
  {
    title: 'Earn Achievements',
    description: 'Unlock achievements by reaching milestones - high scores, long streaks, completing daily challenges, and more!',
    icon: Star,
    color: 'from-yellow-500 to-amber-500',
    tip: 'Check your stats to track your progress!',
  },
];

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const Icon = step.icon;

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
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Skip button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onComplete}
            className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 transition-colors"
          >
            Skip Tutorial <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {TUTORIAL_STEPS.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? 'w-8 bg-primary' : index < currentStep ? 'w-2 bg-primary/50' : 'w-2 bg-muted'
              }`}
              layoutId={`dot-${index}`}
            />
          ))}
        </div>

        {/* Content card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="bg-card rounded-3xl border border-border p-6 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-3 text-balance">{step.title}</h2>

            {/* Description */}
            <p className="text-muted-foreground text-center mb-4 leading-relaxed">{step.description}</p>

            {/* Tip */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-6">
              <p className="text-sm text-center text-primary font-medium">
                <Zap className="w-4 h-4 inline mr-1" />
                {step.tip}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <motion.button
                  onClick={prevStep}
                  className="flex-1 py-3 rounded-xl border border-border hover:bg-muted font-semibold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </motion.button>
              )}
              <motion.button
                onClick={nextStep}
                className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                  isLastStep 
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30' 
                    : 'bg-primary text-primary-foreground'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLastStep ? "Let's Play!" : 'Next'}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step counter */}
        <p className="text-center text-muted-foreground text-sm mt-4">
          {currentStep + 1} of {TUTORIAL_STEPS.length}
        </p>
      </motion.div>
    </motion.div>
  );
}
