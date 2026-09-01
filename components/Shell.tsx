"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Overlay from "./Overlay";
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
  // Two different ways a route can present: beside the index, or over it.
  const reading = pathname.startsWith("/writing/");
  const overlay = pathname.startsWith("/zine");
  const activeSlug = reading ? pathname.split("/").pop() : undefined;

  // Tied to the route, not to the overlay component: the overlay stays mounted
  // while it fades out, so unlocking on its unmount would leave the page stuck
  // if that animation never finished.
  useEffect(() => {
    if (!overlay) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlay]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="shell" data-reading={reading} data-blurred={overlay}>
        <Sidebar reading={reading} activeSlug={activeSlug} />

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

      {/* Outside .shell so the backdrop blur does not catch its own panel. */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Overlay label="Life zine">{children}</Overlay>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
