"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { Button, ButtonProps } from "./button"

interface HydrationSafeButtonProps extends ButtonProps {
  className?: string
}

export const HydrationSafeButton = forwardRef<HTMLButtonElement, HydrationSafeButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        className={cn(className)}
        ref={ref}
        suppressHydrationWarning={true}
        {...props}
      />
    )
  }
)

HydrationSafeButton.displayName = "HydrationSafeButton" 