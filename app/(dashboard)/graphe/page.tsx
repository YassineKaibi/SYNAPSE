'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { skillNodes, skillEdges } from '@/lib/data/mock-data'
import { SkillForceGraph } from '@/components/graph/skill-force-graph'
import { SkillDetailPanel } from '@/components/graph/skill-detail-panel'
import type { SkillNode, SkillCategory } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  Network,
  ChevronDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const categories: { value: SkillCategory; label: string }[] = [
  { value: 'technical', label: 'Technique' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'communication', label: 'Communication' },
  { value: 'strategic', label: 'Strategique' },
  { value: 'creative', label: 'Creatif' },
  { value: 'analytical', label: 'Analytique' },
]

export default function GraphePage() {
  const [graphNodes, setGraphNodes] = useState<SkillNode[]>(skillNodes)
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<SkillCategory[]>([])
  const [viewMode, setViewMode] = useState<'graph' | 'grid'>('graph')
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Update dimensions based on container
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('graph-container')
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [selectedSkill])

  useEffect(() => {
    const syncMobileMode = () => {
      if (window.innerWidth < 768) {
        setViewMode('grid')
      }
    }
    syncMobileMode()
    window.addEventListener('resize', syncMobileMode)
    return () => window.removeEventListener('resize', syncMobileMode)
  }, [])

  useEffect(() => {
    const onDemoAction = (event: Event) => {
      const customEvent = event as CustomEvent<{ action?: string }>
      if (customEvent.detail?.action !== 'select-graphe-skill') return
      const target = graphNodes.find((node) => node.id === 'sk-fastapi')
      if (!target) return
      setViewMode('graph')
      setSelectedSkill(target)
    }
    window.addEventListener('synapse:demo-step-action', onDemoAction as EventListener)
    return () =>
      window.removeEventListener(
        'synapse:demo-step-action',
        onDemoAction as EventListener
      )
  }, [graphNodes])

  // Filter nodes
  const filteredNodes = graphNodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(node.category)
    return matchesSearch && matchesCategory
  })

  // Filter edges to only include visible nodes
  const filteredEdges = skillEdges.filter(edge => 
    filteredNodes.some(n => n.id === edge.source) &&
    filteredNodes.some(n => n.id === edge.target)
  )

  const handleNodeClick = (skill: SkillNode) => {
    setSelectedSkill(skill)
  }

  const handleCategoryToggle = (category: SkillCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // Stats
  const masteredCount = graphNodes.filter(s => s.status === 'mastered').length
  const unlockedCount = graphNodes.filter(s => s.status === 'unlocked').length
  const totalCount = graphNodes.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-7rem)] flex flex-col"
    >
      {/* Header */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl font-bold">Graphe de Competences</h1>
            <p className="text-muted-foreground">
              Explorez et developpez votre reseau de competences.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-skill-mastered/20 text-skill-mastered border-skill-mastered">
                {masteredCount} maitrisees
              </Badge>
              <Badge variant="outline">
                {unlockedCount} en cours
              </Badge>
              <Badge variant="secondary">
                {totalCount} total
              </Badge>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une competence..."
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtrer
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    {selectedCategories.length}
                  </Badge>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map(category => (
                <DropdownMenuCheckboxItem
                  key={category.value}
                  checked={selectedCategories.includes(category.value)}
                  onCheckedChange={() => handleCategoryToggle(category.value)}
                >
                  {category.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border p-1">
            <Button
              variant={viewMode === 'graph' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('graph')}
              className="h-8"
              aria-label="Afficher la vue graphe"
            >
              <Network className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
              aria-label="Afficher la vue grille"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className="text-xs text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
          >
            Vue grille pour accessibilite
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Graph/Grid Container */}
        <div 
          id="graph-container"
          data-demo="graph-main"
          className={cn(
            'flex-1 min-h-0',
            selectedSkill && 'pr-0'
          )}
        >
          {viewMode === 'graph' ? (
            <SkillForceGraph
              nodes={filteredNodes}
              edges={filteredEdges}
              selectedNodeId={selectedSkill?.id}
              onNodeClick={handleNodeClick}
              onAppendEvidence={(skillId, evidence) => {
                setGraphNodes((prev) =>
                  prev.map((node) =>
                    node.id === skillId
                      ? { ...node, evidence: [...(node.evidence ?? []), evidence] }
                      : node
                  )
                )
              }}
              width={selectedSkill ? dimensions.width - 340 : dimensions.width}
              height={dimensions.height}
            />
          ) : (
            <div className="h-full overflow-y-auto rounded-lg border border-border bg-card p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredNodes.map(skill => (
                  <motion.button
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleNodeClick(skill)}
                    className={cn(
                      'p-4 rounded-lg border text-left transition-all',
                      'hover:border-primary hover:shadow-sm',
                      selectedSkill?.id === skill.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-card',
                      skill.status === 'locked' && 'opacity-50'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={skill.status === 'mastered' ? 'default' : 'secondary'}
                        className={cn(
                          'text-[10px]',
                          skill.status === 'mastered' && 'bg-skill-mastered text-white'
                        )}
                      >
                        {skill.status}
                      </Badge>
                      {skill.status !== 'locked' && (
                        <span className="text-xs text-muted-foreground">
                          {skill.level}%
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-sm mb-1">{skill.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {skill.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedSkill && (
          <SkillDetailPanel
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
            onNavigateToSkill={(skillId) => {
              const skill = graphNodes.find(s => s.id === skillId)
              if (skill) setSelectedSkill(skill)
            }}
          />
        )}
      </div>
    </motion.div>
  )
}
