'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { companyBriefs, candidateStudents, skillEdges, skillNodes } from '@/lib/data/mock-data'
import type { CompanyBrief, CandidateStudent, SkillNode } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Building2,
  MapPin,
  Search,
  Plus,
  Network,
  Users,
  CheckCircle2,
  CircleDot,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SkillForceGraph } from '@/components/graph/skill-force-graph'

// Company briefs for LogiTrans SA (company-logitrans)
const COMPANY_ID = 'company-logitrans'
const myBriefs = companyBriefs.filter((b) => b.companyId === COMPANY_ID)
const otherBriefs = companyBriefs.filter((b) => b.companyId !== COMPANY_ID)

const STATUS_LABELS: Record<CompanyBrief['status'], string> = {
  available: 'Ouvert',
  applied: 'Candidatures',
  accepted: 'Accepté',
  rejected: 'Refusé',
}

const STATUS_COLORS: Record<CompanyBrief['status'], string> = {
  available: 'bg-signal-blue/20 text-signal-blue border-signal-blue/40',
  applied: 'bg-signal-orange/20 text-signal-orange border-signal-orange/40',
  accepted: 'bg-signal-green/20 text-signal-green border-signal-green/40',
  rejected: 'bg-destructive/20 text-destructive border-destructive/40',
}

// Fake candidate counts per brief
const CANDIDATE_COUNTS: Record<string, number> = {
  'brief-logitrans': 3,
  'brief-pharmadist': 7,
  'brief-olijobs': 4,
  'brief-smartpark': 5,
  'brief-educonnect': 2,
  'brief-wastetrack': 8,
}

const BRIEF_WIZARD_STEPS = [
  { id: 1, label: 'Contexte métier' },
  { id: 2, label: 'Problème à résoudre' },
  { id: 3, label: 'Contraintes' },
  { id: 4, label: 'Livrables attendus' },
  { id: 5, label: 'Analyse IA' },
]

function matchScoreColor(score: number): string {
  if (score >= 80) return 'text-signal-green'
  if (score >= 60) return 'text-signal-blue'
  return 'text-signal-orange'
}

function CircularScore({ score, size = 48 }: { score: number; size?: number }) {
  const r = size * 0.36
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const cx = size / 2
  const cy = size / 2

  const strokeColor = score >= 80
    ? 'var(--signal-green)'
    : score >= 60
    ? 'var(--signal-blue)'
    : 'var(--signal-orange)'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center font-mono font-bold',
          matchScoreColor(score)
        )}
        style={{ fontSize: size * 0.2 }}
      >
        {score}%
      </span>
    </div>
  )
}

// AI Analysis step fake stream
function AIAnalysisStep() {
  const [started, setStarted] = useState(false)
  const [text, setText] = useState('')
  const fullText = `Analyse du brief en cours...\n\nCompétences extraites:\n• Python (niveau avancé requis)\n• SQL & PostgreSQL\n• React (interface)\n• FastAPI (backend)\n\nMaturité estimée: 6-8 mois de pratique autonome\n\nArcs pédagogiques suggérés:\n1. Découverte — Audit systèmes existants, stakeholders\n2. Exploration — Prototypage API GPS, benchmark\n3. Solution — Dev complet tracking + dashboard\n4. Industrialisation — CI/CD, documentation, tests charge\n\nProfils correspondants dans le graphe: 3 étudiants à 80%+`

  const start = () => {
    setStarted(true)
    setText('')
    let i = 0
    const interval = setInterval(() => {
      i += 2
      setText(fullText.slice(0, i))
      if (i >= fullText.length) clearInterval(interval)
    }, 25)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-signal-green" />
        <span className="text-sm font-medium">Analyse IA du Brief</span>
      </div>
      {!started ? (
        <Button onClick={start} className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Lancer l&apos;analyse
        </Button>
      ) : (
        <div className="bg-secondary/50 rounded-lg p-4 border border-border font-mono text-xs text-foreground/80 min-h-[200px] whitespace-pre-line leading-relaxed">
          {text}
          {text.length < fullText.length && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1.5 h-3 bg-primary ml-0.5 align-middle"
            />
          )}
        </div>
      )}
    </div>
  )
}

