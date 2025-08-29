import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sri Lanka Politics Test | Take the Political Compass Quiz',
  description: 'Take the comprehensive Sri Lanka politics test with 20 questions. Discover your political compass position - authoritarian, libertarian, left, or right in Sri Lankan politics.',
  keywords: 'Sri Lanka politics test, political compass quiz, Sri Lankan political test, political position quiz',
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
