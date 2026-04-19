'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  sampleProject,
  sampleMutations,
  skillNodes,
  pfeTimeline,
  agents,
  sampleDebate,
} from '@/lib/data/mock-data'
import { MutationTimeline } from '@/components/projet/mutation-timeline'
import { MutationReplayScrubber } from '@/components/projet/mutation-replay-scrubber'
import { AgentSigil } from '@/components/agents/agent-sigil'
import { PhaseStepper } from '@/components/synapse/phase-stepper'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dna,
  Plus,
  Lock,
  Circle,
  ArrowRight,
  Users,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Phase label translations
const PHASE_LABELS: Record<string, string> = {
  diagnostic: 'Diagnostic',
  brief_selection: 'Sélection',
  planning: 'Planification',
  execution: 'Exécution',
  review: 'Revue',
  defense: 'Soutenance',
}

// Agent color map
const AGENT_COLORS: Record<string, string> = {
  'agent-architecte': 'text-agent-zephyr border-agent-zephyr',
  'agent-product-owner': 'text-agent-artemis border-agent-artemis',
  'agent-avocat-diable': 'text-agent-nova border-agent-nova',
  'agent-coach-carriere': 'text-agent-echo border-agent-echo',
  'agent-scribe': 'text-agent-sphinx border-agent-sphinx',
}

const AGENT_BG_COLORS: Record<string, string> = {
  'agent-architecte': 'border-l-agent-zephyr',
  'agent-product-owner': 'border-l-agent-artemis',
  'agent-avocat-diable': 'border-l-agent-nova',
  'agent-coach-carriere': 'border-l-agent-echo',
  'agent-scribe': 'border-l-agent-sphinx',
}

// Genome radial SVG
function GenomeRadial({ genome }: { genome: typeof sampleProject.genome }) {
  const dims = [
    { label: 'Adaptabilité', value: genome.adaptability, color: 'var(--agent-zephyr)' },
    { label: 'Spécialisation', value: genome.specialization, color: 'var(--agent-artemis)' },
    { label: 'Collaboration', value: genome.collaboration, color: 'var(--agent-echo)' },
    { label: 'Innovation', value: genome.innovation, color: 'var(--signal-orange)' },
  ]
  const cx = 120
  const cy = 120
  const maxR = 90

  return (
    <svg viewBox="0 0 240 240" className="w-full h-auto max-w-[240px]">
      {/* Background rings */}
      {[0.25, 0.5, 0.75, 1].map((frac) => (
        <circle
          key={frac}
          cx={cx}
          cy={cy}
          r={maxR * frac}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity={0.5}
        />
      ))}
      {dims.map((dim, i) => {
        const totalDims = dims.length
        const angleDeg = (i / totalDims) * 360 - 90
        const angleRad = (angleDeg * Math.PI) / 180
        const r = (dim.value / 100) * maxR
        const circumference = 2 * Math.PI * maxR
        const dashLength = (dim.value / 100) * (circumference / totalDims) * 0.8

        // Draw an arc segment for each dimension
        const startAngleDeg = (i / totalDims) * 360 - 90
        const endAngleDeg = ((i + 1) / totalDims) * 360 - 90
        const startRad = (startAngleDeg * Math.PI) / 180
        const endRad = (endAngleDeg * Math.PI) / 180
        const outerR = r
        const innerR = 8

        const x1 = cx + outerR * Math.cos(startRad)
        const y1 = cy + outerR * Math.sin(startRad)
        const x2 = cx + outerR * Math.cos(endRad)
        const y2 = cy + outerR * Math.sin(endRad)
        const x3 = cx + innerR * Math.cos(endRad)
        const y3 = cy + innerR * Math.sin(endRad)
        const x4 = cx + innerR * Math.cos(startRad)
        const y4 = cy + innerR * Math.sin(startRad)

        const largeArcFlag = (endAngleDeg - startAngleDeg) > 180 ? 1 : 0

        const path = [
          `M ${x1} ${y1}`,
          `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `L ${x3} ${y3}`,
          `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
          'Z',
        ].join(' ')

        const labelAngleRad = ((startAngleDeg + endAngleDeg) / 2) * Math.PI / 180
        const labelR = maxR + 16
        const lx = cx + labelR * Math.cos(labelAngleRad)
        const ly = cy + labelR * Math.sin(labelAngleRad)

        return (
          <g key={dim.label}>
            <motion.path
              d={path}
              fill={dim.color}
              fillOpacity={0.25}
              stroke={dim.color}
              strokeWidth={1.5}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 + 0.3, duration: 0.8, ease: 'easeOut' }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill="var(--muted-foreground)"
            >
              {dim.value}%
            </text>
          </g>
        )
      })}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={4} fill="var(--primary)" />
    </svg>
  )
}

