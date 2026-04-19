export type AgentRole =
  | 'architecte'
  | 'product_owner'
  | 'avocat_diable'
  | 'coach_carriere'
  | 'scribe'

export type SkillStatus = 'locked' | 'unlocked' | 'mastered' | 'suggested' | 'in_progress'
export type SkillCategory =
  | 'technical'
  | 'leadership'
  | 'communication'
  | 'strategic'
  | 'creative'
  | 'analytical'
  | 'domain'
  | 'soft'
export type PFEPhase =
  | 'diagnostic'
  | 'brief_selection'
  | 'planning'
  | 'execution'
  | 'review'
  | 'defense'
export type PedagogicalArcPhase =
  | 'discovery'
  | 'exploration'
  | 'solution'
  | 'industrialization'

export interface Agent {
  id: string
  name: string
  role: AgentRole
  personality: string
  expertise: string[]
  voiceStyle?: string
  color?: string
  [key: string]: unknown
}

export interface SkillNode {
  id: string
  name: string
  category: SkillCategory
  status: SkillStatus
  level: number
  confidence?: number
  source?: string
  description: string
  prerequisites: string[]
  evidence?: string[]
  x?: number
  y?: number
  [key: string]: unknown
}

export interface SkillEdge {
  id: string
  source: string
  target: string
  weight?: number
  strength?: number
  type?: string
  relation?: string
  [key: string]: unknown
}

export interface AgentMessage {
  id: string
  agentId: string
  content: string
  timestamp: Date
  type: 'opinion' | 'question' | 'suggestion' | 'consensus' | 'disagreement' | 'evidence'
  sentiment?: 'positive' | 'neutral' | 'negative' | 'cautious'
  referencedSkills?: string[]
  confidence?: number
  disagreesWith?: string
  [key: string]: unknown
}

export interface DisagreementMarker {
  id: string
  topic: string
  agentA: string
  agentB: string
  positionA: string
  positionB: string
  severity: 'minor' | 'moderate' | 'fundamental'
  status: 'active' | 'resolved'
  gameMasterNote?: string
  [key: string]: unknown
}

export interface Debate {
  id: string
  topic: string
  status: string
  context?: string
  consensusReached: boolean
  messages: AgentMessage[]
  disagreements: DisagreementMarker[]
  recommendations: string[]
  gameMasterNotes: string[]
  [key: string]: unknown
}

export interface PFEMilestone {
  phase: PFEPhase
  dueDate: Date
  deliverables: string[]
  [key: string]: unknown
}

export interface ProjectGenome {
  adaptability: number
  specialization: number
  collaboration: number
  innovation: number
  coreStrengths: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  riskTolerance: number
  [key: string]: number | string | string[]
}

export interface ProjectMutation {
  id: string
  type: string
  title: string
  description: string
  timestamp: Date
  agentId?: string
  impact: 'minor' | 'moderate' | 'major'
  immutable?: boolean
  before?: Partial<ProjectGenome>
  after?: Partial<ProjectGenome>
  relatedSkillId?: string
  [key: string]: unknown
}

export interface Project {
  id: string
  name: string
  description: string
  phase: PFEPhase
  goals: string[]
  targetSkills: string[]
  genome: ProjectGenome
  genomeSnapshots?: Array<{ at: Date; genome: ProjectGenome }>
  [key: string]: unknown
}

export interface CompanyBrief {
  id: string
  companyId: string
  companyName: string
  company: string
  industry: string
  location: string
  title: string
  summary?: string
  problemStatement: string
  expectedOutcomes: string[]
  requiredSkills: string[]
  niceToHaveSkills: string[]
  pedagogicalArcs: Array<{
    phase: PedagogicalArcPhase
    activities: string[]
    checkpoints: string[]
    requiredSkills: string[]
    skillsGained: string[]
  }>
  matchScore?: number
  status: 'available' | 'applied' | 'accepted' | 'rejected'
  [key: string]: unknown
}

export interface CandidateStudent {
  id: string
  name: string
  score: number
  topSkills: string[]
  school: string
  program: string
  matchedSkills: string[]
  matchScore: number
  evidenceExcerpts: string[]
  [key: string]: unknown
}

export interface TwinSignal {
  id: string
  type: 'momentum' | 'stress' | 'focus' | 'confidence'
  value: number
  trend: 'rising' | 'falling' | 'stable'
  timestamp: Date
  [key: string]: unknown
}

export interface TwinForecast {
  date: Date
  predictedMomentum: number
  predictedStress: number
  riskFactors: string[]
  opportunities: string[]
}

export interface AlertLoop {
  id: string
  signal: string
  threshold: number
  currentValue: number
  triggered: boolean
  action: string
  lastTriggered?: Date | null
}

export interface EvidenceItem {
  id: string
  title: string
  phase: PFEPhase
  type: 'skill_validation' | 'debate_excerpt' | 'mutation_log' | 'signal_snapshot' | 'supervisor_note'
  timestamp: Date
  content: string
  hash: string
  signatures: Array<{ signerRole: AgentRole; signedAt: Date }>
  status?: string
  [key: string]: unknown
}

export interface ProactiveToast {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success'
  priority: number
  duration?: number
  action?: { label: string; href: string }
  [key: string]: unknown
}

export interface GameMasterDecision {
  id: string
  timestamp: Date
  context: string
  decision: string
  rationale: string
  affectedAgents: string[]
  impactLevel: 'low' | 'medium' | 'high'
  visibility: 'student' | 'supervisor' | 'jury' | 'all'
  relatedDisagreement?: string
}

export interface ArbitrationRequest {
  id: string
  studentId: string
  studentName: string
  disagreement: DisagreementMarker
  requestedAt: Date
  urgency: 'low' | 'medium' | 'high'
  context: string
  suggestedResolutions: string[]
  [key: string]: unknown
}

export interface StudentAlert {
  id: string
  studentId: string
  studentName: string
  message: string
  type: 'stress' | 'momentum_drop' | 'deadline' | 'skill_gap'
  severity: 'info' | 'warning' | 'critical'
  acknowledged: boolean
  createdAt?: Date
  timestamp: Date
  [key: string]: unknown
}

export interface SupervisorDecision {
  id: string
  arbitrationId: string
  decision: string
  rationale: string
  timestamp: Date
  notifiedStudent: boolean
  [key: string]: unknown
}
