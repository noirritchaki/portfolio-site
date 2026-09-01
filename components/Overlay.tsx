"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * A route rendered over the page rather than beside it.
 *
 * Sits outside `.shell` on purpose: the blur is a `backdrop-filter`, so
 * whatever is behind this element gets blurred without the overlay's own
 * contents being caught in it.
 */
export default function Overlay({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);

  // Always back to home rather than router.back(), which would leave the site
  // for anyone who landed on this URL directly.
  const close = useCallback(() => router.push("/"), [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKey);
    panel.current?.focus();

    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      // Only a click on the backdrop itself closes — clicks inside the panel
      // bubble up here too, and those are the page turns.
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {/*
        The scale lives on the panel, not on the backdrop: scaling an element
        that carries a backdrop-filter scales the blurred region with it, which
        pulls unblurred page in at the edges.
      */}
      <motion.div
        className="overlay-panel"
        ref={panel}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.div>

      <button className="overlay-close" onClick={close} aria-label="Close">
        ×
      </button>
    </div>
  );
}
