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
  description: 'Official management platform and portal for Cambodia–China Expo Week 2026 in Kunming, Yunnan, China (November 7–11, 2026).',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,300..900;1,300..900&family=Noto+Serif+Khmer:wght@300..900&family=Noto+Serif+SC:wght@300..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GlassAmbientBackground />
        <ThemeProvider>
          <SettingsProvider>
            <LanguageProvider>
              <AuthProvider>
                <Navbar />
                <main style={{ minHeight: 'calc(100vh - 180px)', position: 'relative', zIndex: 1 }}>
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
