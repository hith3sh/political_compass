import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sri Lanka Political Compass Community Results | Political Spectrum Analysis',
  description: 'Explore Sri Lanka political compass community results. See how thousands of Sri Lankans are positioned on the political spectrum - authoritarian, libertarian, left, and right.',
  keywords: 'Sri Lanka political compass community, political spectrum analysis, Sri Lankan political distribution, community political results',
}

export default function CommunityResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
