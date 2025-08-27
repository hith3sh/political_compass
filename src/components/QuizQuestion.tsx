'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Question, Answer } from '../lib/types';

interface QuizQuestionProps {
  question: Question;
  answer?: Answer;
  onAnswerChange: (questionId: number, value: -2 | -1 | 1 | 2) => void;
  language: 'en' | 'si';
}

const answerOptions = [
  { value: -2 as const, labelEn: 'Strongly Disagree', labelSi: 'දැඩි ලෙස එකඟ නොවෙමි' },
  { value: -1 as const, labelEn: 'Disagree', labelSi: 'එකඟ නොවෙමි' },
  { value: 1 as const, labelEn: 'Agree', labelSi: 'එකඟවෙමි' },
  { value: 2 as const, labelEn: 'Strongly Agree', labelSi: 'දැඩි ලෙස එකඟවෙමි' },
];

export function QuizQuestion({ question, answer, onAnswerChange, language }: QuizQuestionProps) {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {question.text[language]}
        </h3>
      </div>
      
      <div className="space-y-3">
        {answerOptions.map((option, index) => (
          <motion.label
            key={option.value}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              answer?.value === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.value}
              checked={answer?.value === option.value}
              onChange={() => onAnswerChange(question.id, option.value)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center ${
              answer?.value === option.value
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {answer?.value === option.value && (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
            <span className="text-gray-700 font-medium">
              {language === 'en' ? option.labelEn : option.labelSi}
            </span>
          </motion.label>
        ))}
      </div>
    </motion.div>
  );
}