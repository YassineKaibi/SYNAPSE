'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { AgentMessage, Agent, DisagreementMarker } from '@/lib/types'
import { cn } from '@/lib/utils'
import { AgentAvatar } from '@/components/agents/agent-sigil'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { skillNodes, agents as allAgents } from '@/lib/data/mock-data'
import { AlertTriangle, Zap } from 'lucide-react'

interface MessageBubbleProps {
  message: AgentMessage
  agent: Agent
  isLatest?: boolean
  useTypewriter?: boolean
  onTypingComplete?: () => void
}

const sentimentColors = {
  positive: 'border-l-primary',
  neutral: 'border-l-muted-foreground',
  negative: 'border-l-destructive',
  cautious: 'border-l-signal-orange',
}

const typeLabels: Record<string, string> = {
  opinion: 'Opinion',
  question: 'Question',
  suggestion: 'Suggestion',
  consensus: 'Consensus',
  disagreement: 'Desaccord',
  evidence: 'Evidence',
}

export function MessageBubble({ 
  message, 
  agent, 
  isLatest = false, 
  useTypewriter = false,
  onTypingComplete 
}: MessageBubbleProps) {
  const [displayedText, setDisplayedText] = useState(useTypewriter ? '' : message.content)
  const [isTyping, setIsTyping] = useState(useTypewriter)

  // Typewriter effect
  useEffect(() => {
    if (!useTypewriter) {
      setDisplayedText(message.content)
      return
    }

    setIsTyping(true)
    setDisplayedText('')
    let index = 0
    const interval = setInterval(() => {
      if (index < message.content.length) {
        setDisplayedText(message.content.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        onTypingComplete?.()
      }
    }, 40)

    return () => clearInterval(interval)
  }, [message.content, useTypewriter, onTypingComplete])

  const referencedSkillData = message.referencedSkills?.map(
    skillId => skillNodes.find(s => s.id === skillId)
  ).filter(Boolean)

  const timeAgo = getTimeAgo(message.timestamp)

  // Find disagreeing agent if this is a disagreement message
  const disagreeingWithAgent = message.disagreesWith 
    ? allAgents.find(a => a.id === message.disagreesWith)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'group relative',
        isLatest && !isTyping && 'animate-pulse-once'
      )}
    >
      <div className={cn(
        'flex gap-4 p-4 rounded-lg bg-card border border-border/50',
        'hover:border-border transition-colors',
        'border-l-4',
        message.sentiment && sentimentColors[message.sentiment],
        message.type === 'disagreement' && 'ring-1 ring-signal-orange/30'
      )}>
        {/* Agent Avatar */}
        <div className="shrink-0">
          <AgentAvatar
            role={agent.role}
            size="sm"
            name={agent.name}
            voiceStyle={agent.voiceStyle}
            disagreeing={Boolean(disagreeingWithAgent)}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm" style={{ color: agent.color }}>
              {agent.name}
            </span>
            <Badge 
              variant={message.type === 'disagreement' ? 'destructive' : 'outline'} 
              className="text-[10px] px-1.5 py-0"
            >
              {typeLabels[message.type] || message.type}
            </Badge>
            {message.confidence && (
              <span className="text-[10px] text-muted-foreground">
                {message.confidence}% confiance
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {timeAgo}
            </span>
          </div>

          {/* Disagreement indicator */}
          {disagreeingWithAgent && (
            <div className="flex items-center gap-2 text-xs text-signal-orange">
              <Zap className="w-3 h-3" />
              <span>
                En desaccord avec <strong style={{ color: disagreeingWithAgent.color }}>{disagreeingWithAgent.name}</strong>
              </span>
            </div>
          )}

          {/* Message Content with typewriter cursor */}
          <p className="text-sm text-foreground leading-relaxed">
            {displayedText}
            {isTyping && (
              <motion.span
                className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
          </p>

          {/* Referenced Skills */}
          {!isTyping && referencedSkillData && referencedSkillData.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-1.5 pt-1"
            >
              {referencedSkillData.map(skill => skill && (
                <Badge 
                  key={skill.id} 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0"
                >
                  {skill.name}
                </Badge>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Connection line to next message */}
      <div className="absolute left-8 top-full w-px h-4 bg-border/50 group-last:hidden" />
    </motion.div>
  )
}

// Disagreement surface component
export function DisagreementSurface({ disagreement }: { disagreement: DisagreementMarker }) {
  const agentA = allAgents.find(a => a.id === disagreement.agentA)
  const agentB = allAgents.find(a => a.id === disagreement.agentB)

  if (!agentA || !agentB) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 rounded-lg bg-signal-orange/10 border border-signal-orange/30"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-signal-orange" />
        <h4 className="font-medium text-sm">Desaccord actif: {disagreement.topic}</h4>
        <Badge 
          variant="outline" 
          className={cn(
            'text-[10px] ml-auto',
            disagreement.severity === 'fundamental' && 'border-destructive text-destructive',
            disagreement.severity === 'moderate' && 'border-signal-orange text-signal-orange',
            disagreement.severity === 'minor' && 'border-muted-foreground'
          )}
        >
          {disagreement.severity}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Agent A position */}
        <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AgentAvatar role={agentA.role} size="sm" name={agentA.name} voiceStyle={agentA.voiceStyle} />
              <span className="text-sm font-medium" style={{ color: agentA.color }}>
                {agentA.name}
              </span>
            </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {disagreement.positionA}
          </p>
        </div>

        {/* Agent B position */}
        <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AgentAvatar role={agentB.role} size="sm" name={agentB.name} voiceStyle={agentB.voiceStyle} />
              <span className="text-sm font-medium" style={{ color: agentB.color }}>
                {agentB.name}
              </span>
            </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {disagreement.positionB}
          </p>
        </div>
      </div>

      {disagreement.gameMasterNote && (
        <div className="mt-3 pt-3 border-t border-signal-orange/20">
          <p className="text-xs text-muted-foreground italic">
            Game Master: {disagreement.gameMasterNote}
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Button size="sm" variant="outline" className="text-xs">
          Demander arbitrage
        </Button>
        <Button size="sm" variant="ghost" className="text-xs">
          Voir historique
        </Button>
      </div>
    </motion.div>
  )
}

// Typing indicator for agents
export function TypingIndicator({ agent }: { agent: Agent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4 p-4"
    >
      <AgentAvatar role={agent.role} size="sm" name={agent.name} voiceStyle={agent.voiceStyle} speaking />
      <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-secondary">
        <motion.span
          className="w-2 h-2 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="w-2 h-2 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="w-2 h-2 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="text-xs text-muted-foreground self-center" style={{ color: agent.color }}>
        {agent.name} reflechit...
      </span>
    </motion.div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'a l\'instant'
  if (minutes < 60) return `il y a ${minutes}min`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  
  const days = Math.floor(hours / 24)
  return `il y a ${days}j`
}
