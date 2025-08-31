import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '../lib/LanguageContext'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'Political Compass Sri Lanka | Discover Your Political Position',
  description: 'Take the Sri Lanka politics test to discover your position on the political compass. Find out if you are authoritarian, libertarian, left, or right in Sri Lankan politics.',
  keywords: 'political compass Sri Lanka, Sri Lanka politics test, political position test, Sri Lankan political spectrum',
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
            src="https://app.rybbit.io/api/script.js"
            data-site-id="2302"
            defer
        ></script>
        
        {/* Popunder Ad - One per page */}
        {/* <script
          type="text/javascript"
          src="//pl27528300.effectivecpmrate.com/12/0c/4b/120c4bcb1c2545ec2113195288dcad95.js"
          async
        /> */}
        
        {/* Social Bar */}
        <script
          type="text/javascript"
          src="//pl27528342.effectivecpmrate.com/85/7e/86/857e869bf5537eb6a0890a31fc212317.js"
          async
        />
      </body>
    </html>
  )
}