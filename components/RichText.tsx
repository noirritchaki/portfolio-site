import type { ReactNode } from "react";

/**
 * A deliberately tiny inline formatter, so copy can stay as plain strings in
 * content/ rather than turning into JSX.
 *
 *   [label](https://url)   → link
 *   ==label==              → highlighted chip
 *   ~~label~~              → assumption mark, only painted in review mode
 *   **label**              → bold
 *   *label*                → italic
 *
 * A chip and a link combine, which is the usual case for a current employer:
 *
 *   ==[Company](https://company.com)==
 *
 * A chip may also carry a {note}, which turns the whole paragraph into a hover
 * reveal — see parseReveal below and components/HighlightReveal.tsx.
 */

const LINK = /\[([^\]]+)\]\(([^)]+)\)/;
const MARK = /==(.+?)==/;
const ASSUMPTION = /~~(.+?)~~/;
const BOLD = /\*\*(.+?)\*\*/;
const ITALIC = /\*(.+?)\*/;

/** ==[Label](url)=={note} — the note is what appears on hover. */
const REVEAL = /==\[([^\]]+)\]\(([^)]+)\)==\{([^}]+)\}/;

/**
 * If a paragraph carries a chip with a {note}, split it into the pieces
 * HighlightReveal needs. Returns null for ordinary paragraphs.
 */
export function parseReveal(text: string) {
  const match = REVEAL.exec(text);
  if (!match) return null;

  const [full, label, href, reveal] = match;
  return {
    before: text.slice(0, match.index),
    label,
    href,
    reveal,
    after: text.slice(match.index + full.length),
  };
}

/** The same copy with its markup removed — for metadata, alt text, etc. */
export function stripMarkup(text: string) {
  return text
    .replace(new RegExp(REVEAL.source, "g"), "$1")
    .replace(new RegExp(MARK.source, "g"), "$1")
    .replace(new RegExp(ASSUMPTION.source, "g"), "$1")
    .replace(new RegExp(BOLD.source, "g"), "$1")
    .replace(new RegExp(ITALIC.source, "g"), "$1")
    .replace(new RegExp(LINK.source, "g"), "$1");
}

type Pattern = {
  re: RegExp;
  /** Which capture group holds content that may itself contain markup. */
  inner: number;
  wrap: (children: ReactNode, match: RegExpExecArray, key: string) => ReactNode;
};

/* Order matters: bold before italic, or ** is eaten one asterisk at a time. */
const PATTERNS: Pattern[] = [
  {
    re: MARK,
    inner: 1,
    wrap: (children, _m, key) => (
      <mark className="highlight" key={key}>
        {children}
      </mark>
    ),
  },
  {
    re: ASSUMPTION,
    inner: 1,
    wrap: (children, _m, key) => (
      <span className="asm" key={key}>
        {children}
      </span>
    ),
  },
  {
    re: BOLD,
    inner: 1,
    wrap: (children, _m, key) => <strong key={key}>{children}</strong>,
  },
  {
    re: ITALIC,
    inner: 1,
    wrap: (children, _m, key) => <em key={key}>{children}</em>,
  },
  {
    re: LINK,
    inner: 1,
    wrap: (children, match, key) => {
      const href = match[2];
      const external = href.startsWith("http");

      return (
        <a
          key={key}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
];

function parse(text: string, key: string): ReactNode[] {
  for (const pattern of PATTERNS) {
    const match = pattern.re.exec(text);
    if (!match) continue;

    return [
      ...parse(text.slice(0, match.index), `${key}b`),
      pattern.wrap(parse(match[pattern.inner], `${key}i`), match, `${key}w`),
      ...parse(text.slice(match.index + match[0].length), `${key}a`),
    ];
  }

  return text ? [text] : [];
}

export default function RichText({ text }: { text: string }) {
  return <>{parse(text, "t")}</>;
}
