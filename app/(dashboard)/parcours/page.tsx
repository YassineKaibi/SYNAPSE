'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { companyBriefs, skillNodes, agents } from '@/lib/data/mock-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AgentSigil } from '@/components/agents/agent-sigil'
import type { PedagogicalArcPhase, CompanyBrief } from '@/lib/types'
import { 
  Route, 
  Play, 
  CheckCircle2, 
  Circle, 
  Lock,
  Clock,
  ArrowRight,
  Truck,
  Database,
  Package,
  Beaker,
  Rocket,
  Factory,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// PFE-contextual pathways derived from company briefs
const pfePathways = [
  {
    id: 'flotte',
    name: 'Parcours Tracking Flotte',
    description: 'Tracking GPS, optimisation routes et alertes maintenance pour LogiTrans',
    icon: Truck,
    briefId: 'brief-logitrans',
    phases: ['discovery', 'exploration', 'solution', 'industrialization'] as PedagogicalArcPhase[],
    currentPhase: 'solution' as PedagogicalArcPhase,
    progress: 65,
    status: 'active' as const,
    color: 'var(--agent-zephyr)',
  },
  {
    id: 'data-pipeline',
    name: 'Parcours Data Pipeline',
    description: 'ETL, analyse temps reel et KPIs pour la chaine logistique',
    icon: Database,
    briefId: 'brief-logitrans',
    phases: ['discovery', 'exploration', 'solution', 'industrialization'] as PedagogicalArcPhase[],
    currentPhase: 'exploration' as PedagogicalArcPhase,
    progress: 40,
    status: 'active' as const,
    color: 'var(--agent-artemis)',
  },
  {
    id: 'supply-chain',
    name: 'Parcours Supply Chain Digital',
    description: 'Integration WMS, gestion stocks et tracabilite produits',
    icon: Package,
    briefId: 'brief-pharmadist',
    phases: ['discovery', 'exploration', 'solution', 'industrialization'] as PedagogicalArcPhase[],
    currentPhase: 'discovery' as PedagogicalArcPhase,
    progress: 15,
    status: 'suggested' as const,
    color: 'var(--agent-echo)',
  },
]

const phaseConfig: Record<PedagogicalArcPhase, { label: string; icon: typeof Beaker; description: string }> = {
  discovery: { 
    label: 'Decouverte', 
    icon: Beaker, 
    description: 'Audit, interviews et comprehension du contexte metier' 
  },
  exploration: { 
    label: 'Exploration', 
    icon: Route, 
    description: 'Prototypage, benchmark et validation technique' 
  },
  solution: { 
    label: 'Solution', 
    icon: Rocket, 
    description: 'Developpement, integration et tests fonctionnels' 
  },
  industrialization: { 
    label: 'Industrialisation', 
    icon: Factory, 
    description: 'CI/CD, documentation et mise en production' 
  },
}

export default function ParcoursPage() {
  const [activePathway, setActivePathway] = useState(pfePathways[0])
  const [expandedPhase, setExpandedPhase] = useState<PedagogicalArcPhase | null>(activePathway.currentPhase)

  // Get brief for active pathway
  const activeBrief = companyBriefs.find(b => b.id === activePathway.briefId) as CompanyBrief | undefined
  const pedagogicalArc = activeBrief?.pedagogicalArcs || []

  // Get phase index for progress calculation
  const phaseIndex = activePathway.phases.indexOf(activePathway.currentPhase)
  const phaseProgress = ((phaseIndex + 0.5) / activePathway.phases.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Parcours PFE</h1>
          <p className="text-muted-foreground">
            Suivez votre progression a travers les arcs pedagogiques de votre projet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            J-45 soutenance
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-6">
        {/* Left: Pathway List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-2">
            Parcours actifs
          </h3>
          {pfePathways.map((pathway) => {
            const PathwayIcon = pathway.icon
            return (
              <Card
                key={pathway.id}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary/50',
                  activePathway.id === pathway.id && 'border-primary bg-primary/5'
                )}
                onClick={() => {
                  setActivePathway(pathway)
                  setExpandedPhase(pathway.currentPhase)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `color-mix(in oklch, ${pathway.color} 20%, transparent)` }}
                    >
                      <PathwayIcon className="w-5 h-5" style={{ color: pathway.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium truncate">{pathway.name}</h4>
                        <Badge 
                          variant={pathway.status === 'active' ? 'default' : 'secondary'}
                          className="text-[10px] shrink-0 ml-2"
                        >
                          {pathway.status === 'active' ? 'En cours' : 'Suggere'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {pathway.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {phaseConfig[pathway.currentPhase].label}
                          </span>
                          <span>{pathway.progress}%</span>
                        </div>
                        <Progress value={pathway.progress} className="h-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Quick stats */}
          <Card className="bg-secondary/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-medium">Statistiques</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground">Competences validees</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">En progression</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Pathway Details with Pedagogical Arcs */}
        <div className="space-y-6">
          {/* Pathway Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in oklch, ${activePathway.color} 20%, transparent)` }}
                  >
                    <activePathway.icon className="w-7 h-7" style={{ color: activePathway.color }} />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold mb-1">
                      {activePathway.name}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-2">
                      {activePathway.description}
                    </p>
                    {activeBrief && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-secondary rounded">
                          {activeBrief.companyName}
                        </span>
                        <span>{activeBrief.industry}</span>
                      </div>
                    )}
                  </div>
                </div>
                {activePathway.status === 'active' ? (
                  <Button>
                    Continuer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Activer
                  </Button>
                )}
              </div>

              {/* Phase progress bar */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  {activePathway.phases.map((phase, index) => {
                    const config = phaseConfig[phase]
                    const PhaseIcon = config.icon
                    const isComplete = index < phaseIndex
                    const isCurrent = phase === activePathway.currentPhase
                    const isLocked = index > phaseIndex

                    return (
                      <div 
                        key={phase}
                        className={cn(
                          'flex flex-col items-center gap-1 flex-1',
                          isLocked && 'opacity-40'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                          isComplete && 'bg-primary text-primary-foreground',
                          isCurrent && 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background',
                          isLocked && 'bg-secondary text-muted-foreground'
                        )}>
                          {isComplete ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <PhaseIcon className="w-5 h-5" />
                          )}
                        </div>
                        <span className="text-xs font-medium">{config.label}</span>
                      </div>
                    )
                  })}
                </div>
                <Progress value={phaseProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Pedagogical Arcs Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Route className="w-4 h-4" />
                Arcs Pedagogiques
              </CardTitle>
              <CardDescription>
                Activites et competences de chaque phase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activePathway.phases.map((phase, index) => {
                  const config = phaseConfig[phase]
                  const PhaseIcon = config.icon
                  const isComplete = index < phaseIndex
                  const isCurrent = phase === activePathway.currentPhase
                  const isLocked = index > phaseIndex
                  const isExpanded = expandedPhase === phase
                  const arcData = pedagogicalArc.find(a => a.phase === phase)

                  return (
                    <motion.div
                      key={phase}
                      initial={false}
                      className={cn(
                        'border rounded-lg overflow-hidden transition-colors',
                        isCurrent && 'border-primary bg-primary/5',
                        isComplete && 'border-primary/30',
                        isLocked && 'border-border opacity-60'
                      )}
                    >
                      {/* Phase header */}
                      <button
                        className="w-full p-4 flex items-center justify-between text-left"
                        onClick={() => setExpandedPhase(isExpanded ? null : phase)}
                        disabled={isLocked}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            isComplete && 'bg-primary text-primary-foreground',
                            isCurrent && 'bg-primary/20 text-primary',
                            isLocked && 'bg-secondary text-muted-foreground'
                          )}>
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : isLocked ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <PhaseIcon className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {config.label}
                              {isCurrent && (
                                <Badge variant="default" className="text-[10px]">
                                  En cours
                                </Badge>
                              )}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {config.description}
                            </p>
                          </div>
                        </div>
                        {!isLocked && (
                          <ChevronRight 
                            className={cn(
                              'w-4 h-4 text-muted-foreground transition-transform',
                              isExpanded && 'rotate-90'
                            )} 
                          />
                        )}
                      </button>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {isExpanded && arcData && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-border"
                          >
                            <div className="p-4 space-y-4">
                              {/* Activities */}
                              <div>
                                <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                  Activites
                                </h5>
                                <ul className="space-y-2">
                                  {arcData.activities.map((activity, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <Circle className="w-1.5 h-1.5 mt-2 fill-current text-primary shrink-0" />
                                      <span>{activity}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Skills gained */}
                              <div>
                                <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                  Competences developpees
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {arcData.skillsGained.map((skillId) => {
                                    const skill = skillNodes.find(s => s.id === skillId)
                                    if (!skill) return null
                                    return (
                                      <Badge 
                                        key={skillId} 
                                        variant="secondary"
                                        className="gap-1"
                                      >
                                        <Sparkles className="w-3 h-3" />
                                        {skill.name}
                                      </Badge>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Agent validations */}
                              {isCurrent && (
                                <div className="pt-3 border-t border-border">
                                  <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                    Validation du Conseil
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    {agents.slice(0, 3).map((agent) => (
                                      <div 
                                        key={agent.id}
                                        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/50"
                                      >
                                        <AgentSigil
                                          role={agent.role}
                                          size="sm"
                                          animated={false}
                                          voiceStyle={agent.voiceStyle}
                                          ariaLabel={`Sigil de ${agent.name}`}
                                        />
                                        <span className="text-xs">{agent.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
