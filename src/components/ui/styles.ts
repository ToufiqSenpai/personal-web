import * as stylex from '@stylexjs/stylex'

// Repeated layout atoms shared by the page sections.
export const shared = stylex.create({
  section: {
    paddingInline: '1.5rem',
    paddingBlock: '5rem',
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in srgb, var(--color-border) 50%, transparent)',
  },
  container: {
    maxWidth: '72rem',
    marginInline: 'auto',
  },
  eyebrow: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--color-accent)',
  },
  sectionTitle: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '3rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-ink)',
    '@media (min-width: 640px)': {
      fontSize: '1.875rem',
    },
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: '1.5rem',
    paddingBlock: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--color-accent)',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecorationLine: 'none',
    transitionProperty: 'box-shadow, background-color',
    transitionDuration: '200ms',
    ':hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-accent) 90%, transparent)',
      boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--color-accent) 20%, transparent)',
    },
  },
})
