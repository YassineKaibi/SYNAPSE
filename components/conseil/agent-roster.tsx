'use client'

import { motion } from 'framer-motion'
import type { Agent } from '@/lib/types'
import { cn } from '@/lib/utils'
import { AgentAvatar } from '@/components/agents/agent-sigil'

interface AgentRosterProps {
  agents: Agent[]
  activeAgentId?: string
  speakingAgentId?: string
  disagreementAgentIds?: string[]
  onAgentClick?: (agent: Agent) => void
}

export function AgentRoster({ 
  agents, 
  activeAgentId, 
  speakingAgentId,
  disagreementAgentIds = [],
  onAgentClick 
}: AgentRosterProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
        Le Conseil
      </h3>
      <div className="space-y-1">
        {agents.map((agent, index) => (
          <motion.button
            key={agent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onAgentClick?.(agent)}
            className={cn(
              'w-full flex items-center gap-3 p-2 rounded-lg transition-all',
              'hover:bg-secondary group text-left',
              activeAgentId === agent.id && 'bg-secondary',
              speakingAgentId === agent.id && 'ring-2 ring-primary/50'
            )}
          >
            <div className="relative">
              <AgentAvatar
                role={agent.role}
                size="sm"
                name={agent.name}
                speaking={speakingAgentId === agent.id}
                disagreeing={disagreementAgentIds.includes(agent.id)}
                voiceStyle={agent.voiceStyle}
              />
              {speakingAgentId === agent.id && (
                <motion.div
                  className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm font-medium truncate',
                activeAgentId === agent.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
              )}>
                {agent.name}
              </p>
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                {agent.personality}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {getAgentStatus(agent.role)}
              </p>
              <div className="mt-1 hidden flex-wrap gap-1 group-hover:flex">
                {agent.expertise.slice(0, 3).map((item) => (
                  <span
                    key={`${agent.id}-${item}`}
                    className="rounded-full border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function getAgentStatus(role: Agent['role']): string {
  const statuses: Record<Agent['role'], string> = {
    architecte: 'Garde-fou technique',
    product_owner: 'Voix de l\'utilisateur',
    avocat_diable: 'Chasseur d\'angles morts',
    coach_carriere: 'Lecteur de trajectoire',
    scribe: 'Memoire du PFE',
  }
  return statuses[role]
}
