'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSelector } from '../../../components/LanguageSelector';
import { useLanguage } from '../../../lib/LanguageContext';
import { UserResult } from '../../../lib/types';
import { formatScore, getQuadrantLabel } from '../../../lib/utils';
import { getAvatarUrl } from '../../../lib/avatars';

interface StatsData {
  totalUsers: number;
}

interface PaginatedResults {
  results: UserResult[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function IndividualResults() {
  const { language, setLanguage } = useLanguage();
  const [results, setResults] = useState<UserResult[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 18; // 3x6 grid looks good

  // Fetch stats only once on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const statsData = await response.json();
          setStats(statsData);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  // Fetch data when page changes (including initial load)
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Use loading for first page, pageLoading for subsequent pages
        if (currentPage === 1) {
          setLoading(true);
        } else {
          setPageLoading(true);
        }
        
        const response = await fetch(`/api/results?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch page data');
        }

        const data: PaginatedResults = await response.json();
        setResults(data.results || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load page data');
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchPageData();
  }, [currentPage, itemsPerPage]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'libertarian-left':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'libertarian-right':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'authoritarian-left':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'authoritarian-right':
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
              {language === 'en' ? 'Individual Results' : 'පුද්ගල ප්‍රතිඵල'}
            </h1>
            <p className="text-gray-500">
              {language === 'en' ? 'Unable to load results' : 'ප්‍රතිඵල පූරණය කළ නොහැක'}
            </p>
            <Link href="/community-results" className="text-blue-600 hover:text-blue-700 mt-4 inline-block cursor-pointer">
              {language === 'en' ? '← Back to Overview' : '← සමාලෝචනයට'}
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
              <Link 
                href="/community-results"
                className="text-blue-600 hover:text-blue-700 font-medium mr-4"
              >
                ← {language === 'en' ? 'Back' : 'ආපසු'}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'en' ? 'Individual Results' : 'පුද්ගල ප්‍රතිඵල'}
              </h1>
              {stats && (
                <span className="ml-4 text-lg font-semibold text-blue-600">
                  ({stats.totalUsers} {language === 'en' ? 'total' : 'මුළු'})
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {language === 'en' 
                  ? `Page ${currentPage} of ${totalPages}` 
                  : `පිටුව ${currentPage} න් ${totalPages}`}
              </span>
              <span>•</span>
              <span>
                {language === 'en' 
                  ? `Showing ${results.length} results` 
                  : `ප්‍රතිඵල ${results.length} ක් පෙන්වනවා`}
              </span>
            </div>
          </div>
          <LanguageSelector 
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </motion.div>

        {/* Results Grid with Loading Overlay */}
        <div className="relative">
          {/* Page Loading Overlay */}
          {pageLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">
                  {language === 'en' ? 'Loading...' : 'පූරණය වෙමින්...'}
                </span>
              </div>
            </div>
          )}

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
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1 || pageLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 1 || pageLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'en' ? 'Previous' : 'පෙර'}
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                const isActive = pageNum === currentPage;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={pageLoading}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : pageLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || pageLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === totalPages || pageLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              {language === 'en' ? 'Next' : 'ඊළඟ'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}

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
                ? 'Be the first to take the test!' 
                : 'පළමුව ටෙස්ට් එක ගන්න!'}
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