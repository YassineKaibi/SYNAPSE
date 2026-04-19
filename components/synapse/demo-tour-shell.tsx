'use client'

import { DemoTourProvider } from '@/components/synapse/demo-tour'

export function DemoTourShell({ children }: { children: React.ReactNode }) {
  return <DemoTourProvider>{children}</DemoTourProvider>
}
