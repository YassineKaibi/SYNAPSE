import type {
  Agent,
  AgentRole,
  AlertLoop,
  ArbitrationRequest,
  CandidateStudent,
  CompanyBrief,
  Debate,
  DisagreementMarker,
  EvidenceItem,
  GameMasterDecision,
  PFEPhase,
  ProactiveToast,
  Project,
  ProjectMutation,
  SkillEdge,
  SkillNode,
  StudentAlert,
  SupervisorDecision,
  TwinForecast,
  TwinSignal,
} from '@/lib/types'

const now = new Date()
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

export const agents: Agent[] = [
  {
    id: 'agent-architecte',
    name: 'Zephyr',
    role: 'architecte',
    personality: 'Structuré, orienté scalabilité',
    expertise: ['Architecture API', 'Scalabilité', 'Qualité de code'],
    voiceStyle: 'Factuel et méthodique',
    color: 'var(--agent-zephyr)',
  },
  {
    id: 'agent-product-owner',
    name: 'Artemis',
    role: 'product_owner',
    personality: 'Orientée valeur métier',
    expertise: ['Cadrage produit', 'Priorisation', 'Impact utilisateur'],
    voiceStyle: 'Empathique, orientée utilisateur',
    color: 'var(--agent-artemis)',
  },
  {
    id: 'agent-avocat-diable',
    name: 'Nova',
    role: 'avocat_diable',
    personality: 'Contradiction constructive',
    expertise: ['Analyse de risque', 'Scénarios d’échec', 'Gouvernance'],
    voiceStyle: 'Provocateur précis',
    color: 'var(--agent-nova)',
  },
  {
    id: 'agent-coach-carriere',
    name: 'Echo',
    role: 'coach_carriere',
    personality: 'Progression et soutenabilité',
    expertise: ['Positionnement carrière', 'Résilience', 'Communication'],
    voiceStyle: 'Calme et encourageant',
    color: 'var(--agent-echo)',
  },
  {
    id: 'agent-scribe',
    name: 'Sphinx',
    role: 'scribe',
    personality: 'Trace, preuve, synthèse',
    expertise: ['Documentation', 'Traçabilité', 'Synthèse'],
    voiceStyle: 'Neutre et synthétique',
    color: 'var(--agent-sphinx)',
  },
]

export const skillNodes: SkillNode[] = [
  {
    id: 'sk-python',
    name: 'Python',
    category: 'technical',
    status: 'mastered',
    level: 84,
    source: 'diagnostic',
    description: 'Conception et implémentation backend Python.',
    prerequisites: [],
  },
  {
    id: 'sk-sql',
    name: 'SQL',
    category: 'analytical',
    status: 'unlocked',
    level: 70,
    source: 'diagnostic',
    description: 'Modélisation, requêtes et optimisation SQL.',
    prerequisites: [],
  },
  {
    id: 'sk-react',
    name: 'React',
    category: 'technical',
    status: 'unlocked',
    level: 62,
    source: 'diagnostic',
    description: 'UI composables et gestion d’état frontend.',
    prerequisites: [],
  },
  {
    id: 'sk-fastapi',
    name: 'FastAPI',
    category: 'technical',
    status: 'in_progress',
    level: 58,
    source: 'diagnostic',
    description: 'APIs robustes, validation et OpenAPI.',
    prerequisites: ['sk-python', 'sk-sql'],
  },
  {
    id: 'sk-docker',
    name: 'Docker',
    category: 'domain',
    status: 'suggested',
    level: 22,
    description: 'Containerisation et environnements reproductibles.',
    prerequisites: ['sk-fastapi'],
  },
  {
    id: 'sk-stakeholder',
    name: 'Stakeholder Management',
    category: 'communication',
    status: 'unlocked',
    level: 64,
    description: 'Alignement attentes métiers/techniques.',
    prerequisites: [],
  },
  {
    id: 'sk-resilience',
    name: 'Résilience',
    category: 'soft',
    status: 'in_progress',
    level: 61,
    description: 'Gestion du stress et adaptation continue.',
    prerequisites: [],
  },
  {
    id: 'sk-data-analysis',
    name: 'Data Analysis',
    category: 'analytical',
    status: 'unlocked',
    level: 56,
    description: 'Analyse KPI et lecture de signaux projet.',
    prerequisites: ['sk-sql'],
  },
  {
    id: 'sk-supply-chain',
    name: 'Supply Chain',
    category: 'domain',
    status: 'suggested',
    level: 35,
    description: 'Concepts métier logistique et opérations.',
    prerequisites: ['sk-stakeholder'],
  },
  {
    id: 'sk-route-optim',
    name: 'Route Optimization',
    category: 'strategic',
    status: 'locked',
    level: 0,
    description: 'Optimisation de tournées et arbitrages coûts/temps.',
    prerequisites: ['sk-data-analysis', 'sk-supply-chain'],
  },
]

