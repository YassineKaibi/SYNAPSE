'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Command, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { currentUser, sampleInsights } from '@/lib/data/mock-data'
import { CommandPalette } from './command-palette'
import { cn } from '@/lib/utils'

interface AppTopbarProps {
  sidebarWidth?: number
  isMobile?: boolean
}

export function AppTopbar({ sidebarWidth = 220, isMobile = false }: AppTopbarProps) {
  const [commandOpen, setCommandOpen] = useState(false)
  const unreadInsights = sampleInsights.filter(i => !i.dismissed).length

  // Keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginLeft: sidebarWidth }}
        className="fixed top-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-30 flex items-center justify-between px-3 md:px-6 gap-2"
      >
        {/* Left: Search / Command Trigger */}
        <Button
          variant="outline"
          className="w-44 md:w-64 justify-start text-muted-foreground font-normal"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="w-4 h-4 mr-2" />
          <span>Rechercher...</span>
          <kbd className="ml-auto pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="w-3 h-3" />K
          </kbd>
        </Button>

        {/* Center: Live Indicator */}
        <div className={cn("absolute left-1/2 -translate-x-1/2 items-center gap-2", isMobile ? 'hidden' : 'flex')}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            Conseil actif
          </span>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Ouvrir les notifications">
                <Bell className="w-5 h-5" />
                {unreadInsights > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                  >
                    {unreadInsights}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sampleInsights.slice(0, 3).map(insight => (
                <DropdownMenuItem key={insight.id} className="flex flex-col items-start py-3">
                  <div className="flex items-center gap-2 w-full">
                    <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
                      {insight.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(insight.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="font-medium text-sm mt-1">{insight.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{insight.description}</p>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                Voir toutes les notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Ouvrir le menu utilisateur">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-secondary">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{currentUser.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{currentUser.title}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Parametres</DropdownMenuItem>
              <DropdownMenuItem>Raccourcis clavier</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Se deconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  )
}
