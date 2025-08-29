import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suggest Political Theorists | Sri Lanka Political Compass Community',
  description: 'Suggest political theorists for the Sri Lanka political compass. Vote on community suggestions and help expand the political spectrum with influential thinkers.',
  keywords: 'suggest political theorists, Sri Lanka political compass community, political spectrum suggestions, community voting',
}

export default function SuggestPoliticiansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
