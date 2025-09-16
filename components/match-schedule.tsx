"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Calendar, Clock, MapPin } from "lucide-react"
import type { ScheduleMatch } from "@/lib/types"
import Image from "next/image"

export function MatchSchedule() {
  const [schedule, setSchedule] = useState<ScheduleMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/schedule")
      const data = await response.json()

      if (data.success) {
        setSchedule(data.data)
        setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString())
      }
    } catch (error) {
      console.error("Failed to fetch schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      fullDate: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const upcomingMatches = schedule.filter((match) => match.status === "upcoming")
  const completedMatches = schedule.filter((match) => match.status === "completed")
  const liveMatches = schedule.filter((match) => match.status === "live")

  const MatchCard = ({ match }: { match: ScheduleMatch }) => {
    const dateInfo = formatDate(match.date)

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {match.matchNumber}
              </Badge>
              {getStatusBadge(match.status)}
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{dateInfo.date}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-8 h-8">
                  <Image
                  src={`/team-logos/${match.team1.shortName}.png`}
                    alt={`${match.team1.name} logo`}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{match.team1.shortName}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{match.team1.name}</div>
                </div>
              </div>

              <div className="px-4">
                <span className="text-lg font-bold text-muted-foreground">VS</span>
              </div>

              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="flex-1 text-right">
                  <div className="font-semibold">{match.team2.shortName}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{match.team2.name}</div>
                </div>
                <div className="relative w-8 h-8">
                  <Image
                  src={`/team-logos/${match.team2.shortName}.png`}
                    alt={`${match.team2.name} logo`}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatTime(match.time)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{match.venue}</span>
              </div>
            </div>

            {match.result && (
              <div className="p-2 bg-accent/10 rounded text-center">
                <p className="text-sm font-medium text-accent-foreground">{match.result}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Match Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Match Schedule</CardTitle>
            {lastUpdated && <p className="text-sm text-muted-foreground mt-1">Last updated: {lastUpdated}</p>}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSchedule}
            disabled={loading}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {upcomingMatches.length > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs">{upcomingMatches.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="live" className="relative">
              Live
              {liveMatches.length > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-red-500">{liveMatches.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              {completedMatches.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {completedMatches.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            <div className="space-y-4">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => <MatchCard key={match.id} match={match} />)
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming matches scheduled.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="live" className="mt-4">
            <div className="space-y-4">
              {liveMatches.length > 0 ? (
                liveMatches.map((match) => <MatchCard key={match.id} match={match} />)
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No live matches at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="space-y-4">
              {completedMatches.length > 0 ? (
                completedMatches.map((match) => <MatchCard key={match.id} match={match} />)
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No completed matches to show.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
