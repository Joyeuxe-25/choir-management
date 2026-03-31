import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/variables.css';

export const metadata: Metadata = {
  title: 'Chorale Angelus Dei',
  description: 'Choir Management System for Chorale Angelus Dei.',
  icons: {
    icon: '/logo.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}