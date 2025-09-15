import { mockPointsTable } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockPointsTable,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch points table" }, { status: 500 })
  }
}
