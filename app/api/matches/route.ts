import { mockMatches } from "@/lib/data";
import { NextResponse } from "next/server";

const matchState = {
  lastUpdate: Date.now(),
  eventCounter: 0,
};

function simulateMatchProgression() {
  const now = Date.now();
  const timeSinceLastUpdate = now - matchState.lastUpdate;

  // Update every 10-15 seconds to simulate real match events
  if (timeSinceLastUpdate < 10000) {
    return mockMatches;
  }

  matchState.lastUpdate = now;
  matchState.eventCounter++;

  // Find live matches and simulate events
  const updatedMatches = mockMatches.map((match) => {
    if (match.status !== "live" || !match.score) return match;

    const shouldUpdate = Math.random() > 0.3; // 70% chance of update
    if (!shouldUpdate) return match;

    const updatedMatch = { ...match };
    const eventType = Math.random();

    if (eventType < 0.1) {
      // 10% chance of wicket
      if (updatedMatch.score.team2.wickets < 10) {
        updatedMatch.score = {
          ...updatedMatch.score,
          team2: {
            ...updatedMatch.score.team2,
            wickets: updatedMatch.score.team2.wickets + 1,
            runs: updatedMatch.score.team2.runs + Math.floor(Math.random() * 3),
          },
        };
      }
    } else if (eventType < 0.25) {
      // 15% chance of boundary (4 or 6)
      const boundaryRuns = Math.random() > 0.7 ? 6 : 4;
      updatedMatch.score = {
        ...updatedMatch.score,
        team2: {
          ...updatedMatch.score.team2,
          runs: updatedMatch.score.team2.runs + boundaryRuns,
          overs: Math.min(20, updatedMatch.score.team2.overs + 0.1),
        },
      };
    } else if (eventType < 0.8) {
      // 55% chance of regular runs (1-3)
      const runs = Math.floor(Math.random() * 3) + 1;
      const balls =
        Math.floor(updatedMatch.score.team2.overs) * 6 +
        Math.round((updatedMatch.score.team2.overs % 1) * 10) +
        1;

      updatedMatch.score = {
        ...updatedMatch.score,
        team2: {
          ...updatedMatch.score.team2,
          runs: updatedMatch.score.team2.runs + runs,
          overs: Math.min(20, Math.floor(balls / 6) + (balls % 6) / 10),
        },
      };
    }

    // Check if match should end
    if (
      updatedMatch.score.team2.overs >= 20 ||
      updatedMatch.score.team2.wickets >= 10
    ) {
      updatedMatch.status = "completed";
      const team1Score = updatedMatch.score.team1.runs;
      const team2Score = updatedMatch.score.team2.runs;

      if (team2Score > team1Score) {
        updatedMatch.result = `${updatedMatch.team2.shortName} won by ${
          10 - updatedMatch.score.team2.wickets
        } wickets`;
      } else {
        updatedMatch.result = `${updatedMatch.team1.shortName} won by ${
          team1Score - team2Score
        } runs`;
      }
    }

    return updatedMatch;
  });

  // Update the global state
  mockMatches.splice(0, mockMatches.length, ...updatedMatches);

  return updatedMatches;
}
export async function GET() {
  try {
    const matches = simulateMatchProgression();
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
