'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { agents, skillNodes } from '@/lib/data/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { AgentSigil } from '@/components/agents/agent-sigil'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'q-architecte',
    role: 'architecte' as const,
    question:
      'Quelles decisions techniques vous semblent les plus risquées aujourd hui dans votre PFE LogiTrans ?',
  },
  {
    id: 'q-po',
    role: 'product_owner' as const,
    question:
      'Quelle valeur metier concrete voulez-vous livrer en priorite pour les equipes LogiTrans ?',
  },
  {
    id: 'q-coach',
    role: 'coach_carriere' as const,
    question:
      'Quelle competence souhaitez-vous prouver au jury ENIT d ici la soutenance ?',
  },
  {
    id: 'q-nova',
    role: 'avocat_diable' as const,
    question:
      'Si votre plan echoue dans 3 semaines, quelle hypothese aura ete sous-estimee selon vous ?',
  },
]

const TOTAL_STEPS = 7

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const diagnosticSkills = useMemo(
    () => skillNodes.filter((node) => node.source === 'diagnostic').slice(0, 10),
    []
  )
  const progress = (step / TOTAL_STEPS) * 100

  const questionIndex = step - 2
  const currentQuestion = QUESTIONS[questionIndex]
  const currentAgent = currentQuestion
    ? agents.find((agent) => agent.role === currentQuestion.role)
    : null

  const canContinue =
    step <= 1 ||
    step >= 6 ||
    Boolean(currentQuestion && answers[currentQuestion.id]?.trim().length)

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
      return
    }
    router.push('/projet')
  }

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Diagnostic Jour 0</p>
            <p className="text-sm font-medium">Etape {step} / {TOTAL_STEPS}</p>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl"
        >
          {step === 1 && (
            <div className="text-center space-y-8" data-demo="onboarding-intro">
              <div>
                <h1 className="font-fraunces text-4xl text-foreground mb-3">
                  Bienvenue Amira
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Vous allez rencontrer les 5 agents du Conseil. Ils lancent votre
                  diagnostic et calibrent votre jumeau cognitif pour le PFE LogiTrans.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                    className="rounded-lg border border-border bg-card p-3 flex flex-col items-center gap-2"
                  >
                    <AgentSigil role={agent.role} size="md" voiceStyle={agent.voiceStyle} ariaLabel={`Sigil de ${agent.name}`} />
                    <p className="text-xs font-medium" style={{ color: agent.color }}>
                      {agent.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {step >= 2 && step <= 5 && currentQuestion && currentAgent && (
            <div className="space-y-5">
              <Card className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <AgentSigil role={currentAgent.role} size="md" voiceStyle={currentAgent.voiceStyle} ariaLabel={`Sigil de ${currentAgent.name}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1" style={{ color: currentAgent.color }}>
                        {currentAgent.name}
                      </p>
                      <p className="text-base leading-relaxed">{currentQuestion.question}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Textarea
                value={answers[currentQuestion.id] ?? ''}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
                }
                placeholder="Votre reponse..."
                className="min-h-36 resize-none"
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-fraunces text-3xl mb-2">Votre graphe initial se construit</h2>
                <p className="text-muted-foreground">
                  Les competences detectees pendant le diagnostic se debloquent en direct.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {diagnosticSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.35 }}
                    className="rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{skill.name}</p>
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + 0.15 }}
                      className="text-xs text-muted-foreground mt-1"
                    >
                      Debloquee via diagnostic
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="text-center space-y-4">
              <h2 className="font-fraunces text-3xl">Diagnostic termine</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Le Conseil est pret. Votre parcours PFE est initialise et vous pouvez
                maintenant piloter votre projet depuis la vue Projet.
              </p>
              <p className="text-sm text-muted-foreground">
                4 reponses enregistrees localement pour cette session.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button onClick={handleNext} disabled={!canContinue}>
            {step === TOTAL_STEPS ? 'Aller au projet' : 'Continuer'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
