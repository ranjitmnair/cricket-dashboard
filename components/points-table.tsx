"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import type { PointsTableEntry } from "@/lib/types"
import Image from "next/image"

export function PointsTable() {
  const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const fetchPointsTable = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/points-table")
      const data = await response.json()

      if (data.success) {
        setPointsTable(data.data)
        setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString())
      }
    } catch (error) {
      console.error("Failed to fetch points table:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPointsTable()
  }, [])

  const getFormBadge = (result: string) => {
    return (
      <Badge
        variant={result === "W" ? "default" : "destructive"}
        className={`w-6 h-6 p-0 text-xs font-bold ${
          result === "W" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {result}
      </Badge>
    )
  }

  const getQualificationStatus = (position: number) => {
    if (position <= 4) {
      return { icon: TrendingUp, color: "text-green-600", label: "Qualified" }
    } else if (position <= 6) {
      return { icon: TrendingUp, color: "text-yellow-600", label: "In Contention" }
    } else {
      return { icon: TrendingDown, color: "text-red-600", label: "Eliminated" }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Points Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
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
            <CardTitle className="text-2xl">Points Table</CardTitle>
            {lastUpdated && <p className="text-sm text-muted-foreground mt-1">Last updated: {lastUpdated}</p>}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPointsTable}
            disabled={loading}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold">Pos</th>
                <th className="text-left py-3 px-2 font-semibold">Team</th>
                <th className="text-center py-3 px-2 font-semibold">M</th>
                <th className="text-center py-3 px-2 font-semibold">W</th>
                <th className="text-center py-3 px-2 font-semibold">L</th>
                <th className="text-center py-3 px-2 font-semibold">Pts</th>
                <th className="text-center py-3 px-2 font-semibold">NRR</th>
                <th className="text-center py-3 px-2 font-semibold">Form</th>
                <th className="text-center py-3 px-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {pointsTable.map((entry) => {
                const status = getQualificationStatus(entry.position)
                const StatusIcon = status.icon
                return (
                  <tr
                    key={entry.team.shortName}
                    className={`border-b hover:bg-muted/50 transition-colors ${
                      entry.position <= 4 ? "bg-green-50 dark:bg-green-950/20" : ""
                    }`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{entry.position}</span>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                          <Image
                  src={`/team-logos/${entry.team.shortName}.png`}
                            alt={`${entry.team.name} logo`}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{entry.team.shortName}</div>
                          <div className="text-xs text-muted-foreground hidden lg:block">{entry.team.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-2 font-medium">{entry.matches}</td>
                    <td className="text-center py-3 px-2 font-medium text-green-600">{entry.won}</td>
                    <td className="text-center py-3 px-2 font-medium text-red-600">{entry.lost}</td>
                    <td className="text-center py-3 px-2 font-bold text-primary">{entry.points}</td>
                    <td className="text-center py-3 px-2 font-medium">{entry.nrr}</td>
                    <td className="text-center py-3 px-2">
                      <div className="flex gap-1 justify-center">
                        {entry.form.map((result, index) => (
                          <div key={index}>{getFormBadge(result)}</div>
                        ))}
                      </div>
                    </td>
                    <td className="text-center py-3 px-2">
                      <Badge variant="outline" className={`text-xs ${status.color}`}>
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {pointsTable.map((entry) => {
            const status = getQualificationStatus(entry.position)
            const StatusIcon = status.icon
            return (
              <Card
                key={entry.team.shortName}
                className={`${entry.position <= 4 ? "border-green-200 bg-green-50 dark:bg-green-950/20" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl">{entry.position}</span>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      </div>
                      <div className="relative w-10 h-10">
                        <Image
                  src={`/team-logos/${entry.team.shortName}.png`}
                          alt={`${entry.team.name} logo`}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{entry.team.shortName}</div>
                        <div className="text-sm text-muted-foreground">{entry.team.name}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${status.color}`}>
                      {status.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-xs text-muted-foreground">Matches</div>
                      <div className="font-semibold">{entry.matches}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Won</div>
                      <div className="font-semibold text-green-600">{entry.won}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Points</div>
                      <div className="font-bold text-primary">{entry.points}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">NRR</div>
                      <div className="font-semibold">{entry.nrr}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1">Recent Form</div>
                    <div className="flex gap-1">
                      {entry.form.map((result, index) => (
                        <div key={index}>{getFormBadge(result)}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Legend</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Qualified for Playoffs</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
              <span>In Contention</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span>Eliminated</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            M: Matches, W: Won, L: Lost, Pts: Points, NRR: Net Run Rate
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
