'use client'

import * as stylex from '@stylexjs/stylex'
import { useState, type FormEvent } from 'react'
import { Turnstile } from '@/components/ui/Turnstile'
import { m } from '@/paraglide/messages'

type FormState = 'idle' | 'loading' | 'success'
type Field = 'name' | 'email' | 'subject' | 'message' | 'captcha' | 'submit'
type Errors = Partial<Record<Field, string>>
interface PayloadError {
  message: string
  path?: string
  name?: string
  data?: { code?: string }
}

interface ApiErrorBody {
  errors?: PayloadError[]
}

function getCaptchaErrorMessage(body: ApiErrorBody | null): string | undefined {
  const code = body?.errors?.find((error) => error.data?.code)?.data?.code
  if (code === 'CAPTCHA_UNAVAILABLE') return m.pages_contact_error_captcha_unavailable()
  if (code === 'CAPTCHA_FAILED') return m.pages_contact_captcha_error()
  return undefined
}

function getFieldErrors(body: ApiErrorBody | null): Errors {
  const fieldErrors: Errors = {}
  for (const error of body?.errors ?? []) {
    const field = (error.path ?? error.name) as Field | undefined
    if (field) fieldErrors[field] = error.message
  }
  return fieldErrors
}

const styles = stylex.create({
  form: {
    padding: { default: '1.5rem', '@media (min-width: 640px)': '2rem' },
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
  },
  row: {
    display: 'grid',
    gap: '1.25rem',
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
  fieldGroup: {
    marginTop: '1.25rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.375rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted)',
  },
  input: {
    width: '100%',
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    borderRadius: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-canvas)',
    color: 'var(--color-ink)',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    outline: 'none',
    transitionProperty: 'border-color',
    transitionDuration: '150ms',
    ':focus': {
      borderColor: 'var(--color-accent)',
    },
  },
  textarea: {
    resize: 'none',
  },
  error: {
    marginTop: '0.25rem',
    marginBottom: 0,
    fontSize: '0.75rem',
    color: 'var(--color-accent)',
  },
  submit: {
    width: { default: '100%', '@media (min-width: 640px)': 'auto' },
    marginTop: '1.5rem',
    paddingInline: '1.5rem',
    paddingBlock: '0.625rem',
    borderRadius: '0.5rem',
    borderWidth: 0,
    backgroundColor: 'var(--color-accent)',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    ':disabled': {
      opacity: 0.6,
    },
  },
  successCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '2rem',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    textAlign: 'center',
  },
  successIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    marginBottom: '1rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--color-accent-soft)',
    color: 'var(--color-accent)',
  },
  successTitle: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--color-ink)',
  },
  successSubtitle: {
    marginTop: 0,
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
  },
  reset: {
    paddingInline: '1.25rem',
    paddingBlock: '0.5rem',
    borderRadius: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'transparent',
    color: 'var(--color-ink)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
})

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [turnstileToken, setTurnstileToken] = useState('')

  function resetCaptcha() {
    window.turnstile?.reset()
    setTurnstileToken('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setErrors({})
    setFormState('loading')

    try {
      const response = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          _turnstileToken: turnstileToken,
        }),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as ApiErrorBody | null
        const captchaMessage = getCaptchaErrorMessage(body)

        if (captchaMessage) {
          setErrors({ captcha: captchaMessage })
        } else {
          const fieldErrors = getFieldErrors(body)
          if (Object.keys(fieldErrors).length === 0) throw new Error('Failed to submit form')
          setErrors(fieldErrors)
        }

        setFormState('idle')
        resetCaptcha()
        return
      }

      setFormState('success')
      form.reset()
      resetCaptcha()
    } catch (error) {
      console.error(error)
      setErrors({ submit: m.pages_contact_error_submit_failed() })
      setFormState('idle')
      resetCaptcha()
    }
  }

  if (formState === 'success') {
    return (
      <div {...stylex.props(styles.successCard)}>
        <div {...stylex.props(styles.successIcon)}>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 {...stylex.props(styles.successTitle)}>{m.pages_contact_success_title()}</h3>
        <p {...stylex.props(styles.successSubtitle)}>{m.pages_contact_success_subtitle()}</p>
        <button type="button" onClick={() => setFormState('idle')} {...stylex.props(styles.reset)}>
          {m.pages_contact_send_another()}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} {...stylex.props(styles.form)}>
      <div {...stylex.props(styles.row)}>
        <div>
          <label htmlFor="name" {...stylex.props(styles.label)}>
            {m.pages_contact_name_label()}
          </label>
          <input id="name" name="name" type="text" placeholder="Jane Doe" {...stylex.props(styles.input)} />
          {errors.name && <p {...stylex.props(styles.error)}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" {...stylex.props(styles.label)}>
            {m.pages_contact_email_input_label()}
          </label>
          <input id="email" name="email" type="email" placeholder="jane@example.com" {...stylex.props(styles.input)} />
          {errors.email && <p {...stylex.props(styles.error)}>{errors.email}</p>}
        </div>
      </div>

      <div {...stylex.props(styles.fieldGroup)}>
        <label htmlFor="subject" {...stylex.props(styles.label)}>
          {m.pages_contact_subject_label()}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder={m.pages_contact_subject_placeholder()}
          {...stylex.props(styles.input)}
        />
        {errors.subject && <p {...stylex.props(styles.error)}>{errors.subject}</p>}
      </div>

      <div {...stylex.props(styles.fieldGroup)}>
        <label htmlFor="message" {...stylex.props(styles.label)}>
          {m.pages_contact_message_label()}
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder={m.pages_contact_message_placeholder()}
          {...stylex.props(styles.input, styles.textarea)}
        />
        {errors.message && <p {...stylex.props(styles.error)}>{errors.message}</p>}
      </div>

      <div {...stylex.props(styles.fieldGroup)}>
        <Turnstile
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken('')}
          onError={() => setTurnstileToken('')}
        />
        {errors.captcha && <p {...stylex.props(styles.error)}>{errors.captcha}</p>}
      </div>

      {errors.submit && <p {...stylex.props(styles.error)}>{errors.submit}</p>}

      <button type="submit" disabled={formState === 'loading' || !turnstileToken} {...stylex.props(styles.submit)}>
        {formState === 'loading' ? m.pages_contact_sending() : m.pages_contact_send()}
      </button>
    </form>
  )
}
