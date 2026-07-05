import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

export function CTA() {
  const t = useTranslations('pages.Home.cta')

  return (
    <section className="relative px-6 py-24 overflow-hidden bg-canvas/30 border-t border-border/50">
      
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.07] pointer-events-none" />

      {/* Decorative Glowing Radial Blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 -z-10 h-[350px] w-[350px] rounded-full bg-accent/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 -z-10 h-[350px] w-[350px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl rounded-3xl border border-border/80 bg-surface/75 backdrop-blur-md p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden">
        
        {/* Mesh gradient light highlight */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/5 blur-[80px]" />
        
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          
          {/* Left Column (Meta text) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left relative z-10">
            <Reveal>
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                {t('eyebrow')}
              </p>
            </Reveal>
            
            <Reveal delay={100}>
              <h2 className="mb-4 text-3xl font-extrabold text-ink sm:text-4xl tracking-tight leading-tight">
                {t('title')}
              </h2>
            </Reveal>
            
            <Reveal delay={200}>
              <p className="mb-8 text-sm sm:text-base text-muted leading-relaxed max-w-md">
                {t('description')}
              </p>
            </Reveal>
            
            <Reveal delay={300}>
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-accent/10 hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <span>{t('button')}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </Reveal>
          </div>

          {/* Right Column (Developer Telemetry Status Board) */}
          <div className="lg:col-span-5 w-full relative z-10">
            <Reveal delay={200}>
              <div className="w-full rounded-xl border border-border/60 bg-canvas/50 backdrop-blur-sm p-6 font-mono text-[10px] select-none text-muted shadow-inner">
                {/* Header macOS Dots */}
                <div className="flex items-center gap-1.5 border-b border-border/40 pb-3 mb-4">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F56]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#FFBD2E]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#27C93F]"></span>
                  <span className="ml-2 text-[9px] text-muted/65">telemetry_status.sh</span>
                </div>

                {/* Status details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>SYSTEM_STATUS:</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      ONLINE & AVAILABLE
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>RESPONSE_TIME:</span>
                    <span className="text-ink font-semibold">{"< 24 HOURS"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>LOCATION:</span>
                    <span className="text-ink font-semibold">JAKARTA (UTC+7)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>COMM_CHANNEL:</span>
                    <span className="text-accent font-semibold">ENCRYPTED HTTPS</span>
                  </div>
                  
                  <div className="border-t border-border/45 pt-3 flex flex-col gap-1.5">
                    <span>STACK_PREFERENCE:</span>
                    <span className="text-ink text-[9px] leading-relaxed">
                      [Next.js, Payload CMS, AI Agents, Python]
                    </span>
                  </div>
                </div>

                {/* Blinking input prompt */}
                <div className="mt-4 pt-3 border-t border-border/45 text-ink flex items-center gap-1">
                  <span className="text-accent">hi@personal-web:~$</span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}
