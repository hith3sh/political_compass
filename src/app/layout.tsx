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
        
        {/* Iframe Ad */}
        
        {/* Popunder Ad - One per page */}
        <script
          type="text/javascript"
          src="//pl27528300.effectivecpmrate.com/12/0c/4b/120c4bcb1c2545ec2113195288dcad95.js"
          async
        />
      </body>
    </html>
  )
}