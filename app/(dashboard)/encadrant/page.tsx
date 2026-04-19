'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Calendar,
  Clock,
  Gavel,
  MessageSquare,
  Quote,
  ShieldAlert,
  CheckCircle2,
  Bell,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { AgentAvatar } from '@/components/agents/agent-sigil'
import { supervisorQueue, agents, gameMasterDecisions } from '@/lib/data/mock-data'
import { clearDemoArbitration, loadDemoArbitration } from '@/lib/demo-state'
import type {
  ArbitrationRequest,
  StudentAlert,
  SupervisorDecision,
  Agent,
} from '@/lib/types'
import { cn } from '@/lib/utils'

const URGENCY_CONFIG: Record<
  ArbitrationRequest['urgency'],
  { label: string; className: string }
> = {
  high: {
    label: 'Urgent',
    className: 'bg-signal-coral/15 text-signal-coral border-signal-coral/30',
  },
  medium: {
    label: 'Moyenne',
    className: 'bg-signal-orange/15 text-signal-orange border-signal-orange/30',
  },
  low: {
    label: 'Faible',
    className: 'bg-signal-blue/15 text-signal-blue border-signal-blue/30',
  },
}

const SEVERITY_LABEL: Record<string, string> = {
  minor: 'Mineur',
  moderate: 'Modere',
  fundamental: 'Fondamental',
}

const SEVERITY_CLASS: Record<string, string> = {
  minor: 'bg-signal-blue/10 text-signal-blue',
  moderate: 'bg-signal-orange/10 text-signal-orange',
  fundamental: 'bg-signal-coral/10 text-signal-coral',
}

const ALERT_ICON: Record<StudentAlert['type'], typeof AlertTriangle> = {
  stress: AlertTriangle,
  momentum_drop: ShieldAlert,
  deadline: Clock,
  skill_gap: Bell,
}

const ALERT_TONE: Record<StudentAlert['severity'], string> = {
  info: 'text-signal-blue',
  warning: 'text-signal-orange',
  critical: 'text-signal-coral',
}

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  return `il y a ${days} j`
}

function agentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id)
}

