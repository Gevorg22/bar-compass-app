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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090b12' },
    { media: '(prefers-color-scheme: light)', color: '#f0f4fb' },
  ],
};

const themeScript = `
  try {
    var t = localStorage.getItem('bar-compass-theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
`;

const swScript = `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').catch(function() {});
    });
  }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </body>
    </html>
  );
}
