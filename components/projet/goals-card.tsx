'use client'

import { motion } from 'framer-motion'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Target, Plus, Edit2 } from 'lucide-react'
import { skillNodes } from '@/lib/data/mock-data'

interface GoalsCardProps {
  project: Project
  onEditGoals?: () => void
}

export function GoalsCard({ project, onEditGoals }: GoalsCardProps) {
  // Calculate progress based on target skills
  const targetSkillData = project.targetSkills
    .map(id => skillNodes.find(s => s.id === id))
    .filter(Boolean)
  
  const avgProgress = targetSkillData.length > 0
    ? targetSkillData.reduce((sum, s) => sum + (s?.level || 0), 0) / targetSkillData.length
    : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Objectifs du projet
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEditGoals}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression globale</span>
            <span className="font-medium">{Math.round(avgProgress)}%</span>
          </div>
          <Progress value={avgProgress} className="h-2" />
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {project.goals.map((goal, index) => {
            // Simulate some goals being complete
            const isComplete = index < 1
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg',
                  'bg-secondary/50 hover:bg-secondary transition-colors'
                )}
              >
                <Checkbox 
                  checked={isComplete}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm',
                    isComplete && 'line-through text-muted-foreground'
                  )}>
                    {goal}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Add Goal Button */}
        <Button variant="outline" className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un objectif
        </Button>

        {/* Target Skills */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Competences cibles
          </h4>
          <div className="flex flex-wrap gap-2">
            {targetSkillData.map(skill => skill && (
              <div
                key={skill.id}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium',
                  'bg-primary/20 text-primary border border-primary/30'
                )}
              >
                {skill.name}
                <span className="ml-1 text-primary/70">{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
