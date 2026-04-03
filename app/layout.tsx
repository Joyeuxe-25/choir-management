import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import '../styles/variables.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Chorale Angelus Dei',
  description: 'Choir Management System for Chorale Angelus Dei.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Angelus Dei',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/icons/icon-192x192.png', sizes: '192x192' },
      { rel: 'icon', url: '/icons/icon-512x512.png', sizes: '512x512' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#166534',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}