export const skillEdges: SkillEdge[] = [
  { id: 'e1', source: 'sk-python', target: 'sk-fastapi', strength: 1, type: 'prerequisite' },
  { id: 'e2', source: 'sk-sql', target: 'sk-fastapi', strength: 0.8, type: 'prerequisite' },
  { id: 'e3', source: 'sk-fastapi', target: 'sk-docker', strength: 0.6, type: 'prerequisite' },
  { id: 'e4', source: 'sk-sql', target: 'sk-data-analysis', strength: 0.9, type: 'prerequisite' },
  { id: 'e5', source: 'sk-stakeholder', target: 'sk-supply-chain', strength: 0.7, type: 'prerequisite' },
  { id: 'e6', source: 'sk-data-analysis', target: 'sk-route-optim', strength: 0.9, type: 'prerequisite' },
  { id: 'e7', source: 'sk-supply-chain', target: 'sk-route-optim', strength: 0.8, type: 'prerequisite' },
]

export const currentUser = {
  id: 'user-amira',
  name: 'Amira Ben Salah',
  title: 'Étudiante ingénieure - ENIT',
  company: 'LogiTrans SA',
  avatar: '/avatar-amira.png',
  preferences: {
    notifications: true,
    autoSuggest: true,
    proactiveAlerts: true,
    language: 'fr',
  },
}

export const sampleInsights = [
  {
    id: 'ins-1',
    type: 'alerte',
    priority: 'high',
    title: 'Dérive de planning détectée',
    description: 'Le sprint API est en retard de 2 jours.',
    createdAt: daysAgo(1),
    dismissed: false,
  },
  {
    id: 'ins-2',
    type: 'suggestion',
    priority: 'medium',
    title: 'Ajoutez une preuve technique',
    description: 'Documentez l’arbitrage architecture v2.',
    createdAt: daysAgo(2),
    dismissed: false,
  },
  {
    id: 'ins-3',
    type: 'progression',
    priority: 'low',
    title: 'Compétence FastAPI en hausse',
    description: 'Niveau estimé passé de 52% à 58%.',
    createdAt: daysAgo(3),
    dismissed: true,
  },
]

export const pfeTimeline = {
  currentPhase: 'execution' as PFEPhase,
  dayInProgram: 49,
  totalDays: 120,
  milestones: [
    { phase: 'diagnostic' as PFEPhase, dueDate: daysAgo(45), deliverables: ['Diagnostic initial'] },
    { phase: 'brief_selection' as PFEPhase, dueDate: daysAgo(40), deliverables: ['Brief validé'] },
    { phase: 'planning' as PFEPhase, dueDate: daysAgo(32), deliverables: ['Roadmap & risques'] },
    { phase: 'execution' as PFEPhase, dueDate: daysFromNow(20), deliverables: ['MVP opérationnel'] },
    { phase: 'review' as PFEPhase, dueDate: daysFromNow(40), deliverables: ['Revue encadrant'] },
    { phase: 'defense' as PFEPhase, dueDate: daysFromNow(71), deliverables: ['Soutenance'] },
  ],
}

