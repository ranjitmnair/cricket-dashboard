"use client";

import { useState } from "react";

import { LiveMatchesSection } from "@/components/live-matches-section";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardNavigation } from "@/components/dashboard-navigation";
import { PointsTable } from "@/components/points-table";
import { MatchSchedule } from "@/components/match-schedule";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("live");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "live":
        return <LiveMatchesSection />;
      case "points":
        return <PointsTable />;
      case "schedule":
        return <MatchSchedule />;
      default:
        return <LiveMatchesSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block lg:col-span-1">
            <DashboardNavigation
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-6">{renderActiveSection()}</div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted/50 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              <p>IPL T20 Live Dashboard - Real-time cricket updates</p>
            </div>
            <div className="text-xs text-muted-foreground text-center sm:text-right">
              <p>{`Built with <3 by @ranjitmnair`}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
