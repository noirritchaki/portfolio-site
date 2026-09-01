export const profile = {
  name: "Noirrit",
  avatar: "/avatar.jpg",

  /** Small button in the top corner of the column. */
  zine: { label: "life zine", href: "/zine" },

  /**
   * Each string is one paragraph. Inline formatting (see components/RichText):
   *   [label](https://url)          → link
   *   ==[label](https://url)==      → highlighted link, for where you work now
   *   ==[label](https://url)=={note} → the same, but hovering the chip blurs
   *                                    the line away and reveals {note}
   *
   * The note continues from the chip, so it reads "Plum is making …" — write
   * it as a predicate, not a full sentence. Keep it close in length to the
   * line it replaces: both layers share one grid cell, so the paragraph always
   * reserves the height of the taller one.
   */
  bio: [
    "I'm a product designer at ==[Plum](https://plumhq.com)=={is making insurance & healthcare easy to use.}, currently building on our claims experience.",

    "Before that, I spent my time at [Capx.ai](https://capx.ai).",

    "I've also got an insanely large hobby list that you should ask me about.",

    "Always up for a conversation. You'll find me on [Twitter](https://x.com), [GitHub](https://github.com), or you can [email me](mailto:noirrit.work@gmail.com).",
  ],
};
