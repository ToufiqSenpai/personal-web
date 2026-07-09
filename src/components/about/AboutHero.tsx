import Image from 'next/image'
import type { Profile } from '@/payload-types'

export interface AboutHeroProps {
  profile: Profile
}

export function AboutHero({ profile }: AboutHeroProps) {
  const name = profile.name
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const languagesString = profile.languages ? profile.languages.map((l) => l.language).join(' • ') : ''

  const rolesString = profile.roles ? profile.roles.map((r) => r.role).join(' • ') : ''

  const avatarUrl = typeof profile.avatar === 'object' && profile.avatar !== null ? profile.avatar.url || '' : ''
  const avatarAlt =
    typeof profile.avatar === 'object' && profile.avatar !== null ? profile.avatar.alt || 'Avatar' : 'Avatar'

  return (
    <section className="px-6 pt-20 pb-12">
      <div className="mx-auto max-w-4xl">
        <div className="animate-fade-in-up">
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-gradient-to-br from-accent to-accent/40">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={avatarAlt} fill className="object-cover" sizes="96px" priority />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono text-2xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink sm:text-4xl">{name}</h1>
              <p className="mt-1 text-lg text-muted">{rolesString}</p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {profile.location}
                </div>
                {languagesString && (
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    {languagesString}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-base text-muted">{profile.bio}</p>
        </div>
      </div>
    </section>
  )
}
