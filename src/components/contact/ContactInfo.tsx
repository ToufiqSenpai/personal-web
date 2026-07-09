import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getProfile } from '@/data/queries'
import { ProfileIcon } from '@/payload-types'

export async function ContactInfo({ locale }: { locale: string }) {
  const t = await getTranslations('pages.Contact')
  const profile = await getProfile(locale as 'en' | 'id' | 'ja')

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-5">
        <p className="mb-2 font-mono text-xs text-muted">{t('emailLabel')}</p>
        <Link href={`mailto:${profile.email}`} className="text-sm text-ink transition-colors hover:text-accent">
          {profile.email}
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <p className="mb-3 font-mono text-xs text-muted">{t('socialsLabel')}</p>
        <div className="flex gap-3">
          {profile.socials?.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent hover:text-accent"
              aria-label={social.name}
            >
              <Image src={(social.icon as ProfileIcon).url!} alt={social.name} width={18} height={18} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
