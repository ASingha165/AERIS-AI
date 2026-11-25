import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { AirQualityProvider } from '@/lib/context/AirQualityContext';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });

export const metadata: Metadata = {
  title: 'AERIS-AI | Environmental Intelligence Platform',
  description: 'Breathe Smarter. Live Better. AI-powered household-level pollution decision intelligence.',
  keywords: ['Air Quality', 'AQI', 'Urban Health', 'Pollution Planner', 'Environmental AI', 'Kolkata Air'],
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
        <AirQualityProvider>{children}</AirQualityProvider>
      </body>
    </html>
  );
}
