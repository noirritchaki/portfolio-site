# Portfolio

A minimal personal site: a narrow bio column with a dated index of writing, and a
second column that opens each entry as an article beside it. Built with Next.js
(App Router) + TypeScript, no CSS framework.

## Run

```bash
npm run dev
```

## Editing the content

All copy lives in two files — you should not need to touch the components.

- **`content/profile.ts`** — your name, avatar path, bio paragraphs, the list of
  places you've worked (each becomes a link in the bio), and your email.
- **`content/entries.ts`** — the index on the left. Each entry is one object:

  ```ts
  {
    slug: "first-piece",        // omit for WIP / external entries
    title: "First Piece",
    year: "2026",               // year label, printed once per group
    date: "18/03",              // right-aligned marker
    published: "18 March, 2026",// long date at the top of the article
    body: [                     // one string per paragraph
      "A paragraph.",
      "## A Subheading",        // "## " prefix renders as a subheading
      "Another paragraph.",
    ],
  }
  ```

  Two variants:
  - `wip: true` — not a link; shows the bouncing dots instead of a date.
  - `href: "https://…"` — links out instead of opening an article.

Entries render in array order, so put the newest first.

## Swapping the avatar

Replace `public/avatar.jpg`. It renders at 56×56, cropped to a circle.

## Long-form pieces

Short entries stay as `body: string[]`. Anything with real structure uses
`blocks` instead — a tagged union defined in `content/blocks.ts` and rendered by
`components/ArticleBlocks.tsx`. The Health Checkup case study
(`content/health-checkup.ts`) uses 21 of them: section markers, cards, quotes,
figure grids, a reframe diagram, a numbered spine, a severity table, a range
specimen, and so on.

To add a block type: add a variant to the union in `content/blocks.ts`, a
`case` in `ArticleBlocks.tsx`, and its styles in `app/globals.css`. Add the type
to the `WIDE` set at the top of `ArticleBlocks.tsx` if it should break out of
the text measure.

### Review mode

Open a piece with `?review` — e.g. `/writing/health-checkup?review` — to paint
the `~~assumption marks~~` and reveal the appendix block listing what still
needs verifying. Both are invisible without it.

**This hides things from a casual reader; it does not make them private.**
Review content is in the page source either way. If it must not ship at all,
gate the `appendix` case in `ArticleBlocks.tsx` on
`process.env.NODE_ENV === "development"`, which strips it from `next build`.

### Figures

Figure slots render as dashed placeholders showing where the artwork comes
from. Export the image, drop it in `public/`, and set `src` on that figure in
the content file — the placeholder is replaced.

## Fonts

**Inter** throughout, loaded from Google Fonts via `next/font`, which self-hosts
it at build time — no runtime request to Google, no layout shift.

Everything is 14px. Titles separate themselves from body copy by color rather
than size, the way the layout was designed. `--text-title` is a separate token
at the top of `app/globals.css` if you later want an explicit size hierarchy.

## Bio copy

`content/profile.ts` holds the bio as plain strings with a little inline markup,
rendered by `components/RichText.tsx`:

```
[label](https://url)          a link
==[label](https://url)==      a highlighted chip
==[label](https://url)=={…}   a chip that reveals a note on hover
```

The third form turns the whole paragraph into a hover reveal
(`components/HighlightReveal.tsx`): pointing at the chip blurs the sentence
around it away and fades a note in, word by word.

Two things to know when writing one:

- **The note continues from the chip.** It renders as `Plum is making …`, so
  write a predicate, not a full sentence — don't repeat the company name.
- **Keep it about as long as the line it replaces.** Both layers share one CSS
  grid cell so nothing reflows on hover, which means the paragraph always
  reserves the height of the taller layer. A long note leaves a visible gap
  under a short line.

The same markup works in article bodies in `content/entries.ts`.

## Layout and transitions

The home page centers the column in the viewport. Opening an entry slides the
column left and dissolves the article in on the right; going back reverses it.

The sidebar lives in `components/Shell.tsx`, mounted once from
`app/layout.tsx`, so it survives navigation. `app/page.tsx` renders `null` —
the home page *is* the shell with no article beside it. `Shell` reads the
current path to decide whether it is in the reading state, so adding routes
needs no wiring.

### Scrolling

The index is its own scroll target: `position: sticky` with `height: 100dvh`
and its own `overflow-y`. It stays put while the article scrolls the document
past it, and scrolls only itself when its content is taller than the window
(`overscroll-behavior: contain` stops that chaining to the page).

It is sticky rather than a second overflow container on the article side,
because `overflow-y: auto` there computes `overflow-x` to `auto` as well, which
would clip the `.bleed` blocks that deliberately extend past the column.

### The two animations

- **The slide** — a plain CSS transform transition on `--shift` in
  `app/globals.css`, 500ms. The offset is a known constant, half the difference
  between the 1000px shell and the 372px column, so nothing needs measuring.
  It is deliberately *not* a Motion `layout` animation: that measures positions
  before and after, which cannot be reconciled with `position: sticky` — the
  measurements come from different scroll frames and the animation strands a
  residual transform, leaving the column stuck on one side.
- **The dissolve** — `AnimatePresence` in `Shell`, keyed on the pathname, so
  moving between two articles cross-fades too. It waits ~220ms so the article
  appears once the column has mostly settled rather than sliding with it.
  `mode="popLayout"` matters: it takes the exiting article out of the flow
  while it fades. Under the default mode it stays a flex child until the fade
  finishes, so the shell stays full, the sidebar cannot re-centre, and the
  invisible slot sits on top of the index swallowing clicks on the right-hand
  half of every row. The `pointer-events: none` rule on a non-reading
  `.article-slot` is the belt to that braces.

While an article is open the column washes back to 40% and its text drops to
the faintest grey; hovering anywhere over it restores it to exactly its home
appearance, and the entry you are reading stays a step darker than the rest so
the column still says where you are. That behavior sits behind a
`@media (hover: hover)` guard — on a touch screen there is no way to bring the
column back, so it stays at full strength.

Both animations respect `prefers-reduced-motion` (via `MotionConfig
reducedMotion="user"` for Motion, and a media query in `app/globals.css` for
the CSS transitions).

## Design tokens

Colors, type scale, and column widths are CSS custom properties at the top of
`app/globals.css`.
