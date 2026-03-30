import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/variables.css';

export const metadata: Metadata = {
  title: 'Choir Management System',
  description: 'Manage your choir members, attendance, songs, and meetings.',
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