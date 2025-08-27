'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PoliticalCompass } from '../components/PoliticalCompass';
import { LanguageSelector } from '../components/LanguageSelector';
import { RecentResults } from '../components/RecentResults';
import { useLanguage } from '../lib/LanguageContext';

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

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
          <div className="flex-1" />
          <LanguageSelector 
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
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

        {/* Quadrant Descriptions */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {[
            {
              title: language === 'en' ? 'Liberal Socialist' : 'ලිබරල් සමාජවාදී',
              description: language === 'en' 
                ? 'Supports social equality and personal freedoms'
                : 'සමාජ සමානාත්මතාවය සහ පුද්ගලික නිදහස සහාය දෙයි',
              color: 'bg-yellow-100 border-yellow-300'
            },
            {
              title: language === 'en' ? 'Liberal Capitalist' : 'ලිබරල් ධනවාදී',
              description: language === 'en'
                ? 'Favors free markets and individual liberties'
                : 'නිදහස් වෙලඳපල සහ පුද්ගල නිදහස කැමති කරයි',
              color: 'bg-purple-100 border-purple-300'
            },
            {
              title: language === 'en' ? 'Conservative Socialist' : 'සම්ප්‍රදායික සමාජවාදී',
              description: language === 'en'
                ? 'Believes in economic equality with traditional values'
                : 'සම්ප්‍රදායික වටිනාකම් සමඟ ආර්ථික සමානාත්මතාවය විශ්වාස කරයි',
              color: 'bg-red-100 border-red-300'
            },
            {
              title: language === 'en' ? 'Conservative Capitalist' : 'සම්ප්‍රදායික ධනවාදී',
              description: language === 'en'
                ? 'Supports free enterprise and traditional authority'
                : 'නිදහස් ව්‍යවසාය සහ සම්ප්‍රදායික අධිකාරිත්වයට සහාය දෙයි',
              color: 'bg-green-100 border-green-300'
            }
          ].map((quadrant, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-lg border-2 ${quadrant.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {quadrant.title}
              </h3>
              <p className="text-gray-600">
                {quadrant.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Community Results */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <RecentResults language={language} limit={5} />
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Link href="/quiz">
            <motion.button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300"
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
            transition={{ delay: 1.2 }}
          >
            {language === 'en' ? '24 questions • Takes about 5 minutes' : 'ප්‍රශ්න 24ක් • විනාඩි 5ක් පමණ ගතවේ'}
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}