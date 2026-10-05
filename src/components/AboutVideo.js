import React, { useState } from "react"

const getYouTubeEmbedUrl = value => {
  if (!value) return null

  try {
    const url = new URL(value)
    const hostname = url.hostname.replace(/^www\./, "")
    let videoId = null

    if (hostname === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0]
    if (["youtube.com", "m.youtube.com"].includes(hostname)) {
      videoId = url.pathname.startsWith("/embed/")
        ? url.pathname.split("/")[2]
        : url.searchParams.get("v")
    }

    return /^[A-Za-z0-9_-]{11}$/.test(videoId || "")
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : null
  } catch (_error) {
    return null
  }
}

const AboutVideo = ({ video }) => {
  const embedUrl = getYouTubeEmbedUrl(video?.url)
  const [isPlaying, setIsPlaying] = useState(false)
  if (!embedUrl) return null

  const videoId = embedUrl.split("/").pop()
  const posterUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  // One heading per block: the video eyebrow is not shown. The title is a caption, not a heading.
  return (
    <figure className="about-video">
      <div className="about-video-frame">
        {isPlaying ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button className="about-video-poster" type="button" onClick={() => setIsPlaying(true)} aria-label={`Play video: ${video.title}`}>
            <img src={posterUrl} alt="" loading="lazy" width="480" height="360" />
            <span className="about-video-play" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="about-video-caption">
        <span className="about-video-title">{video.title}</span>
        {video.description ? <span className="about-video-description">{video.description}</span> : null}
        {video.transcript ? (
          <details className="about-video-transcript">
            <summary>{video.transcriptLabel || "Read video transcript"}</summary>
            <p>{video.transcript}</p>
          </details>
        ) : null}
      </figcaption>
    </figure>
  )
}

export default AboutVideo
