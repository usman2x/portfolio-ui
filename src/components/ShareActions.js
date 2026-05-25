import React, { useMemo } from "react";
import { trackEvent } from "../utils/analytics";
import { siteMetadata } from "../lib/site";

const ShareActions = ({ title, pathname }) => {
  const baseSiteUrl = siteMetadata.siteUrl || "";
  const url = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }

    return baseSiteUrl ? `${baseSiteUrl}${pathname}` : pathname;
  }, [baseSiteUrl, pathname]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleShare = async () => {
    trackEvent("share_click", { event_category: "engagement", event_label: pathname });

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch (error) {
        // Ignore user cancellation and keep fallback links available.
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      trackEvent("share_copy_link", { event_category: "engagement", event_label: pathname });
    } catch (error) {
      // Clipboard can fail in non-secure contexts.
    }
  };

  return (
    <div className="share-actions" aria-label="Share this article">
      <button type="button" className="theme-btn-primary theme-btn-sm" onClick={handleShare}>
        Share
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="theme-btn-outline theme-btn-sm"
        onClick={() =>
          trackEvent("share_linkedin", { event_category: "engagement", event_label: pathname })
        }
      >
        LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="theme-btn-outline theme-btn-sm"
        onClick={() => trackEvent("share_x", { event_category: "engagement", event_label: pathname })}
      >
        X
      </a>
      <button type="button" className="theme-btn-outline theme-btn-sm" onClick={handleCopy}>
        Copy Link
      </button>
    </div>
  );
};

export default ShareActions;
