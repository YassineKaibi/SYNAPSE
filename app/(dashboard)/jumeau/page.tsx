'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { alertLoops, currentUser, twinForecasts, twinSignals } from '@/lib/data/mock-data'
import type { TwinSignal } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, Brain, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const chartData = twinForecasts.map((forecast, index) => ({
  index: index + 1,
  label: forecast.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
  momentum: Math.round(forecast.predictedMomentum),
  stress: Math.round(forecast.predictedStress),
  riskFactors: forecast.riskFactors,
  opportunities: forecast.opportunities,
}))

function RiskDot(props: any) {
  const { cx, cy, payload } = props
  if (!payload?.riskFactors?.length) return null
  return (
    <path
      d={`M ${cx} ${cy - 6} L ${cx - 5} ${cy + 4} L ${cx + 5} ${cy + 4} Z`}
      fill="var(--signal-orange)"
      stroke="var(--signal-orange)"
    />
  )
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

function trendFromDelta(delta: number): TwinSignal['trend'] {
  if (delta > 0.5) return 'rising'
  if (delta < -0.5) return 'falling'
  return 'stable'
}

function AnimatedPercent({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const start = display
    const end = value
    const duration = 550
    const startAt = performance.now()
    let raf = 0

    const tick = (time: number) => {
      const progress = Math.min((time - startAt) / duration, 1)
      setDisplay(Math.round(start + (end - start) * progress))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return <>{display}%</>
}

export default function JumeauPage() {
  const [liveSignals, setLiveSignals] = useState<TwinSignal[]>(twinSignals)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveSignals((prev) =>
        prev.map((signal) => {
          const delta = (Math.random() - 0.5) * 4
          const nextValue = clamp(signal.value + delta)
          return {
            ...signal,
            value: nextValue,
            trend: trendFromDelta(nextValue - signal.value),
            timestamp: new Date(),
          }
        })
      )
    }, 8000)

    return () => window.clearInterval(interval)
  }, [])

  const signalCards = useMemo(() => liveSignals, [liveSignals])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Jumeau Cognitif</h1>
        <p className="text-muted-foreground">
          Suivi de {currentUser.name} · {currentUser.company}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {signalCards.map((signal) => {
          const isRising = signal.trend === 'rising'
          const TrendIcon = isRising ? TrendingUp : TrendingDown
          const isStable = signal.trend === 'stable'
          return (
            <Card key={signal.id}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground capitalize mb-1">{signal.type}</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold">
                    <AnimatedPercent value={signal.value} />
                  </p>
                  {isStable ? (
                    <div className="w-4 h-4 rounded-full bg-border" />
                  ) : (
                    <TrendIcon
                      className={cn(
                        'w-4 h-4',
                        signal.type === 'stress'
                          ? isRising ? 'text-signal-orange' : 'text-signal-green'
                          : isRising ? 'text-signal-green' : 'text-signal-orange'
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Trajectoire prédite
          </CardTitle>
          <CardDescription>
            Projection 28 jours · momentum (vert) et stress (orange)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={3} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <ReferenceLine y={70} stroke="var(--signal-orange)" strokeDasharray="4 4" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const item = payload[0].payload
                    return (
                      <div className="rounded-md border border-border bg-background p-3 text-xs">
                        <p className="font-medium mb-2">{item.label}</p>
                        <p>Momentum: <span className="font-mono text-signal-green">{item.momentum}%</span></p>
                        <p>Stress: <span className="font-mono text-signal-orange">{item.stress}%</span></p>
                        {item.riskFactors.length > 0 && (
                          <p className="mt-2 text-signal-orange">
                            Risques: {item.riskFactors.join(', ')}
                          </p>
                        )}
                        {item.opportunities.length > 0 && (
                          <p className="mt-1 text-signal-green">
                            Opportunites: {item.opportunities.join(', ')}
                          </p>
                        )}
                      </div>
                    )
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="momentum"
                  stroke="var(--signal-green)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="var(--signal-orange)"
                  strokeWidth={2}
                  dot={<RiskDot />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-signal-orange" />
            Les marqueurs triangulaires signalent des jours a risque.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Boucles d&apos;alerte actives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alertLoops.map((loop) => {
            const ratio = Math.min(100, Math.round((loop.currentValue / loop.threshold) * 100))
            return (
              <div key={loop.id} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium capitalize">{loop.signal}</p>
                    <Badge variant={loop.triggered ? 'destructive' : 'outline'} className="text-[10px]">
                      {loop.triggered ? 'Declenchee' : 'Surveillance'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Seuil {loop.threshold}% · Actuel {loop.currentValue}%
                  </p>
                </div>
                <Progress value={ratio} className="h-1.5" />
                <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between gap-3">
                  <span>Dernier declenchement: {loop.lastTriggered ? loop.lastTriggered.toLocaleString('fr-FR') : 'Jamais'}</span>
                  <span className="text-foreground/80">Action: {loop.action}</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
