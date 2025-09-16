"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { MatchEvent, Match } from "@/lib/types"

export function useMatchEvents(onEvent?: (event: MatchEvent) => void) {
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const previousMatchDataRef = useRef<Match[]>([])

  const detectEvents = useCallback((currentMatches: Match[], previousMatches: Match[]) => {
    const newEvents: MatchEvent[] = []

    currentMatches.forEach((currentMatch) => {
      const previousMatch = previousMatches.find((m) => m.id === currentMatch.id)

      if (!previousMatch || !currentMatch.score || !previousMatch.score) return

      const currentTeam1 = currentMatch.score.team1
      const currentTeam2 = currentMatch.score.team2
      const prevTeam1 = previousMatch.score.team1
      const prevTeam2 = previousMatch.score.team2

      // Detect wickets
      if (currentTeam1.wickets > prevTeam1.wickets) {
        newEvents.push({
          id: `${currentMatch.id}-wicket-${Date.now()}`,
          matchId: currentMatch.id,
          type: "wicket",
          timestamp: new Date().toISOString(),
          description: `${currentMatch.team1.shortName} loses a wicket! ${currentTeam1.runs}/${currentTeam1.wickets}`,
          significance: "high",
          data: { team: currentMatch.team1.shortName, runs: currentTeam1.runs },
        })
      }

      if (currentTeam2.wickets > prevTeam2.wickets) {
        newEvents.push({
          id: `${currentMatch.id}-wicket-${Date.now()}`,
          matchId: currentMatch.id,
          type: "wicket",
          timestamp: new Date().toISOString(),
          description: `${currentMatch.team2.shortName} loses a wicket! ${currentTeam2.runs}/${currentTeam2.wickets}`,
          significance: "high",
          data: { team: currentMatch.team2.shortName, runs: currentTeam2.runs },
        })
      }

      const team1RunIncrease = currentTeam1.runs - prevTeam1.runs
      const team2RunIncrease = currentTeam2.runs - prevTeam2.runs

      if (team1RunIncrease >= 4 && team1RunIncrease <= 6) {
        const eventType = team1RunIncrease === 6 ? "six" : "boundary"
        newEvents.push({
          id: `${currentMatch.id}-${eventType}-${Date.now()}`,
          matchId: currentMatch.id,
          type: eventType,
          timestamp: new Date().toISOString(),
          description: `${currentMatch.team1.shortName} hits a ${eventType === "six" ? "SIX" : "FOUR"}! ${team1RunIncrease} runs added`,
          significance: eventType === "six" ? "high" : "medium",
          data: { team: currentMatch.team1.shortName, runs: team1RunIncrease },
        })
      }

      if (team2RunIncrease >= 4 && team2RunIncrease <= 6) {
        const eventType = team2RunIncrease === 6 ? "six" : "boundary"
        newEvents.push({
          id: `${currentMatch.id}-${eventType}-${Date.now()}`,
          matchId: currentMatch.id,
          type: eventType,
          timestamp: new Date().toISOString(),
          description: `${currentMatch.team2.shortName} hits a ${eventType === "six" ? "SIX" : "FOUR"}! ${team2RunIncrease} runs added`,
          significance: eventType === "six" ? "high" : "medium",
          data: { team: currentMatch.team2.shortName, runs: team2RunIncrease },
        })
      }

      // Detect milestones (50s, 100s, 150s, etc.)
      const checkMilestones = (current: number, previous: number, team: string) => {
        const milestones = [50, 100, 150, 200, 250]
        milestones.forEach((milestone) => {
          if (current >= milestone && previous < milestone) {
            newEvents.push({
              id: `${currentMatch.id}-milestone-${milestone}-${Date.now()}`,
              matchId: currentMatch.id,
              type: "milestone",
              timestamp: new Date().toISOString(),
              description: `${team} reaches ${milestone} runs! Great batting performance`,
              significance: "high",
              data: { team, runs: milestone },
            })
          }
        })
      }

      checkMilestones(currentTeam1.runs, prevTeam1.runs, currentMatch.team1.shortName)
      checkMilestones(currentTeam2.runs, prevTeam2.runs, currentMatch.team2.shortName)

      // Detect status changes
      if (currentMatch.status !== previousMatch.status) {
        if (currentMatch.status === "live" && previousMatch.status === "upcoming") {
          newEvents.push({
            id: `${currentMatch.id}-start-${Date.now()}`,
            matchId: currentMatch.id,
            type: "match_start",
            timestamp: new Date().toISOString(),
            description: `${currentMatch.team1.shortName} vs ${currentMatch.team2.shortName} has started!`,
            significance: "medium",
          })
        }

        if (currentMatch.status === "completed" && previousMatch.status === "live") {
          newEvents.push({
            id: `${currentMatch.id}-end-${Date.now()}`,
            matchId: currentMatch.id,
            type: "match_end",
            timestamp: new Date().toISOString(),
            description: `Match completed! ${currentMatch.result || "Result pending"}`,
            significance: "high",
          })
        }
      }
    })

    return newEvents
  }, [])

  const startEventMonitoring = useCallback(() => {
     console.log("reached here");
    const pollForEvents = async () => {
      try {
        const response = await fetch("/api/matches")
        const data = await response.json()

        if (data.success) {
          const currentMatches = data.data
          const previousMatches = previousMatchDataRef.current

          if (previousMatches.length > 0) {
            const newEvents = detectEvents(currentMatches, previousMatches)

            if (newEvents.length > 0) {
              setEvents((prev) => [...newEvents, ...prev].slice(0, 50)) // Keep last 50 events

              newEvents.forEach((event) => {
                onEvent?.(event)
              })
            }
          }

          previousMatchDataRef.current = currentMatches
        }
      } catch (error) {
      }
    }

    // Poll every 10 seconds for live matches
    const interval = setInterval(pollForEvents, 10000)
    setIsConnected(true)

    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [detectEvents, onEvent])

  useEffect(() => {
    const cleanup = startEventMonitoring()
    return cleanup
  }, [startEventMonitoring])

  return {
    events,
    isConnected,
  }
}
