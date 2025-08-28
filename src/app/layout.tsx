import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '../lib/LanguageContext'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'පොලිටික්ස් මීටරේ',
  description: 'Discover your political position on the economic and social axes through our comprehensive political compass quiz.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : 'b34a8ef0e6cd2bcb0679b13b9843c7ca',
                'format' : 'iframe',
                'height' : 300,
                'width' : 160,
                'params' : {}
              };
            `,
          }}
        />
        <script
          src="//www.highperformanceformat.com/b34a8ef0e6cd2bcb0679b13b9843c7ca/invoke.js"
          async
        />
      </body>
    </html>
  )
}