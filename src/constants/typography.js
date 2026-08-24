// Type scale extracted from the Stitch design system (Inter throughout).
// Inter font files were not included in the Stitch export — fontFamily falls back
// to the OS default until Inter-Regular/Medium/SemiBold/Bold.ttf are added to
// src/assets/fonts and linked via react-native.config.js assets.
export const typography = {
  display: {
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: -0.4,
  },
  headlineLg: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  headlineLgMobile: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  headlineMd: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.1,
  },
  bodyLg: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
  },
  labelMd: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
};

export default typography;
