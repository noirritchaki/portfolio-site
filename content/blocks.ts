/**
 * Block types for long-form pieces.
 *
 * Short entries stay as `body: string[]`. Anything with real structure uses
 * `blocks`, which is a tagged union rendered by components/ArticleBlocks.tsx.
 *
 * Every `text` field accepts the inline markup in components/RichText.tsx:
 * links, ==chips==, **bold**, *italic*, and ~~assumption marks~~.
 */

export type Tone = "good" | "watch" | "alert";

export type Figure = {
  /** Where the artwork comes from. Shown in the placeholder until `src` lands. */
  ref: string;
  caption?: string;
  ratio?: "wide" | "tall" | "squat";
  /** Point at /figures/… once exported and the placeholder is replaced. */
  src?: string;
};

export type ReframeSide = {
  label: string;
  items: { title: string; sub?: string }[];
  /** Highlights the side being argued for. */
  emphasis?: boolean;
};

export type TableRow = {
  level: string;
  tone: Tone;
  cells: string[];
};

export type Item = { title: string; text: string };

export type Block =
  /** Standfirst under the title. */
  | { type: "lede"; text: string }
  /** Role / Surface / Scope / Status grid. */
  | { type: "meta"; items: { label: string; value: string }[] }
  /** The faint wall of biomarker values behind the opening. */
  | { type: "wall"; items: string[] }
  /** Starts a section: rule, label, and a dot at `progress` percent. */
  | { type: "marker"; label: string; progress: number }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "text"; text: string }
  /** Smaller, dimmer aside. */
  | { type: "note"; text: string }
  | { type: "card"; label: string; index?: string; text: string[] }
  | { type: "quote"; text: string; cite: string }
  | { type: "figures"; layout?: "one" | "two" | "three"; items: Figure[] }
  /** The questions people actually ask, as chips. */
  | { type: "pills"; items: string[] }
  | { type: "reframe"; from: ReframeSide; to: ReframeSide }
  | {
      type: "principles";
      items: (Item & { list?: string[]; killed?: string })[];
    }
  /** Numbered running order. */
  | { type: "spine"; items: Item[] }
  /** Small grid of equal beats. */
  | { type: "beats"; items: Item[] }
  /** Label + description rows. */
  | { type: "metrics"; items: Item[] }
  | { type: "table"; head: string[]; rows: TableRow[] }
  /** A single value shown against its range. */
  | {
      type: "specimen";
      label: string;
      value: string;
      tone: Tone;
      toneLabel: string;
      /** 0–100, position of the marker on the track. */
      position: number;
      ends: [string, string, string];
      text: string;
    }
  /** Only rendered in review mode. See components/ReviewMode.tsx. */
  | { type: "appendix"; title: string; intro: string; items: string[] }
  | { type: "footnote"; text: string };