export const sampleProject: Project = {
  id: 'proj-logitrans',
  name: 'Optimisation flotte intelligente',
  description:
    'Pilotage d’un service de recommandations de trajets et alertes opérationnelles pour LogiTrans.',
  phase: 'execution',
  goals: [
    'Stabiliser l’API de tracking en charge réelle',
    'Formaliser les arbitrages techniques critiques',
    'Structurer un dossier de preuves jury-ready',
  ],
  targetSkills: ['sk-fastapi', 'sk-data-analysis', 'sk-stakeholder'],
  genome: {
    adaptability: 74,
    specialization: 68,
    collaboration: 77,
    innovation: 64,
    coreStrengths: ['Communication technique', 'Structuration', 'Résilience'],
    learningStyle: 'kinesthetic',
    riskTolerance: 62,
  },
  genomeSnapshots: [
    {
      at: daysAgo(20),
      genome: {
        adaptability: 60,
        specialization: 52,
        collaboration: 65,
        innovation: 49,
        coreStrengths: ['Communication technique', 'Structuration'],
        learningStyle: 'kinesthetic',
        riskTolerance: 55,
      },
    },
    {
      at: daysAgo(10),
      genome: {
        adaptability: 68,
        specialization: 60,
        collaboration: 71,
        innovation: 58,
        coreStrengths: ['Communication technique', 'Structuration', 'Apprentissage rapide'],
        learningStyle: 'kinesthetic',
        riskTolerance: 59,
      },
    },
    {
      at: daysAgo(1),
      genome: {
        adaptability: 74,
        specialization: 68,
        collaboration: 77,
        innovation: 64,
        coreStrengths: ['Communication technique', 'Structuration', 'Résilience'],
        learningStyle: 'kinesthetic',
        riskTolerance: 62,
      },
    },
  ],
}

export const sampleMutations: ProjectMutation[] = [
  {
    id: 'mut-1',
    type: 'brief_selected',
    title: 'Brief validé',
    description: 'Sélection du brief LogiTrans et cadrage initial.',
    timestamp: daysAgo(32),
    agentId: 'agent-product-owner',
    impact: 'moderate',
    immutable: true,
  },
  {
    id: 'mut-2',
    type: 'skill_added',
    title: 'Ajout compétence',
    description: 'FastAPI ajouté comme compétence cœur.',
    timestamp: daysAgo(24),
    agentId: 'agent-architecte',
    impact: 'major',
    immutable: true,
    relatedSkillId: 'sk-fastapi',
  },
  {
    id: 'mut-3',
    type: 'level_change',
    title: 'Montée de niveau',
    description: 'Progression SQL validée avec preuve de requêtes.',
    timestamp: daysAgo(14),
    agentId: 'agent-scribe',
    impact: 'minor',
  },
  {
    id: 'mut-4',
    type: 'gm_intervention',
    title: 'Intervention GM',
    description: 'Réduction du scope sprint pour fiabiliser la livraison.',
    timestamp: daysAgo(6),
    agentId: 'agent-avocat-diable',
    impact: 'major',
  },
  {
    id: 'mut-5',
    type: 'pathway_shift',
    title: 'Ajustement parcours',
    description: 'Priorité donnée à la résilience et aux alertes.',
    timestamp: daysAgo(2),
    agentId: 'agent-coach-carriere',
    impact: 'moderate',
  },
]

const baseDisagreement: DisagreementMarker = {
  id: 'disagree-1',
  topic: 'Faut-il geler le scope API cette semaine ?',
  agentA: 'agent-avocat-diable',
  agentB: 'agent-coach-carriere',
  positionA: 'Geler le scope pour éviter une dette incontrôlée.',
  positionB: 'Maintenir un scope minimal mais préserver l’élan équipe.',
  severity: 'moderate',
  status: 'active',
  gameMasterNote: 'Arbitrage encadrant recommandé avant vendredi.',
}

export const sampleDebate: Debate = {
  id: 'debate-1',
  topic: 'Arbitrages de sprint LogiTrans',
  context: 'Préparation démo jury et stabilisation API',
  status: 'active',
  consensusReached: false,
  messages: [
    {
      id: 'msg-1',
      agentId: 'agent-architecte',
      content: 'Nous devons limiter les changements non testés sur le backend.',
      timestamp: daysAgo(1),
      type: 'opinion',
      sentiment: 'cautious',
      referencedSkills: ['sk-fastapi', 'sk-docker'],
      confidence: 81,
    },
    {
      id: 'msg-2',
      agentId: 'agent-product-owner',
      content: 'Le jury doit voir de la valeur utilisateur, pas seulement de la stabilité.',
      timestamp: daysAgo(1),
      type: 'opinion',
      sentiment: 'positive',
      referencedSkills: ['sk-stakeholder'],
      confidence: 76,
    },
    {
      id: 'msg-3',
      agentId: 'agent-avocat-diable',
      content: 'Si on ouvre le scope, on compromet la tenue des engagements.',
      timestamp: daysAgo(1),
      type: 'disagreement',
      sentiment: 'negative',
      confidence: 83,
      disagreesWith: 'agent-coach-carriere',
    },
  ],
  disagreements: [baseDisagreement],
  recommendations: [
    'Valider un périmètre API strict pour 5 jours.',
    'Conserver une démonstration orientée impact utilisateur.',
  ],
  gameMasterNotes: ['Escalade envoyée à l’encadrant.'],
}

