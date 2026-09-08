'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';
import { SystemNode } from '@/components/ui/SystemNode';

const systemNodes = [
  {
    label: 'Web',
    description: 'Sites modernes conçus pour votre activité.',
    position: { left: '50%', top: '8%' },
    href: '/solutions/site-web',
  },
  {
    label: 'IA',
    description: 'Intelligence intégrée directement à vos processus.',
    position: { left: '77%', top: '18%' },
  },
  {
    label: 'Assistants IA',
    description: 'Assistants personnalisés pour répondre, guider et agir.',
    position: { left: '88%', top: '44%' },
  },
  {
    label: 'WhatsApp IA',
    description: 'Votre assistant IA directement dans WhatsApp.',
    position: { left: '77%', top: '74%' },
  },
  {
    label: 'Automatisation',
    description: 'Automatisez les tâches répétitives et les flux métier.',
    position: { left: '50%', top: '88%' },
  },
  {
    label: 'Agents IA',
    description: 'Des agents capables d’exécuter des missions en autonomie.',
    position: { left: '23%', top: '74%' },
  },
  {
    label: 'Intégrations',
    description: 'Connectez vos outils et vos données.',
    position: { left: '12%', top: '44%' },
  },
  {
    label: 'Outils métier',
    description: 'Des interfaces et systèmes adaptés à vos opérations.',
    position: { left: '23%', top: '18%' },
  },
];

