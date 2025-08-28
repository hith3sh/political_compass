import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getQuadrant(economic: number, social: number) {
  // Check for centrist position (both scores very close to 0)
  const threshold = 1.0; // Within 1 point of center
  if (Math.abs(economic) <= threshold && Math.abs(social) <= threshold) {
    return 'centrist';
  }
  
  if (economic <= 0 && social <= 0) {
    return 'libertarian-left';
  } else if (economic > 0 && social <= 0) {
    return 'libertarian-right';
  } else if (economic <= 0 && social > 0) {
    return 'authoritarian-left';
  } else {
    return 'authoritarian-right';
  }
}

export function formatScore(score: number): string {
  return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
}

export function getQuadrantLabel(quadrant: string, language: 'en' | 'si'): string {
  const labels = {
    en: {
      'libertarian-left': 'Libertarian Socialist',
      'libertarian-right': 'Libertarian Capitalist',
      'authoritarian-left': 'Authoritarian Socialist',
      'authoritarian-right': 'Authoritarian Capitalist',
      'centrist': 'Centrist',
      // Legacy names for backward compatibility
      'liberal-left': 'Libertarian Socialist',
      'liberal-right': 'Libertarian Capitalist',
      'authoritative-left': 'Authoritarian Socialist',
      'authoritative-right': 'Authoritarian Capitalist',
    },
    si: {
      'libertarian-left': 'NPP ජෙප්පෙක් ',
      'libertarian-right': 'ටොයියෙක්',
      'authoritarian-left': 'පරණ ජෙප්පෙක්',
      'authoritarian-right': 'බයියෙක්',
      'centrist': 'මධ්‍යස්ථවාදී පොරක්',
      // Legacy names for backward compatibility
      'liberal-left': 'NPP ජෙප්පෙක් ',
      'liberal-right': 'ටොයියෙක්',
      'authoritative-left': 'පරණ ජෙප්පෙක්',
      'authoritative-right': 'බයියෙක්',
    }
  };
  
  return labels[language][quadrant as keyof typeof labels.en] || quadrant;
}