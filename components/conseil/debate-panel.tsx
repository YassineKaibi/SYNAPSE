'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Debate } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MessageBubble, TypingIndicator, DisagreementSurface } from './message-bubble'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Pause, Play, RotateCcw, Users } from 'lucide-react'
import { agents } from '@/lib/data/mock-data'

interface DebatePanelProps {
  debate: Debate
  speakingAgentId?: string | null
  onSendMessage?: (content: string) => void
}

export function DebatePanel({ debate, speakingAgentId, onSendMessage }: DebatePanelProps) {
  const [input, setInput] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const [showDisagreement, setShowDisagreement] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [debate.messages, speakingAgentId])

  const handleSend = () => {
    if (!input.trim() || isPaused) return
    
    const userInput = input
    setInput('')
    onSendMessage?.(userInput)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Check if there's an active disagreement in recent messages
  const hasActiveDisagreement = debate.messages.some(m => m.type === 'disagreement')
  const speakingAgent = speakingAgentId ? agents.find((a) => a.id === speakingAgentId) : null

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="font-serif text-lg font-semibold">{debate.topic}</h2>
          <p className="text-sm text-muted-foreground line-clamp-1">{debate.context}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDisagreement(!showDisagreement)}
            className={cn(
              'gap-1 text-xs',
              hasActiveDisagreement && 'text-signal-orange'
            )}
          >
            <Users className="w-3 h-3" />
            Desaccords
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Reprendre le debat' : 'Mettre le debat en pause'}
            className={cn(isPaused && 'text-destructive')}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Reinitialiser le debat">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Disagreement Surface - shown above messages when active */}
      <AnimatePresence>
        {showDisagreement && debate.disagreements.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 border-b border-border overflow-hidden"
          >
            <div className="p-4">
              <DisagreementSurface disagreement={debate.disagreements[0]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {debate.messages.map((message, index) => {
          const agent = agents.find(a => a.id === message.agentId)
          if (!agent) return null

          return (
            <MessageBubble
              key={message.id}
              message={message}
              agent={agent}
              isLatest={index === debate.messages.length - 1}
              useTypewriter={index === debate.messages.length - 1}
            />
          )
        })}

        <AnimatePresence>
          {speakingAgent && <TypingIndicator key={speakingAgent.id} agent={speakingAgent} />}
        </AnimatePresence>

        {/* Consensus indicator */}
        {debate.consensusReached && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center p-4"
          >
            <div className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium">
              Consensus atteint
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez une question au Conseil..."
            className="flex-1"
            disabled={isPaused}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isPaused}
            className="shrink-0"
            aria-label="Envoyer le message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {isPaused
            ? 'Debat en pause.'
            : '2 agents repondront a chaque message. Appuyez sur Entree pour envoyer.'}
        </p>
      </div>
    </div>
  )
}
