"use client";

import { useState, useEffect } from "react";

import { Match } from "@/lib/types";

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

    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const liveMatches = matches.filter((match) => match.status === "live");
  const upcomingMatches = matches
    .filter((match) => match.status === "upcoming")
    .slice(0, 2);
  const displayMatches = liveMatches.length > 0 ? liveMatches : upcomingMatches;

  if (loading) {
    return <div>Live Matches</div>;
  }

  return (
    <>
      {liveMatches.length > 0 ? (
        liveMatches.map((match) => <h1>{match.score?.team1.runs}</h1>)
      ) : (
        <h1>No live match</h1>
      )}
    </>
  );
}
