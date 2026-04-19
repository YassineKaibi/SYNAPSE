'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useDemoTour } from '@/components/synapse/demo-tour'
import { agents, sampleDebate, scriptedResponses } from '@/lib/data/mock-data'
import { saveDemoArbitration } from '@/lib/demo-state'
import { AgentRoster } from '@/components/conseil/agent-roster'
import { DebatePanel } from '@/components/conseil/debate-panel'
import { ContextSidebar } from '@/components/conseil/context-sidebar'
import type { Agent, AgentMessage, AgentRole, DisagreementMarker } from '@/lib/types'

const KEYWORD_TO_ROLE: Array<{ needle: string; role: AgentRole }> = [
  { needle: 'archi', role: 'architecte' },
  { needle: 'backend', role: 'architecte' },
  { needle: 'api', role: 'architecte' },
  { needle: 'user', role: 'product_owner' },
  { needle: 'utilisateur', role: 'product_owner' },
  { needle: 'metier', role: 'product_owner' },
  { needle: 'risque', role: 'avocat_diable' },
  { needle: 'deadline', role: 'avocat_diable' },
  { needle: 'stress', role: 'coach_carriere' },
  { needle: 'carriere', role: 'coach_carriere' },
  { needle: 'cv', role: 'coach_carriere' },
  { needle: 'preuve', role: 'scribe' },
  { needle: 'rapport', role: 'scribe' },
  { needle: 'dossier', role: 'scribe' },
]

