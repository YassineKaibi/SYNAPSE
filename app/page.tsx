'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CommandPalette } from '@/components/synapse/command-palette'
import { Brain, Command, Network, Store, Target, Users } from 'lucide-react'

const problems = [
  {
    title: 'Sujets PFE figes',
    description: 'Le projet reste souvent fige alors que les besoins et les contraintes evoluent chaque semaine.',
  },
  {
    title: 'Encadrants satures',
    description: 'Le suivi individualise se dilue quand un encadrant pilote plusieurs etudiants en meme temps.',
  },
  {
    title: 'CV illisibles',
    description: 'Les acquis reels du PFE sont difficiles a prouver pour les recruteurs et les jurys.',
  },
]

const solutions = [
  {
    title: 'Conseil',
    description: "Cinq agents debattent, confrontent leurs hypotheses et produisent des decisions argumentees.",
    icon: Users,
  },
  {
    title: 'Projets Vivants',
    description: "Le projet mute selon les risques, l'avancement et les retours terrain, sans casser la trajectoire.",
    icon: Target,
  },
  {
    title: 'Graphe de Competences',
    description: 'Chaque preuve alimente un graphe lisible pour suivre la progression reelle de chaque competence.',
    icon: Network,
  },
  {
    title: 'Marketplace de Problemes',
    description: "Les entreprises publient des briefs concrets relies aux besoins terrain et aux competences attendues.",
    icon: Store,
  },
  {
    title: 'Jumeau Numerique',
    description: "Le jumeau anticipe les risques de deraillement et recommande des actions pour rester sur l'objectif.",
    icon: Brain,
  },
]

export default function HomePage() {
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <p className="font-fraunces text-xl">SYNAPSE</p>
          <Button variant="outline" onClick={() => setCommandOpen(true)}>
            <Command className="mr-2 h-4 w-4" />
            Palette
            <kbd className="ml-2 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-14">
        <section>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="max-w-4xl font-fraunces text-4xl leading-tight md:text-6xl">
              SYNAPSE. Le jumeau cognitif de l&apos;etudiant ingenieur.
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
              Une experience PFE pilotee par un conseil multi-agents pour transformer chaque decision en preuve claire,
              actionnable et soutenable jusqu&apos;a la soutenance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding">Demarrer le diagnostic</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/onboarding?demo=1">Mode demo</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        <section>
          <h2 className="mb-6 font-fraunces text-3xl">Le probleme aujourd&apos;hui</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map(problem => (
              <Card key={problem.title} className="border-border bg-card p-6">
                <h3 className="font-fraunces text-xl">{problem.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{problem.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 font-fraunces text-3xl">La solution SYNAPSE</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {solutions.map(solution => {
              const Icon = solution.icon
              return (
                <Card key={solution.title} className="border-border bg-card p-5">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-fraunces text-lg">{solution.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{solution.description}</p>
                </Card>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-6 font-fraunces text-3xl">Architecture</h2>
          <Card className="border-border bg-card p-6">
            <svg viewBox="0 0 900 260" className="h-auto w-full" role="img" aria-label="Architecture SYNAPSE en quatre couches">
              <rect x="20" y="30" width="200" height="56" rx="10" className="fill-muted" />
              <rect x="240" y="30" width="200" height="56" rx="10" className="fill-muted" />
              <rect x="460" y="30" width="200" height="56" rx="10" className="fill-muted" />
              <rect x="680" y="30" width="200" height="56" rx="10" className="fill-muted" />
              <text x="120" y="64" textAnchor="middle" className="fill-foreground text-sm">Donnees</text>
              <text x="340" y="64" textAnchor="middle" className="fill-foreground text-sm">Intelligence</text>
              <text x="560" y="64" textAnchor="middle" className="fill-foreground text-sm">Services</text>
              <text x="780" y="64" textAnchor="middle" className="fill-foreground text-sm">Experience</text>

              <line x1="220" y1="58" x2="240" y2="58" stroke="currentColor" className="text-muted-foreground" />
              <line x1="440" y1="58" x2="460" y2="58" stroke="currentColor" className="text-muted-foreground" />
              <line x1="660" y1="58" x2="680" y2="58" stroke="currentColor" className="text-muted-foreground" />

              <rect x="80" y="150" width="740" height="70" rx="12" className="fill-secondary" />
              <text x="450" y="182" textAnchor="middle" className="fill-foreground text-sm">
                Flux continu : diagnostic - debats - arbitrages - preuves - soutenance
              </text>
              <text x="450" y="204" textAnchor="middle" className="fill-muted-foreground text-xs">
                Architecture abstraite volontairement sans details d&apos;infrastructure
              </text>
            </svg>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 font-fraunces text-3xl">Le parcours d&apos;Amira</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            Jour 0, Amira Ben Salah lance son diagnostic a l&apos;ENIT et construit un premier graphe de competences.
            Pendant son PFE chez LogiTrans SA, le Conseil ajuste le cap, le Game Master arbitre les tensions, et
            chaque mutation du projet produit des preuves verifiables jusqu&apos;a une soutenance defendable devant le jury.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>Hackathon SYNAPSE - TODO: equipe</span>
          <span>Contact - TODO: equipe</span>
        </div>
      </footer>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  )
}
