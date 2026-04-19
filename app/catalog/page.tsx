'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  Zap,
  Brain,
  GitGraph,
  Target,
  Users,
  Map,
  Store,
  Building2,
  BookOpen,
  LogIn,
} from 'lucide-react'
import { AppSidebar } from '@/components/synapse/app-sidebar'
import { AppTopbar } from '@/components/synapse/app-topbar'
import { CommandPalette } from '@/components/synapse/command-palette'

const SCREEN_CATALOG = [
  {
    id: 'conseil',
    title: 'Conseil',
    description: 'Three-column debate interface where agents discuss and generate insights',
    icon: Brain,
    href: '/conseil',
    tier: 'Flagship',
  },
  {
    id: 'graphe',
    title: 'Graphe',
    description: 'Force-directed skill graph visualization with real-time interactions',
    icon: GitGraph,
    href: '/graphe',
    tier: 'Flagship',
  },
  {
    id: 'projet',
    title: 'Projet',
    description: 'Project genome and mutation timeline tracking',
    icon: Target,
    href: '/projet',
    tier: 'Flagship',
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    description: 'Interactive multi-step introduction to SYNAPSE',
    icon: LogIn,
    href: '/onboarding',
    tier: 'Secondary',
  },
  {
    id: 'jumeau',
    title: 'Jumeau',
    description: 'Digital twin simulation and AI interaction',
    icon: Users,
    href: '/jumeau',
    tier: 'Secondary',
  },
  {
    id: 'parcours',
    title: 'Parcours',
    description: 'Career and project path exploration',
    icon: Map,
    href: '/parcours',
    tier: 'Secondary',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Discover and integrate premium skills from providers',
    icon: Store,
    href: '/marketplace',
    tier: 'Secondary',
  },
  {
    id: 'entreprise',
    title: 'Entreprise',
    description: 'Partner organization and team management',
    icon: Building2,
    href: '/entreprise',
    tier: 'Secondary',
  },
  {
    id: 'encadrant',
    title: 'Encadrant',
    description: 'Mentor dashboard for tracking mentee progress',
    icon: BookOpen,
    href: '/encadrant',
    tier: 'Secondary',
  },
]

export default function CatalogPage() {
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <AppTopbar />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-7xl"
          >
            <div className="mb-12">
              <h1 className="text-5xl font-fraunces font-bold text-foreground">Catalogue ecrans (dev)</h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Ecran de navigation technique interne. Ouvrir la palette avec{' '}
                <kbd className="rounded border border-border bg-secondary px-2 py-1 text-xs font-mono">⌘K</kbd>.
              </p>
            </div>

            <div className="mb-12">
              <div className="mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-signal-green" />
                <h2 className="text-2xl font-fraunces font-bold text-foreground">Flagship Screens</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {SCREEN_CATALOG.filter((s) => s.tier === 'Flagship').map((screen, idx) => {
                  const Icon = screen.icon
                  return (
                    <motion.div
                      key={screen.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <Link href={screen.href}>
                        <Card className="group h-full cursor-pointer p-8 transition-all hover:border-signal-green/50 hover:shadow-lg">
                          <Icon className="mb-4 h-12 w-12 text-signal-green transition-transform group-hover:scale-110" />
                          <h3 className="mb-2 text-xl font-fraunces font-bold text-foreground">{screen.title}</h3>
                          <p className="mb-4 text-sm text-muted-foreground">{screen.description}</p>
                          <Badge className="bg-signal-green/20 text-signal-green">{screen.tier}</Badge>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center gap-2">
                <Command className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-2xl font-fraunces font-bold text-foreground">Secondary Screens</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SCREEN_CATALOG.filter((s) => s.tier === 'Secondary').map((screen, idx) => {
                  const Icon = screen.icon
                  return (
                    <motion.div
                      key={screen.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                    >
                      <Link href={screen.href}>
                        <Card className="group cursor-pointer p-6 transition-all hover:border-foreground/20">
                          <Icon className="mb-3 h-8 w-8 text-muted-foreground transition-colors group-hover:text-signal-green" />
                          <h3 className="mb-1 font-fraunces font-bold text-foreground">{screen.title}</h3>
                          <p className="text-xs text-muted-foreground">{screen.description}</p>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {showCommandPalette && (
        <CommandPalette
          open={showCommandPalette}
          onOpenChange={setShowCommandPalette}
        />
      )}
    </div>
  )
}
