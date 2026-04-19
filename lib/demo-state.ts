import type { ArbitrationRequest } from '@/lib/types'

const DEMO_ARBITRATION_KEY = 'synapse.demo.arbitration'

function hasWindow() {
  return typeof window !== 'undefined'
}

export function saveDemoArbitration(arbitration: ArbitrationRequest) {
  if (!hasWindow()) return
  window.localStorage.setItem(DEMO_ARBITRATION_KEY, JSON.stringify(arbitration))
}

export function loadDemoArbitration(): ArbitrationRequest | null {
  if (!hasWindow()) return null
  const raw = window.localStorage.getItem(DEMO_ARBITRATION_KEY)
  if (!raw) return null
  const parsed = JSON.parse(raw) as ArbitrationRequest & { requestedAt: string }
  return {
    ...parsed,
    requestedAt: new Date(parsed.requestedAt),
  }
}

export function clearDemoArbitration() {
  if (!hasWindow()) return
  window.localStorage.removeItem(DEMO_ARBITRATION_KEY)
}
