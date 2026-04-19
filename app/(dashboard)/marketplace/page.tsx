'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { companyBriefs, skillNodes } from '@/lib/data/mock-data'
import type { CompanyBrief, PedagogicalArcPhase } from '@/lib/types'
import { AgentSigil } from '@/components/agents/agent-sigil'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  MapPin,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Network,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Compute how many briefs match >= 80%
const highMatchCount = companyBriefs.filter(
  (b) => (b.matchScore ?? 0) >= 80
).length

// All unique industries
const allIndustries = Array.from(new Set(companyBriefs.map((b) => b.industry)))

const ARC_PHASE_LABELS: Record<PedagogicalArcPhase, string> = {
  discovery: 'Découverte',
  exploration: 'Exploration',
  solution: 'Solution',
  industrialization: 'Industrialisation',
}

const ARC_PHASE_COLORS: Record<PedagogicalArcPhase, string> = {
  discovery: 'text-agent-zephyr border-agent-zephyr/40 bg-agent-zephyr/5',
  exploration: 'text-agent-artemis border-agent-artemis/40 bg-agent-artemis/5',
  solution: 'text-signal-green border-signal-green/40 bg-signal-green/5',
  industrialization: 'text-signal-orange border-signal-orange/40 bg-signal-orange/5',
}

function matchScoreColor(score: number): string {
  if (score >= 80) return 'text-signal-green'
  if (score >= 60) return 'text-signal-blue'
  return 'text-signal-orange'
}

function matchScoreStroke(score: number): string {
  if (score >= 80) return 'var(--signal-green)'
  if (score >= 60) return 'var(--signal-blue)'
  return 'var(--signal-orange)'
}

function CircularScore({ score }: { score: number }) {
  const r = 16
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle cx={22} cy={22} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
        <motion.circle
          cx={22}
          cy={22}
          r={r}
          fill="none"
          stroke={matchScoreStroke(score)}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold',
          matchScoreColor(score)
        )}
      >
        {score}%
      </span>
    </div>
  )
}

function SkillChip({
  skillId,
  variant = 'required',
}: {
  skillId: string
  variant?: 'required' | 'nice'
}) {
  const skill = skillNodes.find((s) => s.id === skillId)
  if (!skill) return null
  return (
    <Badge
      variant={variant === 'required' ? 'secondary' : 'outline'}
      className={cn(
        'text-[10px] font-mono',
        variant === 'nice' && 'opacity-70'
      )}
    >
      {skill.name}
    </Badge>
  )
}

