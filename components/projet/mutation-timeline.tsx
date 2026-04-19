'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { DisagreementMarker, ProjectMutation } from '@/lib/types'
import { cn } from '@/lib/utils'
import { agents, gameMasterDecisions } from '@/lib/data/mock-data'
import { AgentSigil } from '@/components/agents/agent-sigil'
import { 
  Plus, 
  Minus, 
  TrendingUp, 
  Target, 
  GitBranch,
  Circle,
  Lock,
  Zap,
  ArrowRightLeft,
  CheckCircle2,
} from 'lucide-react'

interface MutationTimelineProps {
  mutations: ProjectMutation[]
  disagreements?: DisagreementMarker[]
  maxItems?: number
  showLock?: boolean
}

const typeConfig: Record<ProjectMutation['type'], {
  icon: React.ReactNode
  color: string
  label: string
}> = {
  skill_added: {
    icon: <Plus className="w-3 h-3" />,
    color: 'text-primary',
    label: 'Competence ajoutee',
  },
  skill_removed: {
    icon: <Minus className="w-3 h-3" />,
    color: 'text-destructive',
    label: 'Competence retiree',
  },
  level_change: {
    icon: <TrendingUp className="w-3 h-3" />,
    color: 'text-primary',
    label: 'Progression',
  },
  goal_updated: {
    icon: <Target className="w-3 h-3" />,
    color: 'text-agent-zephyr',
    label: 'Objectif mis a jour',
  },
  pathway_shift: {
    icon: <GitBranch className="w-3 h-3" />,
    color: 'text-agent-artemis',
    label: 'Parcours modifié',
  },
  brief_selected: {
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: 'text-signal-green',
    label: 'Brief sélectionné',
  },
  phase_transition: {
    icon: <ArrowRightLeft className="w-3 h-3" />,
    color: 'text-signal-blue',
    label: 'Transition de phase',
  },
  gm_intervention: {
    icon: <Zap className="w-3 h-3" />,
    color: 'text-signal-orange',
    label: 'Intervention Game Master',
  },
}

const impactSize = {
  minor: 'w-2 h-2',
  moderate: 'w-3 h-3',
  major: 'w-4 h-4',
}

export function MutationTimeline({ mutations, disagreements = [], maxItems, showLock = false }: MutationTimelineProps) {
  const displayMutations = maxItems ? mutations.slice(0, maxItems) : mutations

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-4">
        {disagreements
          .filter((item) => item.gameMasterNote)
          .map((item, index) => {
            const gmDecision = gameMasterDecisions.find(
              (decision) => decision.relatedDisagreement === item.id
            )
            return (
              <motion.div
                key={`dis-${item.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative flex gap-4 pl-8"
              >
                <div className="absolute left-2 top-1 rounded-full bg-signal-orange w-3 h-3" />
                <div className="flex-1 rounded-lg border border-signal-orange/30 bg-signal-orange/10 p-3">
                  <p className="text-xs font-medium text-foreground">{item.topic}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{item.gameMasterNote}</p>
                  {gmDecision && (
                    <Link href={`/gamemaster#${gmDecision.id}`} className="inline-flex mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-signal-orange/40 text-signal-orange">
                        Decision GM
                      </span>
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}

        {displayMutations.map((mutation, index) => {
          const config = typeConfig[mutation.type]
          const agent = mutation.agentId 
            ? agents.find(a => a.id === mutation.agentId) 
            : null

          return (
            <motion.div
              key={mutation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4 pl-8"
            >
              {/* Timeline node */}
              <div className={cn(
                'absolute left-2 top-1 rounded-full bg-background border-2 border-border flex items-center justify-center',
                impactSize[mutation.impact],
                mutation.impact === 'major' && 'border-primary'
              )}>
                {mutation.impact === 'major' && (
                  <Circle className="w-1.5 h-1.5 fill-primary text-primary" />
                )}
              </div>

              {/* Content */}
              <div className={cn(
                'flex-1 p-3 rounded-lg bg-card border border-border/50',
                'hover:border-border transition-colors',
                showLock && mutation.immutable && 'bg-primary/5'
              )}>
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn(
                    'shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center',
                    config.color
                  )}>
                    {config.icon}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('text-xs font-medium', config.color)}>
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(mutation.timestamp)}
                      </span>
                      {showLock && mutation.immutable && (
                        <Lock className="w-2.5 h-2.5 text-muted-foreground/60" />
                      )}
                    </div>
                    <p className="text-sm text-foreground mt-1">
                      {mutation.description}
                    </p>
                    
                    {/* Agent attribution */}
                    {agent && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <AgentSigil
                          role={agent.role}
                          size="sm"
                          animated={false}
                          voiceStyle={agent.voiceStyle}
                          ariaLabel={`Sigil de ${agent.name}`}
                        />
                        <span>Suggere par {agent.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* "Load more" indicator */}
      {maxItems && mutations.length > maxItems && (
        <div className="relative pl-8 pt-4">
          <div className="absolute left-2 top-4 w-4 h-4 rounded-full bg-background border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
            <span className="text-[8px] text-muted-foreground">+{mutations.length - maxItems}</span>
          </div>
          <button className="text-xs text-primary hover:underline">
            Voir toutes les mutations
          </button>
        </div>
      )}
    </div>
  )
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine(s)`
  
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
}
