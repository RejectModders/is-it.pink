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
    title: 'is it pink?',
    description: 'Can you tell if a color is pink? Test your color perception in this addictive mini-game!',
    url: 'https://is-it.pink',
    siteName: 'is it pink?',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'is it pink?',
      },
    ],
  },
  other: {
    'theme-color': '#ec4899',
  },
  twitter: {
    card: 'summary',
    title: 'is it pink?',
    description: 'Can you tell if a color is pink? Test your color perception in this addictive mini-game!',
    images: ['/favicon.png'],
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

// Script to prevent flash of wrong theme
const themeScript = `
  (function() {
    try {
      var darkMode = localStorage.getItem('pinkGameDarkMode');
      if (darkMode === 'true' || (!darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: '#1a0f16' }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
