import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/SessionProvider'

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
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
