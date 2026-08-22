"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import EntryList from "./EntryList";
import HighlightReveal from "./HighlightReveal";
import RichText, { parseReveal } from "./RichText";

export default function Sidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    // `layout` is what animates the slide from center to left: Motion measures
    // the element before and after the flex alignment changes and tweens the
    // difference as a transform.
    <motion.aside
      className="sidebar"
      data-reading={Boolean(activeSlug)}
      layout
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
    >
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
    </motion.aside>
  );
}
