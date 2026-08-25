import type { CSSProperties } from "react";
import type { Block, Figure, ReframeSide } from "@/content/blocks";
import RichText from "./RichText";

/* Blocks that break out of the text measure into the full column. */
const WIDE = new Set(["wall", "meta", "figures", "beats", "table", "specimen"]);

function Slot({ figure }: { figure: Figure }) {
  if (figure.src) {
    // eslint-disable-next-line @next/next/no-img-element -- dimensions unknown until exports land
    return <img className="fig-img" src={figure.src} alt={figure.caption ?? figure.ref} />;
  }

  return (
    <div className={`slot${figure.ratio ? ` slot-${figure.ratio}` : ""}`}>
      <code>{figure.ref}</code>
    </div>
  );
}

function Side({ side }: { side: ReframeSide }) {
  return (
    <div className="reframe-side">
      <p className="label">{side.label}</p>
      {side.items.map((item) => (
        <span
          className={`tag${side.emphasis ? " tag-on" : ""}`}
          key={item.title}
        >
          {item.title}
          {item.sub && <em>{item.sub}</em>}
        </span>
      ))}
    </div>
  );
}

function Body({ block }: { block: Block }) {
  switch (block.type) {
    case "wall":
      return (
        <div className="wall" aria-hidden="true">
          {block.items.map((item) => (
            <b key={item}>{item}</b>
          ))}
        </div>
      );

    case "lede":
      return (
        <p className="lede">
          <RichText text={block.text} />
        </p>
      );

    case "meta":
      return (
        <div className="meta">
          {block.items.map((item) => (
            <div key={item.label}>
              <p className="label">{item.label}</p>
              <span>
                <RichText text={item.value} />
              </span>
            </div>
          ))}
        </div>
      );

    case "marker":
      return (
        <div className="marker">
          <span className="label marker-label">{block.label}</span>
          <span className="rail">
            <i style={{ "--progress": block.progress } as CSSProperties} />
          </span>
        </div>
      );

    case "heading":
      return <h3 className="block-heading">{block.text}</h3>;

    case "subheading":
      return <h4 className="block-subheading">{block.text}</h4>;

    case "text":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );

    case "note":
      return (
        <p className="note">
          <RichText text={block.text} />
        </p>
      );

    case "card":
      return (
        <div className="card">
          <div className="card-head">
            <p className="label">{block.label}</p>
            {block.index && <p className="label">{block.index}</p>}
          </div>
          <div className="card-body">
            {block.text.map((line) => (
              <p key={line}>
                <RichText text={line} />
              </p>
            ))}
          </div>
        </div>
      );

    case "quote":
      return (
        <blockquote>
          <RichText text={block.text} />
          <cite>{block.cite}</cite>
        </blockquote>
      );

    case "figures":
      return (
        <div className={`figs figs-${block.layout ?? "one"}`}>
          {block.items.map((figure) => (
            <figure key={figure.ref}>
              <Slot figure={figure} />
              {figure.caption && (
                <figcaption>
                  <RichText text={figure.caption} />
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      );

    case "pills":
      return (
        <ul className="pills">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );

    case "reframe":
      return (
        <div className="reframe">
          <Side side={block.from} />
          <div className="reframe-arrow" aria-hidden="true">
            →
          </div>
          <Side side={block.to} />
        </div>
      );

    case "principles":
      return (
        <ul className="principles">
          {block.items.map((item) => (
            <li key={item.title}>
              <h4 className="block-subheading">
                <RichText text={item.title} />
              </h4>
              <p className="note">
                <RichText text={item.text} />
              </p>
              {item.list && (
                <ul className="principle-list">
                  {item.list.map((line) => (
                    <li key={line}>
                      <RichText text={line} />
                    </li>
                  ))}
                </ul>
              )}
              {item.killed && (
                <p className="killed">
                  <b>Killed</b> <RichText text={item.killed} />
                </p>
              )}
            </li>
          ))}
        </ul>
      );

    case "spine":
      return (
        <ol className="spine">
          {block.items.map((item) => (
            <li key={item.title}>
              <b>{item.title}</b>
              <span>
                <RichText text={item.text} />
              </span>
            </li>
          ))}
        </ol>
      );

    case "beats":
      return (
        <ul className="beats">
          {block.items.map((item) => (
            <li key={item.title}>
              <b>{item.title}</b>
              <span>
                <RichText text={item.text} />
              </span>
            </li>
          ))}
        </ul>
      );

    case "metrics":
      return (
        <ul className="metrics">
          {block.items.map((item) => (
            <li key={item.title}>
              <b className="label">{item.title}</b>
              <span>
                <RichText text={item.text} />
              </span>
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th className="label" key={cell}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.level}>
                  <td>
                    <span className={`chip chip-${row.tone}`}>{row.level}</span>
                  </td>
                  {row.cells.map((cell) => (
                    <td key={cell}>
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "specimen":
      return (
        <div className="card">
          <div className="card-head">
            <p className="label">{block.label}</p>
            <p className="label">{block.value}</p>
          </div>
          <div className="card-body">
            <div className="range">
              <div className="track">
                <i style={{ "--progress": block.position } as CSSProperties} />
              </div>
              <div className="ends">
                {block.ends.map((end) => (
                  <span key={end}>{end}</span>
                ))}
              </div>
            </div>
            <p>
              <span className={`chip chip-${block.tone}`}>{block.toneLabel}</span>{" "}
              <RichText text={block.text} />
            </p>
          </div>
        </div>
      );

    case "footnote":
      return (
        <p className="footnote">
          <RichText text={block.text} />
        </p>
      );

    case "appendix":
      return (
        <div className="appendix">
          <p className="label marker-label">Not for publication</p>
          <h3 className="block-heading">{block.title}</h3>
          <p className="note">
            <RichText text={block.intro} />
          </p>
          <ol>
            {block.items.map((item) => (
              <li key={item}>
                <RichText text={item} />
              </li>
            ))}
          </ol>
        </div>
      );
  }
}

export default function ArticleBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <div
          key={`${block.type}-${i}`}
          className={`block block-${block.type}${WIDE.has(block.type) ? " bleed" : ""}`}
        >
          <Body block={block} />
        </div>
      ))}
    </>
  );
}