export default function ProjetPage() {
  const project = sampleProject
  const [mutationIndex, setMutationIndex] = useState(sampleMutations.length - 1)
  const currentPhase = pfeTimeline.currentPhase
  const currentPhaseLabel = PHASE_LABELS[currentPhase] ?? currentPhase
  const snapshotGenome = useMemo(() => {
    const snapshots = project.genomeSnapshots ?? []
    return snapshots[mutationIndex]?.genome ?? project.genome
  }, [mutationIndex, project.genomeSnapshots, project.genome])

  // Day counter
  const dayIn = pfeTimeline.dayInProgram
  const totalDays = pfeTimeline.totalDays

  // Goals with progress computed from targetSkills
  const goalsWithProgress = project.goals.map((goal, i) => {
    // Map each goal to a target skill for progress computation
    const targetSkillId = project.targetSkills[i] ?? project.targetSkills[0]
    const skill = skillNodes.find((s) => s.id === targetSkillId)
    const progress = skill?.level ?? 0
    // Determine agent "ownership" based on goal content
    const agentOwners = ['agent-product-owner', 'agent-architecte', 'agent-coach-carriere', 'agent-scribe']
    const agentId = agentOwners[i % agentOwners.length]
    const agent = agents.find((a) => a.id === agentId)
    return { goal, progress, skill, agent }
  })

  // Sous-quêtes: mutations where type === 'skill_added'
  const sousQuetes = sampleMutations.filter((m) => m.type === 'skill_added')

  // Recommendations from debate
  const recommendations = sampleDebate.recommendations ?? []

  // Agent for each recommendation
  const debateAgentIds = ['agent-architecte', 'agent-product-owner', 'agent-avocat-diable', 'agent-coach-carriere', 'agent-scribe']

  return (
    <div className="flex flex-col gap-0 min-h-0">
      {/* Phase stepper strip */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-2">
        <PhaseStepper variant="full" className="max-w-xl" />
      </div>

      <div className="space-y-6 p-6 pb-8">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="font-serif text-2xl font-bold text-balance leading-tight">
                {project.name}
              </h1>
              <Badge
                variant="outline"
                className="text-signal-green border-signal-green/50 bg-signal-green/10 font-mono text-xs shrink-0"
              >
                {currentPhaseLabel}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs shrink-0">
                J {dayIn} / {totalDays}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/evidence">
                <FolderOpen className="w-4 h-4 mr-2" />
                Dossier de preuves
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/conseil">
                <Users className="w-4 h-4 mr-2" />
                Consulter le Conseil
              </Link>
            </Button>
          </div>
        </div>

        {/* Three-column main grid */}
        <div className="grid grid-cols-[1.1fr_1.4fr_1fr] gap-5">
          {/* LEFT: Objectifs et Quêtes */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Objectifs et Quêtes
            </h2>

            <div className="space-y-3">
              {goalsWithProgress.map(({ goal, progress, skill, agent }, i) => (
                <Card key={i} className="p-4 hover:border-primary/30 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-tight flex-1">
                        {goal}
                      </p>
                      {agent && (
                        <div
                          className={cn(
                            'shrink-0 rounded-full border p-1',
                            AGENT_COLORS[agent.id]
                          )}
                        >
                          <AgentSigil
                            role={agent.role}
                            size="sm"
                            animated={false}
                            voiceStyle={agent.voiceStyle}
                            ariaLabel={`Sigil de ${agent.name}`}
                          />
                        </div>
                      )}
                    </div>
                    {skill && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-1" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Sous-quêtes pédagogiques */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Sous-quêtes pédagogiques
              </h3>
              <div className="space-y-2">
                {sousQuetes.map((mutation) => (
                  <div
                    key={mutation.id}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border/50 text-sm"
                  >
                    <Plus className="w-3 h-3 text-signal-green shrink-0" />
                    <span className="text-foreground/80 flex-1 leading-tight text-xs">
                      {mutation.description}
                    </span>
                    {mutation.agentId && (() => {
                      const ag = agents.find(a => a.id === mutation.agentId)
                      return ag ? (
                        <AgentSigil
                          role={ag.role}
                          size="sm"
                          animated={false}
                          className="shrink-0"
                          voiceStyle={ag.voiceStyle}
                          ariaLabel={`Sigil de ${ag.name}`}
                        />
                      ) : null
                    })()}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CENTER: Génome du Projet */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full flex flex-col" data-demo="project-genome">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Dna className="w-4 h-4 text-primary" />
                  Génome du Projet
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Ce qui ne change pas. Ce qui évolue.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center gap-4">
                <GenomeRadial genome={snapshotGenome} />

                {/* Core strengths */}
                <div className="w-full space-y-1">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Forces immuables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {snapshotGenome.coreStrengths.map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="font-mono text-[10px] border-primary/30 text-primary"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="w-full grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-secondary/40 rounded-md p-2">
                    <p className="text-muted-foreground mb-0.5">Style d&apos;apprentissage</p>
                    <p className="text-foreground font-medium capitalize">
                      {snapshotGenome.learningStyle === 'kinesthetic'
                        ? 'Kinesthésique'
                        : snapshotGenome.learningStyle}
                    </p>
                  </div>
                  <div className="bg-secondary/40 rounded-md p-2">
                    <p className="text-muted-foreground mb-0.5">Tolérance au risque</p>
                    <p className="text-foreground font-medium">
                      {snapshotGenome.riskTolerance}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT: Timeline des Mutations */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <Card className="flex flex-col">
              <CardHeader className="pb-2 shrink-0">
                <CardTitle className="text-sm font-medium">Timeline des Mutations</CardTitle>
                {/* Legend */}
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Circle className="w-1.5 h-1.5 fill-muted-foreground text-muted-foreground" />
                    Mineur
                  </span>
                  <span className="flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-primary/50 text-primary/50" />
                    Modéré
                  </span>
                  <span className="flex items-center gap-1">
                    <Circle className="w-2.5 h-2.5 fill-primary text-primary" />
                    Majeur
                  </span>
                </div>
              </CardHeader>
              <CardContent className="min-h-0 overflow-hidden max-h-[300px]">
                <ScrollArea className="h-full">
                  <MutationTimeline
                    mutations={sampleMutations}
                    disagreements={sampleDebate.disagreements}
                    showLock
                  />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Mutation Replay Scrubber */}
            <MutationReplayScrubber
              mutations={sampleMutations}
              currentIndex={mutationIndex}
              onIndexChange={setMutationIndex}
              currentGenome={snapshotGenome}
            />
          </motion.div>
        </div>

        {/* Bottom: Recommandations en direct du Conseil */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <Link
              href="/conseil"
              className="flex items-center gap-2 group"
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-signal-green"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Conseil actif
              </span>
              <ArrowRight className="w-3 h-3 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {recommendations.map((rec, i) => {
              const agentId = debateAgentIds[i % debateAgentIds.length]
              const agent = agents.find((a) => a.id === agentId)

              return (
                <Card
                  key={i}
                  className={cn(
                    'shrink-0 w-[300px] p-4 border-l-2 hover:border-primary/20 transition-colors',
                    agent ? AGENT_BG_COLORS[agent.id] : 'border-l-primary'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {agent && (
                      <div className="shrink-0 mt-0.5">
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
                      {agent && (
                        <p className="text-[10px] text-muted-foreground mb-1 font-mono">
                          {agent.name}
                        </p>
                      )}
                      <p className="text-xs text-foreground leading-relaxed">{rec}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
