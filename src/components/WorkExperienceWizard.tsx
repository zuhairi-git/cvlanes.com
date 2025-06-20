'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimelineCard from './TimelineCard';

interface WorkPosition {
  title: string;
  period: string;
  company?: string;
  description?: string;
  positions?: WorkPosition[];
}

interface WorkContent {
  intro: string;
  positions: WorkPosition[];
}

interface WorkExperienceWizardProps {
  workContent: WorkContent;
  theme: string;
  t: (key: string) => string;
}

export function WorkExperienceWizard({ workContent, theme, t }: WorkExperienceWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSteps = workContent.positions.length;

  // Handle scroll progress
  useEffect(() => {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    setScrollProgress(progress);
  }, [currentStep, totalSteps]);  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const getCurrentPosition = () => {
    return workContent.positions[currentStep];
  };
  const getStepIcon = (index: number) => {
    const position = workContent.positions[index];
    const isFirst = index === 0;
    
    if (position.positions) {
      return 'history';
    }
    
    return isFirst ? 'rocket_launch' : (index % 2 === 0 ? 'grid_view' : 'insights');
  };
  const getStepColors = (theme: string) => {
    if (theme === 'colorful') {
      return {
        gradient: 'from-purple-500 to-blue-500',
        shadow: 'shadow-purple-500/30',
        ring: 'bg-purple-400/30',
        text: 'text-white'
      };
    } else if (theme === 'dark') {
      return {
        gradient: 'from-blue-400 to-cyan-400',
        shadow: 'shadow-blue-400/30',
        ring: 'bg-blue-400/30',
        text: 'text-white'
      };
    } else {
      return {
        gradient: 'from-blue-500 to-indigo-500',
        shadow: 'shadow-blue-500/30',
        ring: 'bg-blue-400/30',
        text: 'text-white'
      };
    }
  };

  return (
    <div ref={containerRef} className="py-20 bg-black/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span 
            className="material-symbols text-3xl p-3 mb-5 rounded-lg text-purple-400 bg-purple-400/10 inline-block"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            work_history
          </motion.span>
          <h3 className="text-center text-3xl font-bold">
            {t('home.workExperience.title')}
          </h3>
          
          <motion.div
            className="mx-auto h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mt-4"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          />
          <p className="text-center mt-4 text-theme-text/70 max-w-2xl mx-auto">
            {workContent.intro}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative h-2 bg-theme-text/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scrollProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>          {/* Step indicators */}
          <div className="flex justify-between items-center mt-4">
            {workContent.positions.map((_: WorkPosition, index: number) => {
              const colors = getStepColors(theme);
              const isActive = index === currentStep;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${colors.gradient} ${colors.shadow} shadow-lg scale-110`
                      : 'bg-theme-text/10 hover:bg-theme-text/20 text-theme-text/50'
                  }`}
                  whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${colors.ring}`} />
                  )}
                  <span className={`material-symbols text-sm z-10 ${isActive ? 'text-white' : 'text-theme-text/50'}`}>
                    {getStepIcon(index)}
                  </span>
                </motion.button>
              );
            })}
          </div></div>
        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto">
          {/* Card Display Area */}
          <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >                {(() => {
                  const position = getCurrentPosition();
                    if (!position.positions) {
                    // Regular position
                    return (
                      <div className="space-y-4">
                        <TimelineCard
                          theme={theme === 'colorful' ? 'colorful' : theme === 'dark' ? 'dark' : 'light'}
                          icon={<span className="material-symbols text-3xl">{getStepIcon(currentStep)}</span>}
                          title={position.title}
                          date={position.period}
                          location={position.company || ''}
                          description={position.description || ''}
                        />
                        {/* Step counter at bottom */}
                        <div className="flex justify-center">
                          <span className="text-sm text-theme-text/50 bg-theme-text/5 px-3 py-1 rounded-full">
                            {currentStep + 1} of {totalSteps}
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    // Consolidated earlier positions
                    const consolidatedDescription = position.positions
                      .map((subPosition: WorkPosition) => `${subPosition.title} at ${subPosition.company || 'Unknown Company'} (${subPosition.period || "2000-2016"})`)
                      .join(" • ");
                    
                    return (
                      <div className="space-y-4">
                        <TimelineCard
                          theme={theme === 'colorful' ? 'colorful' : theme === 'dark' ? 'dark' : 'light'}
                          icon={<span className="material-symbols text-3xl">history</span>}
                          title={position.title}
                          date={position.period}
                          location="Various Companies"
                          description={consolidatedDescription}
                        />
                        {/* Step counter at bottom */}
                        <div className="flex justify-center">
                          <span className="text-sm text-theme-text/50 bg-theme-text/5 px-3 py-1 rounded-full">
                            {currentStep + 1} of {totalSteps}
                          </span>
                        </div>
                      </div>
                    );
                  }
                })()}
              </motion.div>
            </AnimatePresence>
          </div>          {/* Quick Navigation Dots */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {workContent.positions.map((_: WorkPosition, index: number) => {
              const colors = getStepColors(theme);
              const isActive = index === currentStep;
              
              return (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${colors.gradient} scale-150 shadow-lg ${colors.shadow}`
                      : 'bg-transparent border border-theme-text/20 hover:border-theme-text/40'
                  }`}
                >
                  {isActive && (
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${colors.ring}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-xl"
            initial={{ x: -100, y: 100, opacity: 0 }}
            animate={{ x: 0, y: 150, opacity: 0.5 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            style={{ left: '5%', top: '10%' }}
          />
          <motion.div 
            className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-xl"
            initial={{ x: 100, y: -100, opacity: 0 }}
            animate={{ x: 0, y: -150, opacity: 0.5 }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
            style={{ right: '5%', top: '40%' }}
          />
        </div>
      </div>
    </div>
  );
}
