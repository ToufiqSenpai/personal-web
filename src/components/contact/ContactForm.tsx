'use client'

import { useTranslations } from 'next-intl'
import { useState, type FormEvent } from 'react'
import { Turnstile } from '@/components/ui/Turnstile'

type FormState = 'idle' | 'loading' | 'success'

type Errors = {
  name?: string
  email?: string
  subject?: string
  message?: string
  captcha?: string
  submit?: string
}

export function ContactForm() {
  const t = useTranslations('pages.Contact')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [turnstileToken, setTurnstileToken] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    setErrors({})
    setFormState('loading')

    try {
      const response = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          _turnstileToken: turnstileToken,
        }),
      })

      if (!response.ok) {
        try {
          const errorData = await response.json()
          if (errorData.errors && Array.isArray(errorData.errors)) {
            const fieldErrors: Errors = {}
            let hasFieldErrors = false

            errorData.errors.forEach((err: any) => {
              if (err.field) {
                fieldErrors[err.field as keyof Errors] = err.message
                hasFieldErrors = true
              }
            })

            if (hasFieldErrors) {
              setErrors(fieldErrors)
              setFormState('idle')
              window.turnstile?.reset()
              setTurnstileToken('')
              return
            }
          }
        } catch {
          // Ignore and let it fall back to generic error
        }
        throw new Error('Failed to submit form')
      }

      setFormState('success')
      form.reset()
      setTurnstileToken('')
      window.turnstile?.reset()
    } catch (err) {
      console.error(err)
      setErrors({
        submit: t('errorSubmitFailed') || 'Failed to send message. Please try again.',
      })
      setFormState('idle')
      window.turnstile?.reset()
      setTurnstileToken('')
    }
  }

  if (formState === 'success') {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-surface p-8 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <svg
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
        <h3 className="mb-2 text-lg font-semibold text-ink">{t('successTitle')}</h3>
        <p className="mb-6 text-sm text-muted">{t('successSubtitle')}</p>
        <button
          type="button"
          onClick={() => setFormState('idle')}
          className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          {t('sendAnother')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-muted">
            {t('nameLabel')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
            placeholder="Jane Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-accent">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-muted">
            {t('emailInputLabel')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
            placeholder="jane@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-accent">{errors.email}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="subject" className="mb-1.5 block font-mono text-xs text-muted">
          {t('subjectLabel')}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
          placeholder={t('subjectPlaceholder')}
        />
        {errors.subject && <p className="mt-1 text-xs text-accent">{errors.subject}</p>}
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-muted">
          {t('messageLabel')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className="w-full resize-none rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
          placeholder={t('messagePlaceholder')}
        />
        {errors.message && <p className="mt-1 text-xs text-accent">{errors.message}</p>}
      </div>

      <div className="mt-5">
        <Turnstile
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken('')}
          onError={() => setTurnstileToken('')}
        />
        {errors.captcha && <p className="mt-1 text-xs text-accent">{errors.captcha}</p>}
      </div>

      {errors.submit && <p className="mt-4 text-sm text-accent">{errors.submit}</p>}

      <button
        type="submit"
        disabled={formState === 'loading' || !turnstileToken}
        className="mt-6 w-full rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-60 sm:w-auto"
      >
        {formState === 'loading' ? t('sending') : t('send')}
      </button>
    </form>
  )
}
