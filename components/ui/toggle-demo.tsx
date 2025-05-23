"use client"

import { Toggle } from "@/components/ui/toggle"
import * as React from "react"

export function ToggleDemo() {
  const [pressed, setPressed] = React.useState(false)
  return (
    <Toggle pressed={pressed} onPressedChange={setPressed}>
      {pressed ? "Toggled on" : "Toggle me"}
    </Toggle>
  )
} 