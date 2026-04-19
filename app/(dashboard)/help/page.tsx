'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, MessagesSquare, BookOpen, GraduationCap } from 'lucide-react'

const helpCards = [
  {
    id: 'guide-conseil',
    title: 'Guide du Conseil',
    description: 'Comprendre le role des 5 agents et les bonnes pratiques pour lancer un debat utile.',
    href: '/conseil',
    cta: 'Ouvrir le guide',
    icon: MessagesSquare,
  },
  {
    id: 'faq-pfe',
    title: 'FAQ PFE',
    description: 'Questions frequentes sur les phases du PFE, les livrables et la soutenance.',
    href: '/parcours',
    cta: 'Consulter la FAQ',
    icon: BookOpen,
  },
  {
    id: 'contact-encadrant',
    title: 'Contact encadrant',
    description: 'Acceder rapidement aux arbitrages et aux actions de suivi avec l encadrant.',
    href: '/encadrant',
    cta: 'Contacter',
    icon: GraduationCap,
  },
]

export default function HelpPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Centre d aide
        </h1>
        <p className="text-muted-foreground">
          Ressources rapides pour avancer dans votre PFE avec SYNAPSE.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {helpCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.id} className="border-border">
              <CardHeader className="space-y-3">
                <Icon className="h-5 w-5 text-signal-blue" />
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={card.href}>{card.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </motion.div>
  )
}
