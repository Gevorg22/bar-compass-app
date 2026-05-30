import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'BarCompass — найди ближайший бар',
  description:
    'Компас, который укажет путь к ближайшему бару, пабу или алкомаркету. Работает на основе OpenStreetMap, бесплатно.',
  keywords: ['бар', 'паб', 'компас', 'геолокация', 'алкоголь', 'найти бар'],
  authors: [{ name: 'BarCompass' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BarCompass',
  },
  openGraph: {
    title: 'BarCompass',
    description: 'Найди ближайший бар с помощью компаса',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#090b12',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
