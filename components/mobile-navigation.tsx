"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Trophy, Calendar, Play, X } from "lucide-react"

interface MobileNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function MobileNavigation({ activeSection, onSectionChange }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      id: "live",
      label: "Live Matches",
      icon: Play,
      description: "Current and upcoming matches",
    },
    {
      id: "points",
      label: "Points Table",
      icon: Trophy,
      description: "Team standings and rankings",
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: Calendar,
      description: "Complete match schedule",
    },
  ]

  const handleSectionChange = (section: string) => {
    onSectionChange(section)
    setIsOpen(false)
  }

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-auto p-4 ${
                    activeSection === item.id ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={() => handleSectionChange(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