type ScriptedResponse = {
  content: string
  type: 'opinion' | 'question' | 'suggestion' | 'consensus' | 'disagreement' | 'evidence'
  referencedSkills?: string[]
  disagreesWith?: AgentRole
}

export const scriptedResponses: Record<AgentRole, ScriptedResponse[]> = {
  architecte: [
    {
      content: 'Je recommande un gel de scope API pour sécuriser la démonstration.',
      type: 'suggestion',
      referencedSkills: ['sk-fastapi', 'sk-docker'],
    },
    {
      content: 'On peut réduire le risque en isolant les intégrations critiques.',
      type: 'opinion',
      referencedSkills: ['sk-fastapi'],
    },
  ],
  product_owner: [
    {
      content: 'Gardons un scénario de valeur métier visible pour le jury.',
      type: 'suggestion',
      referencedSkills: ['sk-stakeholder'],
    },
    {
      content: 'Le KPI principal doit rester compréhensible en 3 minutes.',
      type: 'opinion',
      referencedSkills: ['sk-data-analysis'],
    },
  ],
  avocat_diable: [
    {
      content: 'Le plan actuel sous-estime la dette de tests.',
      type: 'disagreement',
      disagreesWith: 'coach_carriere',
      referencedSkills: ['sk-fastapi'],
    },
    {
      content: 'Sans bornes claires, le sprint devient non défendable.',
      type: 'opinion',
    },
  ],
  coach_carriere: [
    {
      content: 'Préservons la dynamique: mini-livraison + preuve de progression.',
      type: 'suggestion',
      disagreesWith: 'avocat_diable',
      referencedSkills: ['sk-resilience'],
    },
    {
      content: 'Le jury valorise aussi la capacité d’adaptation argumentée.',
      type: 'evidence',
      referencedSkills: ['sk-resilience', 'sk-stakeholder'],
    },
  ],
  scribe: [
    {
      content: 'Je synthétise les options et trace les impacts dans le dossier.',
      type: 'evidence',
    },
    {
      content: 'Arbitrage prêt: risques, compromis, et décision proposée.',
      type: 'consensus',
    },
  ],
}

