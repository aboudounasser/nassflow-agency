"use client";

import { useState } from 'react';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';
import { SystemNode } from '@/components/ui/SystemNode';
import { SurfacePanel } from '@/components/ui/SurfacePanel';

function DemoPanel({ active }: { active: string }) {
  return (
    <div className="space-y-4">
      {active === 'ASSISTANT' && (
        <SurfacePanel className="p-4">
          <div className="text-sm text-[#8E98A3]">Assistant IA</div>
          <div className="mt-3 rounded bg-[#0A0D12] p-3 text-sm text-[#CDD5DD]">
            <div className="mb-2 text-xs text-[#8E98A3]">Conversation</div>
            <div className="space-y-2">
              <div className="rounded-xl bg-[#0F171D] border border-[#2A333C] p-3">
                <div className="text-sm text-[#CDD5DD]">Client — « Je voudrais connaître vos disponibilités pour la semaine prochaine. »</div>
              </div>
              <div className="ml-8 rounded-xl bg-[#07101A] border border-[#23465E] p-3 shadow-[0_6px_18px_rgba(7,16,26,0.6)]">
                <div className="text-sm text-[#DFF4FF]">Assistant — Je peux vérifier les créneaux disponibles et vous proposer les meilleurs horaires.</div>
              </div>
            </div>
          </div>
        </SurfacePanel>
      )}

      {active === 'WHATSAPP' && (
        <SurfacePanel className="p-4">
          <div className="text-sm text-[#8E98A3]">WhatsApp IA</div>
          <div className="mt-3 rounded bg-[#0A0D12] p-3 text-sm text-[#CDD5DD]">
            <div className="mb-2 text-xs text-[#8E98A3]">Discussion</div>
            <div className="space-y-2">
              <div className="rounded-xl bg-[#0F171D] border border-[#2A333C] p-3">Client: « Est-ce que ma commande est prête ? »</div>
              <div className="rounded-xl bg-[#07101A] border border-[#23465E] p-3 text-[#DFF4FF]">IA: Vérification — préparation lancée, CRM mis à jour.</div>
              <div className="mt-2 text-xs text-[#8E98A3]">Action déclenchée: mise à jour CRM • notification équipe</div>
            </div>
          </div>
        </SurfacePanel>
      )}

      {active === 'AUTOMATION' && (
        <SurfacePanel className="p-4">
          <div className="text-sm text-[#8E98A3]">Automation</div>
          <div className="mt-3 rounded bg-[#0A0D12] p-3 text-sm text-[#CDD5DD]">
            <div className="text-xs text-[#8E98A3]">Workflow</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#7CC7FF]" />
                <div>Nouveau contact</div>
              </div>
              <div className="text-[#8E98A3]">→</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#7CC7FF]" />
                <div>Qualification</div>
              </div>
              <div className="text-[#8E98A3]">→</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#7CC7FF]" />
                <div>CRM</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-[#8E98A3]">Notification équipe • Suivi automatique</div>
          </div>
        </SurfacePanel>
      )}

      {active === 'AGENT' && (
        <SurfacePanel className="p-4">
          <div className="text-sm text-[#8E98A3]">Agent IA</div>
          <div className="mt-3 rounded bg-[#0A0D12] p-3 text-sm text-[#CDD5DD]">
            <div className="text-xs text-[#8E98A3]">Mission</div>
            <ol className="mt-2 list-decimal list-inside space-y-2">
              <li>Mission reçue</li>
              <li>Analyse des données</li>
              <li>Exécution d’étapes</li>
              <li>Vérification</li>
              <li>Terminé — rapport envoyé</li>
            </ol>
          </div>
        </SurfacePanel>
      )}

      {active === 'DEFAULT' && (
        <SurfacePanel className="p-4">
          <div className="text-sm text-[#8E98A3]">Aperçu</div>
          <div className="mt-2 rounded bg-[#0A0D12] p-3 text-sm text-[#CDD5DD]">Un site, une IA, WhatsApp et vos outils métier peuvent fonctionner ensemble dans un même système.</div>
        </SurfacePanel>
      )}
    </div>
  );
}

export function SystemInActionSection() {
  const [active, setActive] = useState('DEFAULT');

  const activeClass = (key: string) => (active === key ? 'ring-[4px] ring-[#7CC7FF]/15 shadow-[0_6px_18px_rgba(124,199,255,0.06)]' : '');

  return (
    <section id="system-action" aria-label="Système en action">
      <SectionShell className="py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-[980px] text-center">
          <SectionLabel>SYSTÈME EN ACTION</SectionLabel>
          <h2 className="mt-4 font-[family-name:var(--font-sora)] text-[clamp(1.9rem,3vw,2.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[#F4F7FA]">
            Voyez le système en action.
          </h2>
          <p className="mt-3 max-w-[720px] mx-auto text-sm text-[#CDD5DD]">Un site, une IA, WhatsApp et vos outils métier peuvent fonctionner ensemble dans un même système.</p>
        </div>

        <div className="mt-4 grid gap-6 lg:mt-6 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="relative flex items-center justify-center">
            <div className="hidden md:block">
              <div className="relative h-[300px] w-[520px]">
                <svg viewBox="0 0 540 360" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="flowB" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="rgba(124,199,255,0)" />
                      <stop offset="40%" stopColor="rgba(124,199,255,0.9)" />
                      <stop offset="70%" stopColor="rgba(147,167,255,0.78)" />
                      <stop offset="100%" stopColor="rgba(124,199,255,0)" />
                    </linearGradient>
                  </defs>

                  {/* compact flows between nodes */}
                  <path d="M270 70 L270 120 L370 120" fill="none" stroke="url(#flowB)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ opacity: active === 'ASSISTANT' || active === 'DEFAULT' ? 1 : 0.35 }} />
                  <path d="M370 120 L420 160 L420 220" fill="none" stroke="url(#flowB)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ opacity: active === 'WHATSAPP' ? 1 : 0.35 }} />
                  <path d="M270 210 L270 260 L200 260" fill="none" stroke="url(#flowB)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ opacity: active === 'AUTOMATION' ? 1 : 0.35 }} />
                  <path d="M200 260 L160 220 L160 180" fill="none" stroke="url(#flowB)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ opacity: active === 'AGENT' ? 1 : 0.35 }} />
                  <path d="M270 120 L270 210" fill="none" stroke="url(#flowB)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ opacity: active === 'DEFAULT' ? 0.9 : 0.45 }} />
                </svg>

                <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
                  <div className={`flex h-16 w-40 items-center justify-center rounded-full border border-[#2A333C] bg-[#0F171D] text-center ${activeClass('DEFAULT')}`}>
                    <div>
                      <div className="text-[0.56rem] uppercase tracking-[0.18em] text-[#8E98A3]">Hub</div>
                      <div className="mt-1 font-[family-name:var(--font-sora)] text-sm font-medium text-[#F4F7FA]">NASSFLOW</div>
                    </div>
                  </div>
                </div>

                {/* clustered nodes around hub (closer) */}
                <div className="absolute left-[50%] top-[6%] -translate-x-1/2 -translate-y-1/2">
                  <div onClick={() => setActive('ASSISTANT')} className="cursor-pointer">
                    <SystemNode label="SITE" className={active === 'ASSISTANT' ? 'bg-[#0F171D] ' + activeClass('ASSISTANT') : 'bg-[#10161D]'} />
                  </div>
                </div>

                <div className="absolute left-[75%] top-[27%] -translate-x-1/2 -translate-y-1/2">
                  <div onClick={() => setActive('ASSISTANT')} className="cursor-pointer">
                    <SystemNode label="IA" className={active === 'ASSISTANT' ? activeClass('ASSISTANT') : ''} />
                  </div>
                </div>

                <div className="absolute left-[82%] top-[55%] -translate-x-1/2 -translate-y-1/2">
                  <div onClick={() => setActive('WHATSAPP')} className="cursor-pointer">
                    <SystemNode label="WHATSAPP" className={active === 'WHATSAPP' ? activeClass('WHATSAPP') : ''} />
                  </div>
                </div>

                <div className="absolute left-[50%] top-[80%] -translate-x-1/2 -translate-y-1/2">
                  <div onClick={() => setActive('AUTOMATION')} className="cursor-pointer">
                    <SystemNode label="AUTOMATION" className={active === 'AUTOMATION' ? activeClass('AUTOMATION') : ''} />
                  </div>
                </div>

                <div className="absolute left-[18%] top-[55%] -translate-x-1/2 -translate-y-1/2">
                  <div onClick={() => setActive('AGENT')} className="cursor-pointer">
                    <SystemNode label="AGENT" className={active === 'AGENT' ? activeClass('AGENT') : ''} />
                  </div>
                </div>

                {/* secondary nodes compacted */}
                <div className="absolute left-[8%] top-[50%] -translate-x-1/2 -translate-y-1/2"><SystemNode label="CRM" /></div>
                <div className="absolute left-[92%] top-[50%] -translate-x-1/2 -translate-y-1/2"><SystemNode label="OUTILS" /></div>
                <div className="absolute left-[34%] top-[8%] -translate-x-1/2 -translate-y-1/2"><SystemNode label="DONNÉES" /></div>
                <div className="absolute left-[66%] top-[8%] -translate-x-1/2 -translate-y-1/2"><SystemNode label="PROCESS" /></div>
                <div className="absolute left-[50%] top-[96%] -translate-x-1/2 -translate-y-1/2"><SystemNode label="OPÉRATIONS" /></div>
              </div>
            </div>

            {/* mobile simplified stacked flow */}
            <div className="md:hidden w-full">
              <div className="flex justify-center">
                <div className="flex h-16 w-36 items-center justify-center rounded-full border border-[#2A333C] bg-[#0F171D]">
                  <div>
                    <div className="text-[0.52rem] uppercase tracking-[0.18em] text-[#8E98A3]">Hub</div>
                    <div className="mt-1 font-[family-name:var(--font-sora)] text-xs font-medium text-[#F4F7FA]">NASSFLOW</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="w-full max-w-[320px]">
                  <SystemNode label="SITE" />
                </div>
                <div className="w-full max-w-[320px]">
                  <SystemNode label="IA" />
                </div>
                <div className="w-full max-w-[320px]">
                  <SystemNode label="WHATSAPP" />
                </div>
                <div className="w-full max-w-[320px]">
                  <SystemNode label="AUTOMATION" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <DemoPanel active={active} />

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => setActive('ASSISTANT')} className="rounded-full border border-[#2A333C] bg-[#10161D] px-3 py-2 text-xs text-[#CDD5DD]">Assistant IA</button>
              <button onClick={() => setActive('WHATSAPP')} className="rounded-full border border-[#2A333C] bg-[#10161D] px-3 py-2 text-xs text-[#CDD5DD]">WhatsApp IA</button>
              <button onClick={() => setActive('AUTOMATION')} className="rounded-full border border-[#2A333C] bg-[#10161D] px-3 py-2 text-xs text-[#CDD5DD]">Automation</button>
              <button onClick={() => setActive('AGENT')} className="rounded-full border border-[#2A333C] bg-[#10161D] px-3 py-2 text-xs text-[#CDD5DD]">Agent IA</button>
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
