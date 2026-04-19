'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import type { SkillNode, SkillEdge, SkillStatus, SkillCategory } from '@/lib/types'

const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d').then(mod => mod.default),
  { ssr: false }
) as any

type ForceGraphMethods<N, L> = any
type NodeObject = any
type LinkObject = any

interface SkillForceGraphProps {
  nodes: SkillNode[]
  edges: SkillEdge[]
  selectedNodeId?: string
  onNodeClick?: (node: SkillNode) => void
  onNodeHover?: (node: SkillNode | null) => void
  onAppendEvidence?: (skillId: string, evidence: string) => void
  width?: number
  height?: number
}

interface GraphNode extends NodeObject {
  id: string
  skill: SkillNode
}

interface GraphLink extends LinkObject {
  strength: number
}

const statusColors: Record<SkillStatus, string> = {
  locked: '#3a3a4a',
  unlocked: '#52525b',
  in_progress: '#6B9FFF',
  mastered: '#75EE9F',
  suggested: '#6B9FFF',
}

const categoryColors: Record<SkillCategory, string> = {
  technical: '#6B9FFF',
  leadership: '#FF7B7B',
  communication: '#7BDFDF',
  strategic: '#E5B567',
  creative: '#B388FF',
  analytical: '#75EE9F',
  domain: '#E5B567',
  soft: '#7BDFDF',
}

