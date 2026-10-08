/**
 * Single Source of Truth for Design Tokens
 * Cambodia-China Expo Week 2026
 * 
 * Shared across Next.js (Tailwind / CSS variables) and React Native (StyleSheet / theme tokens)
 */

export const colors = {
  // Neutral palette
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#060911',
  },

  // Bilateral Brand Colors
  bilateral: {
    cambodiaRed: '#c8102e',
    cambodiaRedHover: '#a30c25',
    cambodiaBlue: '#0f2b5c',
    chinaRed: '#de2910',
    chinaGold: '#ffde00',
    expoGold: '#d4af37',
    expoGoldLight: '#fbbf24',
  },

  // Semantic mappings (shadcn/ui compatible)
  primary: {
    DEFAULT: '#2563eb', // Royal Blue
    foreground: '#ffffff',
    hover: '#1d4ed8',
  },
  secondary: {
    DEFAULT: '#1e293b',
    foreground: '#f8fafc',
    hover: '#334155',
  },
  accent: {
    DEFAULT: '#d4af37', // Gold
    foreground: '#060911',
    hover: '#fbbf24',
  },
  destructive: {
    DEFAULT: '#ef4444',
    foreground: '#ffffff',
    hover: '#dc2626',
  },
  success: {
    DEFAULT: '#10b981',
    foreground: '#ffffff',
    hover: '#059669',
  },
  warning: {
    DEFAULT: '#f59e0b',
    foreground: '#060911',
    hover: '#d97706',
  },

  // Surfaces & Backgrounds
  background: {
    dark: '#060911',
    cardDark: '#0f172a',
    cardSubtle: 'rgba(15, 23, 42, 0.7)',
    light: '#f8fafc',
    cardLight: '#ffffff',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.1)',
    moderate: 'rgba(255, 255, 255, 0.18)',
    focus: '#3b82f6',
  },
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

export const typography = {
  fontFamily: {
    sans: "'Noto Serif', 'Noto Serif Khmer', 'Noto Serif SC', Georgia, serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  fontSize: {
    xs: { fontSize: '0.75rem', lineHeight: '1rem' },
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    base: { fontSize: '1rem', lineHeight: '1.5rem' },
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
    xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
    '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
    '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
    '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
  },
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
  glow: '0 0 20px rgba(59, 130, 246, 0.35)',
  glowGold: '0 0 20px rgba(212, 175, 55, 0.35)',
  glowRed: '0 0 20px rgba(200, 16, 46, 0.35)',
};

/**
 * Native Theme for React Native (StyleSheet / theme)
 */
export const nativeTheme = {
  colors: {
    background: colors.background.dark,
    card: colors.background.cardDark,
    text: colors.neutral[50],
    textMuted: colors.neutral[400],
    border: colors.border.subtle,
    primary: colors.primary.DEFAULT,
    primaryForeground: colors.primary.foreground,
    secondary: colors.secondary.DEFAULT,
    accent: colors.accent.DEFAULT,
    destructive: colors.destructive.DEFAULT,
    success: colors.success.DEFAULT,
  },
  spacing,
  radii,
  shadows,
};

export default {
  colors,
  spacing,
  radii,
  typography,
  shadows,
  nativeTheme,
};