export const companyBriefs: CompanyBrief[] = [
  {
    id: 'brief-logitrans',
    companyId: 'company-logitrans',
    companyName: 'LogiTrans SA',
    company: 'LogiTrans SA',
    industry: 'Logistique',
    location: 'Tunis',
    title: 'Optimiser les tournées de livraison urbaines',
    problemStatement: 'Réduire retards et coûts carburant via recommandations de routes.',
    expectedOutcomes: ['Prototype API de recommandation', 'Dashboard KPI', 'Plan de déploiement'],
    requiredSkills: ['sk-python', 'sk-fastapi', 'sk-data-analysis'],
    niceToHaveSkills: ['sk-docker', 'sk-route-optim'],
    matchScore: 86,
    status: 'available',
    pedagogicalArcs: [
      {
        phase: 'discovery',
        activities: ['Interviews ops', 'Audit données GPS'],
        checkpoints: ['Cadrage validé'],
        requiredSkills: ['sk-stakeholder'],
        skillsGained: ['sk-stakeholder', 'sk-supply-chain'],
      },
      {
        phase: 'exploration',
        activities: ['POC algorithmes', 'Choix architecture API'],
        checkpoints: ['Prototype validé'],
        requiredSkills: ['sk-python', 'sk-data-analysis'],
        skillsGained: ['sk-fastapi', 'sk-data-analysis'],
      },
      {
        phase: 'solution',
        activities: ['Développement API', 'Intégration dashboard'],
        checkpoints: ['MVP en staging'],
        requiredSkills: ['sk-fastapi', 'sk-react'],
        skillsGained: ['sk-react', 'sk-fastapi'],
      },
      {
        phase: 'industrialization',
        activities: ['CI/CD', 'Documentation opérationnelle'],
        checkpoints: ['Passage revue'],
        requiredSkills: ['sk-docker'],
        skillsGained: ['sk-docker'],
      },
    ],
  },
  {
    id: 'brief-pharmadist',
    companyId: 'company-pharmadist',
    companyName: 'PharmaDist',
    company: 'PharmaDist',
    industry: 'Santé',
    location: 'Sousse',
    title: 'Traçabilité intelligente de stocks sensibles',
    problemStatement: 'Améliorer la visibilité stock/risque rupture sur produits critiques.',
    expectedOutcomes: ['Flux de données consolidé', 'Alerting seuils'],
    requiredSkills: ['sk-sql', 'sk-data-analysis'],
    niceToHaveSkills: ['sk-react', 'sk-stakeholder'],
    matchScore: 78,
    status: 'applied',
    pedagogicalArcs: [
      { phase: 'discovery', activities: ['Cartographie flux'], checkpoints: ['Diagnostic validé'], requiredSkills: ['sk-stakeholder'], skillsGained: ['sk-stakeholder'] },
      { phase: 'exploration', activities: ['POC alerting'], checkpoints: ['POC OK'], requiredSkills: ['sk-sql'], skillsGained: ['sk-data-analysis'] },
      { phase: 'solution', activities: ['Implémentation règles'], checkpoints: ['Recette'], requiredSkills: ['sk-python'], skillsGained: ['sk-python'] },
      { phase: 'industrialization', activities: ['Monitoring'], checkpoints: ['Runbook'], requiredSkills: ['sk-docker'], skillsGained: ['sk-docker'] },
    ],
  },
  {
    id: 'brief-olijobs',
    companyId: 'company-olijobs',
    companyName: 'OliJobs',
    company: 'OliJobs',
    industry: 'RH',
    location: 'Sfax',
    title: 'Matching intelligent compétences/offres',
    problemStatement: 'Améliorer la pertinence du matching candidat-offre.',
    expectedOutcomes: ['Moteur scoring', 'Rapport explicable'],
    requiredSkills: ['sk-data-analysis', 'sk-python'],
    niceToHaveSkills: ['sk-react'],
    matchScore: 72,
    status: 'rejected',
    pedagogicalArcs: [
      { phase: 'discovery', activities: ['Cadrage'], checkpoints: ['OK'], requiredSkills: ['sk-stakeholder'], skillsGained: ['sk-stakeholder'] },
      { phase: 'exploration', activities: ['Benchmark'], checkpoints: ['OK'], requiredSkills: ['sk-data-analysis'], skillsGained: ['sk-data-analysis'] },
      { phase: 'solution', activities: ['PoC scoring'], checkpoints: ['OK'], requiredSkills: ['sk-python'], skillsGained: ['sk-python'] },
      { phase: 'industrialization', activities: ['A/B test'], checkpoints: ['OK'], requiredSkills: ['sk-react'], skillsGained: ['sk-react'] },
    ],
  },
  {
    id: 'brief-smartpark',
    companyId: 'company-smartpark',
    companyName: 'SmartPark',
    company: 'SmartPark',
    industry: 'Mobilité',
    location: 'Tunis',
    title: 'Prévision d’occupation parkings',
    problemStatement: 'Prédire l’occupation en temps réel.',
    expectedOutcomes: ['API prévision', 'Visualisation'],
    requiredSkills: ['sk-python', 'sk-data-analysis'],
    niceToHaveSkills: ['sk-react'],
    matchScore: 81,
    status: 'accepted',
    pedagogicalArcs: [
      { phase: 'discovery', activities: ['Audit capteurs'], checkpoints: ['OK'], requiredSkills: ['sk-stakeholder'], skillsGained: ['sk-stakeholder'] },
      { phase: 'exploration', activities: ['Feature engineering'], checkpoints: ['OK'], requiredSkills: ['sk-data-analysis'], skillsGained: ['sk-data-analysis'] },
      { phase: 'solution', activities: ['API'], checkpoints: ['OK'], requiredSkills: ['sk-fastapi'], skillsGained: ['sk-fastapi'] },
      { phase: 'industrialization', activities: ['Observabilité'], checkpoints: ['OK'], requiredSkills: ['sk-docker'], skillsGained: ['sk-docker'] },
    ],
  },
]

