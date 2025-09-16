"use client"

import { useState, useEffect, useCallback } from "react"
import type { MatchEvent, NotificationSettings } from "@/lib/types"
import { toast } from "./use-toast"

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    wickets: true,
    boundaries: true,
    milestones: true,
    matchUpdates: true,
    browserNotifications: false,
  })

  const [permission, setPermission] = useState<NotificationPermission>("default")

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      if (result === "granted") {
        setSettings((prev) => ({ ...prev, browserNotifications: true }))
      }
    }
  }, [])

  const showToastNotification = useCallback(
    (event: MatchEvent) => {
      if (!settings.enabled) return

      const shouldShow =
        (event.type === "wicket" && settings.wickets) ||
        (event.type === "boundary" && settings.boundaries) ||
        (event.type === "six" && settings.boundaries) ||
        (event.type === "milestone" && settings.milestones) ||
        (["match_start", "match_end", "innings_break"].includes(event.type) && settings.matchUpdates)

      if (!shouldShow) return

      const getToastVariant = () => {
        switch (event.significance) {
          case "high":
            return "destructive"
          default:
            return "default"
        }
      }

      const getIcon = () => {
        switch (event.type) {
          case "wicket":
            return "🏏"
          case "boundary":
            return "4️⃣"
          case "six":
            return "6️⃣"
          case "milestone":
            return "🎯"
          case "match_start":
            return "🚀"
          case "match_end":
            return "🏆"
          case "innings_break":
            return "⏸️"
          default:
            return "📢"
        }
      }

      toast({
        title: `${getIcon()} ${event.type.toUpperCase().replace("_", " ")}`,
        description: event.description,
        variant: getToastVariant(),
      })
    },
    [settings],
  )

  const showBrowserNotification = useCallback(
    (event: MatchEvent) => {
      if (!settings.browserNotifications || permission !== "granted") return

      const notification = new Notification(`IPL Update: ${event.type.toUpperCase()}`, {
        body: event.description,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `match-${event.matchId}`,
        requireInteraction: event.significance === "high",
      })

      // Auto-close after 5 seconds for low/medium significance
      if (event.significance !== "high") {
        setTimeout(() => notification.close(), 5000)
      }
    },
    [settings.browserNotifications, permission],
  )

  const handleMatchEvent = useCallback(
    (event: MatchEvent) => {
      showToastNotification(event)
      showBrowserNotification(event)
    },
    [showToastNotification, showBrowserNotification],
  )

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  return {
    settings,
    setSettings,
    permission,
    requestNotificationPermission,
    handleMatchEvent,
  }
}
