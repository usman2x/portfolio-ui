import React, { useEffect, useMemo, useState } from "react";
import { trackEvent } from "../utils/analytics";
import { siteMetadata } from "../lib/site";

// Quiet sharing: one list of text links, never buttons (STYLEGUIDE.md, "Buttons"). The native
// share sheet ("More options") appears only where the browser supports it.
const ShareActions = ({ title, pathname }) => {
  const baseSiteUrl = siteMetadata.siteUrl || "";
  const url = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }

    return baseSiteUrl ? `${baseSiteUrl}${pathname}` : pathname;
  }, [baseSiteUrl, pathname]);
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && Boolean(navigator.share));
  }, []);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleShare = async () => {
    trackEvent("share_click", { event_category: "engagement", event_label: pathname });
    try {
      await navigator.share({ title, url });
    } catch (error) {
      // Ignore user cancellation; the links below remain available.
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("share_copy_link", { event_category: "engagement", event_label: pathname });
    } catch (error) {
      // Clipboard can fail in non-secure contexts.
    }
  };

  return (
    <ul className="share-links">
      {canShare ? (
        <li>
          <button type="button" className="share-link" onClick={handleShare}>
            More options
          </button>
        </li>
      ) : null}
      <li>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-link"
          onClick={() =>
            trackEvent("share_linkedin", { event_category: "engagement", event_label: pathname })
          }
        >
          LinkedIn
        </a>
      </li>
      <li>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-link"
          onClick={() => trackEvent("share_x", { event_category: "engagement", event_label: pathname })}
        >
          X
        </a>
      </li>
      <li>
        <button type="button" className="share-link" onClick={handleCopy}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? "Link copied to the clipboard" : ""}
        </span>
      </li>
    </ul>
  );
};

export default ShareActions;