export const candidateStudents: CandidateStudent[] = [
  {
    id: 'cand-1',
    name: 'Amira Ben Salah',
    school: 'ENIT',
    program: 'GL',
    score: 92,
    topSkills: ['sk-fastapi', 'sk-sql', 'sk-stakeholder'],
    matchedSkills: ['sk-fastapi', 'sk-python', 'sk-data-analysis'],
    matchScore: 88,
    evidenceExcerpts: ['A piloté un POC API résilient.', 'A produit un dossier de preuves complet.'],
  },
  {
    id: 'cand-2',
    name: 'Youssef Triki',
    school: 'INSAT',
    program: 'Data',
    score: 84,
    topSkills: ['sk-data-analysis', 'sk-sql', 'sk-python'],
    matchedSkills: ['sk-python', 'sk-data-analysis'],
    matchScore: 76,
    evidenceExcerpts: ['Bon niveau analytics KPI.', 'Communication métier solide.'],
  },
  {
    id: 'cand-3',
    name: 'Nour Mzali',
    school: 'ENIS',
    program: 'GI',
    score: 79,
    topSkills: ['sk-react', 'sk-python', 'sk-stakeholder'],
    matchedSkills: ['sk-react', 'sk-python'],
    matchScore: 69,
    evidenceExcerpts: ['UI claire et maintenable.', 'Livraison continue régulière.'],
  },
]

export const latestDiagnosticTranscript = [
  {
    id: 'diag-1',
    role: 'architecte' as AgentRole,
    question: 'Quel est le principal risque technique perçu ?',
    answer: 'Le couplage fort entre API et dashboard.',
    derivedSkills: [
      { skillId: 'sk-fastapi', confidence: 82 },
      { skillId: 'sk-react', confidence: 61 },
    ],
  },
  {
    id: 'diag-2',
    role: 'product_owner' as AgentRole,
    question: 'Quelle valeur métier immédiate voulez-vous montrer ?',
    answer: 'Une réduction visible des retards de livraison.',
    derivedSkills: [
      { skillId: 'sk-stakeholder', confidence: 88 },
      { skillId: 'sk-data-analysis', confidence: 67 },
    ],
  },
]

export const proactiveToasts: ProactiveToast[] = [
  {
    id: 'toast-1',
    title: 'Risque détecté',
    message: 'Le stress projet dépasse le seuil recommandé.',
    type: 'warning',
    priority: 3,
    action: { label: 'Ouvrir le jumeau', href: '/jumeau' },
  },
  {
    id: 'toast-2',
    title: 'Bonne progression',
    message: 'FastAPI vient de franchir 55%.',
    type: 'success',
    priority: 2,
    action: { label: 'Voir le graphe', href: '/graphe' },
  },
  {
    id: 'toast-3',
    title: 'Suggestion',
    message: 'Un arbitrage encadrant est en attente.',
    type: 'info',
    priority: 1,
    action: { label: 'Aller à encadrant', href: '/encadrant' },
  },
]

export const twinSignals: TwinSignal[] = [
  { id: 'sig-1', type: 'momentum', value: 72, trend: 'rising', timestamp: now },
  { id: 'sig-2', type: 'stress', value: 58, trend: 'falling', timestamp: now },
  { id: 'sig-3', type: 'focus', value: 64, trend: 'stable', timestamp: now },
  { id: 'sig-4', type: 'confidence', value: 69, trend: 'rising', timestamp: now },
]

export const twinForecasts: TwinForecast[] = Array.from({ length: 14 }).map((_, index) => ({
  date: daysFromNow(index * 2),
  predictedMomentum: 68 + (index % 5),
  predictedStress: 54 + ((index + 2) % 7),
  riskFactors: index % 4 === 0 ? ['Surcharge sprint'] : [],
  opportunities: index % 3 === 0 ? ['Validation encadrant'] : [],
}))

export const alertLoops: AlertLoop[] = [
  {
    id: 'loop-1',
    signal: 'stress',
    threshold: 65,
    currentValue: 58,
    triggered: false,
    action: 'Maintenir cadence actuelle',
    lastTriggered: daysAgo(8),
  },
  {
    id: 'loop-2',
    signal: 'momentum',
    threshold: 55,
    currentValue: 72,
    triggered: true,
    action: 'Proposer mini-accélération',
    lastTriggered: daysAgo(1),
  },
]

