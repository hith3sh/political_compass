'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../lib/LanguageContext';
import { MatchedFigure } from '../lib/types';

interface PoliticalFigureModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedFigure: MatchedFigure;
}

export function PoliticalFigureModal({ isOpen, onClose, matchedFigure }: PoliticalFigureModalProps) {
  const { language } = useLanguage();

  const getMatchIcon = (matchType: string) => {
    return matchType === 'exact' ? '🎯' : '🔄';
  };

  const getMatchTitle = (matchType: string) => {
    if (language === 'si') {
      return matchType === 'exact' ? 'සම්පූර්ණ ගැලපීම!' : 'සමාන අදහස්!';
    }
    return matchType === 'exact' ? 'Perfect Match!' : 'Similar Views!';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ 
              type: "spring", 
              duration: 0.5,
              bounce: 0.3 
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-4xl mb-2"
                >
                  {getMatchIcon(matchedFigure.matchType)}
                </motion.div>
                <h2 className="text-xl font-bold">
                  {getMatchTitle(matchedFigure.matchType)}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Figure Image */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center mb-4"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200">
                      <Image
                        src={`/people/${matchedFigure.image}`}
                        alt={matchedFigure.name}
                        width={96}
                        height={96}
                        className="object-cover"
                        priority={true}
                      />
                    </div>
                    {/* Ring animation around image */}
                    <div className="absolute inset-0 w-24 h-24 border-2 border-teal-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </motion.div>

                {/* Name */}
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-center text-gray-800 mb-3"
                >
                  {matchedFigure.name}
                </motion.h3>

                {/* Message */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-600 text-center mb-4 leading-relaxed"
                >
                  {language === 'si' 
                    ? `ඔබේ දේශපාලන අදහස් ${matchedFigure.name} සමඟ ${matchedFigure.matchType === 'exact' ? 'සම්පූර්ණයෙන්' : 'බොහෝ සෙයින්'} ගැළපේ!`
                    : matchedFigure.message
                  }
                </motion.p>

                {/* Match details */}
                {matchedFigure.matchType === 'close' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-blue-50 rounded-lg p-3 mb-4"
                  >
                    <p className="text-sm text-blue-700 text-center">
                      {language === 'si' 
                        ? `දුරස්ථභාවය: ${matchedFigure.distance.toFixed(1)} ඒකක`
                        : `Distance: ${matchedFigure.distance.toFixed(1)} units`
                      }
                    </p>
                  </motion.div>
                )}

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg cursor-pointer"
                >
                  {language === 'si' ? 'අවබෝධයි!' : 'Got it!'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}