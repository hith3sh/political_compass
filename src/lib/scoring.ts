import { Answer, Result, Question } from './types';
import { questions } from '../data/questions';
import { getQuadrant } from './utils';

export function calculateScore(answers: Answer[]): Result {
  let economicScore = 0;
  let socialScore = 0;
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;
    
    let scoreValue = answer.value;
    
    // Reverse score if question is marked as reversed
    if (question.reversed) {
      scoreValue = -scoreValue as -2 | -1 | 1 | 2;
    }
    
    if (question.category === 'economic') {
      economicScore += scoreValue;
    } else if (question.category === 'social') {
      socialScore += scoreValue;
    }
  });
  
  // Normalize scores to -10 to +10 range
  // Each category has 12 questions with values from -2 to +2
  // So max/min possible scores are ±24, we scale to ±10
  const normalizedEconomic = Math.max(-10, Math.min(10, (economicScore / 24) * 10));
  const normalizedSocial = Math.max(-10, Math.min(10, (socialScore / 24) * 10));
  
  const quadrant = getQuadrant(normalizedEconomic, normalizedSocial);
  
  return {
    economic: Math.round(normalizedEconomic * 10) / 10, // Round to 1 decimal place
    social: Math.round(normalizedSocial * 10) / 10,
    quadrant: quadrant as 'liberal-left' | 'liberal-right' | 'conservative-left' | 'conservative-right'
  };
}

export function getQuestionsForPage(page: number, questionsPerPage: number = 6): Question[] {
  const startIndex = (page - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  return questions.slice(startIndex, endIndex);
}

export function getTotalPages(questionsPerPage: number = 6): number {
  return Math.ceil(questions.length / questionsPerPage);
}

export function isQuizComplete(answers: Answer[]): boolean {
  return answers.length === questions.length;
}

export function getProgress(answers: Answer[]): number {
  return Math.round((answers.length / questions.length) * 100);
}