"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { zine, type Spread } from "@/content/zine";

/**
 * A book of spreads. Each image is one full spread; the halves below are that
 * same image, twice as wide as its half and slid left, so the seam lands on
 * the spine.
 *
 * Turning forward folds the right half over the centre (3D rotateY); its back
 * face carries the left half of the next spread, while the next spread's right
 * half sits beneath, revealed as the flap lifts. Turning back mirrors it. It
 * loops at both ends.
 *
 * Flips are interruptible: a click mid-turn finalises the fold in flight and
 * starts the next from where it landed, so every click registers rather than
 * being swallowed.
 */

/** Backstop only; see the effect below. Must be >= the CSS fold duration. */
const TURN_MS = 850;
const BACKSTOP_MS = TURN_MS + 150;

type Flip = { id: number; dir: "next" | "prev"; from: number; to: number };

function Half({ spread, side }: { spread: Spread; side: "left" | "right" }) {
  return (
    <Image
      className={`zine-half-img is-${side}`}
      src={spread.src}
      alt=""
      width={spread.width}
      height={spread.height}
      sizes="(max-width: 999px) 88vw, 620px"
      draggable={false}
    />
  );
}

export default function Zine() {
  const [current, setCurrent] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const nextId = useRef(0);
  const len = zine.length;

  const step = useCallback(
    (dir: "next" | "prev") => {
      // Take over from a fold already in flight rather than dropping the click.
      const base = flip ? flip.to : current;
      if (flip) setCurrent(flip.to);

      const to = dir === "next" ? (base + 1) % len : (base - 1 + len) % len;
      nextId.current += 1;
      setFlip({ id: nextId.current, dir, from: base, to });
    },
    [flip, current, len],
  );

  const finish = useCallback((id: number) => {
    setFlip((pending) => {
      if (!pending || pending.id !== id) return pending;
      setCurrent(pending.to);
      return null;
    });
  }, []);

  // Backstop for when animationend never arrives: a backgrounded tab, or
  // reduced motion, where the flap has no animation at all and would otherwise
  // wait forever for an event that is never coming.
  useEffect(() => {
    if (!flip) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => finish(flip.id), reduced ? 0 : BACKSTOP_MS);

    return () => clearTimeout(id);
  }, [flip, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step("next");
      if (e.key === "ArrowLeft") step("prev");
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const shown = zine[flip ? flip.to : current];

  return (
    <div className="zine">
      <div
        className="zine-book"
        style={{ aspectRatio: `${zine[0].width} / ${zine[0].height}` }}
      >
        {!flip && (
          <div className="zine-full">
            <Image
              src={zine[current].src}
              alt={zine[current].title}
              width={zine[current].width}
              height={zine[current].height}
              sizes="(max-width: 999px) 88vw, 620px"
              draggable={false}
              priority
            />
          </div>
        )}

        {flip && (
          // Keyed by flip id so the CSS animations restart on every turn, even
          // when one turn interrupts another.
          <div style={{ display: "contents" }} key={flip.id}>
            <div
              className={`zine-half is-left ${flip.dir === "next" ? "is-out" : "is-in"}`}
            >
              <Half
                spread={zine[flip.dir === "next" ? flip.from : flip.to]}
                side="left"
              />
            </div>

            <div
              className={`zine-half is-right ${flip.dir === "next" ? "is-in" : "is-out"}`}
            >
              <Half
                spread={zine[flip.dir === "next" ? flip.to : flip.from]}
                side="right"
              />
            </div>

            <div
              className={`zine-flap is-${flip.dir}`}
              onAnimationEnd={(e) => {
                // The half fades bubble up here too; only the fold ends a turn.
                if (e.target !== e.currentTarget) return;
                finish(flip.id);
              }}
            >
              <div className="zine-face is-front">
                <Half
                  spread={zine[flip.from]}
                  side={flip.dir === "next" ? "right" : "left"}
                />
              </div>
              <div className="zine-face is-back">
                <Half
                  spread={zine[flip.to]}
                  side={flip.dir === "next" ? "left" : "right"}
                />
              </div>
            </div>
          </div>
        )}

        <button
          className="zine-zone is-prev"
          onClick={() => step("prev")}
          aria-label="Previous spread"
        />
        <button
          className="zine-zone is-next"
          onClick={() => step("next")}
          aria-label="Next spread"
        />
      </div>

      <p className="zine-caption" key={shown.title}>
        {shown.title}
      </p>
    </div>
  );
}
