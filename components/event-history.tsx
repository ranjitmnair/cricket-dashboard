"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { MatchEvent } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface EventHistoryProps {
  events: MatchEvent[]
}

export function EventHistory({ events }: EventHistoryProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "wicket":
        return "🏏"
      case "boundary":
        return "4️⃣"
      case "six":
        return "6️⃣"
      case "milestone":
        return "🎯"
      case "match_start":
        return "🚀"
      case "match_end":
        return "🏆"
      case "innings_break":
        return "⏸️"
      default:
        return "📢"
    }
  }

  const getSignificanceBadge = (significance: string) => {
    switch (significance) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return <Badge className="text-xs">Medium</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
    }
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Events</CardTitle>
          <CardDescription>Live match events will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No events yet. Events will appear when matches are live.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Events</CardTitle>
        <CardDescription>Latest match events and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-lg">{getEventIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm capitalize">{event.type.replace("_", " ")}</p>
                    {getSignificanceBadge(event.significance)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