const FALLBACK_ROLES: AgentRole[] = [
  'architecte',
  'product_owner',
  'avocat_diable',
  'coach_carriere',
  'scribe',
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const DEMO_OPENING_MESSAGE =
  'Je veux preparer une demo jury claire: priorites techniques, impact metier et arbitrages visibles.'

const cloneDebate = () => ({
  ...sampleDebate,
  messages: [...sampleDebate.messages],
  disagreements: [...sampleDebate.disagreements],
  recommendations: [...sampleDebate.recommendations],
  gameMasterNotes: [...sampleDebate.gameMasterNotes],
})

export default function ConseilPage() {
  const { isDemoMode } = useDemoTour()
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const [speakingAgent, setSpeakingAgent] = useState<string | null>(null)
  const [debate, setDebate] = useState(cloneDebate)
  const [demoAutoplayRunning, setDemoAutoplayRunning] = useState(false)
  const [demoAutoplayDone, setDemoAutoplayDone] = useState(false)
  const cursorRef = useRef<Record<AgentRole, number>>({
    architecte: 0,
    product_owner: 0,
    avocat_diable: 0,
    coach_carriere: 0,
    scribe: 0,
  })
  const idCounterRef = useRef(0)
  const demoAutoplayLockRef = useRef(false)

  const nextId = (prefix: string) => {
    idCounterRef.current += 1
    return `${prefix}-${Date.now()}-${idCounterRef.current}`
  }

  const roleToAgentId = (role: AgentRole) => {
    const agent = agents.find((a) => a.role === role)
    return agent?.id
  }

  const selectRoles = (content: string): AgentRole[] => {
    const normalized = content.toLowerCase()
    const selected = new Set<AgentRole>()

    for (const { needle, role } of KEYWORD_TO_ROLE) {
      if (normalized.includes(needle)) {
        selected.add(role)
      }
      if (selected.size >= 2) break
    }

    for (const role of FALLBACK_ROLES) {
      if (selected.size >= 2) break
      selected.add(role)
    }

    return Array.from(selected).slice(0, 2)
  }

  const buildDisagreement = (
    topic: string,
    first: { role: AgentRole; response: (typeof scriptedResponses)[AgentRole][number] },
    second: { role: AgentRole; response: (typeof scriptedResponses)[AgentRole][number] }
  ): DisagreementMarker | null => {
    const aDisagreesB = first.response.disagreesWith === second.role
    const bDisagreesA = second.response.disagreesWith === first.role
    if (!aDisagreesB && !bDisagreesA) return null

    const agentAId = roleToAgentId(first.role)
    const agentBId = roleToAgentId(second.role)
    if (!agentAId || !agentBId) return null

    return {
      id: nextId('dis'),
      topic: `Desaccord Conseil · ${topic.slice(0, 60)}`,
      agentA: agentAId,
      agentB: agentBId,
      positionA: first.response.content,
      positionB: second.response.content,
      severity: 'moderate',
      status: 'active',
      gameMasterNote: 'Desaccord persistant detecte. Arbitrage encadrant recommande.',
    }
  }

  const handleSendMessage = async (content: string) => {
    const roles = selectRoles(content)
    const selected = roles.map((role) => {
      return nextScriptedResponse(role)
    })

    const disagreement = buildDisagreement(content, selected[0], selected[1])

    for (const item of selected) {
      const agentId = roleToAgentId(item.role)
      if (!agentId) continue

      setSpeakingAgent(agentId)
      await delay(500)

      const newMessage: AgentMessage = {
        id: nextId(`msg-live-${item.role}`),
        agentId,
        content: item.response.content,
        timestamp: new Date(),
        type: item.response.type,
        referencedSkills: item.response.referencedSkills,
        confidence: 78,
        disagreesWith: item.response.disagreesWith
          ? roleToAgentId(item.response.disagreesWith)
          : undefined,
      }

      setDebate((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }))

      await delay(500 + newMessage.content.length * 40)
    }

    setSpeakingAgent(null)

    if (disagreement) {
      setDebate((prev) => ({
        ...prev,
        disagreements: [...prev.disagreements, disagreement],
        status: 'escalated',
      }))
    }
  }

  const nextScriptedResponse = (role: AgentRole) => {
    const candidates = scriptedResponses[role]
    const idx = cursorRef.current[role] % candidates.length
    cursorRef.current[role] += 1
    return { role, response: candidates[idx] }
  }

  const runDemoAutoplay = async () => {
    if (demoAutoplayLockRef.current || demoAutoplayRunning || demoAutoplayDone) return
    demoAutoplayLockRef.current = true
    setDemoAutoplayRunning(true)
    try {
      setDebate(cloneDebate())
      await delay(150)
      setDebate((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: nextId('msg-demo-opening'),
            agentId: 'agent-scribe',
            content: `Ouverture demo (Amira): ${DEMO_OPENING_MESSAGE}`,
            timestamp: new Date(),
            type: 'question',
            confidence: 100,
          },
        ],
        gameMasterNotes: [
          ...prev.gameMasterNotes,
          `Ouverture demo: ${DEMO_OPENING_MESSAGE}`,
        ],
      }))

      const sequence: AgentRole[] = [
        'architecte',
        'product_owner',
        'avocat_diable',
        'coach_carriere',
        'scribe',
      ]
      const selected = sequence.map((role) => nextScriptedResponse(role))

      for (const item of selected) {
        const agentId = roleToAgentId(item.role)
        if (!agentId) continue

        setSpeakingAgent(agentId)
        await delay(800)

        const message: AgentMessage = {
          id: nextId(`msg-demo-${item.role}`),
          agentId,
          content: item.response.content,
          timestamp: new Date(),
          type: item.response.type,
          referencedSkills: item.response.referencedSkills,
          confidence: 84,
          disagreesWith: item.response.disagreesWith
            ? roleToAgentId(item.response.disagreesWith)
            : undefined,
        }
        setDebate((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }))
      }

      const nova = selected.find((entry) => entry.role === 'avocat_diable')
      const echo = selected.find((entry) => entry.role === 'coach_carriere')
      const disagreement =
        nova && echo ? buildDisagreement(DEMO_OPENING_MESSAGE, nova, echo) : null

      if (disagreement) {
        setDebate((prev) => ({
          ...prev,
          disagreements: [...prev.disagreements, disagreement],
          status: 'escalated',
          consensusReached: true,
        }))
        saveDemoArbitration({
          id: nextId('arb-demo'),
          studentId: 'user-amira',
          studentName: 'Amira Ben Salah',
          disagreement,
          requestedAt: new Date(),
          urgency: 'medium',
          context:
            'Sequence auto-play demo Conseil. Desaccord persistant entre Nova et Echo a arbitrer cote encadrant.',
          suggestedResolutions: [
            'Valider la priorite resilience (Echo)',
            'Escalade formelle immediate (Nova)',
            'Compromis: resilience + cadre de gouvernance hebdomadaire',
          ],
        })
      } else {
        setDebate((prev) => ({
          ...prev,
          consensusReached: true,
          status: 'concluded',
        }))
      }

      setDemoAutoplayDone(true)
    } finally {
      setSpeakingAgent(null)
      setDemoAutoplayRunning(false)
      demoAutoplayLockRef.current = false
    }
  }

  useEffect(() => {
    if (!isDemoMode) {
      setDemoAutoplayDone(false)
      setDemoAutoplayRunning(false)
      return
    }
    if (!demoAutoplayDone && !demoAutoplayRunning) {
      void runDemoAutoplay()
    }
  }, [demoAutoplayDone, demoAutoplayRunning, isDemoMode])

  useEffect(() => {
    const onDemoAction = (event: Event) => {
      const customEvent = event as CustomEvent<{ action?: string }>
      if (customEvent.detail?.action !== 'autoplay-conseil') return
      void runDemoAutoplay()
    }
    window.addEventListener('synapse:demo-step-action', onDemoAction as EventListener)
    return () =>
      window.removeEventListener(
        'synapse:demo-step-action',
        onDemoAction as EventListener
      )
  }, [demoAutoplayDone, demoAutoplayRunning])

  const handleAgentClick = (agent: Agent) => {
    setActiveAgent(agent === activeAgent ? null : agent)
  }

  const disagreementAgentIds = Array.from(
    new Set(
      debate.disagreements
        .filter((item) => item.status === 'active')
        .flatMap((item) => [item.agentA, item.agentB])
    )
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-7rem)]"
    >
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">Conseil des Agents</h1>
        <p className="text-muted-foreground">
          Dialoguez avec le Conseil. Deux agents repondent en sequence selon votre message.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_280px] gap-4 xl:gap-6 h-auto xl:h-[calc(100%-5rem)]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="order-2 xl:order-1 bg-card rounded-lg border border-border p-4 overflow-y-auto"
        >
          <AgentRoster
            agents={agents}
            activeAgentId={activeAgent?.id}
            speakingAgentId={speakingAgent ?? undefined}
            disagreementAgentIds={disagreementAgentIds}
            onAgentClick={handleAgentClick}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-1 xl:order-2 min-h-[50vh] xl:min-h-0"
          data-demo="conseil-panel"
        >
          <DebatePanel
            debate={debate}
            speakingAgentId={speakingAgent}
            onSendMessage={handleSendMessage}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="order-3 overflow-y-auto"
        >
          <ContextSidebar debate={debate} />
        </motion.div>
      </div>
    </motion.div>
  )
}
