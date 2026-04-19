'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Users,
  Network,
  Target,
  Brain,
  Route,
  Store,
  Building2,
  ShieldCheck,
  GraduationCap,
  Gavel,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navItems = [
  { id: 'conseil', label: 'Conseil', href: '/conseil', icon: Users, description: 'Debate with your AI council' },
  { id: 'graphe', label: 'Graphe', href: '/graphe', icon: Network, description: 'Explore your skill network' },
  { id: 'projet', label: 'Projet', href: '/projet', icon: Target, description: 'Track your career project' },
  { id: 'jumeau', label: 'Jumeau', href: '/jumeau', icon: Brain, description: 'Your cognitive twin profile' },
  { id: 'parcours', label: 'Parcours', href: '/parcours', icon: Route, description: 'Learning pathways' },
  { id: 'marketplace', label: 'Marketplace', href: '/marketplace', icon: Store, description: 'Discover new skills' },
]

const secondaryNavItems = [
  { id: 'entreprise', label: 'Entreprise', href: '/entreprise', icon: Building2, description: 'Team overview' },
  { id: 'evidence', label: 'Preuves', href: '/evidence', icon: ShieldCheck, description: 'Dossier de preuves' },
  { id: 'encadrant', label: 'Encadrant', href: '/encadrant', icon: GraduationCap, description: 'Manager dashboard' },
  { id: 'gamemaster', label: 'Game Master', href: '/gamemaster', icon: Gavel, description: 'Meta-orchestration console' },
]

const mobileTabItems = navItems.filter((item) =>
  ['conseil', 'graphe', 'projet', 'jumeau'].includes(item.id)
)

interface AppSidebarProps {
  defaultCollapsed?: boolean
}

export function AppSidebar({ defaultCollapsed = false }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 hidden md:flex flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-serif font-bold text-primary-foreground text-lg">S</span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-serif font-semibold text-lg text-sidebar-foreground tracking-tight"
                >
                  SYNAPSE
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            const Icon = item.icon
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      'hover:bg-sidebar-accent group relative',
                      isActive && 'bg-sidebar-accent text-sidebar-primary'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'
                    )} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={cn(
                            'text-sm font-medium truncate',
                            isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'
                          )}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}

          {/* Divider */}
          <div className="my-4 h-px bg-sidebar-border mx-2" />

          {/* Secondary Navigation */}
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      'hover:bg-sidebar-accent group',
                      isActive && 'bg-sidebar-accent text-sidebar-primary'
                    )}
                  >
                    <Icon className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70'
                    )} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={cn(
                            'text-sm truncate',
                            isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70'
                          )}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-sidebar-border space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent group transition-colors"
              >
                <Settings className="w-5 h-5 text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70" />
                {!collapsed && (
                  <span className="text-sm text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70">
                    Parametres
                  </span>
                )}
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Parametres</TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/help"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent group transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70" />
                {!collapsed && (
                  <span className="text-sm text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70">
                    Aide
                  </span>
                )}
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Aide</TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Etendre la barre laterale' : 'Reduire la barre laterale'}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border shadow-sm hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </Button>
      </motion.aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-sidebar-border bg-sidebar/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {mobileTabItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-md py-2 text-[10px]',
                  isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground/70'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </TooltipProvider>
  )
}