function BriefCard({
  brief,
  onExplore,
}: {
  brief: CompanyBrief
  onExplore: (b: CompanyBrief) => void
}) {
  const matchScore = brief.matchScore ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card
        className={cn(
          'h-full flex flex-col hover:border-primary/20 transition-colors',
          brief.status === 'accepted' && 'border-signal-green/30 bg-signal-green/5'
        )}
      >
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          {/* Top: company + score */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-muted-foreground">{brief.companyName}</p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <Badge variant="secondary" className="text-[10px]">
                  {brief.industry}
                </Badge>
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <MapPin className="w-2.5 h-2.5" />
                  {brief.location}
                </span>
              </div>
            </div>
            {brief.status === 'accepted' ? (
              <Badge className="bg-signal-green/20 text-signal-green border-signal-green/40 text-[10px] shrink-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Accepté
              </Badge>
            ) : (
              <CircularScore score={matchScore} />
            )}
          </div>

          {/* Title + problem */}
          <div className="flex-1">
            <h3 className="font-serif text-base font-bold text-foreground mb-1.5 leading-snug text-balance">
              {brief.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {brief.problemStatement}
            </p>
          </div>

          {/* Expected outcomes */}
          <ul className="space-y-0.5">
            {brief.expectedOutcomes.slice(0, 3).map((o) => (
              <li key={o} className="flex items-center gap-1.5 text-[11px] text-foreground/70">
                <CircleDot className="w-2.5 h-2.5 shrink-0 text-primary/50" />
                {o}
              </li>
            ))}
          </ul>

          {/* Skills */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap gap-1">
              {brief.requiredSkills.map((s) => (
                <SkillChip key={s} skillId={s} variant="required" />
              ))}
              {brief.niceToHaveSkills.map((s) => (
                <SkillChip key={s} skillId={s} variant="nice" />
              ))}
            </div>
          </div>

          {/* Actions */}
          {brief.status !== 'accepted' && (
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant="default"
                className="flex-1 text-xs"
                onClick={() => onExplore(brief)}
              >
                Explorer l&apos;arc pédagogique
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Candidater
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ArcSheet({
  brief,
  open,
  onClose,
}: {
  brief: CompanyBrief | null
  open: boolean
  onClose: () => void
}) {
  if (!brief) return null
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif text-xl">{brief.title}</SheetTitle>
          <SheetDescription className="text-xs font-mono">
            {brief.companyName} · {brief.industry}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {brief.pedagogicalArcs.map((arc) => (
            <div
              key={arc.phase}
              className={cn(
                'rounded-lg border p-4 space-y-3',
                ARC_PHASE_COLORS[arc.phase]
              )}
            >
              <h4 className="font-semibold text-sm">
                {ARC_PHASE_LABELS[arc.phase]}
              </h4>
              <div className="space-y-1.5">
                {arc.activities.map((act, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="font-mono text-muted-foreground shrink-0 mt-0.5">
                      {i + 1}.
                    </span>
                    {act}
                  </div>
                ))}
              </div>
              <div className="pt-1 border-t border-current/10">
                <p className="text-[10px] text-muted-foreground mb-1.5">
                  Compétences développées
                </p>
                <div className="flex flex-wrap gap-1">
                  {arc.skillsGained.map((sid) => {
                    const skill = skillNodes.find((s) => s.id === sid)
                    return skill ? (
                      <Badge key={sid} variant="outline" className="text-[10px] font-mono">
                        {skill.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [activeIndustries, setActiveIndustries] = useState<string[]>([])
  const [arcBrief, setArcBrief] = useState<CompanyBrief | null>(null)
  const [arcOpen, setArcOpen] = useState(false)

  const handleExplore = (brief: CompanyBrief) => {
    setArcBrief(brief)
    setArcOpen(true)
  }

  const toggleIndustry = (ind: string) => {
    setActiveIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    )
  }

  const filtered = companyBriefs.filter((b) => {
    const matchesSearch =
      search === '' ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.problemStatement.toLowerCase().includes(search.toLowerCase()) ||
      b.companyName.toLowerCase().includes(search.toLowerCase())
    const matchesIndustry =
      activeIndustries.length === 0 || activeIndustries.includes(b.industry)
    return matchesSearch && matchesIndustry
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl font-bold text-balance">
            Marketplace des Problèmes Réels
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mt-1 leading-relaxed">
            Chaque brief est un vrai problème d&apos;entreprise. Vous ne postulez pas à un stage,
            vous embarquez sur une mission.
          </p>
        </div>
      </div>

      {/* Match score banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 p-4 rounded-lg bg-signal-green/10 border border-signal-green/30"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-signal-green shrink-0"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm font-medium text-foreground">
            <span className="font-mono font-bold text-signal-green">{highMatchCount}</span>
            {' '}brief{highMatchCount > 1 ? 's' : ''} match
            {highMatchCount > 1 ? 'ent' : 'e'} votre graphe de compétences à plus de{' '}
            <span className="font-mono font-bold text-signal-green">80%</span>
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs shrink-0" asChild>
          <Link href="/graphe?view=coverage">
            Voir ma couverture de compétences
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </motion.div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Décrivez le problème que vous voulez attaquer..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Secteurs:
          </span>
          {allIndustries.map((ind) => (
            <Badge
              key={ind}
              variant={activeIndustries.includes(ind) ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => toggleIndustry(ind)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  toggleIndustry(ind)
                }
              }}
            >
              {ind}
            </Badge>
          ))}
        </div>
      </div>

      {/* Briefs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((brief, idx) => (
            <motion.div
              key={brief.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: idx * 0.04 }}
              className="h-full"
            >
              <BriefCard brief={brief} onExplore={handleExplore} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Network className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun brief ne correspond à cette recherche.</p>
        </div>
      )}

      {/* Arc Sheet */}
      <ArcSheet
        brief={arcBrief}
        open={arcOpen}
        onClose={() => setArcOpen(false)}
      />
    </div>
  )
}
