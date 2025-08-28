'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import domtoimage from 'dom-to-image';
import { InteractiveGrid } from '../../components/InteractiveGrid';
import { ConfettiAnimation } from '../../components/ConfettiAnimation';
import { LanguageSelector } from '../../components/LanguageSelector';
import { AvatarSelector } from '../../components/AvatarSelector';
import { MahindaEasterEgg } from '../../components/MahindaEasterEgg';
import { useLanguage } from '../../lib/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { QuizState, Result, SaveResultRequest } from '../../lib/types';
import { calculateScore, getTotalPages } from '../../lib/scoring';
import { getQuadrantLabel, formatScore } from '../../lib/utils';
import { getRandomAvatar, type Avatar } from '../../lib/avatars';

export default function ResultPage() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [screenshotStatus, setScreenshotStatus] = useState<'idle' | 'generating' | 'downloading'>('idle');
  const screenshotRef = useRef<HTMLDivElement>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isSaved, setIsSaved] = useState(false);

  const [quizState] = useLocalStorage<QuizState>('political-compass-quiz', {
    answers: [],
    currentPage: 1,
    totalPages: getTotalPages(),
    completed: false
  });

  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give localStorage time to load
    const timer = setTimeout(() => {
      if (quizState.answers.length === 24) {
        const calculatedResult = calculateScore(quizState.answers);
        setResult(calculatedResult);
        setShowConfetti(true);
        setIsLoading(false);
      } else {
        router.push('/quiz');
      }
    }, 100); // Small delay to ensure localStorage has loaded

    return () => clearTimeout(timer);
  }, [quizState.answers, router]);

  const handleRetake = () => {
    // Clear all quiz-related data
    localStorage.removeItem('political-compass-quiz');
    
    // Also clear any other potential quiz state
    sessionStorage.removeItem('political-compass-quiz');
    
    // Force a page reload to ensure clean state
    router.push('/quiz?page=1');
  };

  const handleSaveToDatabase = async () => {
    if (!result || !selectedAvatar) return;

    setSaveStatus('saving');

    try {
      const saveData: SaveResultRequest = {
        name: userName.trim(),
        economicScore: result.economic,
        socialScore: result.social,
        quadrant: result.quadrant,
        avatar: selectedAvatar.filename
      };

      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error || `Failed to save result: ${response.status}`);
      }

      setSaveStatus('saved');
      setIsSaved(true);
      setShowNameModal(false);
      
      // Show success message briefly, then redirect to community page
      setTimeout(() => {
        setSaveStatus('idle');
        router.push('/community-results');
      }, 2000);
    } catch (error) {
      console.error('Error saving result:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleSaveClick = () => {
    if (isSaved) return;
    if (!selectedAvatar) {
      setSelectedAvatar(getRandomAvatar());
    }
    setShowNameModal(true);
  };

  const handleDownloadScreenshot = async () => {
    if (!result || !screenshotRef.current) return;

    setScreenshotStatus('generating');

    try {
      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await domtoimage.toPng(screenshotRef.current, {
        quality: 0.95,
        bgcolor: '#ffffff',
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left'
        },
        width: screenshotRef.current.offsetWidth * 2,
        height: screenshotRef.current.offsetHeight * 2
      });

      setScreenshotStatus('downloading');
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `political-compass-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => setScreenshotStatus('idle'), 1000);
      
    } catch (error) {
      console.error('Failed to generate screenshot:', error);
      setScreenshotStatus('idle');
      
      // Show user-friendly error message
      alert(language === 'en' 
        ? 'Failed to generate screenshot. Please try again.' 
        : 'ඡායාරූපය සෑදීම අසාර්ථකයි. කරුණාකර නැවත උත්සාහ කරන්න.'
      );
    }
  };

  if (!result || isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <ConfettiAnimation trigger={showConfetti} duration={4000} />
      
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

        {/* Congratulations */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎉 {t('congratulations')}
          </h1>
        </motion.div>

        {/* Screenshot Capture Area */}
        <div 
          ref={screenshotRef}
          className="px-8 py-12 mb-8"
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Quadrant Label */}
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-gray-800">
              {language === 'en'
                ? <>You&apos;re a <span className="font-extrabold">{getQuadrantLabel(result.quadrant, language)}</span></>
                : <>ඔබ <span className="font-extrabold">{getQuadrantLabel(result.quadrant, language)}</span></>
              }
            </div>
          </div>

          {/* Results Display */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Grid */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          >
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
              <InteractiveGrid 
                userPosition={{ x: result.economic, y: result.social }}
                className="w-full"
              />
              {/* Mobile Instructions */}
              <p className="text-xs text-gray-500 text-center mt-2 sm:hidden">
                {language === 'en' 
                  ? 'Tap dots to see political figures' 
                  : 'දේශපාලන චරිත බලන්න ඇස් තියන්න'}
              </p>
            </div>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'en' ? 'Your Scores' : 'ඔබේ ලකුණු'}
              </h3>
              
              <div className="space-y-6">
                {/* Economic Score */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">
                      {t('economicAxis')}
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatScore(result.economic)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-blue-500 h-3 rounded-full flex items-center justify-center relative"
                      style={{ width: '100%' }}
                    >
                      <div 
                        className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-md"
                        style={{ left: `${((result.economic + 10) / 20) * 100}%`, transform: 'translateX(-50%)' }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{t('left')}</span>
                    <span>{t('right')}</span>
                  </div>
                </div>

                {/* Social Score */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">
                      {t('socialAxis')}
                    </span>
                    <span className="text-2xl font-bold text-slate-600">
                      {formatScore(result.social)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full flex items-center justify-center relative"
                      style={{ width: '100%' }}
                    >
                      <div 
                        className="absolute w-4 h-4 bg-white border-2 border-slate-600 rounded-full shadow-md"
                        style={{ left: `${((result.social + 10) / 20) * 100}%`, transform: 'translateX(-50%)' }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{t('libertarian')}</span>
                    <span>{t('authoritarian')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quadrant Description */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {language === 'en' ? 'What this means' : 'මෙයින් අදහස් වන්නේ'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {result.quadrant === 'libertarian-left' && (
                  language === 'en' 
                    ? 'You tend to support social equality, progressive policies, and personal freedoms. You likely favor government intervention in economics while supporting individual liberties in social matters.'
                    : 'ඔයා හැමෝටම සමාන අවස්ථා තියෙන්න ඕන කියන අදහසට කැමති. මිනිස්සුන්ට තමන්ගේ ජිවිතේ ගැන පුද්ගලික තීරණ ගන්න නිදහස තියෙන්න ඕනේ කියල හිතනවා. රජය ආර්ථිකය දියුණු කරන්න මැදිහත් වෙන්නොනේ කියලත් හිතනවා.'
                )}
                {result.quadrant === 'libertarian-right' && (
                  language === 'en'
                    ? 'You value free markets, individual choice, and minimal government intervention. You support both economic freedom and personal liberties, favoring private solutions over government programs.'
                    : 'ඔයා හිතන්නේ ජිවිතේ තීරණ අපිටම ගන්න පුළුවන් රජය ඒවාට මැදිහත් වෙන්නොනේ නැ කියල. වෙළඳපොළ නිදහස්ව ක්‍රියාකරලා, රජය ගොඩක්ම මැදිහත්වෙන්න එපා කියන අදහසට කැමති. පෞද්ගලික ව්‍යාපාර, ව්‍යාපාරිකයින්ට ඉඩ තියෙන්න ඕන, එහෙම අය තමයි රටේ ආර්ථිකය ඉස්සරහට ගෙනියන්නේ කියන අදහසේ ඉන්නේ ඔයා. සමාජයෙ හැමෝම තමන්ට කැමති විදිහට ජීවත් වෙන්න ඉඩ තියෙන්න ඕන කියන එකේ විශ්වාසයක් තියෙනවා.'
                )}
                {result.quadrant === 'authoritarian-left' && (
                  language === 'en'
                    ? 'You combine traditional social values with support for economic equality. You likely support government programs for economic justice while maintaining more authoritarian views on social issues.'
                    : 'ඔයා හිතනවා දුප්පත් අයට උදව් කරන්න රජය ටිකක් වැඩ කර යුතුයි කියලා. ආර්ථිකය සමානව හැදෙන වැඩසටහන්වලට සහය දිය යුතුයි කියලා. සමාජයේ තියෙන නීති, විනය, සම්ප්‍රදාය ටික පවත්වාගෙන යන්න ඕන කියන එකේ විශ්වාසයක් තියෙනවා. සංස්කෘතිය රැකෙන්න ඕන කියලා හිතනවා. මිනිසුන්ට ඕන ඕන විදිහට නිදහසක් දෙනවට කැමති නෑ '
                )}
                {result.quadrant === 'authoritarian-right' && (
                  language === 'en'
                    ? 'You support free enterprise combined with traditional authority and values. You likely favor limited government in economics while supporting stronger social institutions and traditional norms.'
                    : 'ඔයාට අනුව අපේ රටේ සම්ප්‍රදාය, බෞද්ධ සංස්කෘතිය, ජාතික ගෞරවය අනිවාර්ය දෙයක්. රටේ ආර්ථිකය සඳහා ව්‍යාපාරිකයෝට ඉඩ දෙන්න ඕන. රජය වැඩිපුරම මැදිහත් වෙනවට කැමති නැ. සමාජයේ විනයක්, සම්ප්‍රදායන්ට ගරුත්වයක් තිබ්බොත් තමා රටට යහපතක් වෙන්නෙ කියලා හිතනවා.'
                )}
                {result.quadrant === 'centrist' && (
                  language === 'en'
                    ? 'You hold moderate views across both economic and social issues. You likely seek balanced solutions, supporting both market mechanisms and government intervention where needed, while taking pragmatic approaches to social policies without extreme positions.'
                    : 'ඔයා ආර්ථික සහ සමාජ ප්‍රශ්න දෙකටම මධ්‍යස්ථ මතයක් තියෙනවා. වෙළඳපොළ ක්‍රමයත්, අවශ්‍ය තැන්වල රජයේ මැදිහත්වීමත් දෙකම සුදුසු කියලා හිතනවා. සමාජ ප්‍රශ්නවලටත් අන්තවාදී මතයක් නෙවෙයි, ප්‍රායෝගික විසඳුම් සොයන අයෙක්.'
                )}
              </p>
            </div>
          </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleSaveClick}
            disabled={saveStatus === 'saving' || isSaved}
            className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 min-w-[160px] ${
              isSaved 
                ? 'bg-green-500 text-white cursor-not-allowed'
                : saveStatus === 'saving'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-slate-600 text-white hover:bg-slate-700 cursor-pointer'
            }`}
            whileHover={!isSaved && saveStatus !== 'saving' ? { scale: 1.05, y: -2 } : {}}
            whileTap={!isSaved && saveStatus !== 'saving' ? { scale: 0.95 } : {}}
          >
            {saveStatus === 'saving' && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {language === 'en' ? 'Saving...' : 'සුරකිමින්...'}
              </div>
            )}
            {saveStatus === 'saved' || isSaved ? (
              <span>✓ {language === 'en' ? 'Saved!' : 'සුරක්ෂිතයි!'}</span>
            ) : saveStatus === 'error' ? (
              <span>{language === 'en' ? 'Error - Try Again' : 'දෝෂය - නැවත උත්සාහ කරන්න'}</span>
            ) : (
              language === 'en' ? 'Save to Community' : 'ප්‍රජාවට එකතු කරමු'
            )}
          </motion.button>

          <motion.button
            onClick={handleDownloadScreenshot}
            disabled={screenshotStatus !== 'idle'}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-all duration-300 min-w-[160px] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            whileHover={screenshotStatus === 'idle' ? { scale: 1.05, y: -2 } : {}}
            whileTap={screenshotStatus === 'idle' ? { scale: 0.95 } : {}}
          >
            {screenshotStatus === 'generating' && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {language === 'en' ? 'Generating...' : 'සාදමින්...'}
              </div>
            )}
            {screenshotStatus === 'downloading' && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {language === 'en' ? 'Downloading...' : 'බාගන්නමින්...'}
              </div>
            )}
            {screenshotStatus === 'idle' && (
              <span>📷 {t('downloadScreenshot')}</span>
            )}
          </motion.button>

          <Link href="/community-results">
            <motion.button
              className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition-all duration-300 min-w-[160px] cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              👥 {language === 'en' ? 'View Community' : 'අනිත් අයගේ ලකුණු බලමු'}
            </motion.button>
          </Link>

          <motion.button
            onClick={handleRetake}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('retakeTest')}
          </motion.button>
        </motion.div>
        <p className="text-center text-xs text-gray-400 mt-5">
          product of ESDLG creations
        </p>
      </div>

      {/* Name Input Modal */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {language === 'en' ? 'Join the Community' : 'ප්‍රජාවට එකතු වෙමු'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'en' 
                  ? 'Enter your name to save your result and see it in our community results. This will help others see the diversity of political views.'
                  : 'ඔබේ ප්‍රතිඵලය සුරැකීමට සහ අපගේ සමූහයෙ ප්‍රතිඵලවල එය දැකීමට ඔබේ නම ඇතුළත් කරන්න. මෙය අන්‍යයන්ට දේශපාලන අදහස්වල විවිධත්වය දැකීමට උපකාරී වේ.'
                }
              </p>
              
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={language === 'en' ? 'Enter your name' : 'ඔබේ නම ඇතුළත් කරන්න'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-black"
                maxLength={50}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && userName.trim() && selectedAvatar) {
                    handleSaveToDatabase();
                  }
                }}
              />

              <AvatarSelector
                selectedAvatar={selectedAvatar}
                onAvatarSelect={setSelectedAvatar}
                language={language}
              />
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowNameModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : 'අවලංගු කරන්න'}
                </button>
                <button
                  onClick={handleSaveToDatabase}
                  disabled={!userName.trim() || !selectedAvatar || saveStatus === 'saving'}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    !userName.trim() || !selectedAvatar
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-slate-600 text-white hover:bg-slate-700 cursor-pointer'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === 'en' ? 'Saving...' : 'සුරකිමින්...'}
                    </div>
                  ) : (
                    language === 'en' ? 'Save Result' : 'ප්‍රතිඵලය සුරකින්න'
                  )}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                {language === 'en' 
                  ? 'Your name will be displayed publicly with your results'
                  : 'ඔබේ නම ප්‍රතිඵල සමඟ ප්‍රසිද්ධියේ පෙන්වනු ඇත'
                }
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mahinda Easter Egg */}
      {result && (
        <MahindaEasterEgg 
          userPosition={{ economic: result.economic, social: result.social }}
        />
      )}
    </main>
  );
}