export default function EncadrantPage() {
  const initialQueue = useMemo(() => {
    const demoArbitration = loadDemoArbitration()
    if (!demoArbitration) return supervisorQueue.pendingArbitrations
    const alreadyPresent = supervisorQueue.pendingArbitrations.some(
      (item) => item.id === demoArbitration.id
    )
    return alreadyPresent
      ? supervisorQueue.pendingArbitrations
      : [demoArbitration, ...supervisorQueue.pendingArbitrations]
  }, [])
  const [queue, setQueue] = useState<ArbitrationRequest[]>(initialQueue)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialQueue[0]?.id ?? null
  )
  const [rationale, setRationale] = useState('')
  const [chosenResolution, setChosenResolution] = useState<string | null>(
    initialQueue[0]?.suggestedResolutions[0] ?? null
  )
  const [decisions, setDecisions] = useState<SupervisorDecision[]>(
    supervisorQueue.recentDecisions
  )
  const [alerts, setAlerts] = useState<StudentAlert[]>(
    supervisorQueue.studentAlerts
  )

  const selected = useMemo(
    () => queue.find((a) => a.id === selectedId) ?? null,
    [queue, selectedId]
  )

  const agentA = selected && agentById(selected.disagreement.agentA)
  const agentB = selected && agentById(selected.disagreement.agentB)

  function handleSelect(arb: ArbitrationRequest) {
    setSelectedId(arb.id)
    setRationale('')
    setChosenResolution(arb.suggestedResolutions[0] ?? null)
  }

  function handleSubmit() {
    if (!selected || !chosenResolution || !rationale.trim()) return
    const decision: SupervisorDecision = {
      id: `dec-${Date.now()}`,
      arbitrationId: selected.id,
      decision: chosenResolution,
      rationale: rationale.trim(),
      timestamp: new Date(),
      notifiedStudent: true,
    }
    setDecisions((prev) => [decision, ...prev])
    setQueue((prev) => prev.filter((a) => a.id !== selected.id))
    if (selected.id.startsWith('arb-demo-')) {
      clearDemoArbitration()
    }
    const next = queue.find((a) => a.id !== selected.id)
    setSelectedId(next?.id ?? null)
    setRationale('')
    setChosenResolution(next?.suggestedResolutions[0] ?? null)
  }

  function acknowledgeAlert(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-6 pt-8 pb-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">
              Console encadrant
            </p>
            <h1 className="text-3xl md:text-4xl font-fraunces font-semibold text-foreground">
              Arbitrages en attente
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Dr. Sami Trabelsi - ENIT · {queue.length} dossier(s) en attente de tranchage
            </p>
          </div>
          <div className="flex gap-3 text-xs">
            <div className="px-3 py-2 rounded-md border border-border bg-card">
              <div className="text-muted-foreground">Desaccords</div>
              <div className="font-mono text-lg text-signal-coral">{queue.length}</div>
            </div>
            <div className="px-3 py-2 rounded-md border border-border bg-card">
              <div className="text-muted-foreground">Alertes etudiants</div>
              <div className="font-mono text-lg text-signal-orange">
                {alerts.filter((a) => !a.acknowledged).length}
              </div>
            </div>
            <div className="px-3 py-2 rounded-md border border-border bg-card">
              <div className="text-muted-foreground">Decisions tranchees</div>
              <div className="font-mono text-lg text-signal-green">{decisions.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Three-pane workspace */}
      <div className="max-w-[1600px] mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4">
          {/* LEFT: queue */}
          <Card className="p-3 bg-card/70 border-border h-[calc(100vh-220px)] overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-2 pb-2 pt-1">
              <Gavel className="w-4 h-4 text-signal-green" />
              <h2 className="text-sm font-semibold text-foreground">File d'arbitrage</h2>
            </div>
            <Separator className="mb-2" />
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {queue.length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-10 px-3">
                  Aucun desaccord en attente.
                  <br />
                  Le Conseil fonctionne en consensus.
                </div>
              )}
              {queue.map((arb) => {
                const isActive = arb.id === selectedId
                const urgency = URGENCY_CONFIG[arb.urgency]
                const agA = agentById(arb.disagreement.agentA)
                const agB = agentById(arb.disagreement.agentB)
                return (
                  <button
                    key={arb.id}
                    onClick={() => handleSelect(arb)}
                    className={cn(
                      'w-full text-left rounded-md border p-3 transition-all',
                      isActive
                        ? 'border-signal-green bg-signal-green/5 ring-1 ring-signal-green/30'
                        : 'border-border bg-background hover:border-signal-green/40 hover:bg-accent/20'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-sm font-medium text-foreground leading-tight">
                        {arb.studentName}
                      </span>
                      <Badge variant="outline" className={cn('text-[10px] py-0 px-1.5 font-normal', urgency.className)}>
                        {urgency.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {arb.disagreement.topic}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1">
                        {agA && (
                          <div className="w-6 h-6 rounded-full bg-secondary/70 border border-border flex items-center justify-center">
                            <AgentAvatar role={agA.role} size="sm" />
                          </div>
                        )}
                        {agB && (
                          <div className="w-6 h-6 rounded-full bg-secondary/70 border border-border flex items-center justify-center">
                            <AgentAvatar role={agB.role} size="sm" />
                          </div>
                        )}
                      </div>
                      <span className={cn('text-[10px] uppercase tracking-wider', SEVERITY_CLASS[arb.disagreement.severity])}>
                        {SEVERITY_LABEL[arb.disagreement.severity]}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelative(arb.requestedAt)}
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* CENTER: detail */}
          <Card
            className="p-0 bg-card/70 border-border h-[calc(100vh-220px)] overflow-hidden flex flex-col"
            data-demo="encadrant-center"
          >
            <AnimatePresence mode="wait">
              {selected && agentA && agentB ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
                          Desaccord · {SEVERITY_LABEL[selected.disagreement.severity]}
                        </p>
                        <h2 className="text-xl font-fraunces font-semibold text-foreground leading-tight">
                          {selected.disagreement.topic}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Dossier de <span className="text-foreground">{selected.studentName}</span>
                        </p>
                        {selected.disagreement.gameMasterNote && (() => {
                          const gmDecision = gameMasterDecisions.find(
                            (decision) => decision.relatedDisagreement === selected.disagreement.id
                          )
                          return gmDecision ? (
                            <Link href={`/gamemaster#${gmDecision.id}`} className="inline-flex mt-2">
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-signal-orange/40 text-signal-orange">
                                Decision GM
                              </Badge>
                            </Link>
                          ) : null
                        })()}
                      </div>
                      <Badge variant="outline" className={URGENCY_CONFIG[selected.urgency].className}>
                        {URGENCY_CONFIG[selected.urgency].label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      {selected.context}
                    </p>
                  </div>

                  {/* Opposing positions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-6 py-5 border-b border-border">
                    <PositionCard agent={agentA} position={selected.disagreement.positionA} />
                    <PositionCard agent={agentB} position={selected.disagreement.positionB} flipped />
                  </div>

                  {/* Resolutions + rationale */}
                  <div className="px-6 py-5 flex-1 overflow-y-auto">
                    <h3 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
                      Resolutions suggerees
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {selected.suggestedResolutions.map((res) => {
                        const isChosen = chosenResolution === res
                        return (
                          <button
                            key={res}
                            onClick={() => setChosenResolution(res)}
                            className={cn(
                              'text-left text-xs px-3 py-2 rounded-full border transition-all max-w-full',
                              isChosen
                                ? 'bg-signal-green/15 border-signal-green text-signal-green'
                                : 'bg-secondary/40 border-border text-muted-foreground hover:border-signal-green/40 hover:text-foreground'
                            )}
                          >
                            {res}
                          </button>
                        )
                      })}
                    </div>

                    <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                      Rationale de l'encadrant
                    </label>
                    <Textarea
                      value={rationale}
                      onChange={(e) => setRationale(e.target.value)}
                      placeholder="Expliquez votre decision pour l'etudiant et les agents. Cette justification est archivee dans le dossier de preuves."
                      className="min-h-[100px] bg-background border-border text-sm resize-none"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[11px] text-muted-foreground">
                        La decision sera signee et envoyee a {selected.studentName}.
                      </p>
                      <Button
                        disabled={!chosenResolution || !rationale.trim()}
                        onClick={handleSubmit}
                        className="bg-signal-green text-primary-foreground hover:bg-signal-green/90"
                      >
                        <Gavel className="w-4 h-4 mr-1.5" />
                        Trancher
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
                  <CheckCircle2 className="w-10 h-10 text-signal-green mb-3" />
                  <h2 className="text-xl font-fraunces font-semibold text-foreground">
                    File vide
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    Le Conseil a atteint le consensus sur tous les dossiers ouverts. Consultez
                    l'historique des decisions ci-dessous.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </Card>

          {/* RIGHT: alerts */}
          <Card className="p-3 bg-card/70 border-border h-[calc(100vh-220px)] overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-2 pb-2 pt-1">
              <Bell className="w-4 h-4 text-signal-orange" />
              <h2 className="text-sm font-semibold text-foreground">Signaux etudiants</h2>
            </div>
            <Separator className="mb-2" />
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {alerts.map((alert) => {
                const Icon = ALERT_ICON[alert.type]
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'rounded-md border p-3 transition-all',
                      alert.acknowledged
                        ? 'border-border bg-background/40 opacity-60'
                        : 'border-border bg-background'
                    )}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', ALERT_TONE[alert.severity])} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-foreground truncate">
                            {alert.studentName}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatRelative(alert.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <div className="flex gap-1.5 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[11px] px-2 flex-1"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Contacter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[11px] px-2 flex-1"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Planifier RDV
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent decisions table */}
      <div className="max-w-[1600px] mx-auto px-6 pb-12">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-signal-green" />
          <h2 className="text-base font-semibold text-foreground">Decisions recentes</h2>
        </div>
        <Card className="bg-card/70 border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Horodatage</th>
                  <th className="px-4 py-3 font-medium">Decision</th>
                  <th className="px-4 py-3 font-medium">Rationale</th>
                  <th className="px-4 py-3 font-medium text-right">Etat</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {decisions.map((dec, idx) => (
                    <motion.tr
                      key={dec.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-accent/20"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {dec.timestamp.toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium max-w-xs">
                        {dec.decision}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-lg">
                        <span className="line-clamp-2">{dec.rationale}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {dec.notifiedStudent ? (
                          <Badge variant="outline" className="bg-signal-green/10 text-signal-green border-signal-green/30">
                            Notifiee
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-signal-orange/10 text-signal-orange border-signal-orange/30">
                            En attente
                          </Badge>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function PositionCard({
  agent,
  position,
  flipped,
}: {
  agent: Agent
  position: string
  flipped?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-md border p-4 relative overflow-hidden',
        'border-border bg-background/50'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <AgentAvatar role={agent.role} name={agent.name} size="sm" showName />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground ml-auto">
          {flipped ? 'Contre-position' : 'Position'}
        </span>
      </div>
      <Quote
        className={cn(
          'absolute -bottom-2 -right-2 w-16 h-16 opacity-5',
          flipped ? 'rotate-180' : ''
        )}
      />
      <p className="text-sm text-foreground/90 leading-relaxed italic">"{position}"</p>
    </div>
  )
}
