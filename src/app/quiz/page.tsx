'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QuizQuestion } from '../../components/QuizQuestion';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useLanguage } from '../../lib/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { QuizState } from '../../lib/types';
import { getQuestionsForPage, getTotalPages, isQuizComplete, getProgress } from '../../lib/scoring';

function QuizContent() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  const [quizState, setQuizState] = useLocalStorage<QuizState>('political-compass-quiz', {
    answers: [],
    currentPage: 1,
    totalPages: getTotalPages(),
    completed: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const questionsForPage = getQuestionsForPage(currentPage);
  const progress = getProgress(quizState.answers);

  useEffect(() => {
    if (currentPage > quizState.totalPages) {
      router.push('/quiz?page=1');
    }
  }, [currentPage, quizState.totalPages, router]);

  const handleAnswerChange = (questionId: number, value: -2 | -1 | 1 | 2) => {
    const existingAnswerIndex = quizState.answers.findIndex(a => a.questionId === questionId);
    const newAnswers = [...quizState.answers];
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionId, value };
    } else {
      newAnswers.push({ questionId, value });
    }

    setQuizState({
      ...quizState,
      answers: newAnswers,
      currentPage: currentPage,
      completed: isQuizComplete(newAnswers)
    });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      router.push(`/quiz?page=${currentPage - 1}`);
    }
  };

  const handleNext = () => {
    const answeredQuestionsOnPage = questionsForPage.filter(q => 
      quizState.answers.some(a => a.questionId === q.id)
    );
    
    if (answeredQuestionsOnPage.length === questionsForPage.length) {
      if (currentPage < quizState.totalPages) {
        router.push(`/quiz?page=${currentPage + 1}`);
      }
    }
  };

  const handleSubmit = async () => {
    if (isQuizComplete(quizState.answers)) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      router.push('/result');
    }
  };

  const canProceed = questionsForPage.every(q => 
    quizState.answers.some(a => a.questionId === q.id)
  );

  const isLastPage = currentPage === quizState.totalPages;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
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

        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('title')}
            </h1>
            <span className="text-sm text-gray-600">
              {t('page')} {currentPage} {t('of')} {quizState.totalPages}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            {progress}% {language === 'en' ? 'complete' : 'සම්පූර්ණයි'}
          </p>
        </motion.div>

        {/* Questions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {questionsForPage.map((question) => {
              const answer = quizState.answers.find(a => a.questionId === question.id);
              return (
                <QuizQuestion
                  key={question.id}
                  question={question}
                  answer={answer}
                  onAnswerChange={handleAnswerChange}
                  language={language}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          className="flex justify-between items-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {t('previous')}
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: quizState.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => router.push(`/quiz?page=${page}`)}
                className={`w-3 h-3 rounded-full transition-all ${
                  page === currentPage
                    ? 'bg-blue-600'
                    : page < currentPage
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {isLastPage ? (
            <motion.button
              onClick={handleSubmit}
              disabled={!canProceed || isLoading}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                canProceed && !isLoading
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={canProceed ? { scale: 1.05 } : {}}
              whileTap={canProceed ? { scale: 0.95 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'en' ? 'Processing...' : 'සකසමින්...'}
                </div>
              ) : (
                t('submit')
              )}
            </motion.button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                canProceed
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('next')}
            </button>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.p 
          className="text-center text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {language === 'en' 
            ? 'Answer all questions on this page to continue' 
            : 'ඉදිරියට යාමට මෙම පිටුවේ සියලුම ප්‍රශ්න වලට පිළිතුරු දෙන්න'}
        </motion.p>
      </div>
    </main>
  );
}

export default function Quiz() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}