"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const router = useRouter()

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true)
  }, [])

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false)
  }, [])

  const navigateWithConfirmation = useCallback(
    (href: string) => {
      if (hasUnsavedChanges) {
        const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave?")
        if (!confirmed) return false
        setHasUnsavedChanges(false)
      }
      router.push(href)
      return true
    },
    [hasUnsavedChanges, router],
  )

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  return {
    hasUnsavedChanges,
    markAsChanged,
    markAsSaved,
    navigateWithConfirmation,
  }
}
