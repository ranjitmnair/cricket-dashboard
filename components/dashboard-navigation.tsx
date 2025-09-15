"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Calendar, Play } from "lucide-react"

interface DashboardNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function DashboardNavigation({ activeSection, onSectionChange }: DashboardNavigationProps) {
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

  return (
    <Card className="p-4">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-auto p-3 ${
                activeSection === item.id ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-70 hidden sm:block">{item.description}</div>
              </div>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
