import { mockMatches } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const matches = mockMatches;
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
