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

This is why the structure is slightly unusual: **the sidebar lives in
`components/Shell.tsx`, mounted once from `app/layout.tsx`**, rather than being
rendered by each page. It has to survive navigation for Motion to animate it —
if each route rendered its own copy it would unmount and re-mount, and there
would be nothing to tween. `app/page.tsx` therefore renders `null`; the home
page *is* the shell with no article beside it.

`Shell` reads the current path to decide whether it's in the reading state, so
adding routes needs no wiring. The two animations:

- **The slide** — `layout` on the sidebar in `components/Sidebar.tsx`. Motion
  measures the element either side of the flex realignment and tweens the
  difference. 500ms, both directions.
  The `LayoutGroup` wrapper in `Shell` is load-bearing for the return trip:
  going in, the article mounts in the same commit that re-renders the sidebar,
  so the shift is measured for free. Coming back, the article is removed later —
  once its fade-out finishes — in a commit that does not re-render the sidebar,
  so without `LayoutGroup` there is nothing to measure and it snaps to center.
- **The dissolve** — `AnimatePresence` in `Shell`, keyed on the pathname, so
  moving between two articles cross-fades too. It waits ~220ms so the article
  appears once the column has mostly settled rather than sliding with it.

While an article is open the column washes back to 40% and its text drops to
the faintest grey; hovering anywhere over it restores it to exactly its home
appearance, and the entry you are reading stays a step darker than the rest so
the column still says where you are. That behavior sits behind a
`@media (hover: hover)` guard — on a touch screen there is no way to bring the
column back, so it stays at full strength.

Both animations respect `prefers-reduced-motion` (via `MotionConfig reducedMotion="user"`
for Motion, and a media query in `app/globals.css` for the CSS fades).

## Design tokens

Colors, type scale, and column widths are CSS custom properties at the top of
`app/globals.css`.
