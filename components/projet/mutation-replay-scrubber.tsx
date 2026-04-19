'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProjectMutation, ProjectGenome } from '@/lib/types'
import { cn } from '@/lib/utils'
import { agents } from '@/lib/data/mock-data'
import { AgentSigil } from '@/components/agents/agent-sigil'
import { GenomeBars } from './genome-display'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Clock,
  Dna,
  History,
} from 'lucide-react'

interface MutationReplayScrubberProps {
  mutations: ProjectMutation[]
  currentIndex?: number
  onIndexChange?: (index: number) => void
  currentGenome?: ProjectGenome
  className?: string
}

const typeLabels: Record<string, string> = {
  skill_added: 'Competence ajoutee',
  skill_removed: 'Competence retiree',
  level_change: 'Progression',
  goal_updated: 'Objectif MAJ',
  pathway_shift: 'Parcours modifie',
  brief_selected: 'Brief selectionne',
  phase_transition: 'Transition phase',
  gm_intervention: 'Intervention GM',
}

export function MutationReplayScrubber({
  mutations,
  currentIndex: controlledIndex,
  onIndexChange,
  currentGenome,
  className,
}: MutationReplayScrubberProps) {
  const [internalIndex, setInternalIndex] = useState(Math.max(0, mutations.length - 1))
  const [isPlaying, setIsPlaying] = useState(false)
  const currentIndex = controlledIndex ?? internalIndex
  const currentMutation = mutations[currentIndex]

  const setIndex = (value: number) => {
    if (onIndexChange) onIndexChange(value)
    else setInternalIndex(value)
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

  const handleSliderChange = (value: number[]) => {
    setIndex(value[0])
    setIsPlaying(false)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    if (currentIndex >= mutations.length - 1) setIndex(0)
    setIsPlaying(true)
  }

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      const next = currentIndex + 1
      if (next >= mutations.length) {
        setIsPlaying(false)
        return
      }
      setIndex(next)
    }, 1500)
    return () => clearInterval(interval)
  }, [currentIndex, isPlaying, mutations.length])

  if (!currentMutation || !currentGenome) return null

  const agent = currentMutation.agentId ? agents.find((a) => a.id === currentMutation.agentId) : null

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          Replay des Mutations
        </CardTitle>
        <CardDescription>Naviguez dans l&apos;historique du genome</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Jour 0</span>
            <span className="font-mono">
              Mutation {currentIndex + 1} / {mutations.length}
            </span>
            <span>Aujourd&apos;hui</span>
          </div>
          <Slider
            value={[currentIndex]}
            onValueChange={handleSliderChange}
            min={0}
            max={Math.max(0, mutations.length - 1)}
            step={1}
            className="py-2"
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => { setIsPlaying(false); setIndex(0) }} className="h-8 w-8" aria-label="Aller a la premiere mutation">
            <Rewind className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { setIsPlaying(false); setIndex(Math.max(0, currentIndex - 1)) }} className="h-8 w-8" aria-label="Mutation precedente">
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button variant="default" size="icon" onClick={handlePlayPause} className="h-10 w-10" aria-label={isPlaying ? 'Pause replay' : 'Lire replay'}>
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { setIsPlaying(false); setIndex(Math.min(mutations.length - 1, currentIndex + 1)) }} className="h-8 w-8" aria-label="Mutation suivante">
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { setIsPlaying(false); setIndex(mutations.length - 1) }} className="h-8 w-8" aria-label="Aller a la derniere mutation">
            <FastForward className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMutation.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-lg bg-secondary/50 border border-border"
          >
            <div className="flex items-start gap-3">
              {agent && (
                <div className="shrink-0">
                  <AgentSigil
                    role={agent.role}
                    size="sm"
                    animated={false}
                    voiceStyle={agent.voiceStyle}
                    ariaLabel={`Sigil de ${agent.name}`}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    {typeLabels[currentMutation.type] || currentMutation.type}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(currentMutation.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-foreground">{currentMutation.description}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Dna className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Genome a ce point</span>
          </div>
          <GenomeBars genome={currentGenome} />
        </div>
      </CardContent>
    </Card>
  )
}