// Brief creation sheet wizard
function NewBriefSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<Record<number, string>>({})

  const STEP_PLACEHOLDERS: Record<number, string> = {
    1: "Décrivez votre secteur d'activité, taille de l'entreprise, contexte du projet...",
    2: "Quel est le problème concret à résoudre? Quelle perte mesurable observez-vous?",
    3: "Technologies imposées, budget, délais non-négociables, contraintes réglementaires...",
    4: "Qu'attendez-vous en fin de PFE? Code? Documentation? Prototype testé? Rapport?",
    5: '',
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[520px] sm:max-w-[520px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif text-xl">Nouveau Brief</SheetTitle>
          <SheetDescription>
            Postez un vrai problème. Pas une offre de stage.
          </SheetDescription>
        </SheetHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-6">
          {BRIEF_WIZARD_STEPS.map((s) => (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-colors shrink-0',
                  s.id < step
                    ? 'bg-signal-green text-background'
                    : s.id === step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                {s.id < step ? '✓' : s.id}
              </div>
              {s.id < BRIEF_WIZARD_STEPS.length && (
                <div
                  className={cn(
                    'flex-1 h-px',
                    s.id < step ? 'bg-signal-green' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {step < 5 ? (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-1">
                  {BRIEF_WIZARD_STEPS[step - 1].label}
                </h3>
                <Textarea
                  value={values[step] ?? ''}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [step]: e.target.value }))
                  }
                  placeholder={STEP_PLACEHOLDERS[step]}
                  className="min-h-[140px] resize-none text-sm"
                />
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => step > 1 && setStep((s) => s - 1)}
                  disabled={step === 1}
                >
                  Retour
                </Button>
                <Button onClick={() => setStep((s) => Math.min(s + 1, 5))}>
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <AIAnalysisStep />
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(4)}>
                  Retour
                </Button>
                <Button
                  className="bg-signal-green hover:bg-signal-green/90 text-background"
                  onClick={onClose}
                >
                  Publier le brief
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Tab 1: Mes Briefs
function MesBriefs() {
  const [newBriefOpen, setNewBriefOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setNewBriefOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Nouveau brief
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Candidats</TableHead>
              <TableHead>Score moyen</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myBriefs.map((brief) => {
              const count = CANDIDATE_COUNTS[brief.id] ?? 0
              const avgScore = brief.matchScore ?? 75
              return (
                <TableRow key={brief.id}>
                  <TableCell>
                    <p className="font-medium text-sm text-foreground">{brief.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{brief.industry}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('text-[10px]', STATUS_COLORS[brief.status])}
                    >
                      {STATUS_LABELS[brief.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{count}</span>
                  </TableCell>
                  <TableCell>
                    <span className={cn('font-mono text-sm', matchScoreColor(avgScore))}>
                      {avgScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Voir candidats
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      <NewBriefSheet open={newBriefOpen} onClose={() => setNewBriefOpen(false)} />
    </div>
  )
}

// NLP-style skill extraction (simulated)
const SKILL_KEYWORDS: Record<string, string[]> = {
  'sk-python': ['python', 'django', 'fastapi', 'flask', 'pandas', 'numpy'],
  'sk-sql': ['sql', 'postgresql', 'mysql', 'database', 'base de donnees', 'bdd'],
  'sk-react': ['react', 'frontend', 'interface', 'ui', 'ux', 'javascript', 'typescript'],
  'sk-fastapi': ['fastapi', 'api', 'rest', 'backend'],
  'sk-docker': ['docker', 'conteneur', 'devops', 'kubernetes', 'k8s', 'ci/cd'],
  'sk-stakeholder': ['stakeholder', 'client', 'communication', 'parties prenantes'],
  'sk-resilience': ['resilience', 'adaptation', 'stress', 'pression', 'autonomie'],
  'sk-data-analysis': ['data', 'analyse', 'analytics', 'donnees', 'kpi', 'metrics'],
  'sk-supply-chain': ['supply chain', 'logistique', 'logistics', 'transport', 'flotte'],
  'sk-route-optim': ['optimisation', 'routes', 'routage', 'algorithme', 'vrp', 'tsp'],
}

function extractSkillsFromQuery(query: string): { skillId: string; keyword: string }[] {
  const lowerQuery = query.toLowerCase()
  const extracted: { skillId: string; keyword: string }[] = []
  
  Object.entries(SKILL_KEYWORDS).forEach(([skillId, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerQuery.includes(keyword) && !extracted.find(e => e.skillId === skillId)) {
        extracted.push({ skillId, keyword })
      }
    })
  })
  
  return extracted
}

// Tab 2: Recherche dans le Graphe
function RechercheGraphe() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<CandidateStudent[] | null>(null)
  const [extractedSkills, setExtractedSkills] = useState<{ skillId: string; keyword: string }[]>([])
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateStudent | null>(null)
  const requiredSkillIds = extractedSkills.map((skill) => skill.skillId)

  const handleSearch = () => {
    if (!query.trim()) return
    setLoading(true)
    setResults(null)
    setShowAnalysis(false)
    
    // Extract skills from query
    const skills = extractSkillsFromQuery(query)
    
    setTimeout(() => {
      setExtractedSkills(skills)
      setShowAnalysis(true)
      
      setTimeout(() => {
        setLoading(false)
        const requiredSkills = skills.map((skill) => skill.skillId)
        const sortedCandidates = [...candidateStudents]
          .map((candidate) => {
            const matched = candidate.matchedSkills.filter((skillId) => requiredSkills.includes(skillId))
            const coverage = requiredSkills.length > 0 ? matched.length / requiredSkills.length : 0
            return { ...candidate, matchScore: Math.round(coverage * 100), matchedSkills: matched }
          })
          .sort((a, b) => b.matchScore - a.matchScore)
        setResults(sortedCandidates)
      }, 800)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-secondary/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Network className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-1">Recherche semantique dans le graphe</h3>
            <p className="text-xs text-muted-foreground">
              Decrivez le profil recherche en langage naturel. L&apos;IA extrait les competences 
              et interroge le graphe de competences SYNAPSE pour trouver les meilleurs candidats.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Exemple: Je cherche un etudiant capable de developper un backend Python/FastAPI pour une API de tracking GPS, avec une bonne gestion des stakeholders et une experience en supply chain."
          className="min-h-[100px] resize-none text-sm"
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Quick skill chips */}
            {['Python', 'React', 'Supply Chain', 'DevOps'].map(chip => (
              <Badge 
                key={chip}
                variant="outline" 
                className="text-[10px] cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => setQuery(prev => prev + (prev ? ' ' : '') + chip.toLowerCase())}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setQuery((prev) => prev + (prev ? ' ' : '') + chip.toLowerCase())
                  }
                }}
              >
                + {chip}
              </Badge>
            ))}
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Interrogation du graphe...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Skill extraction analysis */}
      <AnimatePresence>
        {showAnalysis && extractedSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Competences extraites de la requete</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map(({ skillId, keyword }) => {
                  const skill = skillNodes.find(s => s.id === skillId)
                  return skill ? (
                    <Badge 
                      key={skillId} 
                      variant="secondary"
                      className="text-xs gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-signal-green" />
                      {skill.name}
                      <span className="text-muted-foreground">({keyword})</span>
                    </Badge>
                  ) : null
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {extractedSkills.length} competences detectees - recherche dans {candidateStudents.length} profils du graphe
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-mono">
                {results.length} profils trouves dans le graphe SYNAPSE
              </p>
              <Badge variant="outline" className="text-[10px]">
                Tries par score de matching
              </Badge>
            </div>
            {results.map((student, idx) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className={cn(
                  'p-4',
                  idx === 0 && 'border-signal-green/40 bg-signal-green/5'
                )}>
                  <div className="flex items-start gap-4">
                    <CircularScore score={student.matchScore} size={52} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm text-foreground">{student.name}</p>
                        {idx === 0 && (
                          <Badge className="text-[10px] bg-signal-green/20 text-signal-green border-signal-green/40">
                            Meilleur match
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mb-2">
                        {student.school} · {student.program}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {student.matchedSkills.map((sid) => {
                          const skill = skillNodes.find((s) => s.id === sid)
                          const isMatched = extractedSkills.find(e => e.skillId === sid)
                          return skill ? (
                            <Badge 
                              key={sid} 
                              variant={isMatched ? 'default' : 'secondary'} 
                              className={cn(
                                'text-[10px] font-mono',
                                isMatched && 'bg-signal-green/20 text-signal-green border-signal-green/40'
                              )}
                            >
                              {isMatched && <CheckCircle2 className="w-2.5 h-2.5 mr-1" />}
                              {skill.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                      <div className="space-y-0.5 mb-3">
                        {student.evidenceExcerpts.map((ex, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-1.5 text-[11px] text-foreground/70"
                          >
                            <CircleDot className="w-2.5 h-2.5 shrink-0 mt-0.5 text-primary/40" />
                            {ex}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => setSelectedCandidate(student)}>
                            <Network className="w-3 h-3 mr-1" />
                            Voir le graphe
                          </Button>
                        <Button size="sm" variant="default" className="text-xs">
                          Contacter
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={Boolean(selectedCandidate)} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
        <SheetContent className="w-[560px] sm:max-w-[560px]">
          <SheetHeader>
            <SheetTitle>Graphe partiel du candidat</SheetTitle>
            <SheetDescription>
              {selectedCandidate?.name} · competences alignees avec la requete
            </SheetDescription>
          </SheetHeader>
          {selectedCandidate && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.matchedSkills.map((id) => {
                  const skill = skillNodes.find((node) => node.id === id)
                  return skill ? (
                    <Badge key={id} className="bg-signal-green/20 text-signal-green border-signal-green/40">
                      {skill.name}
                    </Badge>
                  ) : null
                })}
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                {(() => {
                  const subsetNodes = requiredSkillIds
                    .map((id) => skillNodes.find((node) => node.id === id))
                    .filter((node): node is NonNullable<typeof node> => Boolean(node))
                    .map((node) => ({
                      ...node,
                      status: (selectedCandidate.matchedSkills.includes(node.id) ? 'mastered' : 'locked') as SkillNode['status'],
                    }))
                  const subsetEdges = skillEdges.filter(
                    (edge) =>
                      subsetNodes.some((node) => node.id === edge.source) &&
                      subsetNodes.some((node) => node.id === edge.target)
                  )
                  return (
                <SkillForceGraph
                  nodes={subsetNodes}
                  edges={subsetEdges}
                  width={500}
                  height={320}
                />
                  )
                })()}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Tab 3: Candidats sur mes briefs
function CandidatsSurBriefs() {
  return (
    <div className="space-y-5">
      {myBriefs.map((brief) => {
        const topCandidates = candidateStudents.slice(0, 3)
        return (
          <Card key={brief.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{brief.title}</CardTitle>
              <p className="text-xs text-muted-foreground font-mono">{brief.industry}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {topCandidates.map((student, idx) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border border-border/50"
                >
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center font-mono text-xs text-muted-foreground shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{student.school}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20">
                      <Progress value={student.matchScore} className="h-1" />
                    </div>
                    <span className={cn('font-mono text-xs', matchScoreColor(student.matchScore))}>
                      {student.matchScore}%
                    </span>
                    <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                      Voir
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function EntreprisePage() {
  const [tab, setTab] = useState('briefs')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold">Console Entreprise</h1>
          <p className="text-muted-foreground text-sm">
            LogiTrans SA · Espace partenaire
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="mb-4 md:hidden">
          <Select value={tab} onValueChange={setTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir une vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="briefs">Mes Briefs</SelectItem>
              <SelectItem value="search">Rechercher dans le graphe</SelectItem>
              <SelectItem value="candidats">Candidats sur mes briefs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TabsList className="mb-4 hidden md:flex">
          <TabsTrigger value="briefs" className="gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mes Briefs
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-1.5">
            <Search className="w-3.5 h-3.5" />
            Rechercher dans le graphe
          </TabsTrigger>
          <TabsTrigger value="candidats" className="gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Candidats sur mes briefs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="briefs">
          <MesBriefs />
        </TabsContent>
        <TabsContent value="search">
          <RechercheGraphe />
        </TabsContent>
        <TabsContent value="candidats">
          <CandidatsSurBriefs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
