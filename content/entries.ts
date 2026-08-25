import type { Block } from "./blocks";
import { healthCheckup } from "./health-checkup";

export type Entry = {
  /** Internal article route: /writing/<slug>. Omit for WIP or external entries. */
  slug?: string;
  title: string;
  /** Full title for the article itself, when the index needs a shorter one. */
  headline?: string;
  /** Year group heading, e.g. "2026". */
  year: string;
  /** Right-aligned marker, e.g. "18/03". Omitted for WIP entries. */
  date?: string;
  /** Long form date shown at the top of the article. */
  published?: string;
  /** In progress: renders the bouncing dots instead of a date, and is not a link. */
  wip?: boolean;
  /** Links out instead of opening an article. */
  href?: string;
  /** Short pieces: one string per paragraph, "## " prefix for a subheading. */
  body?: string[];
  /** Long pieces with real structure. Takes precedence over `body`. */
  blocks?: Block[];
};

export const entries: Entry[] = [
  {
    title: "Something In Progress",
    year: "2026",
    wip: true,
  },
  {
    slug: "health-checkup",
    title: "Health Checkup",
    headline: "Packages to questions",
    year: "2026",
    date: "—",
    published: "August 2026",
    blocks: healthCheckup,
  },
  {
    slug: "second-piece",
    title: "Second Piece",
    year: "2022",
    date: "08/02",
    published: "8 February, 2022",
    body: [
      "Another placeholder article. Swap the copy in content/entries.ts and the index on the left updates on its own.",
      "## A Subheading",
      "Body text under a subheading. Add as many paragraphs as you like — each string in the body array becomes one paragraph.",
    ],
  },
  {
    title: "An External Link",
    year: "2020",
    date: "10/11",
    href: "https://example.com",
  },
];

export const articles = entries.filter((e) => e.slug);

export function findEntry(slug: string) {
  return entries.find((e) => e.slug === slug);
}
