"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

/**
 * Owns the two-column arrangement for every route.
 *
 * The sidebar lives here rather than in each page so it survives navigation.
 * Its slide between the centered and left-hand positions is CSS (see
 * `--shift` in globals.css); Motion is only responsible for the article
 * dissolving in and out.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reading = pathname.startsWith("/writing/");
  const activeSlug = reading ? pathname.split("/").pop() : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <main className="shell" data-reading={reading}>
        <Sidebar activeSlug={activeSlug} />

        {/*
          popLayout takes the exiting article out of the flow while it fades.
          Under the default mode it stays a flex child until the fade finishes,
          and the empty slot sits on top of the index swallowing clicks on the
          right-hand half of every row.
        */}
        <AnimatePresence mode="popLayout" initial={false}>
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
      </main>
    </MotionConfig>
  );
}
