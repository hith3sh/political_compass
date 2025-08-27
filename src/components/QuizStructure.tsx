'use client';

import React from 'react';
import { optimizedQuestions } from '../data/optimizedQuestions';

export function QuizStructure() {
  // Group questions by pages (6 questions per page)
  const pages = [];
  for (let i = 0; i < 4; i++) {
    const startIndex = i * 6;
    const pageQuestions = optimizedQuestions.slice(startIndex, startIndex + 6);
    pages.push({
      pageNumber: i + 1,
      questions: pageQuestions
    });
  }

  const getQuestionCategoryCounts = (questions: typeof optimizedQuestions) => {
    const economic = questions.filter(q => q.category === 'economic').length;
    const social = questions.filter(q => q.category === 'social').length;
    return { economic, social };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📋 Optimized Quiz Structure
      </h2>
      
      {/* Overview Stats */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">📊 Quiz Overview</h3>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">4</div>
            <div className="text-sm text-gray-600">Pages</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">6</div>
            <div className="text-sm text-gray-600">Questions/Page</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">~5</div>
            <div className="text-sm text-gray-600">Minutes</div>
          </div>
        </div>
      </div>

      {/* Category Balance */}
      <div className="bg-green-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-green-800 mb-4">⚖️ Question Balance</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-700">Economic Questions</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">12</span>
            </div>
            <div className="text-sm text-gray-600">
              Market regulation, taxation, labor rights, trade policy
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-purple-700">Social Questions</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-semibold">12</span>
            </div>
            <div className="text-sm text-gray-600">
              Personal freedom, law enforcement, values, immigration
            </div>
          </div>
        </div>
      </div>

      {/* Page-by-Page Breakdown */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">📄 Page-by-Page Breakdown</h3>
        
        {pages.map((page) => {
          const counts = getQuestionCategoryCounts(page.questions);
          return (
            <div key={page.pageNumber} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Page {page.pageNumber} of 4
                </h4>
                <div className="flex space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                    {counts.economic} Economic
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                    {counts.social} Social
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {page.questions.map((question, index) => (
                  <div 
                    key={question.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                      question.category === 'economic' 
                        ? 'bg-blue-50 border-blue-400' 
                        : 'bg-purple-50 border-purple-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold text-gray-500">
                            Q{((page.pageNumber - 1) * 6) + index + 1}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            question.category === 'economic'
                              ? 'bg-blue-600 text-white'
                              : 'bg-purple-600 text-white'
                          }`}>
                            {question.category.toUpperCase()}
                          </span>
                          {question.reversed && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
                              REVERSED
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 text-sm">
                          {question.text.en}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scoring Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Scoring System</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Score Range</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• Each question: -2 to +2 points</div>
              <div>• 12 Economic questions: -24 to +24 raw score</div>
              <div>• 12 Social questions: -24 to +24 raw score</div>
              <div>• Normalized to: -10 to +10 final score</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">100-Block Grid</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• 10×10 grid = 100 unique positions</div>
              <div>• Economic axis: 0 (Socialist) → 9 (Capitalist)</div>
              <div>• Social axis: 0 (Authoritarian) → 9 (Libertarian)</div>
              <div>• Each quadrant: 25 blocks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">
        This optimized structure provides comprehensive political assessment in just 4 pages!
      </div>
    </div>
  );
}