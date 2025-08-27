import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getQuadrant(economic: number, social: number) {
  if (economic <= 0 && social <= 0) {
    return 'liberal-left';
  } else if (economic > 0 && social <= 0) {
    return 'liberal-right';
  } else if (economic <= 0 && social > 0) {
    return 'conservative-left';
  } else {
    return 'conservative-right';
  }
}

export function formatScore(score: number): string {
  return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
}

export function getQuadrantLabel(quadrant: string, language: 'en' | 'si'): string {
  const labels = {
    en: {
      'liberal-left': 'Liberal Socialist',
      'liberal-right': 'Liberal Capitalist',
      'conservative-left': 'Conservative Socialist',
      'conservative-right': 'Conservative Capitalist',
    },
    si: {
      'liberal-left': 'ලිබරල් සමාජවාදී',
      'liberal-right': 'ලිබරල් ධනවාදී',
      'conservative-left': 'සම්ප්‍රදායික සමාජවාදී',
      'conservative-right': 'සම්ප්‍රදායික ධනවාදී',
    }
  };
  
  return labels[language][quadrant as keyof typeof labels.en] || quadrant;
}