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

## The zine

`/zine` is a book of spreads: a photo on the left page, a note on the right.
Clicking a page turns it in that direction, and the sequence loops.

It opens as an **overlay** over the rest of the site rather than in the article
column — the page behind is blurred and the book is centred on the viewport.
Close with Escape, the × in the corner, or a click on the backdrop; all three
return to `/`.

Each entry in `content/zine.ts` is **one image of the whole spread** — both
pages and the spine, exactly as the book looks open flat. The book splits it
down the middle itself:

```ts
{
  src: "/zine/kyoto.png",
  width: 1456,          // intrinsic size; sets the book's aspect ratio,
  height: 1033,         // so it has to be right
  title: "Kyoto",       // caption under the book
}
```

Images go in `public/zine/`. Spreads run in array order and wrap around, so
the last turns forward to the first.

`public/zine/page1.png` is currently listed three times so page turns can be
previewed. Replace the repeats with real spreads as you make them.

Export spreads with their own drop shadow on transparency, as `page1.png`
does — the book deliberately has no CSS shadow of its own, so one baked into
the artwork would otherwise double up.

### The overlay

`components/Overlay.tsx` renders *outside* `.shell`, which matters: the blur is
a `backdrop-filter`, and an element cannot blur a backdrop it is itself part
of. A `@supports` fallback filters `.shell` directly for browsers without
`backdrop-filter`, but that is not the default — filtering `.shell` creates a
containing block that breaks the sticky index.

Note the declaration order in `.overlay`: `-webkit-backdrop-filter` must come
*before* the unprefixed `backdrop-filter`. With the order reversed the CSS
pipeline drops the unprefixed one entirely and no blur is applied at all.

The scroll lock lives in `Shell`, keyed on the route, not in `Overlay` keyed on
its own lifetime. The overlay stays mounted while it fades out, so releasing
the lock on unmount would leave the page unscrollable for the length of that
animation — or permanently, if the animation never completed.

### How the turn works

Each half is a window onto the same spread image: the image is drawn at twice
the half's width, and the right half slides it fully left, so each window shows
its own side of the spine. That is why one file can serve as two pages.

Turning forward folds the right half over the centre; its back face carries the
left half of the *next* spread, while that spread's right half sits beneath and
is revealed as the flap lifts. `backface-visibility: hidden` swaps which face
you see as it passes 90°. Turning back mirrors it.

One convention worth keeping: every modifier class inside the zine is `is-`
prefixed (`is-back`, `is-next`, `is-left`). That is not style preference. A
bare `back` on the flap's reverse face collided with the article's
`.back { display: none }` link and hid it outright, so the fold showed nothing
at all past 90°. The same thing happened once with `.zine` itself, which the
book container and the sidebar button both used — the button's border and
shine sweep ended up drawn on the book.

Three details that are load-bearing:

- **Flips are interruptible.** A click mid-turn finalises the fold in flight
  and starts the next from where it landed, so an impatient reader's clicks all
  register instead of being dropped.
- **The flap is keyed by flip id**, so the CSS animations restart on every
  turn — including a turn that interrupts another.
- **`onAnimationEnd` checks `e.target === e.currentTarget`.** The half
  cross-fades are animations too and they bubble to the same handler; without
  the guard a fade would end the turn early.

The turn completes on the flap's `animationend`, with a timed backstop just
past the animation duration for when that event never arrives — a backgrounded
tab, or reduced motion, where the flap has no animation at all and would
otherwise wait forever for an event that is never coming.

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