export const gameMasterRules = [
  'Prioriser la soutenabilité pédagogique avant la vélocité brute.',
  'Escalader à l’encadrant si un désaccord persiste au-delà de 2 cycles.',
  'Toujours associer une preuve explicite à une mutation majeure.',
]

export const gameMasterDecisions: GameMasterDecision[] = [
  {
    id: 'gm-1',
    timestamp: daysAgo(2),
    context: 'Conflit de priorités sprint',
    decision: 'Réduire le scope et renforcer la preuve de valeur.',
    rationale: 'Maintien du cap jury avec risque maîtrisé.',
    affectedAgents: ['agent-architecte', 'agent-product-owner'],
    impactLevel: 'medium',
    visibility: 'all',
    relatedDisagreement: 'disagree-1',
  },
]

export const gameMasterState = {
  systemHealth: '98%',
  lastIntervention: daysAgo(2),
  pendingArbitrations: [baseDisagreement],
}

const pendingArbitrations: ArbitrationRequest[] = [
  {
    id: 'arb-1',
    studentId: 'user-amira',
    studentName: 'Amira Ben Salah',
    disagreement: baseDisagreement,
    requestedAt: daysAgo(1),
    urgency: 'medium',
    context: 'Conflit scope / momentum sur sprint API.',
    suggestedResolutions: [
      'Geler le scope backend 5 jours',
      'Maintenir un mini-lot visible côté métier',
      'Plan hybride: gel + démo ciblée',
    ],
  },
]

const recentDecisions: SupervisorDecision[] = [
  {
    id: 'sup-dec-1',
    arbitrationId: 'arb-legacy',
    decision: 'Arbitrage validé avec compromis.',
    rationale: 'Préserve la preuve et la cadence.',
    timestamp: daysAgo(4),
    notifiedStudent: true,
  },
]

const studentAlerts: StudentAlert[] = [
  {
    id: 'alert-1',
    studentId: 'user-amira',
    studentName: 'Amira Ben Salah',
    message: 'Stress en hausse sur les 48 dernières heures.',
    type: 'stress',
    severity: 'warning',
    acknowledged: false,
    timestamp: daysAgo(1),
  },
  {
    id: 'alert-2',
    studentId: 'user-amira',
    studentName: 'Amira Ben Salah',
    message: 'Risque de retard jalon exécution.',
    type: 'deadline',
    severity: 'critical',
    acknowledged: false,
    timestamp: daysAgo(0),
  },
]

export const supervisorQueue = {
  pendingArbitrations,
  recentDecisions,
  studentAlerts,
}

const evidenceItems: EvidenceItem[] = [
  {
    id: 'ev-1',
    title: 'Validation FastAPI',
    phase: 'execution',
    type: 'skill_validation',
    timestamp: daysAgo(3),
    content: 'Endpoint /routes optimisé et testé.',
    hash: '0xabc1f0e3f1d4b8c912ef70',
    signatures: [{ signerRole: 'architecte', signedAt: daysAgo(3) }],
  },
  {
    id: 'ev-2',
    title: 'Extrait débat scope',
    phase: 'execution',
    type: 'debate_excerpt',
    timestamp: daysAgo(2),
    content: 'Désaccord formalisé puis escaladé.',
    hash: '0xabc1f0e3f1d4b8c912ef71',
    signatures: [{ signerRole: 'scribe', signedAt: daysAgo(2) }],
  },
  {
    id: 'ev-3',
    title: 'Snapshot signaux jumeau',
    phase: 'review',
    type: 'signal_snapshot',
    timestamp: daysAgo(1),
    content: 'Stress stable, momentum en hausse.',
    hash: '0xabc1f0e3f1d4b8c912ef72',
    signatures: [{ signerRole: 'coach_carriere', signedAt: daysAgo(1) }],
  },
]

export const evidenceBundle = {
  status: 'draft' as 'draft' | 'sealed' | 'submitted',
  merkleRoot: '0x94f6d1e4ab2374f812aad9ff7730b12aa77c6b01f3ef8e6dd0019c3412e6f790',
  juryAccessCode: 'JURY-ENIT-2026',
  items: evidenceItems,
}
