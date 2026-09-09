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

  return (
    <aside className="about-video-card" aria-labelledby="about-video-title">
      <div className="about-video-copy">
        <p className="section-eyebrow">{video.eyebrow}</p>
        <h2 id="about-video-title" className="interior-section-title">{video.title}</h2>
        <p>{video.description}</p>
      </div>
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
          <button className="about-video-poster" type="button" onClick={() => setIsPlaying(true)} aria-label={`Play ${video.title}`}>
            <img src={posterUrl} alt="" loading="lazy" width="480" height="360" />
            <span className="about-video-play" aria-hidden="true">▶</span>
          </button>
        )}
      </div>
      {video.transcript ? (
        <details className="about-video-transcript">
          <summary>{video.transcriptLabel || "Read video transcript"}</summary>
          <p>{video.transcript}</p>
        </details>
      ) : null}
    </aside>
  )
}

export default AboutVideo
