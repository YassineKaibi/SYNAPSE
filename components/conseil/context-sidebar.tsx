'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Debate, SkillNode } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SkillNodeMini } from '@/components/graph/skill-node'
import { gameMasterDecisions, skillNodes } from '@/lib/data/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Lightbulb, Target, TrendingUp, AlertTriangle } from 'lucide-react'

interface ContextSidebarProps {
  debate: Debate
  relatedSkills?: SkillNode[]
}

export function ContextSidebar({ debate }: ContextSidebarProps) {
  // Extract all referenced skills from debate messages
  const referencedSkillIds = new Set(
    debate.messages.flatMap(m => m.referencedSkills || [])
  )
  const relatedSkills = skillNodes.filter(s => referencedSkillIds.has(s.id))

  // Calculate debate metrics
  const messagesByAgent = debate.messages.reduce((acc, m) => {
    acc[m.agentId] = (acc[m.agentId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sentimentCounts = debate.messages.reduce((acc, m) => {
    if (m.sentiment) {
      acc[m.sentiment] = (acc[m.sentiment] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const totalMessages = debate.messages.length
  const positiveRatio = ((sentimentCounts.positive || 0) / totalMessages) * 100
  const cautiousRatio = ((sentimentCounts.cautious || 0) / totalMessages) * 100

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Statut du debat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Etat</span>
            <Badge variant={debate.status === 'active' ? 'default' : 'secondary'}>
              {debate.status === 'active' ? 'En cours' : debate.status === 'concluded' ? 'Termine' : 'En pause'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Messages</span>
            <span className="text-sm font-medium">{totalMessages}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Consensus</span>
            <span className={cn(
              'text-sm font-medium',
              debate.consensusReached ? 'text-primary' : 'text-muted-foreground'
            )}>
              {debate.consensusReached ? 'Atteint' : 'En deliberation'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Analyse du sentiment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Positif</span>
              <span className="text-signal-green">{Math.round(positiveRatio)}%</span>
            </div>
            <Progress value={positiveRatio} className="h-1" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Prudent</span>
              <span className="text-signal-orange">{Math.round(cautiousRatio)}%</span>
            </div>
            <Progress value={cautiousRatio} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Related Skills */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Competences discutees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {relatedSkills.map(skill => (
              <SkillNodeMini key={skill.id} skill={skill} />
            ))}
            {relatedSkills.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Aucune competence referencee encore.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Preview */}
      {debate.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-signal-orange" />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {debate.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-xs text-muted-foreground pl-3 border-l-2 border-primary"
                >
                  {rec}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {debate.disagreements.length > 0 && (
        <Card data-demo="conseil-disagreement">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-orange" />
              </span>
              Desaccords en escalade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {debate.disagreements.map((item) => (
              <div key={item.id} className="rounded-md border border-signal-orange/30 bg-signal-orange/10 p-2">
                <p className="text-xs font-medium text-foreground">{item.topic}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {item.severity === 'fundamental' ? 'Niveau fondamental' : item.severity === 'moderate' ? 'Niveau modere' : 'Niveau mineur'}
                </p>
                {item.gameMasterNote && (() => {
                  const related = gameMasterDecisions.find((decision) => decision.relatedDisagreement === item.id)
                  return related ? (
                    <Link href={`/gamemaster#${related.id}`} className="inline-flex mt-2">
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-signal-orange/40 text-signal-orange hover:bg-signal-orange/10">
                        Decision GM
                      </Badge>
                    </Link>
                  ) : null
                })()}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
