import Link from "next/link";
import { entries, type Entry } from "@/content/entries";
import DotsJump from "./DotsJump";

/** The year label only prints on the first entry of each year group. */
function yearLabels(list: Entry[]) {
  let previous = "";
  return list.map((entry) => {
    const label = entry.year === previous ? "" : entry.year;
    previous = entry.year;
    return label;
  });
}

function Row({ entry, year }: { entry: Entry; year: string }) {
  return (
    <>
      <span className="entry-year">{year}</span>
      <span className="entry-title">{entry.title}</span>
      {entry.wip ? <DotsJump /> : <span className="entry-date">{entry.date}</span>}
    </>
  );
}

export default function EntryList({ activeSlug }: { activeSlug?: string }) {
  const years = yearLabels(entries);

  return (
    <nav className="entries">
      {entries.map((entry, i) => {
        const key = entry.slug ?? entry.href ?? entry.title;
        const inner = <Row entry={entry} year={years[i]} />;

        if (entry.slug) {
          return (
            <Link
              key={key}
              className="entry"
              href={`/writing/${entry.slug}`}
              data-active={entry.slug === activeSlug}
            >
              {inner}
            </Link>
          );
        }

        if (entry.href) {
          return (
            <a
              key={key}
              className="entry"
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {inner}
            </a>
          );
        }

        return (
          <div key={key} className="entry" data-wip="true">
            {inner}
          </div>
        );
      })}
    </nav>
  );
}
