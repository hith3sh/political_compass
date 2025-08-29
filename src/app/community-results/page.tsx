'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LanguageSelector } from '../../components/LanguageSelector';
import { QuadrantPieChart } from '../../components/QuadrantPieChart';
import { useLanguage } from '../../lib/LanguageContext';



interface StatsData {
  totalUsers: number;
  quadrantDistribution: Record<string, number>;
}

export default function CommunityResults() {
  const { language, setLanguage } = useLanguage();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const statsData = await response.json();
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load community stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Community Results' : 'සමූහයෙ ප්‍රතිඵල'}
            </h1>
            <p className="text-gray-500">
              {language === 'en' ? 'Unable to load results' : 'ප්‍රතිඵල පූරණය කළ නොහැක'}
            </p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block cursor-pointer">
              {language === 'en' ? '← Back to Home' : '← මුල් පිටුවට'}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'en' ? 'Community Results' : 'සමූහයෙ ප්‍රතිඵල'}
              </h1>
              {stats && (
                <span className="ml-4 text-lg font-semibold text-blue-600">
                  ({stats.totalUsers} {language === 'en' ? 'participants' : 'සහභාගිවූවන්'})
                </span>
              )}
            </div>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'See how our community\'s political views are distributed across different quadrants'
                : 'අපේ ප්‍රජාවේ දේශපාලන අදහස් විවිධ ප්‍රදේශවල ව්‍යාප්ත වන ආකාරය බලන්න'}
            </p>
          </div>
          <LanguageSelector 
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </motion.div>

        {/* Pie Chart */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <QuadrantPieChart 
              distribution={stats.quadrantDistribution}
              language={language}
              className="mx-auto max-w-5xl"
            />
          </motion.div>
        )}

                 {/* Action Buttons */}
         <motion.div 
           className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
         >
           <Link href="/community-results/individual">
             <motion.button
               className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 text-lg min-w-[200px]"
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.95 }}
             >
               👥 {language === 'en' ? 'See Individual Results' : 'පුද්ගල ප්‍රතිඵල බලන්න'}
             </motion.button>
           </Link>

           <Link href="/suggest-politicians">
             <motion.button
               className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-purple-700 transition-all duration-300 text-lg min-w-[200px]"
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.95 }}
             >
               🗳️ {language === 'en' ? 'Suggest Political theorists' : 'ප්‍රසිද්ද මතවාදීන්ව යෝජනා කරන්න'}
             </motion.button>
           </Link>

           <Link href="/">
             <motion.button
               className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-all duration-300 text-lg min-w-[200px]"
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.95 }}
             >
               🧭 {language === 'en' ? 'Take the Test' : 'ටෙස්ට් එක ගන්න'}
             </motion.button>
           </Link>
         </motion.div>

        

        {/* Empty State */}
        {stats && stats.totalUsers === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'en' ? 'No results yet' : 'තවම ප්‍රතිඵල නැත'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'en' 
                ? 'Be the first to take the political compass test and contribute to our community data!'
                : 'දේශපාලන කොම්පස් ටෙස්ට් එක ගත්ත පළමු පුද්ගලයා වෙන්න සහ අපේ ප්‍රජා දත්තවලට දායක වෙන්න!'}
            </p>
          </motion.div>
        )}

        {/* Back to Home */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'en' ? 'Back to Home' : 'මුල් පිටුවට'}
          </Link>
        </motion.div>
      </div>
      
      {/* Popunder Ad - Community Results Page Only */}
      <script
        type="text/javascript"
        src="//pl27528300.effectivecpmrate.com/12/0c/4b/120c4bcb1c2545ec2113195288dcad95.js"
        async
      />
    </main>
  );
}
