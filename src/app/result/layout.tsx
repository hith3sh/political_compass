import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Political Compass Results | Sri Lanka Politics Test Results',
  description: 'View your Sri Lanka politics test results on the political compass. See where you stand on the authoritarian-libertarian and left-right spectrum in Sri Lankan politics.',
  keywords: 'political compass results, Sri Lanka politics test results, political position results, Sri Lankan political spectrum results',
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
