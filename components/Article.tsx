import Link from "next/link";
import ArticleBlocks from "./ArticleBlocks";
import ReviewMode from "./ReviewMode";
import RichText from "./RichText";
import type { Entry } from "@/content/entries";

export default function Article({ entry }: { entry: Entry }) {
  return (
    <article className="article">
      <h2 className="article-title">{entry.headline ?? entry.title}</h2>
      {entry.published && <p className="article-date">{entry.published}</p>}

      <ReviewMode>
        {entry.blocks ? (
          <ArticleBlocks blocks={entry.blocks} />
        ) : (
          entry.body?.map((block) =>
            block.startsWith("## ") ? (
              <h3 className="block-heading" key={block}>
                {block.slice(3)}
              </h3>
            ) : (
              <p key={block}>
                <RichText text={block} />
              </p>
            ),
          )
        )}
      </ReviewMode>

      <Link className="article-back" href="/">
        ← Back
      </Link>
    </article>
  );
}
