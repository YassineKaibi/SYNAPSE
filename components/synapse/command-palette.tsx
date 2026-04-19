'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Users,
  Network,
  Target,
  Brain,
  Route,
  Store,
  Building2,
  GraduationCap,
  Gavel,
  Settings,
  HelpCircle,
  Search,
  Plus,
  MessageSquare,
  Zap,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react'
import { agents, skillNodes } from '@/lib/data/mock-data'
import { AgentSigil } from '@/components/agents/agent-sigil'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const navigate = (href: string) => {
    router.push(href)
    onOpenChange(false)
    setSearchQuery('')
  }

  // Filter items based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery) return skillNodes.slice(0, 10)
    return skillNodes.filter(skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10)
  }, [searchQuery])

  const filteredAgents = useMemo(() => {
    if (!searchQuery) return agents
    return agents.filter(agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Rechercher une competence, un agent, une action..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>Aucun resultat trouve pour "{searchQuery}".</CommandEmpty>

        {/* Quick Actions - only show when not searching */}
        {!searchQuery && (
          <>
            <CommandGroup heading="Actions rapides">
              <CommandItem onSelect={() => navigate('/conseil')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Demarrer une consultation</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/onboarding')}>
                <Brain className="mr-2 h-4 w-4" />
                <span>Lancer le diagnostic</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/evidence')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Voir le dossier de preuves</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/encadrant')}>
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>Arbitrages en attente</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/gamemaster')}>
                <Gavel className="mr-2 h-4 w-4" />
                <span>Console Game Master</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/entreprise')}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Nouveau brief entreprise</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/graphe')}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Ajouter une competence</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/projet')}>
                <Zap className="mr-2 h-4 w-4" />
                <span>Voir les mutations recentes</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />
          </>
        )}

        {/* Navigation */}
        {!searchQuery && (
          <>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => navigate('/conseil')}>
                <Users className="mr-2 h-4 w-4" />
                <span>Conseil</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/graphe')}>
                <Network className="mr-2 h-4 w-4" />
                <span>Graphe</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/projet')}>
                <Target className="mr-2 h-4 w-4" />
                <span>Projet</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/jumeau')}>
                <Brain className="mr-2 h-4 w-4" />
                <span>Jumeau</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/parcours')}>
                <Route className="mr-2 h-4 w-4" />
                <span>Parcours</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/marketplace')}>
                <Store className="mr-2 h-4 w-4" />
                <span>Marketplace</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/entreprise')}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Entreprise</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/encadrant')}>
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>Encadrant</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/gamemaster')}>
                <Gavel className="mr-2 h-4 w-4" />
                <span>Game Master</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate('/catalog')}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                <span>Catalogue ecrans (dev)</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />
          </>
        )}

        {/* Agents */}
        {filteredAgents.length > 0 && (
          <>
            <CommandGroup heading="Agents">
              {filteredAgents.map(agent => (
                <CommandItem 
                  key={agent.id} 
                  onSelect={() => navigate(`/conseil?agent=${agent.id}`)}
                >
                  <div className="mr-2">
                    <AgentSigil
                      role={agent.role}
                      size="sm"
                      animated={false}
                      voiceStyle={agent.voiceStyle}
                      ariaLabel={`Sigil de ${agent.name}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate">{agent.name}</span>
                    <span className="block text-[10px] text-muted-foreground truncate">
                      {agent.personality}
                    </span>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">Consulter</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {!searchQuery && <CommandSeparator />}
          </>
        )}

        {/* Skills */}
        {filteredSkills.length > 0 && (
          <>
            <CommandGroup heading={searchQuery ? 'Competences trouvees' : 'Competences'}>
              {filteredSkills.map(skill => (
                <CommandItem 
                  key={skill.id}
                  onSelect={() => navigate(`/graphe?skill=${skill.id}`)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>{skill.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">
                    {skill.status}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            {!searchQuery && <CommandSeparator />}
          </>
        )}

        {/* Settings - only show when not searching */}
        {!searchQuery && (
          <CommandGroup heading="Parametres">
            <CommandItem onSelect={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Parametres</span>
            </CommandItem>
            <CommandItem onSelect={() => navigate('/help')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Aide</span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
