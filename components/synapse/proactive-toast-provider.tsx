'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { proactiveToasts } from '@/lib/data/mock-data'
import type { ProactiveToast } from '@/lib/types'

function emitToast(item: ProactiveToast, onNavigate: (href: string) => void) {
  const itemAction = item.action
  const action = itemAction
    ? {
        label: itemAction.label,
        onClick: () => onNavigate(itemAction.href),
      }
    : undefined

  const payload = {
    description: item.message,
    duration: item.duration || undefined,
    action,
  }

  if (item.type === 'warning') {
    toast.warning(item.title, payload)
    return
  }
  if (item.type === 'success') {
    toast.success(item.title, payload)
    return
  }
  toast(item.title, payload)
}

export function ProactiveToastProvider() {
  const router = useRouter()
  const toastIndex = useRef(0)
  const orderedToasts = useMemo(
    () => [...proactiveToasts].sort((a, b) => b.priority - a.priority),
    []
  )

  useEffect(() => {
    if (orderedToasts.length === 0) return

    const showNext = () => {
      const item = orderedToasts[toastIndex.current % orderedToasts.length]
      emitToast(item, (href) => router.push(href))
      toastIndex.current += 1
    }

    showNext()
    const interval = window.setInterval(showNext, 30_000)
    return () => window.clearInterval(interval)
  }, [orderedToasts, router])

  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        className: 'border border-border bg-card text-card-foreground',
      }}
    />
  )
}
