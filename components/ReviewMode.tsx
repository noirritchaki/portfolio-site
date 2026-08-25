"use client";

import { useSyncExternalStore, type ReactNode } from "react";

/**
 * Wraps the article body and turns on review mode when the URL carries
 * ?review — which paints the ~~assumption marks~~ and reveals the appendix.
 *
 * Reads location directly rather than via useSearchParams, which would opt the
 * page out of static generation. useSyncExternalStore gives the server a
 * defined `false` to render, so hydration matches.
 *
 * Note that review content is present in the page source either way. If it
 * must not ship at all, gate the appendix on
 * process.env.NODE_ENV === "development" in ArticleBlocks instead.
 */

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

const isReview = () => new URLSearchParams(window.location.search).has("review");

export default function ReviewMode({ children }: { children: ReactNode }) {
  const review = useSyncExternalStore(subscribe, isReview, () => false);

  return (
    <div className="article-body" data-review={review || undefined}>
      {children}
    </div>
  );
}
