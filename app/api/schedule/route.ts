import { mockSchedule } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockSchedule,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch schedule" }, { status: 500 })
  }
}
