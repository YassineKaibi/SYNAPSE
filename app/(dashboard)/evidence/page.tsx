'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { evidenceBundle } from '@/lib/data/mock-data'
import type { EvidenceItem, PFEPhase } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ShieldCheck, FileText, Activity, MessageSquare, NotebookText, Hash, Eye, EyeOff } from 'lucide-react'

const phaseOrder: PFEPhase[] = ['diagnostic', 'brief_selection', 'planning', 'execution', 'review', 'defense']
const phaseLabel: Record<PFEPhase, string> = {
  diagnostic: 'Diagnostic',
  brief_selection: 'Selection brief',
  planning: 'Planification',
  execution: 'Execution',
  review: 'Revue',
  defense: 'Soutenance',
}

const iconByType: Record<EvidenceItem['type'], typeof FileText> = {
  skill_validation: ShieldCheck,
  debate_excerpt: MessageSquare,
  mutation_log: Activity,
  signal_snapshot: Activity,
  supervisor_note: NotebookText,
}

export default function EvidencePage() {
  const [status, setStatus] = useState(evidenceBundle.status)
  const [revealed, setRevealed] = useState(false)
  const [sealed, setSealed] = useState(false)
  const [sealStep, setSealStep] = useState<'idle' | 'flash' | 'merkle' | 'done'>('idle')
  const [typedMerkleRoot, setTypedMerkleRoot] = useState('')
  const [merkleStarted, setMerkleStarted] = useState(false)
  const grouped = useMemo(() => {
    return phaseOrder.map((phase) => ({
      phase,
      items: evidenceBundle.items
        .filter((item) => item.phase === phase)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    }))
  }, [])

  const maskedCode = evidenceBundle.juryAccessCode
    ? evidenceBundle.juryAccessCode
    : 'JURY-ENIT-2026'

  const flatItems = grouped.flatMap(({ items }) => items)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-start justify-between gap-4" data-demo="evidence-header">
        <div>
          <h1 className="font-serif text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Evidence Bundle
          </h1>
          <p className="text-muted-foreground">Verification du dossier de preuves pour la soutenance.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={status === 'sealed' ? 'secondary' : 'default'} disabled={status === 'sealed'}>
              Sceller le dossier
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer le scellement</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action fige les preuves visibles pour le jury. Confirmer le scellement du dossier ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setStatus('sealed')
                    setSealed(true)
                    setSealStep('flash')
                    setMerkleStarted(false)
                  }}
                >
                  Confirmer
                </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="border-border">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Merkle Root</p>
            <p className="font-mono text-sm">{typedMerkleRoot || evidenceBundle.merkleRoot}</p>
            <div className="mt-3">
              <svg viewBox="0 0 220 78" className="w-[220px] h-[78px]" aria-label="Arbre merkle">
                <motion.line x1="24" y1="62" x2="110" y2="40" stroke="var(--signal-green)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: sealStep === 'idle' ? 0 : 1 }} transition={{ duration: 0.45, delay: 0.05 }} />
                <motion.line x1="196" y1="62" x2="110" y2="40" stroke="var(--signal-green)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: sealStep === 'idle' ? 0 : 1 }} transition={{ duration: 0.45, delay: 0.2 }} />
                <motion.line x1="110" y1="40" x2="110" y2="16" stroke="var(--signal-green)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: sealStep === 'idle' ? 0 : 1 }} transition={{ duration: 0.35, delay: 0.55 }} />
                <motion.circle cx="24" cy="62" r="6" fill="var(--signal-green)" initial={{ scale: 0 }} animate={{ scale: sealStep === 'idle' ? 0 : 1 }} transition={{ duration: 0.2 }} />
                <motion.circle cx="196" cy="62" r="6" fill="var(--signal-green)" initial={{ scale: 0 }} animate={{ scale: sealStep === 'idle' ? 0 : 1 }} transition={{ duration: 0.2, delay: 0.15 }} />
                <motion.circle cx="110" cy="40" r="6" fill="var(--signal-green)" initial={{ scale: 0 }} animate={{ scale: sealStep === 'idle' ? 0 : 1 }} transition={{ duration: 0.2, delay: 0.5 }} />
                <motion.circle cx="110" cy="16" r="6" fill="var(--signal-green)" initial={{ scale: 0 }} animate={{ scale: sealStep === 'idle' ? 0 : 1 }} transition={{ duration: 0.2, delay: 0.7 }} />
              </svg>
            </div>
          </div>
          <motion.div
            key={status}
            initial={{ opacity: 0.6, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Badge variant={status === 'sealed' ? 'default' : 'secondary'}>
              {status === 'draft' ? 'Brouillon' : status === 'sealed' ? 'Scelle' : 'Soumis'}
            </Badge>
          </motion.div>
        </CardContent>
      </Card>

      {sealed && (
        <p className="text-xs text-signal-green">Dossier scelle avec succes. Les preuves sont pretes pour le jury.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {grouped.map(({ phase, items }) => {
            if (items.length === 0) return null
            return (
              <div key={phase}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{phaseLabel[phase]}</p>
                <div className="space-y-2">
                  <motion.div
                    initial="idle"
                    animate={sealStep === 'flash' ? 'flash' : 'idle'}
                    variants={{
                      idle: { transition: { staggerChildren: 0 } },
                      flash: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
                    }}
                    onAnimationComplete={() => {
                      if (sealStep !== 'flash' || merkleStarted) return
                      setMerkleStarted(true)
                      setSealStep('merkle')
                      let index = 0
                      const source = evidenceBundle.merkleRoot
                      const timer = window.setInterval(() => {
                        index += 1
                        setTypedMerkleRoot(source.slice(0, index))
                        if (index >= source.length) {
                          window.clearInterval(timer)
                          setSealStep('done')
                        }
                      }, 35)
                    }}
                    className="space-y-2"
                  >
                  {items.map((item) => {
                    const globalIndex = flatItems.findIndex((entry) => entry.id === item.id)
                    const Icon = iconByType[item.type]
                    return (
                      <motion.div
                        key={item.id}
                        variants={{
                          idle: { opacity: 1, x: 0, backgroundColor: 'rgba(0,0,0,0)' },
                          flash: {
                            opacity: [1, 1, 1],
                            x: [0, 2, 0],
                            backgroundColor: ['rgba(117,238,159,0)', 'rgba(117,238,159,0.22)', 'rgba(117,238,159,0)'],
                            transition: { duration: 0.28, delay: globalIndex * 0.02 },
                          },
                        }}
                      >
                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="rounded-md bg-secondary p-2">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.content}</p>
                              <p className="text-[11px] font-mono text-muted-foreground mt-2">
                                <Hash className="inline w-3 h-3 mr-1" />
                                {item.hash.slice(0, 18)}...
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.signatures.map((signature, idx) => (
                                  <Badge key={`${item.id}-${idx}`} variant="outline" className="text-[10px]">
                                    {signature.signerRole}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      </motion.div>
                    )
                  })}
                  </motion.div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Acces jury</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-border bg-secondary/20 p-3 flex items-center justify-between">
                <p className="font-mono text-sm">
                  {revealed ? maskedCode : '••••-••••-••••'}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setRevealed((v) => !v)}
                  aria-label={revealed ? 'Masquer le code jury' : 'Afficher le code jury'}
                >
                  {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button variant="outline" className="w-full">Generer QR code</Button>
              <div className="rounded-md border border-border bg-background p-3 flex items-center justify-center">
                <svg width="140" height="140" viewBox="0 0 140 140" aria-label="QR demo">
                  <rect x="0" y="0" width="140" height="140" fill="var(--background)" />
                  <rect x="8" y="8" width="28" height="28" fill="var(--foreground)" />
                  <rect x="104" y="8" width="28" height="28" fill="var(--foreground)" />
                  <rect x="8" y="104" width="28" height="28" fill="var(--foreground)" />
                  <rect x="52" y="52" width="8" height="8" fill="var(--foreground)" />
                  <rect x="68" y="52" width="8" height="8" fill="var(--foreground)" />
                  <rect x="84" y="52" width="8" height="8" fill="var(--foreground)" />
                  <rect x="52" y="68" width="8" height="8" fill="var(--foreground)" />
                  <rect x="84" y="68" width="8" height="8" fill="var(--foreground)" />
                  <rect x="52" y="84" width="8" height="8" fill="var(--foreground)" />
                  <rect x="68" y="84" width="8" height="8" fill="var(--foreground)" />
                  <rect x="84" y="84" width="8" height="8" fill="var(--foreground)" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
