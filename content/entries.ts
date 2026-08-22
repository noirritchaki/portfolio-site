export type Entry = {
  /** Internal article route: /writing/<slug>. Omit for WIP or external entries. */
  slug?: string;
  title: string;
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
  /** Article body. A paragraph starting with "## " renders as a subheading. */
  body?: string[];
};

export const entries: Entry[] = [
  {
    title: "Something In Progress",
    year: "2026",
    wip: true,
  },
  {
    slug: "first-piece",
    title: "First Piece",
    year: "2026",
    date: "18/03",
    published: "18 March, 2026",
    body: [
      "Opening paragraph. Set up the thing you built or the problem you kept running into, in two or three sentences. Placeholder text — replace this with your own.",
      "## About the Project",
      "One line on what the project is.",
      "A longer paragraph on what it does and who it is for. Keep the register plain; the layout does the work here, so the writing does not have to perform.",
      "A closing paragraph on what you learned, or what you would do differently. Placeholder text.",
    ],
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