export function SolutionsSystem() {
  const [active, setActive] = useState('IA');

  const activeDetails =
    systemNodes.find((item) => item.label === active) ?? systemNodes[1];

  return (
    <section id="systems" aria-label="Solutions système">
      <SectionShell className="py-10 sm:py-12 lg:py-16">
        {/* SECTION INTRO */}
        <div className="mx-auto max-w-[760px] text-center">
          <SectionLabel>Solutions</SectionLabel>

          <h2 className="mt-4 font-[family-name:var(--font-sora)] text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#F4F7FA] sm:mt-5 sm:text-[clamp(2.3rem,5vw,3.25rem)]">
            Des solutions qui s’assemblent en système.
          </h2>
        </div>

        <div className="mt-7 sm:mt-8 lg:mt-10">
          {/* DESKTOP / TABLET */}
          <div className="relative mx-auto hidden h-[430px] w-full max-w-[820px] md:block lg:h-[460px]">
            <svg
              aria-hidden="true"
              viewBox="0 0 820 560"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="systemOrbit"
                  x1="0%"
                  x2="100%"
                  y1="0%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor="rgba(124,199,255,0)"
                  />
                  <stop
                    offset="35%"
                    stopColor="rgba(124,199,255,0.82)"
                  />
                  <stop
                    offset="58%"
                    stopColor="rgba(147,167,255,0.75)"
                  />
                  <stop
                    offset="100%"
                    stopColor="rgba(124,199,255,0)"
                  />
                </linearGradient>
              </defs>

              {/* Orbital rings */}
              <circle
                cx="410"
                cy="280"
                r="170"
                fill="none"
                stroke="rgba(124,199,255,0.11)"
                strokeWidth="1.2"
              />

              <circle
                cx="410"
                cy="280"
                r="240"
                fill="none"
                stroke="rgba(124,199,255,0.07)"
                strokeWidth="1"
              />

              {/* Base connections */}
              <path
                d="M 410 280 L 410 106"
                stroke="rgba(124,199,255,0.26)"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              <path
                d="M 410 280 L 604 184"
                stroke="rgba(124,199,255,0.23)"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              <path
                d="M 410 280 L 672 280"
                stroke="rgba(124,199,255,0.28)"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              <path
                d="M 410 280 L 604 376"
                stroke="rgba(124,199,255,0.23)"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              <path
                d="M 410 280 L 410 454"
                stroke="rgba(124,199,255,0.26)"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              <path
                d="M 410 280 L 216 376"
                stroke="rgba(124,199,255,0.23)"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              <path
                d="M 410 280 L 148 280"
                stroke="rgba(124,199,255,0.28)"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              <path
                d="M 410 280 L 216 184"
                stroke="rgba(124,199,255,0.23)"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Active connections */}
              <path
                d="M 410 280 L 410 106"
                stroke={
                  active === 'Web'
                    ? 'rgba(124,199,255,0.92)'
                    : 'rgba(124,199,255,0.15)'
                }
                strokeWidth={active === 'Web' ? 2.2 : 1.1}
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 220ms ease-out' }}
              />

              <path
                d="M 410 280 L 604 184"
                stroke={
                  active === 'IA'
                    ? 'rgba(124,199,255,0.92)'
                    : 'rgba(124,199,255,0.15)'
                }
                strokeWidth={active === 'IA' ? 2.2 : 1.1}
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 220ms ease-out' }}
              />

              <path
                d="M 410 280 L 672 280"
                stroke={
                  active === 'Assistants IA'
                    ? 'rgba(124,199,255,0.92)'
                    : 'rgba(124,199,255,0.15)'
                }
                strokeWidth={active === 'Assistants IA' ? 2.2 : 1.1}
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 220ms ease-out' }}
              />

              <path
                d="M 410 280 L 604 376"
                stroke={
                  active === 'WhatsApp IA'
                    ? 'rgba(124,199,255,0.92)'
                    : 'rgba(124,199,255,0.15)'
                }
                strokeWidth={active === 'WhatsApp IA' ? 2.2 : 1.1}
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 220ms ease-out' }}
              />

              <path
                d="M 410 280 L 410 454"
                stroke={
                  active === 'Automatisation'
                    ? 'rgba(124,199,255,0.92)'
                    : 'rgba(124,199,255,0.15)'
                }
                strokeWidth={active === 'Automatisation' ? 2.2 : 1.1}
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 220ms ease-out' }}
              />

              <path
                d="M 410 280 L 216 376"
                stroke={
                  active === 'Agents IA'
                    ? 'rgba(124,199,255,0.92)'
                    : 'rgba(124,199,255,0.15)'
                }
                strokeWidth={active === 'Agents IA' ? 2.2 : 1.1}
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 220ms ease-out' }}
              />

              <path
                d="M 410 280 L 148 280"
                stroke={
                  active === 'Intégrations'
                    ? 'rgba(124,199,255,0.92)'
                    : 'rgba(124,199,255,0.15)'
                }
                strokeWidth={active === 'Intégrations' ? 2.2 : 1.1}
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 220ms ease-out' }}
              />

              <path
                d="M 410 280 L 216 184"
                stroke={
                  active === 'Outils métier'
                    ? 'rgba(124,199,255,0.92)'
                    : 'rgba(124,199,255,0.15)'
                }
                strokeWidth={active === 'Outils métier' ? 2.2 : 1.1}
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 220ms ease-out' }}
              />
            </svg>

            {/* Central system */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#2A333C] bg-[#10161D]/95 text-center shadow-[0_0_0_1px_rgba(42,51,60,0.2),0_20px_60px_rgba(18,28,38,0.72)] transition-transform duration-200 ease-out hover:scale-[1.02] sm:h-32 sm:w-32">
                <div className="px-2">
                  <div className="text-[0.52rem] uppercase tracking-[0.18em] text-[#8E98A3] sm:text-[0.56rem] sm:tracking-[0.2em]">
                    Core
                  </div>

                  <div className="mt-2 font-[family-name:var(--font-sora)] text-[0.7rem] font-medium leading-4 text-[#F4F7FA] sm:mt-3 sm:text-[0.8rem]">
                    Système intelligent
                  </div>
                </div>
              </div>
            </div>

            {/* Nodes */}
            {systemNodes.map(({ label, position, href }) => (
              <div
                key={label}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={position}
              >
                {href ? (
                  <Link
                    href={href}
                    aria-label={`Découvrir ${label}`}
                    onMouseEnter={() => setActive(label)}
                    onFocus={() => setActive(label)}
                    className="block min-h-11 transition-all duration-200 ease-out"
                  >
                    <SystemNode
                      label={label}
                      className={[
                        'bg-[#10161D]/90',
                        active === label
                          ? 'border-[#7CC7FF] text-[#F4F7FA] shadow-[0_0_16px_rgba(124,199,255,0.12)]'
                          : 'text-[#CDD5DD] opacity-90',
                      ].join(' ')}
                    />
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-pressed={active === label}
                    onMouseEnter={() => setActive(label)}
                    onFocus={() => setActive(label)}
                    onClick={() => setActive(label)}
                    className="min-h-11 transition-all duration-200 ease-out"
                  >
                    <SystemNode
                      label={label}
                      className={[
                        'bg-[#10161D]/90',
                        active === label
                          ? 'border-[#7CC7FF] text-[#F4F7FA] shadow-[0_0_16px_rgba(124,199,255,0.12)]'
                          : 'text-[#CDD5DD] opacity-90',
                      ].join(' ')}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ACTIVE STATE — DESKTOP */}
          <div className="mx-auto mt-3 hidden max-w-[540px] rounded-[0.875rem] border border-[#2A333C]/80 bg-[#10161D]/75 px-3 py-2 text-left md:block">
            <div className="text-[0.56rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
              État actif
            </div>

            <div className="mt-1.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-[family-name:var(--font-sora)] text-[0.95rem] font-medium text-[#F4F7FA]">
                  {activeDetails.label}
                </div>

                <div className="mt-0.5 text-[0.8rem] leading-5 text-[#CDD5DD]">
                  {activeDetails.description}
                </div>
              </div>

              <span
                className="hidden h-2 w-2 flex-shrink-0 rounded-full bg-[#7CC7FF] shadow-[0_0_16px_rgba(124,199,255,0.7)] sm:inline-block"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* MOBILE */}
          <div className="relative space-y-4 md:hidden">
            {/* Core */}
            <div className="mx-auto flex justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#2A333C] bg-[#0F171D] text-center shadow-[0_0_0_1px_rgba(42,51,60,0.2),0_14px_40px_rgba(18,28,38,0.55)]">
                <div>
                  <div className="text-[0.5rem] uppercase tracking-[0.18em] text-[#8E98A3]">
                    Core
                  </div>

                  <div className="mt-2 font-[family-name:var(--font-sora)] text-[0.64rem] font-medium leading-4 text-[#F4F7FA]">
                    Système intelligent
                  </div>
                </div>

                <span
                  className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#7CC7FF] shadow-[0_0_14px_rgba(124,199,255,0.8)]"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Active state */}
            <div className="rounded-[1rem] border border-[#2A333C]/80 bg-[#10161D]/75 px-3.5 py-3">
              <div className="text-[0.55rem] font-medium uppercase tracking-[0.16em] text-[#8E98A3]">
                État actif
              </div>

              <div className="mt-1 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-[family-name:var(--font-sora)] text-sm font-medium text-[#F4F7FA]">
                    {activeDetails.label}
                  </div>

                  <div className="mt-1 text-xs leading-5 text-[#CDD5DD]">
                    {activeDetails.description}
                  </div>
                </div>

                <span
                  className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#7CC7FF] shadow-[0_0_14px_rgba(124,199,255,0.7)]"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Solution list */}
            <div className="space-y-2">
              {systemNodes.map(({ label, description, href }) => {
                const isActive = active === label;

                const content = (
                  <>
                    <div className="flex min-h-7 items-center justify-between gap-3">
                      <span
                        className={[
                          'text-[0.65rem] font-medium uppercase tracking-[0.14em]',
                          isActive ? 'text-[#F4F7FA]' : 'text-[#CDD5DD]',
                        ].join(' ')}
                      >
                        {label}
                      </span>

                      <span
                        className={[
                          'h-1.5 w-1.5 flex-shrink-0 rounded-full transition-all duration-200',
                          isActive
                            ? 'bg-[#7CC7FF] shadow-[0_0_10px_rgba(124,199,255,0.8)]'
                            : 'bg-[#56616C]',
                        ].join(' ')}
                        aria-hidden="true"
                      />
                    </div>

                    <div
                      className={[
                        'mt-1.5 text-xs leading-5 transition-colors duration-200',
                        isActive ? 'text-[#CDD5DD]' : 'text-[#8E98A3]',
                      ].join(' ')}
                    >
                      {description}
                    </div>
                  </>
                );

                const classes = [
                  'block w-full rounded-[0.9rem] border px-3.5 py-3 text-left transition-all duration-200',
                  isActive
                    ? 'border-[#7CC7FF] bg-[#10161D] shadow-[0_0_18px_rgba(124,199,255,0.08)]'
                    : 'border-[#2A333C] bg-[#0F171D]',
                ].join(' ');

                if (href) {
                  return (
                    <Link
                      key={label}
                      href={href}
                      aria-label={`Découvrir ${label}`}
                      onFocus={() => setActive(label)}
                      className={classes}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActive(label)}
                    className={classes}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}