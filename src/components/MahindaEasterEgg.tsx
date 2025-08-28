'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../lib/LanguageContext';

interface MahindaEasterEggProps {
  userPosition: { economic: number; social: number };
  onClose?: () => void;
}

// Mahinda's exact position from InteractiveGrid.tsx: { x: 1, y: 7 }
const MAHINDA_POSITION = { economic: 1, social: 7 };
const POSITION_THRESHOLD = 1.5; // Allow some margin for matching

function isNearPosition(userPos: { economic: number; social: number }, targetPos: { economic: number; social: number }): boolean {
  const economicDiff = Math.abs(userPos.economic - targetPos.economic);
  const socialDiff = Math.abs(userPos.social - targetPos.social);
  return economicDiff <= POSITION_THRESHOLD && socialDiff <= POSITION_THRESHOLD;
}

export function MahindaEasterEgg({ userPosition, onClose }: MahindaEasterEggProps) {
  const { language } = useLanguage();
  const [shouldShow, setShouldShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user's position matches Mahinda's position
    const matches = isNearPosition(userPosition, MAHINDA_POSITION);
    if (matches) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => {
        setShouldShow(true);
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userPosition]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldShow(false);
      onClose?.();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative max-w-md mx-4"
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: 180 }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 300,
              duration: 0.8 
            }}
          >
            {/* Magic Card Container */}
            <div className="relative bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 p-6 rounded-2xl shadow-2xl transform perspective-1000">
              {/* Magical Sparkles */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Card Content */}
              <div className="text-center">
                {/* Title */}
                <motion.h2
                  className="text-2xl font-bold text-white mb-4 drop-shadow-lg"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {language === 'en' ? '🎉 Special Match! 🎉' : '🎉 විශේෂ ගැලපීමක්! 🎉'}
                </motion.h2>

                {/* Image */}
                <motion.div
                  className="relative w-48 h-60 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  <Image
                    src="/mahinda_smiling.jpg"
                    alt="Mahinda Rajapaksa Smiling"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>

                {/* Message */}
                <motion.div
                  className="space-y-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <p className="text-white font-semibold text-lg drop-shadow">
                    {language === 'en' 
                      ? "Your political position matches with Mahinda Rajapaksa!" 
                      : "ඔබේ දේශපාලන ස්ථානය මහින්ද රාජපක්ෂ සමඟ ගැලපෙනවා!"}
                  </p>
                  <p className="text-white opacity-90 text-sm">
                    {language === 'en' 
                      ? "A rare political alignment detected!" 
                      : "දුර්ලභ දේශපාලන පෙළගැස්මක් අනාවරණය විය!"}
                  </p>
                </motion.div>

                {/* Fun Stats */}
                <motion.div
                  className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <p className="text-white text-xs">
                    {language === 'en' 
                      ? "Position: Economic +1, Social +7" 
                      : "ස්ථානය: ආර්ථික +1, සමාජ +7"}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}