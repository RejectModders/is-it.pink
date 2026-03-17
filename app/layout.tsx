import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import './globals.css'

export const metadata: Metadata = {
  title: 'is it pink? - The Color Guessing Game',
  description: 'Can you tell if a color is pink? Test your color perception in this addictive mini-game. Build streaks, earn multipliers, and compete for the highest score!',
  generator: 'v0.app',
  metadataBase: new URL('https://is-it.pink'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'is it pink?',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'is it pink? - The Color Guessing Game',
    description: 'Can you tell if a color is pink? Test your color perception in this addictive mini-game!',
    url: 'https://is-it.pink',
    siteName: 'is it pink?',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'is it pink? - The Color Guessing Game',
      },
    ],
  },
  other: {
    'theme-color': '#ec4899',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'is it pink? - The Color Guessing Game',
    description: 'Can you tell if a color is pink? Test your color perception in this addictive mini-game!',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  keywords: ['pink', 'color game', 'guessing game', 'mini game', 'color perception', 'fun game'],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ec4899' },
    { media: '(prefers-color-scheme: dark)', color: '#f472b6' },
  ],
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en">
      <body className="font-sans antialiased">
      {children}
      <Analytics />
      <ServiceWorkerRegistration />
      </body>
      </html>
  )
}
