import { mockMatches } from "@/lib/data";
import { NextResponse } from "next/server";

const matchState = {
  lastUpdate: Date.now(),
  eventCounter: 0,
  previousStatuses: new Map<number, string>(), // track each match status
};

function simulateMatchProgression() {
  const now = Date.now();
  const timeSinceLastUpdate = now - matchState.lastUpdate;

  // Update every ~10s
  if (timeSinceLastUpdate < 10000) {
    return mockMatches;
  }

  matchState.lastUpdate = now;
  matchState.eventCounter++;

  const updatedMatches = mockMatches.map((match) => {
    if (match.status !== "live" || !match.score) return match;

    const shouldUpdate = Math.random() > 0.3; // 70% chance to update
    if (!shouldUpdate) return match;

    const updatedMatch = { ...match };
    const eventType = Math.random();

    if (eventType < 0.1) {
      // wicket
      if (updatedMatch.score.team2.wickets < 10) {
        updatedMatch.score.team2.wickets += 1;
        updatedMatch.score.team2.runs += Math.floor(Math.random() * 3);
      }
    } else if (eventType < 0.25) {
      // boundary
      const boundary = Math.random() > 0.7 ? 6 : 4;
      updatedMatch.score.team2.runs += boundary;
      updatedMatch.score.team2.overs = Math.min(
        20,
        updatedMatch.score.team2.overs + 0.1
      );
    } else if (eventType < 0.8) {
      // singles
      const runs = Math.floor(Math.random() * 3) + 1;
      const balls =
        Math.floor(updatedMatch.score.team2.overs) * 6 +
        Math.round((updatedMatch.score.team2.overs % 1) * 10) +
        1;
      updatedMatch.score.team2.runs += runs;
      updatedMatch.score.team2.overs = Math.min(
        20,
        Math.floor(balls / 6) + (balls % 6) / 10
      );
    }

    // End match if overs or wickets exhausted
    if (
      updatedMatch.score.team2.overs >= 20 ||
      updatedMatch.score.team2.wickets >= 10
    ) {
      updatedMatch.status = "completed";
      const team1Runs = updatedMatch.score.team1.runs;
      const team2Runs = updatedMatch.score.team2.runs;

      if (team2Runs > team1Runs) {
        updatedMatch.result = `${updatedMatch.team2.shortName} won by ${
          10 - updatedMatch.score.team2.wickets
        } wickets`;
      } else {
        updatedMatch.result = `${updatedMatch.team1.shortName} won by ${
          team1Runs - team2Runs
        } runs`;
      }
    }

    return updatedMatch;
  });

  mockMatches.splice(0, mockMatches.length, ...updatedMatches);
  return updatedMatches;
}

export async function GET() {
  try {
    const matches = simulateMatchProgression();

    // ✅ Detect if any match changed from live → completed
    let shouldRevalidate = false;
    for (const m of matches) {
      const prev = matchState.previousStatuses.get(m.id);
      if (prev === "live" && m.status === "completed") {
        shouldRevalidate = true;
      }
      matchState.previousStatuses.set(m.id, m.status);
    }

    if (shouldRevalidate) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate-points`, {
          method: "POST",
        });
      } catch (err) {
        console.error("Failed to trigger revalidation:", err);
      }
    }

    return NextResponse.json({
      success: true,
      data: matches,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch match data" },
      { status: 500 }
    );
  }
}
