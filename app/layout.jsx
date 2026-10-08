import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsProvider } from '@/components/SettingsProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassAmbientBackground from '@/components/GlassAmbientBackground';

export const metadata = {
  title: 'Cambodia–China Expo Week 2026 — Official Bilateral Platform',
  description: 'Official management platform and portal for Cambodia–China Expo Week 2026 in Kunming, Yunnan, China (November 7–11, 2026). Connecting enterprise leaders, universities, cultural delegations, and trade buyers.',
  keywords: ['Cambodia-China Expo', 'Kunming 2026', 'Bilateral Trade', 'Yunnan Expo', 'RCEP', 'B2B Trade Fair'],
  authors: [{ name: 'Cambodia-China Expo Committee' }],
  openGraph: {
    title: 'Cambodia–China Expo Week 2026 — Official Bilateral Platform',
    description: 'The flagship bilateral exposition connecting international enterprise leaders, premier universities, cultural delegations, and trade buyers across Cambodia and Greater Yunnan.',
    url: 'https://expoweek2026.org',
    siteName: 'Cambodia–China Expo Week 2026',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cambodia–China Expo Week 2026',
    description: 'Official management platform and portal for Cambodia–China Expo Week 2026 in Kunming, Yunnan, China.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cookieMatch = document.cookie.match(/expo_theme=([^;]+)/);
                  var cookieTheme = cookieMatch ? decodeURIComponent(cookieMatch[1].trim()) : null;
                  var saved = cookieTheme || localStorage.getItem('expo_theme') || 'system';
                  var resolved = saved;
                  if (saved === 'system') {
                    resolved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
                  }
                  if (resolved !== 'dark' && resolved !== 'light') {
                    resolved = 'dark';
                  }
                  document.documentElement.setAttribute('data-theme', resolved);
                  document.documentElement.setAttribute('data-theme-mode', saved);
                  document.documentElement.style.colorScheme = resolved;
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,300..900;1,300..900&family=Noto+Serif+Khmer:wght@300..900&family=Noto+Serif+SC:wght@300..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white transition-all"
        >
          Skip to main content
        </a>
        <GlassAmbientBackground />
        <ThemeProvider>
          <SettingsProvider>
            <LanguageProvider>
              <AuthProvider>
                <Navbar />
                <main id="main-content" tabIndex={-1} style={{ minHeight: 'calc(100vh - 180px)', position: 'relative', zIndex: 1 }}>
                  {children}
                </main>
                <Footer />
              </AuthProvider>
            </LanguageProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
