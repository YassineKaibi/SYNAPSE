'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { pfeTimeline } from '@/lib/data/mock-data'
import type { PFEPhase, PFEMilestone } from '@/lib/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const PHASES: { id: PFEPhase; label: string; short: string }[] = [
  { id: 'diagnostic', label: 'Diagnostic', short: 'Diag.' },
  { id: 'brief_selection', label: 'Sélection', short: 'Brief' },
  { id: 'planning', label: 'Planification', short: 'Plan.' },
  { id: 'execution', label: 'Exécution', short: 'Exec.' },
  { id: 'review', label: 'Revue', short: 'Revue' },
  { id: 'defense', label: 'Soutenance', short: 'Sout.' },
]

const PHASE_ORDER: PFEPhase[] = [
  'diagnostic',
  'brief_selection',
  'planning',
  'execution',
  'review',
  'defense',
]

function getMilestoneForPhase(phase: PFEPhase): PFEMilestone | undefined {
  return pfeTimeline.milestones.find((m) => m.phase === phase)
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

interface PhaseStepperProps {
  /** compact = thin strip, full = larger with labels */
  variant?: 'compact' | 'full'
  className?: string
}

export function PhaseStepper({ variant = 'compact', className }: PhaseStepperProps) {
  const currentPhaseIndex = PHASE_ORDER.indexOf(pfeTimeline.currentPhase)

  return (
    <TooltipProvider delayDuration={100}>
      <div className={cn('flex items-center gap-0', className)}>
        {PHASES.map((phase, idx) => {
          const isPast = idx < currentPhaseIndex
          const isCurrent = idx === currentPhaseIndex
          const isFuture = idx > currentPhaseIndex
          const milestone = getMilestoneForPhase(phase.id)

          return (
            <div key={phase.id} className="flex items-center flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    {/* Connector line before dot */}
                    <div className="flex items-center w-full">
                      {idx > 0 && (
                        <div
                          className={cn(
                            'flex-1 h-px transition-colors',
                            isPast || isCurrent
                              ? 'bg-signal-green'
                              : 'bg-border'
                          )}
                        />
                      )}

                      {/* Phase dot */}
                      <div className="relative shrink-0">
                        {isCurrent ? (
                          <motion.div
                            className="w-3 h-3 rounded-full bg-signal-green"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ) : (
                          <div
                            className={cn(
                              'w-2.5 h-2.5 rounded-full border transition-colors',
                              isPast
                                ? 'bg-signal-green border-signal-green'
                                : 'bg-transparent border-border'
                            )}
                          />
                        )}
                      </div>

                      {/* Connector line after dot */}
                      {idx < PHASES.length - 1 && (
                        <div
                          className={cn(
                            'flex-1 h-px transition-colors',
                            isPast ? 'bg-signal-green' : 'bg-border'
                          )}
                        />
                      )}
                    </div>

                    {/* Label + date (only in full variant) */}
                    {variant === 'full' && (
                      <div className="text-center w-full px-1">
                        <span
                          className={cn(
                            'block text-[10px] font-medium leading-tight truncate',
                            isCurrent
                              ? 'text-signal-green'
                              : isPast
                              ? 'text-foreground/70'
                              : 'text-muted-foreground/50'
                          )}
                        >
                          {phase.short}
                        </span>
                        {milestone && (
                          <span className="block text-[9px] text-muted-foreground/40 leading-tight">
                            {formatShortDate(milestone.dueDate)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p className="font-medium text-sm">{phase.label}</p>
                  {milestone && (
                    <div className="mt-1 space-y-0.5">
                      <p className="text-xs text-muted-foreground">
                        Échéance: {formatShortDate(milestone.dueDate)}
                      </p>
                      {milestone.deliverables.map((d, i) => (
                        <p key={i} className="text-xs text-muted-foreground">
                          · {d}
                        </p>
                      ))}
                    </div>
                  )}
                  {isCurrent && (
                    <p className="text-xs text-signal-green mt-1 font-medium">Phase actuelle</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
