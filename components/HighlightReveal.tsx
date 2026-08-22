"use client";

import { useState, type CSSProperties } from "react";

export type Reveal = {
  before: string;
  label: string;
  href: string;
  after: string;
  reveal: string;
};

/**
 * A line whose highlighted term swaps the sentence around it for a note about
 * that term on hover.
 *
 * Two layers sit in the same grid cell. The original blurs and fades back; the
 * reveal layer fades up, its words staggered. The reveal layer repeats the
 * leading text as a hidden ghost purely for measurement — that is what keeps
 * the chip itself from moving a pixel as the two layers cross over.
 */
export default function HighlightReveal({
  before,
  label,
  href,
  after,
  reveal,
}: Reveal) {
  const [open, setOpen] = useState(false);
  const words = reveal.split(/\s+/).filter(Boolean);

  const trigger = (ghost: boolean) => (
    <a
      className="hl-trigger"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...(ghost ? { tabIndex: -1, "aria-hidden": true } : {})}
    >
      {label}
    </a>
  );

  return (
    <p className="hl" data-open={open}>
      <span className="hl-layer hl-original">
        <span className="hl-text">{before}</span>
        {trigger(false)}
        <span className="hl-text">{after}</span>
      </span>

      <span className="hl-layer hl-reveal" aria-hidden={!open}>
        <span className="hl-ghost" aria-hidden="true">
          {before}
        </span>
        {trigger(true)}{" "}
        {words.map((word, i) => (
          <span
            className="hl-word"
            style={{ "--word-index": i } as CSSProperties}
            key={`${word}-${i}`}
          >
            {word}{" "}
          </span>
        ))}
      </span>
    </p>
  );
}
