export const motionTokens = {
  duration: {
    fast: '180ms',
    normal: '240ms',
    slow: '500ms',
    reveal: '700ms',
  },
  easing: {
    standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  transitions: {
    button: '180ms cubic-bezier(0.16, 1, 0.3, 1)',
    panel: '240ms cubic-bezier(0.16, 1, 0.3, 1)',
    reveal: '700ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
