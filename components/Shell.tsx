"use client";

import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

/**
 * Owns the two-column arrangement for every route.
 *
 * The sidebar lives here rather than in each page so it survives navigation —
 * that persistence is what lets Motion animate it from the centered home
 * position to the left-hand reading position instead of it re-mounting in place.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reading = pathname.startsWith("/writing/");
  const activeSlug = reading ? pathname.split("/").pop() : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <main className="shell" data-reading={reading}>
        {/*
          LayoutGroup is what makes the return trip animate. On the way in, the
          article mounts in the same commit that re-renders the sidebar, so
          Motion measures the shift for free. On the way out the article is
          removed later, once its exit finishes — a commit that does not
          re-render the sidebar, leaving nothing to measure and making it snap
          back. LayoutGroup ties the two together so removing the article
          re-measures the sidebar as well.
        */}
        <LayoutGroup>
          <Sidebar activeSlug={activeSlug} />

          <AnimatePresence mode="wait" initial={false}>
            {reading && (
              <motion.div
                key={pathname}
                className="article-slot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{
                  // Hold until the column has most of the way settled, so the
                  // article dissolves into its final position rather than
                  // sliding with it.
                  opacity: { duration: 0.3, delay: 0.22, ease: "easeOut" },
                }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </main>
    </MotionConfig>
  );
}
