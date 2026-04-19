'use client'

import { motion } from 'framer-motion'
import type { AgentRole } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AgentSigilProps {
  role: AgentRole
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  speaking?: boolean
  disagreeing?: boolean
  voiceStyle?: string
  ariaLabel?: string
  className?: string
}

const sigilPaths: Record<AgentRole, string> = {
  architecte: 'M24 4L4 24L24 44L44 24L24 4ZM24 14L34 24L24 34L14 24L24 14ZM24 20L28 24L24 28L20 24L24 20Z',
  avocat_diable: 'M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm0 8c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12-12 5.373-12 12-12zm0 6a6 6 0 100 12 6 6 0 000-12z',
  product_owner: 'M24 4L4 44h40L24 4zm0 12l12 24H12l12-24zm0 8l6 12H18l6-12z',
  coach_carriere: 'M4 4v40h40V4H4zm8 8h24v24H12V12zm6 6v12h12V18H18z',
  scribe: 'M24 4l-8 8h6v10H12v-6l-8 8 8 8v-6h10v10h-6l8 8 8-8h-6V26h10v6l8-8-8-8v6H26V12h6l-8-8z',
}

const roleColors: Record<AgentRole, string> = {
  architecte: 'text-agent-zephyr',
  product_owner: 'text-agent-artemis',
  avocat_diable: 'text-agent-nova',
  coach_carriere: 'text-agent-echo',
  scribe: 'text-agent-sphinx',
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
}

function voiceVariant(voiceStyle?: string): 'steady' | 'sharp' | 'calm' {
  const normalized = voiceStyle?.toLowerCase() ?? ''
  if (normalized.includes('provocateur')) return 'sharp'
  if (normalized.includes('factuel') || normalized.includes('methodique')) return 'calm'
  return 'steady'
}

export function AgentSigil({
  role,
  size = 'md',
  animated = true,
  speaking = false,
  disagreeing = false,
  voiceStyle,
  ariaLabel,
  className,
}: AgentSigilProps) {
  const Wrapper = animated ? motion.div : 'div'
  const variant = voiceVariant(voiceStyle)
  const shouldShake = animated && speaking && (disagreeing || variant === 'sharp')
  const pulseScale = variant === 'calm' ? [1, 1.04, 1] : [1, 1.08, 1]
  const pulseOpacity = variant === 'calm' ? [0.16, 0.3, 0.16] : [0.18, 0.45, 0.18]
  const transition = shouldShake
    ? { duration: 0.35, ease: 'easeInOut' as const }
    : { type: 'spring' as const, stiffness: 300, damping: 20 }

  return (
    <Wrapper
      className={cn('relative', sizeClasses[size], className)}
      aria-label={ariaLabel}
      role="img"
      {...(animated && {
        initial: { opacity: 0, scale: 0.8 },
        animate: shouldShake
          ? { opacity: 1, scale: 1, x: [0, -1.8, 1.8, -1.2, 1.2, 0] }
          : { opacity: 1, scale: 1 },
        transition,
      })}
    >
      {animated && speaking && (
        <motion.span
          aria-hidden
          className={cn(
            'absolute inset-0 rounded-full border',
            role === 'architecte' && 'border-agent-zephyr',
            role === 'product_owner' && 'border-agent-artemis',
            role === 'avocat_diable' && 'border-agent-nova',
            role === 'coach_carriere' && 'border-agent-echo',
            role === 'scribe' && 'border-agent-sphinx'
          )}
          animate={{ scale: pulseScale, opacity: pulseOpacity }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <svg
        viewBox="0 0 48 48"
        fill="none"
        className={cn('w-full h-full', roleColors[role])}
      >
        <motion.path
          d={sigilPaths[role]}
          fill="currentColor"
          fillOpacity={0.2}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...(animated && {
            initial: { pathLength: 0 },
            animate: { pathLength: 1 },
            transition: { duration: 1.5, ease: 'easeInOut' },
          })}
        />
      </svg>

      {/* Glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-full blur-md opacity-30',
          role === 'architecte' && 'bg-agent-zephyr',
          role === 'product_owner' && 'bg-agent-artemis',
          role === 'avocat_diable' && 'bg-agent-nova',
          role === 'coach_carriere' && 'bg-agent-echo',
          role === 'scribe' && 'bg-agent-sphinx'
        )}
      />
    </Wrapper>
  )
}

export function AgentAvatar({
  role,
  name,
  size = 'md',
  showName = false,
  speaking = false,
  disagreeing = false,
  voiceStyle,
  className,
}: AgentSigilProps & { name?: string; showName?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'relative rounded-full p-2 bg-secondary/50 border border-border/50',
        size === 'sm' && 'p-1',
        size === 'lg' && 'p-3'
      )}>
        <AgentSigil
          role={role}
          size={size}
          speaking={speaking}
          disagreeing={disagreeing}
          voiceStyle={voiceStyle}
          ariaLabel={name ? `Sigil de ${name}` : 'Sigil agent'}
        />
      </div>
      {showName && name && (
        <span className="font-medium text-foreground">{name}</span>
      )}
    </div>
  )
}
