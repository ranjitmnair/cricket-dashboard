"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { MobileNavigation } from "./mobile-navigation"

interface DashboardHeaderProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function DashboardHeader({ activeSection = "live", onSectionChange }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onSectionChange && <MobileNavigation activeSection={activeSection} onSectionChange={onSectionChange} />}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">IPL</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary">T20 Live Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Real-time IPL match updates</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Badge className="bg-red-500 text-white animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                LIVE
              </Badge>
              <span className="text-sm text-muted-foreground">{currentTime}</span>
            </div>
          </div>
        </div>

        <div className="md:hidden mt-2 flex items-center justify-between">
          <Badge className="bg-red-500 text-white animate-pulse text-xs">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            LIVE
          </Badge>
          <span className="text-xs text-muted-foreground">{currentTime}</span>
        </div>
      </div>
    </header>
  )
}
