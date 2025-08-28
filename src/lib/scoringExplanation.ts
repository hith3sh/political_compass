import { Answer } from './types';
import { optimizedQuestions } from '../data/optimizedQuestions';

/**
 * SCORING SYSTEM EXPLANATION
 * 
 * Each question has 4 possible answers with these point values:
 * - Strongly Disagree: -2 points
 * - Disagree: -1 point  
 * - Agree: +1 point
 * - Strongly Agree: +2 points
 * 
 * REVERSED QUESTIONS:
 * Some questions are marked as "reversed" which flips the scoring:
 * - Strongly Disagree: +2 points (flipped from -2)
 * - Disagree: +1 point (flipped from -1)
 * - Agree: -1 point (flipped from +1)
 * - Strongly Agree: -2 points (flipped from +2)
 */

export function demonstrateScoring() {
  console.log("=== POLITICAL COMPASS SCORING DEMONSTRATION ===\n");

  // Example questions to demonstrate scoring
  const economicQuestion = optimizedQuestions.find(q => q.id === 2); // "Company should hire/fire without government interference"
  const reversedEconomicQuestion = optimizedQuestions.find(q => q.id === 1); // "Free markets should be regulated" (reversed)
  const socialQuestion = optimizedQuestions.find(q => q.id === 26); // "Government should monitor communications"
  const reversedSocialQuestion = optimizedQuestions.find(q => q.id === 25); // "Individual freedom over security" (reversed)

  console.log("🏢 ECONOMIC AXIS EXAMPLES:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  // Regular economic question (not reversed)
  console.log(`\nQuestion: "${economicQuestion?.text.en}"`);
  console.log("Category: Economic (not reversed)");
  console.log("Answer → Score → Meaning:");
  console.log("Strongly Agree (+2) → +2 economic → More capitalist/right-wing");
  console.log("Agree (+1) → +1 economic → Slightly capitalist");
  console.log("Disagree (-1) → -1 economic → Slightly socialist");
  console.log("Strongly Disagree (-2) → -2 economic → More socialist/left-wing");

  // Reversed economic question
  console.log(`\nQuestion: "${reversedEconomicQuestion?.text.en}"`);
  console.log("Category: Economic (REVERSED)");
  console.log("Answer → Raw Score → Flipped Score → Meaning:");
  console.log("Strongly Agree (+2) → -2 economic → More socialist/left-wing");
  console.log("Agree (+1) → -1 economic → Slightly socialist");
  console.log("Disagree (-1) → +1 economic → Slightly capitalist");
  console.log("Strongly Disagree (-2) → +2 economic → More capitalist/right-wing");

  console.log("\n👥 SOCIAL AXIS EXAMPLES:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━");

  // Regular social question
  console.log(`\nQuestion: "${socialQuestion?.text.en}"`);
  console.log("Category: Social (not reversed)");
  console.log("Answer → Score → Meaning:");
  console.log("Strongly Agree (+2) → +2 social → More authoritarian");
  console.log("Agree (+1) → +1 social → Slightly authoritarian");
  console.log("Disagree (-1) → -1 social → Slightly libertarian");
  console.log("Strongly Disagree (-2) → -2 social → More libertarian");

  // Reversed social question
  console.log(`\nQuestion: "${reversedSocialQuestion?.text.en}"`);
  console.log("Category: Social (REVERSED)");
  console.log("Answer → Raw Score → Flipped Score → Meaning:");
  console.log("Strongly Agree (+2) → -2 social → More libertarian");
  console.log("Agree (+1) → -1 social → Slightly libertarian");
  console.log("Disagree (-1) → +1 social → Slightly authoritarian");
  console.log("Strongly Disagree (-2) → +2 social → More authoritarian");
}

/**
 * Calculate a complete score walkthrough for demonstration
 */
export function scoreWalkthrough(answers: Answer[]): {
  economicBreakdown: { questionId: number, question: string, answer: number, points: number, isReversed: boolean }[];
  socialBreakdown: { questionId: number, question: string, answer: number, points: number, isReversed: boolean }[];
  finalScores: { economic: number, social: number };
  gridPosition: { x: number, y: number, block: number };
} {
  const economicBreakdown: { questionId: number, question: string, answer: number, points: number, isReversed: boolean }[] = [];
  const socialBreakdown: { questionId: number, question: string, answer: number, points: number, isReversed: boolean }[] = [];
  let economicTotal = 0;
  let socialTotal = 0;

  answers.forEach(answer => {
    const question = optimizedQuestions.find(q => q.id === answer.questionId);
    if (!question) return;

    let scoreValue = answer.value;
    const isReversed = !!question.reversed;

    // Apply reversal if needed
    if (isReversed) {
      scoreValue = -scoreValue as -2 | -1 | 1 | 2;
    }

    const breakdown = {
      questionId: question.id,
      question: question.text.en,
      answer: answer.value,
      points: scoreValue,
      isReversed
    };

    if (question.category === 'economic') {
      economicBreakdown.push(breakdown);
      economicTotal += scoreValue;
    } else if (question.category === 'social') {
      socialBreakdown.push(breakdown);
      socialTotal += scoreValue;
    }
  });

  // Normalize to -10 to +10 scale
  // With 24 questions per category, max possible is ±48, so we scale to ±10
  const normalizedEconomic = Math.max(-10, Math.min(10, (economicTotal / 48) * 10));
  const normalizedSocial = Math.max(-10, Math.min(10, (socialTotal / 48) * 10));

  // Convert to grid position (0-9)
  const gridX = Math.floor((normalizedEconomic + 10) / 2);
  const gridY = 9 - Math.floor((normalizedSocial + 10) / 2); // Inverted for display
  const block = gridY * 10 + gridX;

  return {
    economicBreakdown,
    socialBreakdown,
    finalScores: {
      economic: Math.round(normalizedEconomic * 10) / 10,
      social: Math.round(normalizedSocial * 10) / 10
    },
    gridPosition: { x: gridX, y: gridY, block }
  };
}

/**
 * Example scenarios to show different political positions
 */
export const scoringExamples = {
  strongLibertarianRight: {
    description: "Strong Libertarian Right (Liberal Capitalist)",
    answers: [
      // Economic questions - pro-free market answers
      { questionId: 2, value: 2 }, // Strongly agree with hiring/firing freedom
      { questionId: 1, value: -2 }, // Strongly disagree with market regulation (reversed)
      { questionId: 8, value: -2 }, // Strongly disagree with high taxes (reversed)
      
      // Social questions - pro-individual freedom answers  
      { questionId: 25, value: 2 }, // Strongly agree individual freedom over security (reversed → -2 social)
      { questionId: 26, value: -2 }, // Strongly disagree with government monitoring
      { questionId: 29, value: 2 }, // Strongly agree people should live freely (reversed → -2 social)
    ] as Answer[],
    expectedResult: "High economic score (+), Low social score (-) = Bottom-Right quadrant"
  },

  strongAuthoritarianLeft: {
    description: "Strong Authoritarian Left (authoritative Socialist)", 
    answers: [
      // Economic questions - pro-socialist answers
      { questionId: 2, value: -2 }, // Strongly disagree with hiring/firing freedom  
      { questionId: 1, value: 2 }, // Strongly agree with market regulation (reversed → -2 economic)
      { questionId: 8, value: 2 }, // Strongly agree with high taxes (reversed → -2 economic)
      
      // Social questions - pro-authority answers
      { questionId: 25, value: -2 }, // Strongly disagree individual freedom over security (reversed → +2 social)
      { questionId: 26, value: 2 }, // Strongly agree with government monitoring
      { questionId: 37, value: 2 }, // Strongly agree with traditional values
    ] as Answer[],
    expectedResult: "Low economic score (-), High social score (+) = Top-Left quadrant"
  }
};

/**
 * Print detailed scoring explanation
 */
export function printScoringGuide() {
  console.log(`
🎯 POLITICAL COMPASS SCORING GUIDE
═══════════════════════════════════

📊 ANSWER VALUES:
• Strongly Disagree = -2 points
• Disagree = -1 point
• Agree = +1 point  
• Strongly Agree = +2 points

🔄 REVERSED QUESTIONS:
Questions marked as "reversed" flip the scoring to ensure consistent measurement.
Example: "Free markets should be regulated" (reversed)
- Agreeing with this = socialist position = negative economic score
- The reversal ensures consistent left-right measurement

📈 ECONOMIC AXIS SCORING:
Negative scores (-) = Socialist/Left-wing
• Government control of economy
• High taxes on wealthy
• Strong worker protections
• Market regulation

Positive scores (+) = Capitalist/Right-wing  
• Free market economy
• Low taxes
• Minimal government interference
• Private property rights

📊 SOCIAL AXIS SCORING:
Negative scores (-) = Libertarian
• Individual freedoms
• Minimal government authority
• Personal choice
• Civil liberties

Positive scores (+) = Authoritarian
• Strong government control
• Traditional values
• Law and order
• Collective security

🎯 FINAL CALCULATION:
1. Sum all economic question points
2. Sum all social question points  
3. Normalize to -10 to +10 scale
4. Convert to 100-block grid position (0-99)

📍 GRID POSITIONING:
• Economic: 0=Socialist → 9=Capitalist
• Social: 0=Authoritarian → 9=Libertarian
• Block = (Social × 10) + Economic
  `);
}