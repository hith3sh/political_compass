'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PoliticalCompass } from '../components/PoliticalCompass';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../lib/LanguageContext';

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setTotalUsers(data.totalUsers);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <Link href="/community-results">
              <motion.button 
                className="bg-white text-gray-700 px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform transition-all duration-300 border border-gray-200 cursor-pointer"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === 'en' ? '👥 Community Results' : '👥 ප්‍රජා ප්‍රතිඵල'}
              </motion.button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quiz Completion Counter */}
            {totalUsers !== null && totalUsers > 0 && (
              <Link href="/community-results">
                <motion.button 
                  className="bg-white text-gray-700 px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform transition-all duration-300 border border-gray-200 cursor-pointer"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="font-bold text-blue-600">
                      {totalUsers.toLocaleString()}
                    </span>
                    <span className="text-sm">
                      {language === 'en' ? 'people have taken this quiz' : 'දෙනෙක් මේ ප්‍රශ්නාවලිය ගෙන ඇත'}
                    </span>
                  </div>
                </motion.button>
              </Link>
            )}
            <LanguageSelector 
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </motion.div>

        {/* Title Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Political Compass Visualization */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PoliticalCompass 
            size={500} 
            showLabels={true} 
            showPosition={false} 
          />
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Link href="/quiz">
            <motion.button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('takeTest')}
            </motion.button>
          </Link>
          
          <motion.p 
            className="text-sm text-gray-500 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {language === 'en' ? '24 questions • Takes about 5 minutes' : 'ප්‍රශ්න 24ක් • විනාඩි 5ක් පමණ ගතවේ'}
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}