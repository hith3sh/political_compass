'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useLanguage } from '../../lib/LanguageContext';
import { UserResult } from '../../lib/types';
import { formatScore, getQuadrantLabel } from '../../lib/utils';

interface PaginatedResults {
  results: UserResult[];
  total: number;
  totalPages: number;
}

export default function Community() {
  const { language, setLanguage } = useLanguage();
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchResults = async (page: number, search?: string) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        mode: 'paginated',
        page: page.toString(),
        limit: '20'
      });

      if (search?.trim()) {
        queryParams.set('search', search.trim());
      }

      const response = await fetch(`/api/results?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data: PaginatedResults = await response.json();
      setResults(data.results);
      setTotalPages(data.totalPages);
      setTotalUsers(data.total);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(searchTerm);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'liberal-left': return 'bg-yellow-100 text-yellow-800';
      case 'liberal-right': return 'bg-purple-100 text-purple-800';
      case 'conservative-left': return 'bg-red-100 text-red-800';
      case 'conservative-right': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← {language === 'en' ? 'Back to Home' : 'මුල් පිටුවට'}
          </Link>
          <LanguageSelector 
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </motion.div>

        {/* Title and Stats */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Community Results' : 'ප්‍රජා ප්‍රතිඵල'}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {language === 'en' 
              ? 'See how others scored on the political compass'
              : 'අන්‍යයන් දේශපාලන මාලිමාවෙන් ලබාගත් ලකුණු බලන්න'
            }
          </p>
          {totalUsers > 0 && (
            <div className="inline-block bg-blue-100 text-blue-800 px-6 py-2 rounded-full font-semibold">
              {totalUsers} {language === 'en' ? 'total participants' : 'මුළු සහභාගිවන්නන්'}
            </div>
          )}
        </motion.div>

        {/* Search */}
        <motion.div 
          className="mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'en' ? 'Search by name...' : 'නම අනුව සොයන්න...'}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {language === 'en' ? 'Search' : 'සොයන්න'}
            </button>
          </form>
          {searchQuery && (
            <div className="mt-2 text-center">
              <span className="text-gray-600 mr-2">
                {language === 'en' ? 'Searching for:' : 'සොයන්නේ:'}
              </span>
              <span className="font-semibold">&quot;{searchQuery}&quot;</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="ml-2 text-blue-600 hover:text-blue-700 underline"
              >
                {language === 'en' ? 'Clear' : 'ඉවත් කරන්න'}
              </button>
            </div>
          )}
        </motion.div>

        {/* Results */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'en' ? 'Loading results...' : 'ප්‍රතිඵල පූරණය වෙමින්...'}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchResults(currentPage, searchQuery)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'en' ? 'Try Again' : 'නැවත උත්සාහ කරන්න'}
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery 
                  ? (language === 'en' ? 'No results found for your search.' : 'ඔබේ සෙවුම සඳහා ප්‍රතිඵල හමු නොවීය.')
                  : (language === 'en' ? 'No results yet. Be the first to share!' : 'තවම ප්‍රතිඵල නැත. මුලින්ම බෙදා ගන්න!')
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {result.name}
                      </h3>
                      <div className="mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getQuadrantColor(result.quadrant)}`}>
                          {getQuadrantLabel(result.quadrant, language)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {language === 'en' ? 'Economic:' : 'ආර්ථික:'}
                          </span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {formatScore(result.economic_score)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {language === 'en' ? 'Social:' : 'සමාජ:'}
                          </span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {formatScore(result.social_score)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      {formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              } transition-colors`}
            >
              {language === 'en' ? 'Previous' : 'පෙර'}
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                    } transition-colors`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              } transition-colors`}
            >
              {language === 'en' ? 'Next' : 'ඊළඟ'}
            </button>
          </motion.div>
        )}

        <motion.p 
          className="text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {language === 'en' 
            ? 'All results are publicly visible. Take the quiz to add your result!'
            : 'සියලුම ප්‍රතිඵල ප්‍රසිද්ධියේ දකින්න පුළුවන්. ඔබේ ප්‍රතිඵලය එකතු කිරීමට ප්‍රශ්නාවලිය ගන්න!'
          }
        </motion.p>
      </div>
    </main>
  );
}