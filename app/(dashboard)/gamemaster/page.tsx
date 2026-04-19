'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AgentSigil } from '@/components/agents/agent-sigil'
import { gameMasterRules, gameMasterState, gameMasterDecisions, agents } from '@/lib/data/mock-data'
import type { GameMasterDecision } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Gavel, Activity, Clock3, Scale, Circle } from 'lucide-react'

type VisibilityFilter = 'student' | 'supervisor' | 'jury' | 'all'
type ScenarioKey = 'tech-block' | 'council-disagreement' | 'path-acceleration'

const IMPACT_DOT_CLASS: Record<GameMasterDecision['impactLevel'], string> = {
  low: 'text-signal-blue',
  medium: 'text-signal-orange',
  high: 'text-signal-coral',
}

const VISIBILITY_LABEL: Record<VisibilityFilter, string> = {
  student: 'Etudiant',
  supervisor: 'Encadrant',
  jury: 'Jury',
  all: 'Tous',
}

const SCENARIO_LABEL: Record<ScenarioKey, string> = {
  'tech-block': 'Blocage technique detecte',
  'council-disagreement': 'Desaccord persistant Conseil',
  'path-acceleration': 'Acceleration parcours',
}

const scenarioTemplates: Record<
  ScenarioKey,
  Omit<GameMasterDecision, 'id' | 'timestamp'>
> = {
  'tech-block': {
    context: 'Derive technique detectee sur l\'integration telemetry API',
    decision: 'Activer cellule anti-blocage sur 24h et reduire l\'objectif sprint',
    rationale: 'Le blocage est localise mais penalise la velocite globale. Le recadrage court preserve la livraison.',
    affectedAgents: ['agent-architecte', 'agent-avocat-diable', 'agent-scribe'],
    impactLevel: 'high',
    visibility: 'supervisor',
  },
  'council-disagreement': {
    context: 'Divergence prolongee entre objectifs metier et risque execution',
    decision: 'Escalader l\'arbitrage a l\'encadrant avec synthese evidence-ready',
    rationale: 'Le desaccord est pedagogiquement utile, mais depasse le seuil de convergence autonome.',
    affectedAgents: ['agent-product-owner', 'agent-avocat-diable', 'agent-coach-carriere'],
    impactLevel: 'medium',
    visibility: 'all',
    relatedDisagreement: 'disagree-1',
  },
  'path-acceleration': {
    context: 'Momentum en hausse et KPIs stabilises sur 3 checkpoints',
    decision: 'Debloquer une sous-quete avancee de specialisation FastAPI',
    rationale: 'Le signal actuel permet d\'accelerer sans compromettre la qualite des preuves.',
    affectedAgents: ['agent-coach-carriere', 'agent-architecte'],
    impactLevel: 'low',
    visibility: 'student',
  },
}

export default function GameMasterPage() {
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all')
  const [scenario, setScenario] = useState<ScenarioKey>('tech-block')
  const [decisions, setDecisions] = useState<GameMasterDecision[]>(() =>
    [...gameMasterDecisions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  )

  const decisionList = decisions
  const filtered = useMemo(
    () => decisionList.filter((item) => item.visibility === visibilityFilter),
    [decisionList, visibilityFilter]
  )

  const lastIntervention = decisionList[0]?.timestamp ?? gameMasterState.lastIntervention

  const handleSimulate = () => {
    const template = scenarioTemplates[scenario]
    const newDecision: GameMasterDecision = {
      ...template,
      id: `gm-live-${Date.now()}`,
      timestamp: new Date(),
    }
    setDecisions((prev) => [newDecision, ...prev])
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold">Game Master Console</h1>
        <p className="text-sm text-muted-foreground">
          Console d&apos;orchestration meta pour la demo jury.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">System Health</p>
              <p className="font-mono text-2xl text-signal-green">{gameMasterState.systemHealth}</p>
            </div>
            <Activity className="w-5 h-5 text-signal-green" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Derniere intervention</p>
              <p className="font-mono text-sm">{formatDateTime(lastIntervention)}</p>
            </div>
            <Clock3 className="w-5 h-5 text-signal-blue" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Decisions actives / Arbitrages en attente</p>
              <p className="font-mono text-2xl">
                {decisionList.length} / {gameMasterState.pendingArbitrations.length}
              </p>
            </div>
            <Scale className="w-5 h-5 text-signal-orange" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Card className="min-h-[560px]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Flux de decisions</CardTitle>
              <Tabs
                value={visibilityFilter}
                onValueChange={(value) => setVisibilityFilter(value as VisibilityFilter)}
              >
                <TabsList>
                  <TabsTrigger value="student">Etudiant</TabsTrigger>
                  <TabsTrigger value="supervisor">Encadrant</TabsTrigger>
                  <TabsTrigger value="jury">Jury</TabsTrigger>
                  <TabsTrigger value="all">Tous</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  id={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.2) }}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                        {formatDateTime(item.timestamp)}
                      </p>
                      <h3 className="font-medium leading-tight">{item.context}</h3>
                    </div>
                    <Badge variant="outline">{VISIBILITY_LABEL[item.visibility]}</Badge>
                  </div>

                  <p className="mt-3 text-sm text-foreground">{item.decision}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.rationale}</p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {item.affectedAgents.map((agentId) => {
                        const agent = agents.find((a) => a.id === agentId)
                        if (!agent) return null
                        return (
                          <AgentSigil
                            key={`${item.id}-${agentId}`}
                            role={agent.role}
                            size="sm"
                            animated={false}
                            voiceStyle={agent.voiceStyle}
                            ariaLabel={`Sigil de ${agent.name}`}
                          />
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Circle className={`w-2.5 h-2.5 fill-current ${IMPACT_DOT_CLASS[item.impactLevel]}`} />
                      Impact {item.impactLevel}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Aucune decision pour la visibilite {VISIBILITY_LABEL[visibilityFilter].toLowerCase()}.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Regles de mutation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gameMasterRules.map((rule, index) => (
              <div key={index} className="rounded-md border border-border bg-secondary/20 p-3">
                <p className="text-xs leading-relaxed">{rule}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 text-signal-orange" />
            <p className="text-sm font-medium">Simuler une intervention</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={scenario} onValueChange={(value) => setScenario(value as ScenarioKey)}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Choisir un scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech-block">{SCENARIO_LABEL['tech-block']}</SelectItem>
                <SelectItem value="council-disagreement">{SCENARIO_LABEL['council-disagreement']}</SelectItem>
                <SelectItem value="path-acceleration">{SCENARIO_LABEL['path-acceleration']}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSimulate}>Simuler une intervention</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
