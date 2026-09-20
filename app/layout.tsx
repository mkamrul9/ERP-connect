/**
 * Root Layout Component
 * 
 * Provides the global HTML structure, font (Inter), and layout wrapper.
 * Includes the Sidebar navigation and sets up the main content area.
 * Designed for responsive viewports (Web & Mobile).
 */
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthGuard from './components/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'ERP-connect',
  description: 'ERP-connect — Modern Enterprise Resource Planning Platform',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ERP-connect',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: 'var(--bg)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
