'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { enhancedQuestions } from '../data/enhancedQuestions';
import { calculateGridScore } from '../lib/gridScoring';
import { Answer } from '../lib/types';

export function ScoringDemo() {
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  
  // Show first 6 questions (3 economic, 3 social) as examples
  const demoQuestions = enhancedQuestions.slice(0, 6);
  
  const handleAnswerChange = (questionId: number, value: -2 | -1 | 1 | 2) => {
    setSelectedAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId ? { questionId, value } : a
        );
      }
      return [...prev, { questionId, value }];
    });
  };

  const getScoreForQuestion = (questionId: number, answerValue: number) => {
    const question = enhancedQuestions.find(q => q.id === questionId);
    if (!question) return 0;
    
    let score = answerValue;
    if (question.reversed) {
      score = -score;
    }
    return score;
  };

  const calculateCurrentScore = () => {
    if (selectedAnswers.length === 0) return null;
    
    let economicTotal = 0;
    let socialTotal = 0;
    let economicCount = 0;
    let socialCount = 0;

    selectedAnswers.forEach(answer => {
      const question = enhancedQuestions.find(q => q.id === answer.questionId);
      if (!question) return;

      let score = answer.value;
      if (question.reversed) score = -score;

      if (question.category === 'economic') {
        economicTotal += score;
        economicCount++;
      } else {
        socialTotal += score;
        socialCount++;
      }
    });

    // Project what full score would be (assuming average for unanswered questions)
    const economicAvg = economicCount > 0 ? economicTotal / economicCount : 0;
    const socialAvg = socialCount > 0 ? socialTotal / socialCount : 0;
    
    const projectedEconomic = economicAvg * 24; // 24 economic questions total
    const projectedSocial = socialAvg * 24; // 24 social questions total

    const normalizedEconomic = Math.max(-10, Math.min(10, (projectedEconomic / 48) * 10));
    const normalizedSocial = Math.max(-10, Math.min(10, (projectedSocial / 48) * 10));

    return {
      economic: Math.round(normalizedEconomic * 10) / 10,
      social: Math.round(normalizedSocial * 10) / 10,
      economicRaw: economicTotal,
      socialRaw: socialTotal
    };
  };

  const currentScore = calculateCurrentScore();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🎯 How Questions Affect Your Score
      </h2>
      
      {/* Scoring Guide */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">📊 Scoring System</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Answer Values:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Strongly Disagree</span>
                <span className="font-mono bg-red-100 px-2 py-1 rounded">-2</span>
              </div>
              <div className="flex justify-between">
                <span>Disagree</span>
                <span className="font-mono bg-red-50 px-2 py-1 rounded">-1</span>
              </div>
              <div className="flex justify-between">
                <span>Agree</span>
                <span className="font-mono bg-green-50 px-2 py-1 rounded">+1</span>
              </div>
              <div className="flex justify-between">
                <span>Strongly Agree</span>
                <span className="font-mono bg-green-100 px-2 py-1 rounded">+2</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Axis Meanings:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Economic:</span>
                <div className="text-xs text-gray-600">
                  Negative (-) = Socialist/Left | Positive (+) = Capitalist/Right
                </div>
              </div>
              <div>
                <span className="font-semibold">Social:</span>
                <div className="text-xs text-gray-600">
                  Negative (-) = Libertarian | Positive (+) = Authoritarian
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Questions */}
      <div className="space-y-6">
        {demoQuestions.map((question, index) => {
          const answer = selectedAnswers.find(a => a.questionId === question.id);
          const isEconomic = question.category === 'economic';
          
          return (
            <motion.div
              key={question.id}
              className={`border-2 rounded-lg p-6 ${
                isEconomic ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      isEconomic 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-purple-600 text-white'
                    }`}>
                      {question.category.toUpperCase()}
                    </span>
                    {question.reversed && (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-800">
                        REVERSED
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 font-medium">
                    {question.text.en}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[-2, -1, 1, 2].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswerChange(question.id, value as -2 | -1 | 1 | 2)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      answer?.value === value
                        ? 'bg-blue-600 text-white transform scale-105 shadow-lg'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs mb-1">
                        {value === -2 ? 'Strongly Disagree' : 
                         value === -1 ? 'Disagree' :
                         value === 1 ? 'Agree' : 'Strongly Agree'}
                      </div>
                      <div className="font-mono">
                        {value > 0 ? '+' : ''}{value}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {answer && (
                <div className="bg-white rounded p-3 border-l-4 border-blue-500">
                  <div className="text-sm">
                    <span className="font-semibold">Your answer contributes:</span>
                    <span className={`ml-2 px-2 py-1 rounded font-mono text-sm ${
                      getScoreForQuestion(question.id, answer.value) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : getScoreForQuestion(question.id, answer.value) < 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getScoreForQuestion(question.id, answer.value) > 0 ? '+' : ''}
                      {getScoreForQuestion(question.id, answer.value)} {question.category}
                    </span>
                    {question.reversed && (
                      <div className="text-xs text-orange-600 mt-1">
                        ⚠️ Score reversed: {answer.value} becomes {getScoreForQuestion(question.id, answer.value)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Current Score Display */}
      {currentScore && (
        <motion.div 
          className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-xl font-bold mb-4">📊 Your Current Score (Projected)</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-sm opacity-90">Economic Score</div>
              <div className="text-2xl font-bold">
                {currentScore.economic > 0 ? '+' : ''}{currentScore.economic}
              </div>
              <div className="text-sm opacity-75">
                {currentScore.economic > 0 ? 'Capitalist →' : currentScore.economic < 0 ? '← Socialist' : 'Centrist'}
              </div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-sm opacity-90">Social Score</div>
              <div className="text-2xl font-bold">
                {currentScore.social > 0 ? '+' : ''}{currentScore.social}
              </div>
              <div className="text-sm opacity-75">
                {currentScore.social > 0 ? 'Authoritarian ↑' : currentScore.social < 0 ? '↓ Libertarian' : 'Centrist'}
              </div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-sm opacity-90">Quadrant</div>
              <div className="text-lg font-bold">
                {currentScore.economic <= 0 && currentScore.social >= 0 ? 'Conservative Socialist' :
                 currentScore.economic > 0 && currentScore.social >= 0 ? 'Conservative Capitalist' :
                 currentScore.economic <= 0 && currentScore.social < 0 ? 'Liberal Socialist' :
                 'Liberal Capitalist'}
              </div>
            </div>
          </div>
          <div className="text-xs opacity-75 mt-4">
            * This is a projection based on {selectedAnswers.length} of 6 demo questions. 
            The full quiz has 48 questions for much more accurate results.
          </div>
        </motion.div>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        Answer the questions above to see how each response affects your political compass score!
      </div>
    </div>
  );
}