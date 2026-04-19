'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DemoStepAction = 'select-graphe-skill' | 'autoplay-conseil'

type DemoStep = {
  id: string
  route: string
  highlightSelector: string
  caption: string
  action?: DemoStepAction
}

const demoSteps: DemoStep[] = [
  {
    id: 'onboarding-intro',
    route: '/onboarding',
    highlightSelector: '[data-demo="onboarding-intro"]',
    caption: 'Jour 0: presentation des 5 agents qui cadrent le diagnostic initial.',
  },
  {
    id: 'diagnostic-result',
    route: '/diagnostic',
    highlightSelector: '[data-demo="diagnostic-transcript"]',
    caption: 'Le transcript relie reponses, competences derivees et niveau de confiance.',
  },
  {
    id: 'graphe-focus',
    route: '/graphe',
    highlightSelector: '[data-demo="graph-main"]',
    caption: 'Vue graphe avec une competence cle auto-selectionnee pour la narration jury.',
    action: 'select-graphe-skill',
  },
  {
    id: 'projet-genome',
    route: '/projet',
    highlightSelector: '[data-demo="project-genome"]',
    caption: 'Le genome du projet montre les dimensions qui evoluent au fil des mutations.',
  },
  {
    id: 'conseil-autoplay',
    route: '/conseil',
    highlightSelector: '[data-demo="conseil-panel"]',
    caption: 'Le Conseil lance un debat scripté: 5 agents repondent en sequence.',
    action: 'autoplay-conseil',
  },
  {
    id: 'conseil-disagreement',
    route: '/conseil',
    highlightSelector: '[data-demo="conseil-disagreement"]',
    caption: 'Le desaccord est mis en evidence et prepare l arbitrage encadrant.',
  },
  {
    id: 'encadrant-arbitration',
    route: '/encadrant',
    highlightSelector: '[data-demo="encadrant-center"]',
    caption: 'L encadrant tranche avec rationale, puis la decision est archivee.',
  },
  {
    id: 'evidence-bundle',
    route: '/evidence',
    highlightSelector: '[data-demo="evidence-header"]',
    caption: 'Le dossier de preuves consolide hash, signatures et statut de scellement.',
  },
]

type DemoTourContextValue = {
  isDemoMode: boolean
}

const DemoTourContext = createContext<DemoTourContextValue | null>(null)

