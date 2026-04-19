import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { DemoTourShell } from '@/components/synapse/demo-tour-shell'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const fraunces = localFont({
  src: [
    {
      path: '../public/fonts/Fraunces-VariableFont.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-fraunces',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
})

const jetbrainsMono = localFont({
  src: [
    {
      path: '../public/fonts/JetBrainsMono-VariableFont.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-jetbrains',
  display: 'swap',
  fallback: ['monospace'],
})

export const metadata: Metadata = {
  title: 'SYNAPSE - Jumeau Cognitif',
  description: 'Votre jumeau cognitif professionnel. Conseil des agents IA personnalisés pour votre développement de carrière.',
  generator: 'SYNAPSE',
  keywords: ['AI', 'career development', 'skill graph', 'cognitive twin', 'professional growth'],
  authors: [{ name: 'SYNAPSE' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8fa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${geist.variable} ${geistMono.variable} ${fraunces.variable} ${jetbrainsMono.variable} dark bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <DemoTourShell>{children}</DemoTourShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
