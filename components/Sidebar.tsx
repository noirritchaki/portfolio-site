"use client";

import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import EntryList from "./EntryList";
import HighlightReveal from "./HighlightReveal";
import RichText, { parseReveal } from "./RichText";

/**
 * Deliberately not a Motion component. The slide between the centered home
 * position and the left-hand reading position is a plain CSS transform
 * transition (see `--shift` in globals.css).
 *
 * Motion's `layout` was doing that job, but it measures positions and cannot
 * be reconciled with `position: sticky` — the measured before/after are taken
 * in different scroll frames, and the animation strands a residual transform,
 * leaving the column stuck on one side. The offset here is a known constant,
 * (shell 1000px − sidebar 372px) / 2, so there is nothing to measure.
 */
export default function Sidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <aside className="sidebar" data-reading={Boolean(activeSlug)}>
      <Link href="/" aria-label={`${profile.name} — home`}>
        <Image
          className="avatar"
          src={profile.avatar}
          alt={profile.name}
          width={56}
          height={56}
          priority
        />
      </Link>

      <h1 className="name">{profile.name}</h1>

      <div className="intro">
        {profile.bio.map((line) => {
          const reveal = parseReveal(line);

          return reveal ? (
            <HighlightReveal key={line} {...reveal} />
          ) : (
            <p key={line}>
              <RichText text={line} />
            </p>
          );
        })}
      </div>

      <EntryList activeSlug={activeSlug} />
    </aside>
  );
}
