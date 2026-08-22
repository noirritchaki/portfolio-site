import type { ReactNode } from "react";

/**
 * A deliberately tiny inline formatter, so bio and article copy can stay as
 * plain strings in content/ rather than turning into JSX.
 *
 *   [label](https://url)   → link (underlines on hover)
 *   [label](mailto:…)      → link, not opened in a new tab
 *   ==label==              → highlighted chip
 *
 * The two combine, which is the usual case for a current employer:
 *
 *   ==[Company](https://company.com)==
 */

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
const MARK = /==(.+?)==/g;
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
    .replace(REVEAL, "$1")
    .replace(MARK, "$1")
    .replace(LINK, "$1");
}

function withLinks(text: string, key: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = new RegExp(LINK.source, "g");
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));

    const [full, label, href] = match;
    const external = href.startsWith("http");

    nodes.push(
      <a
        key={`${key}-${i++}`}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
      </a>,
    );

    last = match.index + full.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const re = new RegExp(MARK.source, "g");
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(...withLinks(text.slice(last, match.index), `t${i}`));
    }

    nodes.push(
      <mark className="highlight" key={`m${i}`}>
        {withLinks(match[1], `m${i}`)}
      </mark>,
    );

    last = match.index + match[0].length;
    i++;
  }

  if (last < text.length) nodes.push(...withLinks(text.slice(last), `t${i}`));

  return <>{nodes}</>;
}
