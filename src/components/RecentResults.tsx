'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { UserResult } from '../lib/types';
import { formatScore, getQuadrantLabel } from '../lib/utils';

interface RecentResultsProps {
  language: 'en' | 'si';
  limit?: number;
}

interface StatsData {
  totalUsers: number;
}

export function RecentResults({ language, limit = 5 }: RecentResultsProps) {
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
          fetch(`/api/results?limit=${limit}`),
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
  }, [limit]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {language === 'en' ? 'Community Results' : 'ප්‍රජා ප්‍රතිඵල'}
        </h3>
        <p className="text-gray-500 text-center py-8">
          {language === 'en' ? 'Unable to load results' : 'ප්‍රතිඵල පූරණය කළ නොහැක'}
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {language === 'en' ? 'Community Results' : 'ප්‍රජා ප්‍රතිඵල'}
        </h3>
        {stats && (
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
            {stats.totalUsers} {language === 'en' ? 'participants' : 'සහභාගිවන්නන්'}
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {language === 'en' 
            ? 'No results yet. Be the first to share your result!' 
            : 'තවම ප්‍රතිඵල නැත. ඔබේ ප්‍රතිඵලය බෙදා ගන්න!'
          }
        </p>
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {result.name}
                  </h4>
                  <div className="text-sm text-gray-600 mb-2">
                    {getQuadrantLabel(result.quadrant, language)}
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>
                      {language === 'en' ? 'Economic' : 'ආර්ථික'}: {formatScore(result.economic_score)}
                    </span>
                    <span>
                      {language === 'en' ? 'Social' : 'සමාජ'}: {formatScore(result.social_score)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  {formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            href="/community"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
          >
            {language === 'en' ? 'View all results' : 'සියලු ප්‍රතිඵල බලන්න'} →
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

export default RecentResults;