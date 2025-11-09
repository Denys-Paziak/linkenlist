"use client"

interface ScrollPosition {
  x: number
  y: number
  timestamp: number
}

interface ScrollState {
  positions: Map<string, ScrollPosition>
  containers: Map<string, ScrollPosition>
  isModalOpen: boolean
  savedPosition: ScrollPosition | null
}

class ScrollManager {
  private state: ScrollState = {
    positions: new Map(),
    containers: new Map(),
    isModalOpen: false,
    savedPosition: null,
  }

  private throttleTimer: number | null = null
  private rafId: number | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.init()
    }
  }

  private init() {
    // Handle browser back/forward navigation
    window.addEventListener("popstate", this.handlePopState.bind(this))

    // Save scroll position before page unload
    window.addEventListener("beforeunload", this.saveCurrentPosition.bind(this))

    // Restore position after page load
    window.addEventListener("load", this.restorePosition.bind(this))
  }

  private respectsReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  private throttle(func: Function, delay: number) {
    if (this.throttleTimer) return

    this.throttleTimer = window.setTimeout(() => {
      func()
      this.throttleTimer = null
    }, delay)
  }

  private smoothScrollTo(x: number, y: number, duration = 300) {
    if (this.respectsReducedMotion()) {
      window.scrollTo(x, y)
      return
    }

    const startX = window.pageXOffset
    const startY = window.pageYOffset
    const distanceX = x - startX
    const distanceY = y - startY
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      window.scrollTo(startX + distanceX * easeOut, startY + distanceY * easeOut)

      if (progress < 1) {
        this.rafId = requestAnimationFrame(animateScroll)
      }
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
    this.rafId = requestAnimationFrame(animateScroll)
  }

  private getHeaderOffset(): number {
    const header = document.querySelector("header")
    return header ? header.offsetHeight : 0
  }

  private saveCurrentPosition() {
    const key = window.location.pathname + window.location.search
    this.state.positions.set(key, {
      x: window.pageXOffset,
      y: window.pageYOffset,
      timestamp: Date.now(),
    })
  }

  private handlePopState() {
    // Restore position for back/forward navigation
    setTimeout(() => {
      this.restorePosition()
    }, 0)
  }

  private restorePosition() {
    const key = window.location.pathname + window.location.search
    const savedPosition = this.state.positions.get(key)

    if (savedPosition) {
      // Only restore if position was saved recently (within 5 minutes)
      if (Date.now() - savedPosition.timestamp < 300000) {
        this.smoothScrollTo(savedPosition.x, savedPosition.y, 150)
      }
    }
  }

  // Public methods
  public scrollToTop(smooth = true) {
    if (smooth && !this.respectsReducedMotion()) {
      this.smoothScrollTo(0, 0)
    } else {
      window.scrollTo(0, 0)
    }
  }

  public scrollToHash(hash: string, smooth = true) {
    const element = document.getElementById(hash.replace("#", ""))
    if (!element) return

    const headerOffset = this.getHeaderOffset()
    const elementTop = element.offsetTop - headerOffset - 20 // Extra 20px padding

    if (smooth && !this.respectsReducedMotion()) {
      this.smoothScrollTo(0, elementTop)
    } else {
      window.scrollTo(0, elementTop)
    }
  }

  public handleNavigation(href: string, isHash = false) {
    this.saveCurrentPosition()

    if (isHash) {
      this.scrollToHash(href)
    } else {
      // For normal navigation, scroll to top will happen after page load
      // We don't need to do anything here as Next.js will handle the navigation
    }
  }

  public freezeBackground() {
    if (this.state.isModalOpen) return

    this.state.savedPosition = {
      x: window.pageXOffset,
      y: window.pageYOffset,
      timestamp: Date.now(),
    }

    document.body.style.position = "fixed"
    document.body.style.top = `-${this.state.savedPosition.y}px`
    document.body.style.left = `-${this.state.savedPosition.x}px`
    document.body.style.width = "100%"
    document.body.style.overflow = "hidden"

    this.state.isModalOpen = true
  }

  public unfreezeBackground() {
    if (!this.state.isModalOpen || !this.state.savedPosition) return

    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.left = ""
    document.body.style.width = ""
    document.body.style.overflow = ""

    window.scrollTo(this.state.savedPosition.x, this.state.savedPosition.y)

    this.state.isModalOpen = false
    this.state.savedPosition = null
  }

  public saveContainerPosition(containerId: string, element: HTMLElement) {
    this.throttle(() => {
      this.state.containers.set(containerId, {
        x: element.scrollLeft,
        y: element.scrollTop,
        timestamp: Date.now(),
      })
    }, 100)
  }

  public restoreContainerPosition(containerId: string, element: HTMLElement) {
    const position = this.state.containers.get(containerId)
    if (position && Date.now() - position.timestamp < 300000) {
      element.scrollTo(position.x, position.y)
    }
  }

  public cleanup() {
    if (this.throttleTimer) {
      clearTimeout(this.throttleTimer)
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
  }
}

// Create singleton instance
export const scrollManager = new ScrollManager()

// Hook for React components
export function useScrollManager() {
  return scrollManager
}
