import { Reveal } from '@/components/ui/Reveal'
import type { Profile } from '@/payload-types'
import { useTranslations } from 'next-intl'

export interface BentoHobbiesProps {
  profile: Profile
}

const LAYOUTS = [
  { col: 'md:col-span-2', row: 'md:row-span-2', minH: 'min-h-[220px] md:min-h-[420px]' }, // hero
  { col: 'md:col-span-1', row: 'md:row-span-1', minH: 'min-h-[200px]' }, // square
  { col: 'md:col-span-1', row: 'md:row-span-1', minH: 'min-h-[200px]' }, // square
  { col: 'md:col-span-2', row: 'md:row-span-1', minH: 'min-h-[200px]' }, // wide
  { col: 'md:col-span-1', row: 'md:row-span-2', minH: 'min-h-[200px] md:min-h-[420px]' }, // tall
  { col: 'md:col-span-1', row: 'md:row-span-1', minH: 'min-h-[200px]' }, // square
]

function getLayout(index: number) {
  if (index === 0) return LAYOUTS[0]
  return LAYOUTS[1 + ((index - 1) % (LAYOUTS.length - 1))]
}

const TILT_CLASSES = [
  'group-hover:rotate-[-1.5deg] group-focus:rotate-[-1.5deg]',
  'group-hover:rotate-[1.5deg] group-focus:rotate-[1.5deg]',
  'group-hover:rotate-[-1deg] group-focus:rotate-[-1deg]',
  'group-hover:rotate-[1deg] group-focus:rotate-[1deg]',
  'group-hover:rotate-[-2deg] group-focus:rotate-[-2deg]',
  'group-hover:rotate-[2deg] group-focus:rotate-[2deg]',
]

export function BentoHobbies({ profile }: BentoHobbiesProps) {
  const t = useTranslations('pages.About')
  const hobbiesItems = profile.hobbies || []

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{t('hobbies.eyebrow')}</p>
          <h2 className="mb-8 text-2xl font-bold text-ink">{t('hobbies.title')}</h2>
        </Reveal>
 
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {hobbiesItems.map((hobby, index) => {
            const layout = getLayout(index)
            const tiltClass = TILT_CLASSES[index % TILT_CLASSES.length]
 
            let imageUrl = ''
            let altText = hobby.title
            if (hobby.image && typeof hobby.image === 'object') {
              imageUrl = hobby.image.url || ''
              altText = hobby.image.alt || hobby.title
            }
 
            return (
              <Reveal
                key={index}
                delay={index * 90}
                tabIndex={0}
                className={`group relative overflow-hidden rounded-2xl bg-surface focus:outline-none focus:ring-2 focus:ring-accent/25 ${layout.col} ${layout.row} ${layout.minH}`}
              >
                <div
                  className={`absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06] group-focus:scale-[1.06] ${tiltClass} motion-reduce:transform-none motion-reduce:transition-none`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {imageUrl ? (
                    <img src={imageUrl} alt={altText} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/30 via-surface to-surface">
                      <span className="font-mono text-4xl font-bold text-accent/60">
                        {hobby.title?.charAt(0) ?? '?'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/90 group-focus:from-black/90" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="mb-1 text-lg font-bold text-white transition-transform duration-300 group-hover:-translate-y-1 group-focus:-translate-y-1">
                    {hobby.title}
                  </h3>
                  {hobby.description && (
                    <p className="max-h-0 overflow-hidden text-sm text-white/80 opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100 group-focus:max-h-20 group-focus:opacity-100">
                      {hobby.description}
                    </p>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
