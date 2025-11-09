"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

export function useUrlState() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const getParam = useCallback(
    (key: string): string => {
      return searchParams.get(key) || ""
    },
    [searchParams],
  )

  const getParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [searchParams])

  const setParam = useCallback(
    (key: string, value: string, replace = false) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      const url = `${window.location.pathname}?${params.toString()}`
      if (replace) {
        router.replace(url)
      } else {
        router.push(url)
      }
    },
    [router, searchParams],
  )

  const setParams = useCallback(
    (newParams: Record<string, string>, replace = false) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      const url = `${window.location.pathname}?${params.toString()}`
      if (replace) {
        router.replace(url)
      } else {
        router.push(url)
      }
    },
    [router, searchParams],
  )

  const removeParam = useCallback(
    (key: string, replace = false) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)

      const url = `${window.location.pathname}?${params.toString()}`
      if (replace) {
        router.replace(url)
      } else {
        router.push(url)
      }
    },
    [router, searchParams],
  )

  return useMemo(
    () => ({
      getParam,
      getParams,
      setParam,
      setParams,
      removeParam,
    }),
    [getParam, getParams, setParam, setParams, removeParam],
  )
}
