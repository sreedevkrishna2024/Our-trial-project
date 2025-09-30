import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/SessionProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  preload: true
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: 'AI Writing Studio | Professional Creative Writing Platform',
  description: 'Transform your ideas into compelling stories with our professional AI-powered writing assistant. Experience real-time generation, smart templates, and seamless export options.',
  keywords: 'AI writing, creative writing, story generation, character development, plot building, dialogue creation, writing assistant',
  authors: [{ name: 'AI Writing Studio Team' }],
  creator: 'AI Writing Studio',
  publisher: 'AI Writing Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aiwritingstudio.com'),
  openGraph: {
    title: 'AI Writing Studio | Professional Creative Writing Platform',
    description: 'Transform your ideas into compelling stories with our professional AI-powered writing assistant.',
    url: 'https://aiwritingstudio.com',
    siteName: 'AI Writing Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Writing Studio | Professional Creative Writing Platform',
    description: 'Transform your ideas into compelling stories with our professional AI-powered writing assistant.',
    creator: '@aiwritingstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="font-body antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
