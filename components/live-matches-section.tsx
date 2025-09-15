"use client";

import { useState, useEffect } from "react";
import { LiveMatchCard } from "./live-match-card";
import type { Match } from "@/lib/types";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LiveMatchesSection() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/matches");
      const data = await response.json();

      if (data.success) {
        setMatches(data.data);
        setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();

    // Auto-refresh every 30 seconds for live matches
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const liveMatches = matches.filter((match) => match.status === "live");
  const upcomingMatches = matches
    .filter((match) => match.status === "upcoming")
    .slice(0, 2);
  const displayMatches = liveMatches.length > 0 ? liveMatches : upcomingMatches;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Live Matches</h2>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {liveMatches.length > 0 ? "Live Matches" : "Upcoming Matches"}
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {lastUpdated && <span>Last updated: {lastUpdated}</span>}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMatches}
          disabled={loading}
          className="gap-2 bg-transparent"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {displayMatches.map((match) => (
          <LiveMatchCard key={match.id} match={match} />
        ))}
      </div>

      {displayMatches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No matches available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
