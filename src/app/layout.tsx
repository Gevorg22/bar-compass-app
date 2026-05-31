import type { Metadata, Viewport } from 'next';

import './globals.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'BarCompass — найди ближайший бар',
  description:
    'Компас, который укажет путь к ближайшему бару, пабу или алкомаркету. Работает на основе OpenStreetMap, бесплатно.',
  keywords: ['бар', 'паб', 'компас', 'геолокация', 'алкоголь', 'найти бар'],
  authors: [{ name: 'BarCompass' }],
  manifest: `${basePath}/manifest.json`,
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

const themeScript = `try{var t=localStorage.getItem('bar-compass-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}`;

const swPath = `${basePath}/sw.js`;
const swScript = `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('${swPath}').catch(function(){});});}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </body>
    </html>
  );
}