export function SkillForceGraph({
  nodes,
  edges,
  selectedNodeId,
  onNodeClick,
  onNodeHover,
  onAppendEvidence,
  width = 800,
  height = 600,
}: SkillForceGraphProps) {
  const graphRef = useRef<ForceGraphMethods<GraphNode, GraphLink> | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [legendOpen, setLegendOpen] = useState(true)
  const [evidenceTarget, setEvidenceTarget] = useState<SkillNode | null>(null)
  const [evidenceDraft, setEvidenceDraft] = useState('')

  const directPrerequisiteIds = new Set(
    hoveredNode
      ? edges
          .filter((edge) => edge.type === 'prerequisite' && edge.target === hoveredNode)
          .map((edge) => edge.source)
      : []
  )
  if (hoveredNode) directPrerequisiteIds.add(hoveredNode)

  // Transform data for force graph
  const graphData = {
    nodes: nodes.map(skill => ({
      id: skill.id,
      skill,
    })) as GraphNode[],
    links: edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      strength: edge.strength,
    })) as GraphLink[],
  }

  // Custom node rendering with canvas
  const drawNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { skill } = node
    const x = node.x ?? 0
    const y = node.y ?? 0
    
    const isSelected = selectedNodeId === skill.id
    const isHovered = hoveredNode === skill.id
    const hasHoverFocus = Boolean(hoveredNode)
    const isInFocus = !hasHoverFocus || directPrerequisiteIds.has(skill.id)
    const nodeAlpha = isInFocus ? 1 : 0.3
    const baseSize = skill.status === 'mastered' ? 12 : skill.status === 'locked' ? 6 : 8
    const size = baseSize * (isSelected ? 1.5 : isHovered ? 1.3 : 1)
    const previousAlpha = ctx.globalAlpha
    ctx.globalAlpha = previousAlpha * nodeAlpha
    
    // Glow effect for mastered/selected nodes
    if (skill.status === 'mastered' || isSelected) {
      ctx.beginPath()
      ctx.arc(x, y, size + 4, 0, 2 * Math.PI)
      const gradient = ctx.createRadialGradient(x, y, size, x, y, size + 8)
      gradient.addColorStop(0, `${statusColors[skill.status]}40`)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Main node circle
    ctx.beginPath()
    ctx.arc(x, y, size, 0, 2 * Math.PI)
    
    // Fill based on status
    if (skill.status === 'locked') {
      ctx.fillStyle = statusColors.locked
    } else {
      // Gradient fill showing progress
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, categoryColors[skill.category])
      gradient.addColorStop(skill.level / 100, categoryColors[skill.category])
      gradient.addColorStop(skill.level / 100, `${categoryColors[skill.category]}40`)
      gradient.addColorStop(1, `${categoryColors[skill.category]}20`)
      ctx.fillStyle = gradient
    }
    ctx.fill()

    // Border
    ctx.strokeStyle = isSelected 
      ? '#75EE9F' 
      : isHovered 
        ? '#ffffff' 
        : `${statusColors[skill.status]}80`
    ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1
    ctx.stroke()

    // Label (only show when zoomed in or hovered/selected)
    if (globalScale > 0.8 || isHovered || isSelected) {
      const fontSize = Math.max(10 / globalScale, 8)
      ctx.font = `${isSelected ? 'bold ' : ''}${fontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = skill.status === 'locked' ? '#71717a' : '#e4e4e7'
      ctx.fillText(skill.name, x, y + size + 4)
      
      // Level percentage
      if (skill.status !== 'locked' && (isHovered || isSelected)) {
        ctx.font = `${fontSize * 0.8}px Inter, system-ui, sans-serif`
        ctx.fillStyle = '#a1a1aa'
        ctx.fillText(`${skill.level}%`, x, y + size + 4 + fontSize + 2)
      }
    }
    ctx.globalAlpha = previousAlpha
  }, [selectedNodeId, hoveredNode, directPrerequisiteIds])

  // Custom link rendering
  const drawLink = useCallback((link: GraphLink, ctx: CanvasRenderingContext2D) => {
    const source = link.source as GraphNode
    const target = link.target as GraphNode
    
    if (!source.x || !source.y || !target.x || !target.y) return

    const isHighlighted = 
      selectedNodeId === source.skill.id || 
      selectedNodeId === target.skill.id ||
      hoveredNode === source.skill.id ||
      hoveredNode === target.skill.id
    const isDirectPrerequisiteLink =
      hoveredNode !== null &&
      target.skill.id === hoveredNode &&
      edges.some(
        (edge) =>
          edge.type === 'prerequisite' &&
          edge.source === source.skill.id &&
          edge.target === target.skill.id
      )
    const hasHoverFocus = Boolean(hoveredNode)
    const edgeAlpha = hasHoverFocus ? (isDirectPrerequisiteLink ? 1 : 0.3) : 1

    ctx.beginPath()
    ctx.moveTo(source.x, source.y)
    ctx.lineTo(target.x, target.y)
    
    ctx.strokeStyle = isHighlighted 
      ? `rgba(117, 238, 159, ${link.strength * 0.8})` 
      : `rgba(82, 82, 91, ${link.strength * 0.5})`
    ctx.lineWidth = hasHoverFocus ? (isDirectPrerequisiteLink ? 3 : 1) : isHighlighted ? 2 : 1
    const previousAlpha = ctx.globalAlpha
    ctx.globalAlpha = previousAlpha * edgeAlpha
    ctx.stroke()
    ctx.globalAlpha = previousAlpha
  }, [selectedNodeId, hoveredNode, edges])

  // Handle node interactions
  const handleNodeClick = useCallback((node: GraphNode, event: MouseEvent) => {
    if (event.detail === 2) {
      setEvidenceTarget(node.skill)
      setEvidenceDraft('')
      return
    }
    onNodeClick?.(node.skill)
    
    // Center on node
    graphRef.current?.centerAt(node.x, node.y, 500)
    graphRef.current?.zoom(2, 500)
  }, [onNodeClick])

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node?.skill.id ?? null)
    onNodeHover?.(node?.skill ?? null)
  }, [onNodeHover])

  // Configure force simulation
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge')?.strength(-150)
      graphRef.current.d3Force('link')?.distance((link: GraphLink) => 80 / link.strength)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative rounded-lg overflow-hidden bg-background border border-border"
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={width}
        height={height}
        backgroundColor="transparent"
        nodeCanvasObject={drawNode}
        linkCanvasObject={drawLink}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodePointerAreaPaint={(node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
          const size = node.skill.status === 'mastered' ? 14 : 10
          ctx.beginPath()
          ctx.arc(node.x ?? 0, node.y ?? 0, size, 0, 2 * Math.PI)
          ctx.fillStyle = color
          ctx.fill()
        }}
        cooldownTicks={100}
        warmupTicks={50}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        minZoom={0.5}
        maxZoom={5}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-card/80 backdrop-blur border border-border max-w-[320px] transition-all duration-150 ease-in-out">
        <button
          type="button"
          onClick={() => setLegendOpen((prev) => !prev)}
          className="text-xs font-medium text-muted-foreground mb-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
        >
          Legende {legendOpen ? '−' : '+'}
        </button>
        {legendOpen && (
          <div className="space-y-3">
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Statuts</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {Object.entries(statusColors).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-muted-foreground capitalize">
                      {status === 'mastered' ? 'Maitrise' :
                       status === 'unlocked' ? 'En cours' :
                       status === 'suggested' ? 'Suggere' : 'Verrouille'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Categories</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {Object.entries(categoryColors).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                    <span className="text-muted-foreground capitalize">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button
          onClick={() => graphRef.current?.zoom(graphRef.current.zoom() * 1.5, 300)}
          aria-label="Zoom avant"
          className="w-8 h-8 rounded bg-card/80 backdrop-blur border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          +
        </button>
        <button
          onClick={() => graphRef.current?.zoom(graphRef.current.zoom() / 1.5, 300)}
          aria-label="Zoom arriere"
          className="w-8 h-8 rounded bg-card/80 backdrop-blur border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          -
        </button>
        <button
          onClick={() => {
            graphRef.current?.centerAt(0, 0, 300)
            graphRef.current?.zoom(1, 300)
          }}
          aria-label="Reinitialiser le zoom"
          className="w-8 h-8 rounded bg-card/80 backdrop-blur border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-xs"
        >
          R
        </button>
      </div>

      {evidenceTarget && (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const payload = evidenceDraft.trim()
            if (!payload) return
            onAppendEvidence?.(evidenceTarget.id, payload)
            setEvidenceDraft('')
            setEvidenceTarget(null)
          }}
          className="absolute top-4 left-1/2 -translate-x-1/2 w-[min(460px,calc(100%-2rem))] rounded-lg border border-border bg-card/95 backdrop-blur p-3 space-y-2 shadow-lg"
        >
          <p className="text-xs text-muted-foreground">
            Ajouter une preuve · <span className="text-foreground">{evidenceTarget.name}</span>
          </p>
          <textarea
            value={evidenceDraft}
            onChange={(event) => setEvidenceDraft(event.target.value)}
            className="w-full h-20 rounded-md border border-border bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="Contexte, lien ou note de preuve..."
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEvidenceTarget(null)}
              className="px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:text-foreground"
            >
              annuler
            </button>
            <button
              type="submit"
              className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground"
            >
              commit
            </button>
          </div>
        </form>
      )}
    </motion.div>
  )
}
