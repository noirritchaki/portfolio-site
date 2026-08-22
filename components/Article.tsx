import Link from "next/link";
import type { Entry } from "@/content/entries";
import RichText from "./RichText";

export default function Article({ entry }: { entry: Entry }) {
  return (
    <article className="article">
      <h2 className="article-title">{entry.title}</h2>
      {entry.published && <p className="article-date">{entry.published}</p>}

      <div className="article-body">
        {entry.body?.map((block) =>
          block.startsWith("## ") ? (
            <h3 className="article-heading" key={block}>
              {block.slice(3)}
            </h3>
          ) : (
            <p key={block}>
              <RichText text={block} />
            </p>
          ),
        )}
      </div>

      <Link className="back" href="/">
        ← Back
      </Link>
    </article>
  );
}
