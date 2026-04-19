'use client'

import { motion } from 'framer-motion'
import type { SkillNode as SkillNodeType, SkillStatus, SkillCategory } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Lock, Check, Sparkles, ArrowUp } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'

interface SkillNodeProps {
  skill: SkillNodeType
  size?: 'sm' | 'md' | 'lg'
  selected?: boolean
  onClick?: () => void
  showTooltip?: boolean
}

const statusConfig: Record<SkillStatus, { 
  bg: string
  border: string
  icon: React.ReactNode
  label: string
}> = {
  locked: {
    bg: 'bg-secondary/20',
    border: 'border-muted-foreground',
    icon: <Lock className="w-3 h-3" />,
    label: 'Verrouillee',
  },
  unlocked: {
    bg: 'bg-secondary',
    border: 'border-border',
    icon: <ArrowUp className="w-3 h-3" />,
    label: 'En cours',
  },
  mastered: {
    bg: 'bg-primary/20',
    border: 'border-primary',
    icon: <Check className="w-3 h-3" />,
    label: 'Maitrisee',
  },
  suggested: {
    bg: 'bg-signal-blue/20',
    border: 'border-signal-blue',
    icon: <Sparkles className="w-3 h-3" />,
    label: 'Suggeree',
  },
  in_progress: {
    bg: 'bg-signal-orange/20',
    border: 'border-signal-orange',
    icon: <ArrowUp className="w-3 h-3" />,
    label: 'En progression',
  },
}

const categoryColors: Record<SkillCategory, string> = {
  technical: 'text-agent-zephyr',
  leadership: 'text-agent-nova',
  communication: 'text-agent-artemis',
  strategic: 'text-agent-echo',
  creative: 'text-agent-sphinx',
  analytical: 'text-primary',
  domain: 'text-signal-blue',
  soft: 'text-signal-green',
}

const sizeClasses = {
  sm: 'w-12 h-12 text-[10px]',
  md: 'w-20 h-20 text-xs',
  lg: 'w-28 h-28 text-sm',
}

export function SkillNode({ 
  skill, 
  size = 'md', 
  selected = false,
  onClick,
  showTooltip = true,
}: SkillNodeProps) {
  const config = statusConfig[skill.status]
  const categoryColor = categoryColors[skill.category]
  
  const nodeContent = (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative rounded-full flex flex-col items-center justify-center',
        'border-2 transition-all duration-200',
        'hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        config.bg,
        config.border,
        sizeClasses[size],
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        skill.status === 'locked' && 'opacity-50 cursor-not-allowed',
        skill.status === 'mastered' && 'glow-signal',
        skill.status === 'suggested' && 'animate-pulse'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Category indicator */}
      <div className={cn('absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background flex items-center justify-center', categoryColor)}>
        {config.icon}
      </div>
      
      {/* Skill name */}
      <span className={cn(
        'font-medium text-center px-1 leading-tight',
        skill.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
      )}>
        {skill.name}
      </span>
      
      {/* Level indicator for non-locked skills */}
      {skill.status !== 'locked' && skill.level > 0 && (
        <span className="text-[10px] text-muted-foreground mt-0.5">
          {skill.level}%
        </span>
      )}
      
      {/* Progress ring for unlocked skills */}
      {skill.status === 'unlocked' && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="calc(50% - 4px)"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${skill.level * 2.51} 251`}
            className="text-primary/30"
          />
        </svg>
      )}
    </motion.button>
  )

  if (!showTooltip) return nodeContent

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {nodeContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">{skill.name}</span>
              <span className={cn('text-xs capitalize', categoryColor)}>
                {config.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{skill.description}</p>
            {skill.status !== 'locked' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progression</span>
                  <span>{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-1" />
              </div>
            )}
            {skill.prerequisites.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Prerequis: {skill.prerequisites.length} competence(s)
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Mini version for lists
export function SkillNodeMini({ skill }: { skill: SkillNodeType }) {
  const config = statusConfig[skill.status]
  const categoryColor = categoryColors[skill.category]
  
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs',
      config.bg,
      'border',
      config.border
    )}>
      <span className={categoryColor}>{config.icon}</span>
      <span className="font-medium">{skill.name}</span>
      {skill.status !== 'locked' && (
        <span className="text-muted-foreground">{skill.level}%</span>
      )}
    </div>
  )
}
