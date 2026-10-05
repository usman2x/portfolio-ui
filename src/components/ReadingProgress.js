import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

// Thin progress bar for article pages. Progress starts once `startRef` (the
// article) enters the viewport and is complete when the bottom of `endRef`
// (the article body) reaches the bottom of the viewport, so the footer and
// author card do not affect it. The bar is rendered into the sticky site
// header so it sits on the nav bar's bottom edge.
const ReadingProgress = ({ startRef, endRef }) => {
  const barRef = useRef(null)
  const [header, setHeader] = useState(null)

  useEffect(() => {
    setHeader(document.querySelector(".header"))
  }, [])

  useEffect(() => {
    const bar = barRef.current
    const startElement = startRef.current
    const endElement = endRef.current
    if (!bar || !startElement || !endElement) return undefined

    let frame = null

    const update = () => {
      frame = null
      const scrollY = window.scrollY
      const start = Math.max(
        0,
        startElement.getBoundingClientRect().top + scrollY - window.innerHeight
      )
      // Floor so a fractional content bottom still reaches 100% at whole-pixel scroll.
      const end = Math.floor(
        endElement.getBoundingClientRect().bottom + scrollY - window.innerHeight
      )
      const progress =
        end <= start ? 1 : Math.min(1, Math.max(0, (scrollY - start) / (end - start)))
      bar.style.transform = `scaleX(${progress})`
    }

    const requestUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    // Images and fonts loading change the article height after first paint.
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(requestUpdate)
    resizeObserver?.observe(endElement)

    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      resizeObserver?.disconnect()
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [startRef, endRef, header])

  if (!header) return null

  return createPortal(
    <div className="reading-progress" aria-hidden="true">
      <div ref={barRef} className="reading-progress-bar" />
    </div>,
    header
  )
}

export default ReadingProgress