function emitDemoAction(action: DemoStepAction): void {
  window.dispatchEvent(
    new CustomEvent('synapse:demo-step-action', { detail: { action } })
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function useDemoTour(): DemoTourContextValue {
  const value = useContext(DemoTourContext)
  if (!value) {
    throw new Error('useDemoTour must be used within DemoTourProvider')
  }
  return value
}

export function DemoTourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
  const [captionStyle, setCaptionStyle] = useState<CSSProperties>({})
  const actionStepRef = useRef<number | null>(null)
  const currentStep = demoSteps[currentStepIndex]

  const stopDemo = useCallback(() => {
    setIsDemoMode(false)
    setAutoAdvance(false)
    setHighlightRect(null)
    actionStepRef.current = null
  }, [])

  const startDemo = useCallback(
    (index: number) => {
      const safeIndex = clamp(index, 0, demoSteps.length - 1)
      setCurrentStepIndex(safeIndex)
      setIsDemoMode(true)
      setAutoAdvance(false)
      actionStepRef.current = null
      if (pathname !== demoSteps[safeIndex].route) {
        router.push(demoSteps[safeIndex].route)
      }
    },
    [pathname, router]
  )

  const goToStep = useCallback(
    (nextIndex: number) => {
      const safeIndex = clamp(nextIndex, 0, demoSteps.length - 1)
      setCurrentStepIndex(safeIndex)
      actionStepRef.current = null
      if (pathname !== demoSteps[safeIndex].route) {
        router.push(demoSteps[safeIndex].route)
      }
    },
    [pathname, router]
  )

  const isDashboardRoute = useMemo(() => {
    const dashboardRoutes = [
      '/conseil',
      '/graphe',
      '/projet',
      '/jumeau',
      '/parcours',
      '/marketplace',
      '/entreprise',
      '/evidence',
      '/encadrant',
      '/gamemaster',
      '/diagnostic',
      '/settings',
      '/help',
    ]
    return dashboardRoutes.includes(pathname)
  }, [pathname])

  useEffect(() => {
    const demoQuery = new URLSearchParams(window.location.search).get('demo')
    if (demoQuery !== '1' || isDemoMode) return
    startDemo(0)
    router.replace(demoSteps[0].route)
  }, [isDemoMode, router, startDemo])

  useEffect(() => {
    if (!isDemoMode) return
    if (pathname !== currentStep.route) {
      router.push(currentStep.route)
    }
  }, [currentStep.route, isDemoMode, pathname, router])

  useEffect(() => {
    if (!isDemoMode) return

    const updateHighlight = () => {
      const target = document.querySelector(currentStep.highlightSelector)
      if (!(target instanceof HTMLElement)) {
        setHighlightRect(null)
        setCaptionStyle({
          position: 'fixed',
          top: 96,
          right: 16,
          width: 340,
        })
        return
      }

      const rect = target.getBoundingClientRect()
      setHighlightRect(rect)
      const cardWidth = 340
      const left = clamp(rect.left, 16, window.innerWidth - cardWidth - 16)
      const desiredTop = rect.bottom + 12
      const top =
        desiredTop + 220 > window.innerHeight
          ? Math.max(80, rect.top - 220)
          : desiredTop
      setCaptionStyle({
        position: 'fixed',
        top,
        left,
        width: cardWidth,
      })
    }

    const raf = window.requestAnimationFrame(updateHighlight)
    window.addEventListener('resize', updateHighlight)
    window.addEventListener('scroll', updateHighlight, true)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', updateHighlight)
      window.removeEventListener('scroll', updateHighlight, true)
    }
  }, [currentStep.highlightSelector, isDemoMode, pathname])

  useEffect(() => {
    if (!isDemoMode || pathname !== currentStep.route || !currentStep.action) return
    if (actionStepRef.current === currentStepIndex) return
    actionStepRef.current = currentStepIndex
    emitDemoAction(currentStep.action)
  }, [currentStep, currentStepIndex, isDemoMode, pathname])

  useEffect(() => {
    if (!isDemoMode || !autoAdvance) return
    const timer = window.setTimeout(() => {
      if (currentStepIndex >= demoSteps.length - 1) {
        stopDemo()
        return
      }
      goToStep(currentStepIndex + 1)
    }, 6000)
    return () => window.clearTimeout(timer)
  }, [autoAdvance, currentStepIndex, goToStep, isDemoMode, stopDemo])

  return (
    <DemoTourContext.Provider value={{ isDemoMode }}>
      {children}

      {!isDemoMode && isDashboardRoute && (
        <div className="fixed top-20 right-4 z-[90]">
          <Button
            className="shadow-md"
            onClick={() => startDemo(0)}
            aria-label="Activer le mode demo"
          >
            <Play className="w-4 h-4 mr-2" />
            Mode demo
          </Button>
        </div>
      )}

      <AnimatePresence>
        {isDemoMode && (
          <>
            {highlightRect && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  top: highlightRect.top - 6,
                  left: highlightRect.left - 6,
                  width: highlightRect.width + 12,
                  height: highlightRect.height + 12,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed z-[90] rounded-lg border-2 border-primary pointer-events-none shadow-[0_0_0_9999px_rgba(2,6,23,0.45)]"
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={captionStyle}
              className="z-[91] rounded-lg border border-border bg-card/95 backdrop-blur p-4 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Etape {currentStepIndex + 1} / {demoSteps.length}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={stopDemo}
                  className="h-7 w-7"
                  aria-label="Quitter le mode demo"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-foreground mt-2 leading-relaxed">
                {currentStep.caption}
              </p>

              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setAutoAdvance((v) => !v)}
                  className={cn(
                    'text-xs rounded-full border px-2 py-1',
                    autoAdvance
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  Avance auto 6s
                </button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStep(currentStepIndex - 1)}
                    disabled={currentStepIndex === 0}
                  >
                    Precedent
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (currentStepIndex >= demoSteps.length - 1) {
                        stopDemo()
                        return
                      }
                      goToStep(currentStepIndex + 1)
                    }}
                  >
                    {currentStepIndex >= demoSteps.length - 1 ? 'Terminer' : 'Suivant'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DemoTourContext.Provider>
  )
}
