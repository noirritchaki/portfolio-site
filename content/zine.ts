export type Spread = {
  /**
   * One image for the whole spread — both pages, spine included. The book
   * splits it down the middle itself, so the file is exactly what you'd see
   * with the book open flat.
   */
  src: string;
  /** Intrinsic pixel size. Sets the book's aspect ratio, so it must be right. */
  width: number;
  height: number;
  /** Place name, shown under the book. */
  title: string;
};

/** Spreads run in order and loop, so the last one turns back to the first. */
export const zine: Spread[] = [
  { src: "/zine/page1.png", width: 1456, height: 1011, title: "Equilibrium Climbing" },
  { src: "/zine/page1.png", width: 1456, height: 1011, title: "Equilibrium Climbing" },
  { src: "/zine/page1.png", width: 1456, height: 1011, title: "Equilibrium Climbing" },
];
