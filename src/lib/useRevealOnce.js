import { useEffect } from "react"

// Marks the element with data-revealed the first time it scrolls into view.
// data-animated is set only when motion is allowed, so CSS hides the element
// only in that case; without JS or under reduced motion it renders as-is.
const useRevealOnce = ref => {
  useEffect(() => {
    const element = ref.current
    if (!element || !("IntersectionObserver" in window)) return undefined
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined

    element.setAttribute("data-animated", "")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        element.setAttribute("data-revealed", "")
        observer.disconnect()
      },
      { rootMargin: "0px 0px -15% 0px" }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
}

export default useRevealOnce
