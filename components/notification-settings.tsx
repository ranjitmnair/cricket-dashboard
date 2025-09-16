"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { NotificationSettings } from "@/lib/types"

interface NotificationSettingsProps {
  settings: NotificationSettings
  onSettingsChange: (settings: NotificationSettings) => void
  permission: NotificationPermission
  onRequestPermission: () => void
}

export function NotificationSettingsCard({
  settings,
  onSettingsChange,
  permission,
  onRequestPermission,
}: NotificationSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = (key: keyof NotificationSettings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    })
  }

  const getPermissionBadge = () => {
    switch (permission) {
      case "granted":
        return <Badge className="bg-green-500">Enabled</Badge>
      case "denied":
        return <Badge variant="destructive">Blocked</Badge>
      default:
        return <Badge variant="outline">Not Set</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            <CardTitle className="text-lg">Notifications</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>Get notified about important match events</CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Notifications</p>
              <p className="text-sm text-muted-foreground">Turn on/off all notifications</p>
            </div>
            <Switch checked={settings.enabled} onCheckedChange={() => handleToggle("enabled")} />
          </div>

          {settings.enabled && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Wickets</p>
                    <p className="text-sm text-muted-foreground">When a wicket falls</p>
                  </div>
                  <Switch checked={settings.wickets} onCheckedChange={() => handleToggle("wickets")} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Boundaries</p>
                    <p className="text-sm text-muted-foreground">Fours and sixes</p>
                  </div>
                  <Switch checked={settings.boundaries} onCheckedChange={() => handleToggle("boundaries")} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Milestones</p>
                    <p className="text-sm text-muted-foreground">50s, 100s, and team milestones</p>
                  </div>
                  <Switch checked={settings.milestones} onCheckedChange={() => handleToggle("milestones")} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Match Updates</p>
                    <p className="text-sm text-muted-foreground">Start, end, and breaks</p>
                  </div>
                  <Switch checked={settings.matchUpdates} onCheckedChange={() => handleToggle("matchUpdates")} />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Browser Notifications</p>
                    <p className="text-sm text-muted-foreground">Show notifications even when tab is not active</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">Status:</span>
                      {getPermissionBadge()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Switch
                      checked={settings.browserNotifications}
                      onCheckedChange={() => handleToggle("browserNotifications")}
                      disabled={permission !== "granted"}
                    />
                    {permission !== "granted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onRequestPermission}
                        className="text-xs bg-transparent"
                      >
                        Enable
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  )
}
