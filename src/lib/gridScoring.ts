import { Answer, Question } from './types';
import { questions } from '../data/questions';

export interface GridPosition {
  x: number; // 0-9 economic position (0=left, 9=right)
  y: number; // 0-9 social position (0=authoritarian, 9=libertarian)  
  block: number; // 0-99 unique block identifier
  quadrant: 'authoritarian-left' | 'authoritarian-right' | 'libertarian-left' | 'libertarian-right';
  quadrantBlock: number; // 0-24 position within quadrant
}

export interface GridResult {
  economic: number; // Original -10 to +10 score
  social: number; // Original -10 to +10 score  
  gridPosition: GridPosition;
  quadrant: string;
}

/**
 * Convert continuous score (-10 to +10) to grid position (0-9)
 */
export function scoreToGridPosition(score: number): number {
  // Clamp score to valid range
  const clampedScore = Math.max(-10, Math.min(10, score));
  
  // Convert -10 to +10 range to 0-9 range
  // -10 to -6.01 = 0, -6 to -2.01 = 1, -2 to +1.99 = 2, etc.
  const gridPos = Math.floor((clampedScore + 10) / 2);
  
  // Ensure we don't exceed 9 due to floating point precision
  return Math.min(9, gridPos);
}

/**
 * Calculate grid position from economic and social scores
 */
export function calculateGridPosition(economicScore: number, socialScore: number): GridPosition {
  const x = scoreToGridPosition(economicScore); // Economic: 0=left, 9=right
  const y = 9 - scoreToGridPosition(socialScore); // Social: 0=authoritarian, 9=libertarian (inverted)
  
  const block = y * 10 + x; // Convert 2D position to 1D block (0-99)
  
  // Determine quadrant and position within quadrant
  let quadrant: GridPosition['quadrant'];
  let quadrantBlock: number;
  
  if (x <= 4 && y <= 4) {
    // Top-Left: Authoritarian Left
    quadrant = 'authoritarian-left';
    quadrantBlock = y * 5 + x;
  } else if (x >= 5 && y <= 4) {
    // Top-Right: Authoritarian Right  
    quadrant = 'authoritarian-right';
    quadrantBlock = y * 5 + (x - 5);
  } else if (x <= 4 && y >= 5) {
    // Bottom-Left: Libertarian Left
    quadrant = 'libertarian-left';
    quadrantBlock = (y - 5) * 5 + x;
  } else {
    // Bottom-Right: Libertarian Right
    quadrant = 'libertarian-right';
    quadrantBlock = (y - 5) * 5 + (x - 5);
  }
  
  return {
    x,
    y,
    block,
    quadrant,
    quadrantBlock
  };
}

/**
 * Enhanced scoring with grid positioning
 */
export function calculateGridScore(answers: Answer[]): GridResult {
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
  
  const gridPosition = calculateGridPosition(normalizedEconomic, normalizedSocial);
  
  // Convert grid quadrant to traditional quadrant naming
  let quadrant: string;
  switch (gridPosition.quadrant) {
    case 'authoritarian-left':
      quadrant = 'conservative-left';
      break;
    case 'authoritarian-right':
      quadrant = 'conservative-right';
      break;
    case 'libertarian-left':
      quadrant = 'liberal-left';
      break;
    case 'libertarian-right':
      quadrant = 'liberal-right';
      break;
  }
  
  return {
    economic: Math.round(normalizedEconomic * 10) / 10,
    social: Math.round(normalizedSocial * 10) / 10,
    gridPosition,
    quadrant
  };
}

/**
 * Get block information for display
 */
export function getBlockInfo(block: number): { x: number; y: number; quadrant: string } {
  const x = block % 10;
  const y = Math.floor(block / 10);
  
  let quadrant: string;
  if (x <= 4 && y <= 4) {
    quadrant = 'authoritarian-left';
  } else if (x >= 5 && y <= 4) {
    quadrant = 'authoritarian-right';
  } else if (x <= 4 && y >= 5) {
    quadrant = 'libertarian-left';
  } else {
    quadrant = 'libertarian-right';
  }
  
  return { x, y, quadrant };
}

/**
 * Generate description for a specific grid position
 */
export function getGridPositionDescription(position: GridPosition): string {
  const intensity = Math.floor(position.quadrantBlock / 5); // 0-4 (mild to extreme)
  const intensityLabels = ['Mild', 'Moderate', 'Strong', 'Very Strong', 'Extreme'];
  
  const baseDescriptions = {
    'authoritarian-left': 'Socialist with traditional values',
    'authoritarian-right': 'Conservative capitalist', 
    'libertarian-left': 'Progressive socialist',
    'libertarian-right': 'Liberal capitalist'
  };
  
  return `${intensityLabels[intensity]} ${baseDescriptions[position.quadrant]}`;
}