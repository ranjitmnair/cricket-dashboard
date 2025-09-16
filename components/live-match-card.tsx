"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"
import type { Match } from "@/lib/types"
import Image from "next/image"

interface LiveMatchCardProps {
  match: Match
}

export function LiveMatchCard({ match }: LiveMatchCardProps) {
  const [timeElapsed, setTimeElapsed] = useState("")

  useEffect(() => {
    if (match.status === "live") {
      const interval = setInterval(() => {
        const now = new Date()
        const matchStart = new Date(`${match.date}T${match.time}`)
        const diff = now.getTime() - matchStart.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeElapsed(`${hours}h ${minutes}m`)
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [match.status, match.date, match.time])

  const getStatusBadge = () => {
    switch (match.status) {
      case "live":
        return <Badge className="bg-red-500 text-white animate-pulse">🔴 LIVE</Badge>
      case "upcoming":
        return (
          <Badge variant="outline" className="border-accent text-accent-foreground">
            Upcoming
          </Badge>
        )
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {getStatusBadge()}
          {match.status === "live" && timeElapsed && (
            <span className="text-sm text-muted-foreground">{timeElapsed}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src={`/team-logos/${match.team1.shortName}.png`}
                  alt={`${match.team1.name} logo`}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{match.team1.shortName}</h3>
                <p className="text-sm text-muted-foreground">{match.team1.name}</p>
              </div>
            </div>
            {match.score && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {match.score.team1.runs}/{match.score.team1.wickets}
                </div>
                <div className="text-sm text-muted-foreground">({match.score.team1.overs} overs)</div>
              </div>
            )}
          </div>

          <div className="text-center">
            <span className="text-lg font-bold text-muted-foreground">VS</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src={`/team-logos/${match.team2.shortName}.png`}
                  alt={`${match.team2.name} logo`}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{match.team2.shortName}</h3>
                <p className="text-sm text-muted-foreground">{match.team2.name}</p>
              </div>
            </div>
            {match.score && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {match.score.team2.runs}/{match.score.team2.wickets}
                </div>
                <div className="text-sm text-muted-foreground">({match.score.team2.overs} overs)</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(`${match.date}T${match.time}`).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{match.venue}</span>
          </div>
        </div>

        {/* Result */}
        {match.result && (
          <div className="p-3 bg-accent/10 rounded-lg">
            <p className="text-center font-semibold text-accent-foreground">{match.result}</p>
          </div>
        )}

        {match.status === "live" && (
          <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-sm mb-2">Live Commentary</h4>
            <p className="text-sm text-muted-foreground">
              Over {match.score?.team2.overs}: Great shot! The batsman finds the gap and picks up a boundary.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
