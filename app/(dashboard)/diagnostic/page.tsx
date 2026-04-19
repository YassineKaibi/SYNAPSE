'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { agents, latestDiagnosticTranscript, skillNodes } from '@/lib/data/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AgentSigil } from '@/components/agents/agent-sigil'
import { RotateCcw } from 'lucide-react'

export default function DiagnosticPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Re-diagnostic</h1>
          <p className="text-muted-foreground">
            Transcript de la derniere session diagnostique et competences derivees.
          </p>
        </div>
        <Button asChild>
          <Link href="/onboarding">
            <RotateCcw className="w-4 h-4 mr-2" />
            Relancer le diagnostic
          </Link>
        </Button>
      </div>

      <div className="space-y-4" data-demo="diagnostic-transcript">
        {latestDiagnosticTranscript.map((entry, index) => {
          const agent = agents.find((a) => a.role === entry.role)
          if (!agent) return null

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-3">
                    <AgentSigil
                      role={agent.role}
                      size="sm"
                      animated={false}
                      voiceStyle={agent.voiceStyle}
                      ariaLabel={`Sigil de ${agent.name}`}
                    />
                    <span style={{ color: agent.color }}>{agent.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border border-border bg-secondary/30 p-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Question</p>
                    <p className="text-sm">{entry.question}</p>
                  </div>
                  <div className="rounded-md border border-border bg-background p-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Reponse etudiante</p>
                    <p className="text-sm">{entry.answer}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Competences derivees
                    </p>
                    {entry.derivedSkills.map((derived) => {
                      const skill = skillNodes.find((s) => s.id === derived.skillId)
                      if (!skill) return null
                      return (
                        <div key={derived.skillId} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span>{skill.name}</span>
                            <Badge variant="outline" className="font-mono text-[11px]">
                              {derived.confidence}%
                            </Badge>
                          </div>
                          <Progress value={derived.confidence} className="h-1.5" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
