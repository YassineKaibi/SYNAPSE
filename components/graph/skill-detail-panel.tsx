'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { SkillNode, SkillEdge } from '@/lib/types'
import { cn } from '@/lib/utils'
import { skillNodes, skillEdges } from '@/lib/data/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  X, 
  Lock, 
  Check, 
  Sparkles, 
  ArrowUp, 
  ArrowRight,
  BookOpen,
  Target,
  Clock,
} from 'lucide-react'

interface SkillDetailPanelProps {
  skill: SkillNode | null
  onClose: () => void
  onNavigateToSkill?: (skillId: string) => void
}

const statusConfig = {
  locked: { icon: Lock, label: 'Verrouillee', color: 'text-muted-foreground' },
  unlocked: { icon: ArrowUp, label: 'En cours', color: 'text-primary' },
  in_progress: { icon: ArrowRight, label: 'En progression', color: 'text-skill-suggested' },
  mastered: { icon: Check, label: 'Maitrisee', color: 'text-skill-mastered' },
  suggested: { icon: Sparkles, label: 'Suggeree', color: 'text-skill-suggested' },
}

export function SkillDetailPanel({ skill, onClose, onNavigateToSkill }: SkillDetailPanelProps) {
  if (!skill) return null

  const config = statusConfig[skill.status]
  const StatusIcon = config.icon

  // Find prerequisites and dependents
  const prerequisites = skill.prerequisites
    .map(id => skillNodes.find(s => s.id === id))
    .filter(Boolean) as SkillNode[]

  const dependents = skillEdges
    .filter(e => e.source === skill.id)
    .map(e => skillNodes.find(s => s.id === e.target))
    .filter(Boolean) as SkillNode[]

  // Calculate estimated time to master
  const estimatedHours = Math.round((100 - skill.level) * 0.5)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="w-80 shrink-0"
      >
        <Card className="h-full">
          <CardHeader className="relative pb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-2 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <StatusIcon className={cn('w-5 h-5', config.color)} />
              <Badge variant="outline" className={cn('text-xs', config.color)}>
                {config.label}
              </Badge>
            </div>
            <CardTitle className="font-serif text-xl pr-8">{skill.name}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <p className="text-sm text-muted-foreground">{skill.description}</p>

            {/* Progress */}
            {skill.status !== 'locked' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
                {skill.level < 100 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>~{estimatedHours}h pour maitriser</span>
                  </div>
                )}
              </div>
            )}

            {/* Category */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Categorie</span>
              <Badge variant="secondary" className="capitalize">
                {skill.category}
              </Badge>
            </div>

            {/* Prerequisites */}
            {prerequisites.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Prerequis
                </h4>
                <div className="space-y-1">
                  {prerequisites.map(prereq => (
                    <button
                      key={prereq.id}
                      onClick={() => onNavigateToSkill?.(prereq.id)}
                      className={cn(
                        'w-full flex items-center justify-between p-2 rounded-lg',
                        'bg-secondary/50 hover:bg-secondary transition-colors text-left'
                      )}
                    >
                      <span className="text-sm">{prereq.name}</span>
                      <div className="flex items-center gap-2">
                        {prereq.status === 'mastered' && (
                          <Check className="w-4 h-4 text-skill-mastered" />
                        )}
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Unlocks */}
            {dependents.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  Deverrouille
                </h4>
                <div className="space-y-1">
                  {dependents.map(dep => (
                    <button
                      key={dep.id}
                      onClick={() => onNavigateToSkill?.(dep.id)}
                      className={cn(
                        'w-full flex items-center justify-between p-2 rounded-lg',
                        'bg-secondary/50 hover:bg-secondary transition-colors text-left'
                      )}
                    >
                      <span className="text-sm">{dep.name}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 space-y-2">
              {skill.status === 'locked' && prerequisites.every(p => p.status === 'mastered') && (
                <Button className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Debloquer cette competence
                </Button>
              )}
              {skill.status === 'unlocked' && (
                <Button className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continuer l&apos;apprentissage
                </Button>
              )}
              {skill.status === 'suggested' && (
                <Button className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ajouter au parcours
                </Button>
              )}
              {skill.status === 'mastered' && (
                <Button variant="outline" className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Approfondir
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
