'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LanguageSelectorProps {
  currentLanguage: 'en' | 'si';
  onLanguageChange: (language: 'en' | 'si') => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {[
        { code: 'si' as const, label: 'සිං', fullName: 'Sinhala' },
        { code: 'en' as const, label: 'EN', fullName: 'English' }
      ].map((language) => (
        <motion.button
          key={language.code}
          onClick={() => onLanguageChange(language.code)}
          className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            currentLanguage === language.code
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={language.fullName}
        >
          {currentLanguage === language.code && (
            <motion.div
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              layoutId="language-selector"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{language.label}</span>
        </motion.button>
      ))}
    </div>
  );
}