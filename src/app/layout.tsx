import { type Metadata } from 'next'

import {
  ClerkProvider,
} from '@clerk/nextjs'

import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Converso',
  description: 'Real-time AI Teaching Platform',
}

// Force dynamic rendering if Clerk key is missing to prevent build errors
export const dynamic = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'auto' : 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Warn in development
  if (!publishableKey && process.env.NODE_ENV === 'development') {
    console.warn(
      '⚠️ Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable. ' +
      'Please set it in your Vercel project settings under Environment Variables.'
    );
  }

  // If key is missing during build, provide a minimal layout that doesn't break
  // This allows the build to complete, but the app won't work until the key is set
  if (!publishableKey) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
              <p className="text-muted-foreground">
                Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable.
                <br />
                Please set it in your Vercel project settings.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        variables: {
          colorPrimary: '#6c47ff',
        },
      }}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
