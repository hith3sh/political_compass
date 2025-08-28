export interface Question {
  id: number;
  text: {
    en: string;
    si: string;
  };
  category: 'economic' | 'social';
  reversed?: boolean;
}

export interface Answer {
  questionId: number;
  value: -2 | -1 | 1 | 2;
}

export interface Result {
  economic: number; // -10 to +10
  social: number;   // -10 to +10
  quadrant: 'libertarian-left' | 'libertarian-right' | 'authoritarian-left' | 'authoritarian-right';
}

export interface UserResult {
  id: string;
  name: string;
  economic_score: number;
  social_score: number;
  quadrant: string;
  avatar: string;
  created_at: string;
}

export interface SaveResultRequest {
  name: string;
  economicScore: number;
  socialScore: number;
  quadrant: string;
  avatar: string;
}

export interface QuizState {
  answers: Answer[];
  currentPage: number;
  totalPages: number;
  completed: boolean;
}

export type Language = 'en' | 'si';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}