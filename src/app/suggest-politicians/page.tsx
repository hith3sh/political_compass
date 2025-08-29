'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LanguageSelector } from '../../components/LanguageSelector';
import { InteractiveGrid } from '../../components/InteractiveGrid';
import { useLanguage } from '../../lib/LanguageContext';

interface PoliticianSuggestion {
  id: string;
  name: string;
  quadrant: string;
  x: number;
  y: number;
  gridId: number;
  votes: number;
  suggestedBy: string;
  createdAt: string;
}

interface GridPosition {
  x: number;
  y: number;
  quadrant: string;
  label: string;
  gridId: number;
}

export default function SuggestPoliticians() {
  const { language, setLanguage } = useLanguage();
  const [suggestions, setSuggestions] = useState<PoliticianSuggestion[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<GridPosition | null>(null);
  const [newPoliticianName, setNewPoliticianName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate or retrieve persistent user identifier
  const getUserIdentifier = () => {
    let userId = localStorage.getItem('voter_id');
    if (!userId) {
      userId = `User_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('voter_id', userId);
    }
    return userId;
  };

  // Function to get quadrant from coordinates
  const getQuadrantFromCoords = (x: number, y: number): string => {
    if (x < 0 && y > 0) return 'authoritarian-left';
    if (x > 0 && y > 0) return 'authoritarian-right';
    if (x < 0 && y < 0) return 'libertarian-left';
    if (x > 0 && y < 0) return 'libertarian-right';
    return 'centrist';
  };

  // Function to get label from coordinates
  const getLabelFromCoords = (x: number, y: number): string => {
    const quadrant = getQuadrantFromCoords(x, y);
    switch (quadrant) {
      case 'authoritarian-left':
        return language === 'en' ? 'Authoritarian Left' : 'පරණ ජෙප්පෙක්';
      case 'authoritarian-right':
        return language === 'en' ? 'Authoritarian Right' : 'බයියෙක්';
      case 'libertarian-left':
        return language === 'en' ? 'Libertarian Left' : 'NPP ජෙප්පෙක් ';
      case 'libertarian-right':
        return language === 'en' ? 'Libertarian Right' : 'ටොයියෙක්';
      case 'centrist':
        return language === 'en' ? 'Centrist' : 'මධ්‍යස්ථවාදී';
      default:
        return '';
    }
  };

  // Load suggestions on mount
  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGridClick = (x: number, y: number, gridId: number) => {
    const quadrant = getQuadrantFromCoords(x, y);
    const label = getLabelFromCoords(x, y);
    
    setSelectedPosition({
      x,
      y,
      quadrant,
      label,
      gridId
    });
    setShowModal(true);
  };

  const handleSubmitSuggestion = async () => {
    if (!newPoliticianName.trim() || !selectedPosition) return;

    try {
      setLoading(true);
      const userIdentifier = getUserIdentifier();
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-identifier': userIdentifier,
        },
        body: JSON.stringify({
          name: newPoliticianName.trim(),
          quadrant: selectedPosition.quadrant,
          x: selectedPosition.x,
          y: selectedPosition.y,
          gridId: selectedPosition.gridId,
        }),
      });

      if (response.ok) {
        setNewPoliticianName('');
        setShowModal(false);
        setSelectedPosition(null);
        await loadSuggestions(); // Reload suggestions
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (suggestionId: string) => {
    try {
      const userIdentifier = getUserIdentifier();
      const response = await fetch(`/api/suggestions/${suggestionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-identifier': userIdentifier,
        },
      });

      if (response.ok) {
        await loadSuggestions(); // Reload suggestions
      } else {
        const errorData = await response.json();
        if (errorData.error === 'You have already voted on this suggestion') {
          // Show a user-friendly message
          setErrorMessage(language === 'en' ? 'You have already voted on this suggestion!' : 'ඔබ දැනටමත් මෙම යෝජනාව සඳහා ඡන්දය දී ඇත!');
          // Clear the message after 3 seconds
          setTimeout(() => setErrorMessage(null), 3000);
        } else {
          console.error('Error voting:', errorData.error);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'libertarian-left':
        return 'bg-yellow-500';
      case 'libertarian-right':
        return 'bg-slate-500';
      case 'authoritarian-left':
        return 'bg-red-500';
      case 'authoritarian-right':
        return 'bg-green-500';
      case 'centrist':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };



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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Suggest theorists' : 'ප්‍රසිද්ද මතවාදීන්ව යෝජනා කරන්න'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Click on a quadrant to suggest a famous Political theorist. Vote for suggestions you like!'
                : 'ප්‍රසිද්ද මතවාදියෙකු යෝජනා කිරීමට කොටසක් මත ක්ලික් කරන්න. ඔබට අවශ්‍ය යෝජනා සඳහා ඡන්දය දෙන්න!'}
            </p>
          </div>
          <LanguageSelector 
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </motion.div>

        {/* Interactive Political Compass Grid */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-4 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>{language === 'en' ? 'Clickable' : 'ක්ලික් කළ හැකි'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">O</div>
                <span>{language === 'en' ? 'Occupied' : 'අල්ලාගෙන'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <InteractiveGrid 
              onGridClick={handleGridClick}
              className="w-full max-w-6xl"
              showOccupiedLabel
            />
          </div>
        </motion.div>

        {/* Suggestions List */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {language === 'en' ? 'Current Suggestions' : 'වර්තමාන යෝජනා'}
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">
                {language === 'en' ? 'Loading suggestions...' : 'යෝජනා පූරණය වෙමින්...'}
              </p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {language === 'en' 
                  ? 'No suggestions yet. Be the first to suggest a Political theorist!'
                  : 'තවම යෝජනා නැත. දේශපාලන මතවාදියෙකු යෝජනා කරන පළමු පුද්ගලයා වෙන්න!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions
                .sort((a, b) => b.votes - a.votes)
                .map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                                         <div className="flex items-center space-x-4">
                       <div className={`w-4 h-4 rounded-full ${getQuadrantColor(suggestion.quadrant)}`}></div>
                       <div>
                         <h3 className="font-semibold text-gray-900">{suggestion.name}</h3>
                         <p className="text-sm text-gray-600">
                           {language === 'en' ? 'Suggested by' : 'යෝජනා කරන ලද්දේ'} {suggestion.suggestedBy}
                         </p>
                         <p className="text-xs text-gray-500">
                           {language === 'en' ? 'Position' : 'ස්ථානය'}: ({suggestion.x}, {suggestion.y})
                         </p>
                       </div>
                     </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{suggestion.votes}</div>
                        <div className="text-xs text-gray-500">
                          {language === 'en' ? 'votes' : 'ඡන්ද'}
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={() => handleVote(suggestion.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {language === 'en' ? 'Vote' : 'ඡන්දය'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>

        {/* Back to Home */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            href="/community-results"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'en' ? 'Back to Community Results' : 'ප්‍රජා ප්‍රතිඵල වෙත ආපසු'}
          </Link>
        </motion.div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Modal for adding suggestions */}
      {showModal && selectedPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Suggest a Politician' : 'දේශපාලනඥයෙකු යෝජනා කරන්න'}
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                {language === 'en' ? 'Quadrant:' : 'කොටස:'} <span className="font-semibold">{selectedPosition.label}</span>
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Politician Name' : 'දේශපාලනඥයාගේ නම'}
              </label>
              <input
                type="text"
                value={newPoliticianName}
                onChange={(e) => setNewPoliticianName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder={language === 'en' ? 'Enter politician name...' : 'දේශපාලනඥයාගේ නම ඇතුළත් කරන්න...'}
                disabled={loading}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPosition(null);
                  setNewPoliticianName('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                {language === 'en' ? 'Cancel' : 'අවලංගු කරන්න'}
              </button>
              <button
                onClick={handleSubmitSuggestion}
                disabled={!newPoliticianName.trim() || loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading 
                  ? (language === 'en' ? 'Submitting...' : 'යොමු කරමින්...')
                  : (language === 'en' ? 'Submit' : 'යොමු කරන්න')
                }
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
