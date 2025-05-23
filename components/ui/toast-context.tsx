"use client"

import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import * as React from "react"

const ToastContext = React.createContext<ReturnType<typeof useToast> | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast()

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
} 