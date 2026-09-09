import { useEffect, useState } from "react"

const ProjectGallery = ({ images = [], title }) => {
  const [activeIndex, setActiveIndex] = useState(null)
  const activeImage = activeIndex === null ? null : images[activeIndex]

  useEffect(() => {
    if (activeIndex === null) return undefined
    const onKeyDown = event => {
      if (event.key === "Escape") setActiveIndex(null)
      if (event.key === "ArrowLeft") setActiveIndex(index => (index - 1 + images.length) % images.length)
      if (event.key === "ArrowRight") setActiveIndex(index => (index + 1) % images.length)
    }
    document.body.classList.add("has-gallery-modal")
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.classList.remove("has-gallery-modal")
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeIndex, images.length])

  if (!images.length) return null

  return (
    <section className="project-gallery" aria-labelledby="project-gallery-title">
      <div className="project-gallery-heading">
        <h2 id="project-gallery-title">Project gallery</h2>
        <p>{images.length} {images.length === 1 ? "image" : "images"} · Select an image to view it full size.</p>
      </div>
      <div className="project-gallery-grid">
        {images.map((image, index) => (
          <button
            type="button"
            className={`project-gallery-item ${index === 0 ? "project-gallery-item-featured" : ""}`}
            key={image.id}
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${image.alt || `${title} image ${index + 1}`} full size`}
          >
            <img src={image.thumbnailUrl} alt={image.alt || `${title} image ${index + 1}`} loading={index < 2 ? "eager" : "lazy"} />
            {image.caption ? <span>{image.caption}</span> : null}
          </button>
        ))}
      </div>

      {activeImage ? (
        <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${title} image viewer`} onClick={() => setActiveIndex(null)}>
          <div className="project-lightbox-panel" onClick={event => event.stopPropagation()}>
            <div className="project-lightbox-toolbar">
              <p>{activeIndex + 1} / {images.length}</p>
              <button type="button" onClick={() => setActiveIndex(null)} aria-label="Close image viewer">Close ×</button>
            </div>
            <img src={activeImage.fullUrl} alt={activeImage.alt || `${title} image ${activeIndex + 1}`} />
            {activeImage.caption ? <p className="project-lightbox-caption">{activeImage.caption}</p> : null}
            {images.length > 1 ? (
              <div className="project-lightbox-controls">
                <button type="button" onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}>← Previous</button>
                <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % images.length)}>Next →</button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default ProjectGallery
