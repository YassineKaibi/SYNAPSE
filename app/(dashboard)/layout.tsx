'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppSidebar } from '@/components/synapse/app-sidebar'
import { AppTopbar } from '@/components/synapse/app-topbar'
import { ProactiveToastProvider } from '@/components/synapse/proactive-toast-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sidebarWidth = sidebarCollapsed ? 64 : 220
  const effectiveSidebarWidth = isMobile ? 0 : sidebarWidth

  useEffect(() => {
    const syncMobile = () => setIsMobile(window.innerWidth < 768)
    syncMobile()
    window.addEventListener('resize', syncMobile)
    return () => window.removeEventListener('resize', syncMobile)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar defaultCollapsed={sidebarCollapsed} />
      <AppTopbar sidebarWidth={effectiveSidebarWidth} isMobile={isMobile} />
      <ProactiveToastProvider />

      <motion.main
        initial={false}
        animate={{ marginLeft: effectiveSidebarWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="pt-16 min-h-screen pb-20 md:pb-0"
      >
        <div className="p-4 md:p-6 max-w-7xl">
          {children}
        </div>
      </motion.main>
    </div>
  )
}
