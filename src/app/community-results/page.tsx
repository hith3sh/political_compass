'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useLanguage } from '../../lib/LanguageContext';
import { UserResult } from '../../lib/types';
import { formatScore, getQuadrantLabel } from '../../lib/utils';
import { getAvatarUrl } from '../../lib/avatars';

interface StatsData {
  totalUsers: number;
}

export default function CommunityResults() {
  const { language, setLanguage } = useLanguage();
  const [results, setResults] = useState<UserResult[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent results and stats in parallel
        const [resultsResponse, statsResponse] = await Promise.all([
          fetch('/api/results?limit=50'), // Get more results for the dedicated page
          fetch('/api/stats')
        ]);

        if (!resultsResponse.ok || !statsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const resultsData = await resultsResponse.json();
        const statsData = await statsResponse.json();

        setResults(resultsData.results || []);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'liberal-left':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'liberal-right':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'conservative-left':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'conservative-right':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
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
              {stats && (
                <span className="ml-4 text-2xl font-bold text-blue-600">
                  {stats.totalUsers}
                </span>
              )}
            </div>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Results of others' 
                : 'අනිත් අය අරන් තියෙන ප්‍රතිපල '}
            </p>
          </div>
          <LanguageSelector 
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </motion.div>



        {/* Results Grid */}
        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={getAvatarUrl(result.avatar || 'memo_1.png')}
                    alt={`${result.name}'s avatar`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                
                {/* Name and Quadrant */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {result.name}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getQuadrantColor(result.quadrant)}`}>
                    {getQuadrantLabel(result.quadrant, language)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {language === 'en' ? 'Economic' : 'ආර්ථික'}
                  </span>
                  <span className={`font-semibold ${result.economic_score > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatScore(result.economic_score)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {language === 'en' ? 'Social' : 'සමාජ'}
                  </span>
                  <span className={`font-semibold ${result.social_score > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatScore(result.social_score)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {language === 'en' ? 'Completed' : 'සම්පූර්ණ කරන ලදී'} {formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {results.length === 0 && !loading && (
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
                ? '' 
                : ''}
            </p>
          </motion.div>
        )}

        {/* Back to Home */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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
    </main>
  );
}
