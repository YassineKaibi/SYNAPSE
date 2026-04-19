'use client'

import { motion } from 'framer-motion'
import type { Project, ProjectGenome } from '@/lib/types'
import { cn } from '@/lib/utils'

interface GenomeDisplayProps {
  genome: Project['genome']
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const genomeTraits = [
  { key: 'adaptability', label: 'Adaptabilite', color: 'oklch(0.75 0.15 180)' },
  { key: 'specialization', label: 'Specialisation', color: 'oklch(0.70 0.15 250)' },
  { key: 'collaboration', label: 'Collaboration', color: 'oklch(0.68 0.14 300)' },
  { key: 'innovation', label: 'Innovation', color: 'oklch(0.70 0.18 25)' },
] as const

export function GenomeDisplay({ genome, size = 'md', animated = true }: GenomeDisplayProps) {
  if (!genome) return null
  
  const sizeConfig = {
    sm: { radius: 40, stroke: 6, fontSize: 8 },
    md: { radius: 60, stroke: 8, fontSize: 10 },
    lg: { radius: 80, stroke: 10, fontSize: 12 },
  }

  const config = sizeConfig[size]
  const circumference = 2 * Math.PI * config.radius

  return (
    <div className="relative" style={{ width: config.radius * 2 + 40, height: config.radius * 2 + 40 }}>
      <svg 
        viewBox={`0 0 ${config.radius * 2 + 40} ${config.radius * 2 + 40}`}
        className="w-full h-full"
      >
        {genomeTraits.map((trait, index) => {
          const value = genome[trait.key as keyof ProjectGenome] as number
          if (typeof value !== 'number') return null
          const offset = circumference * (1 - value / 100)
          const rotation = index * 90

          return (
            <g key={trait.key} transform={`rotate(${rotation} ${config.radius + 20} ${config.radius + 20})`}>
              {/* Background track */}
              <circle
                cx={config.radius + 20}
                cy={config.radius + 20}
                r={config.radius - index * (config.stroke + 4)}
                fill="none"
                stroke="var(--border)"
                strokeWidth={config.stroke}
                strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
                strokeLinecap="round"
              />
              
              {/* Value arc */}
              <motion.circle
                cx={config.radius + 20}
                cy={config.radius + 20}
                r={config.radius - index * (config.stroke + 4)}
                fill="none"
                stroke={trait.color}
                strokeWidth={config.stroke}
                strokeDasharray={`${(circumference * 0.25) * (value / 100)} ${circumference}`}
                strokeLinecap="round"
                initial={animated ? { strokeDashoffset: circumference * 0.25 } : undefined}
                animate={animated ? { strokeDashoffset: 0 } : undefined}
                transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
              />
            </g>
          )
        })}

        {/* Center text */}
        <text
          x={config.radius + 20}
          y={config.radius + 20}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground font-serif"
          fontSize={config.fontSize * 2}
        >
          {Math.round(((genome.adaptability as number) + (genome.specialization as number) + (genome.collaboration as number) + (genome.innovation as number)) / 4)}%
        </text>
      </svg>

      {/* Labels */}
      <div className="absolute inset-0 pointer-events-none">
        {genomeTraits.map((trait, index) => {
          const angle = (index * 90 - 45) * (Math.PI / 180)
          const labelRadius = config.radius + 30
          const x = Math.cos(angle) * labelRadius + config.radius + 20
          const y = Math.sin(angle) * labelRadius + config.radius + 20

          return (
            <div
              key={trait.key}
              className="absolute text-xs font-medium whitespace-nowrap"
              style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
                color: trait.color,
              }}
            >
              {genome[trait.key]}%
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Compact bar version
export function GenomeBars({ genome }: { genome: ProjectGenome | undefined }) {
  if (!genome) return null
  
  return (
    <div className="space-y-3">
      {genomeTraits.map(trait => {
        const value = genome[trait.key as keyof ProjectGenome] as number
        if (typeof value !== 'number') return null
        return (
        <div key={trait.key} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{trait.label}</span>
            <span className="font-medium" style={{ color: trait.color }}>
              {value}%
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: trait.color }}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      )})}
    </div>
  )
}
