import type { Block } from "./blocks";

/**
 * Rebuilt from the case study document. Phrases wrapped in ~~…~~ are
 * inferences from the source that still need confirming — open the piece with
 * ?review to see them marked, along with the appendix at the end.
 */
export const healthCheckup: Block[] = [
  {
    type: "wall",
    items: [
      "HbA1c 5.4", "LDL 132", "HDL 48", "Triglycerides 168", "ApoB 96",
      "hsCRP 2.1", "eGFR 94", "ALT 41", "AST 33", "GGT 58", "TSH 2.3",
      "Vitamin D 18", "Vitamin B12 310", "Ferritin 42", "Creatinine 0.9",
      "Uric acid 6.1", "Haemoglobin 14.2", "Platelets 249", "WBC 7.1",
      "Albumin 4.3", "Bilirubin 0.8", "Calcium 9.4", "Sodium 139",
      "Potassium 4.2", "Lp(a) 34", "Fasting insulin 11.4", "HOMA-IR 2.6",
      "Cortisol 14", "Homocysteine 12", "Free T3 108", "Free T4 8.2",
      "Total cholesterol 214", "VLDL 34", "MCV 88", "MCH 29", "RDW 13.1",
      "ESR 11", "Urea 28", "Total protein 7.2", "Globulin 2.9", "ALP 84",
    ],
  },
  {
    type: "lede",
    text: "A health checkup used to be something you bought. I redesigned it into something you ask.",
  },
  {
    type: "meta",
    items: [
      { label: "Role", value: "Sole designer, end to end" },
      { label: "Surface", value: "~~iOS & Android~~" },
      { label: "Scope", value: "Ordering · Reports · Severity · Recommendations" },
      { label: "Status", value: "~~Shipped in phases~~" },
    ],
  },

  {
    type: "card",
    label: "The thirty-second version",
    index: "01",
    text: [
      "Plum sold comprehensive health checkup packages. One shape, take it or leave it — so the person who needed one test bought sixty, and the person whose doctor asked for three bought nothing.",
      "Then results came back as a wall of values with a few numbers in red. The most common thing we heard next was some version of *am I okay?* The report could not answer it.",
      "I rebuilt both ends. **Ordering became modular** — a package, a group, or a single test. **Reports became narrative** — the summary before the evidence, the action before the data, and a severity system that can tell the difference between *watch this* and *call someone.*",
      "One idea at both ends: stop speaking in SKUs and biomarkers. Start speaking in intent and answers.",
    ],
  },

  { type: "marker", label: "What we were selling", progress: 8 },
  { type: "heading", text: "A catalogue with exactly one shape" },
  {
    type: "text",
    text: "The mechanics of a health checkup are simple enough. You book in the app, a phlebotomist comes to your house, your sample goes to a lab, and a few days later a report appears. ~~Some checkups add imaging — ultrasound, ECG, DEXA — which arrive separately and look nothing like the blood work.~~",
  },
  {
    type: "text",
    text: "What wasn't simple was the ordering. The catalogue held comprehensive packages and nothing else. That wasn't laziness; ~~packages are easy to price, easy to route through a lab, and easy to explain in a single card.~~ It was a reasonable place to start that had stopped fitting the people arriving.",
  },
  {
    type: "figures",
    items: [
      {
        ref: "Figma → Designs → Home / old package-only list",
        ratio: "squat",
        caption: "**Before.** Every path through the product led to the same decision: which of these large bundles do you want?",
      },
    ],
  },

  { type: "marker", label: "Two problems, one cause", progress: 20 },
  { type: "heading", text: "Nobody arrives with a package-shaped question" },
  {
    type: "text",
    text: "People showed up holding a prescription with three tests on it. Or a thyroid result from six months ago they wanted to re-check. Or a vague, real worry like *“I've been tired since March”*. That maps to a handful of markers and not to a sixty-marker panel. The catalogue answered one question well and every other question badly.",
  },
  {
    type: "text",
    text: "And at the far end of the journey, the report was doing worse. The format of viewing your report was very haphazard and that needed solving.",
  },
  {
    type: "quote",
    text: "Health report is fragmented across biomarkers and difficult for users to interpret.",
    cite: "Problem statement, from the project file",
  },
  {
    type: "text",
    text: "So I wrote down the question I actually wanted to design against, and then refused to design anything that failed it:",
  },
  {
    type: "quote",
    text: "What should a user know within 30 seconds of opening their report?",
    cite: "The brief, reduced to one line",
  },

  { type: "marker", label: "The reframe", progress: 32 },
  { type: "heading", text: "My first structure was clinically correct and completely useless" },
  {
    type: "text",
    text: "I began by grouping results the way medicine groups them. *Cardiometabolic health. Inflammation & immune load. Core organ health. Respiratory. Bone & musculoskeletal. Nutrition & micronutrients.* Eleven areas, that a doctor would understand but a user taking a health checkup would not because nobody wakes up worried about their inflammation load.",
  },
  { type: "text", text: "What people actually ask, more or less verbatim:" },
  {
    type: "pills",
    items: [
      "Why do I always feel tired?",
      "Are my organs healthy?",
      "Am I at risk of future disease?",
      "Am I lacking any important nutrients?",
      "Is there anything I should be worried about?",
    ],
  },
  {
    type: "text",
    text: "So I re-cut the same markers into the three questions those collapse into. Nothing was added or removed. Only the sorting changed and the sorting was the product.",
  },
  {
    type: "reframe",
    from: {
      label: "Clinical taxonomy",
      items: [
        { title: "Cardiometabolic health" },
        { title: "Inflammation & immune load" },
        { title: "Core organ health" },
        { title: "Respiratory & lung" },
        { title: "Bone & musculoskeletal" },
        { title: "Nutrition & micronutrient" },
        { title: "Brain & neurological" },
        { title: "Infection screening" },
      ],
    },
    to: {
      label: "What people ask",
      emphasis: true,
      items: [
        { title: "How my body is functioning", sub: "Which parts of me are healthy?" },
        { title: "How I feel day to day", sub: "Why do I feel the way I feel?" },
        { title: "Future health risks", sub: "What might I face later?" },
      ],
    },
  },
  {
    type: "note",
    text: "The cost was real and worth naming: this cut does not line up with how labs sell panels or how results arrive. ~~A single package can feed all three groups, and one group can sit half-empty until the right test is ordered which is exactly the seam the recommendation engine later grew out of.~~",
  },

  { type: "marker", label: "Rules I designed against", progress: 41 },
  { type: "heading", text: "Four principles, each with a body count" },
  {
    type: "note",
    text: "A principle that never rejected anything is decoration. Each one below killed something I'd already drawn.",
  },
  {
    type: "principles",
    items: [
      {
        title: "Progressive disclosure, not another page",
        text: "Depth should be a tap inside the thing you're already reading, never a new destination.",
        killed: "a parallel “detailed results” section that repeated every health group in full.",
      },
      {
        title: "Concepts, not verdicts",
        text: "The middle layer of the report: the grouping that sits above individual test values has to be named after something that can hold any state, not the state itself.",
        list: [
          "“Cholesterol Health: Healthy” reads fine.",
          "“High Cholesterol: Healthy” reads like a contradiction.",
        ],
        killed: "grouping by clinical finding. It's the more natural-sounding option on paper, but it only makes sense the moment something's wrong, and breaks the moment you're well.",
      },
      {
        title: "No flag without an action",
        text: "Anything the product is willing to make someone anxious about, it has to be willing to advise them on.",
        killed: "colour-only out-of-range highlighting. A red mark with no next step, inherited straight from the lab printout.",
      },
      {
        title: "Never make anyone learn our taxonomy",
        text: "If a label needs a glossary to make sense, it's our word for it, not theirs.",
        killed: "the eleven-area clinical structure above, cut after I'd fully built it out. Rigorous, but built for people who already think like a lab, not a patient.",
      },
    ],
  },

  { type: "marker", label: "Act one · ordering", progress: 55 },
  { type: "heading", text: "One product became three" },
  {
    type: "text",
    text: "A package, a group, or a single test. ~~A group is the interesting one — a small curated set that maps to a concern rather than a discount, which is what stops it from being a tiny package with worse margins.~~",
  },
  {
    type: "text",
    text: "Once you sell all three, the store needs two doors. Browsing is how you shop when you don't know what you want; searching is how you shop when you know the exact name and half-remember the spelling. I gave the home page both without a mode switch, and let returning users skip the shop entirely — *previously booked* is a shortcut, not a badge.",
  },
  {
    type: "figures",
    layout: "three",
    items: [
      { ref: "Home – Packages", ratio: "tall", caption: "Browse, for people without a specific test in mind." },
      { ref: "Home – Tests", ratio: "tall", caption: "The same catalogue, à la carte, one tap away." },
      { ref: "Search page/landing", ratio: "tall", caption: "Search carries the load for tests, where names are long, abbreviated and misremembered." },
    ],
  },
  { type: "subheading", text: "A test page has to teach before it can sell" },
  {
    type: "text",
    text: "Nobody needs a package explained — the name does the work. A single test does: what it measures, why anyone orders it, what a result would tell you. I settled on one anatomy for both, with accordions that keep the page short and a default-open set chosen by ~~what a first-time buyer needs rather than what's clinically thorough.~~",
  },
  {
    type: "figures",
    layout: "two",
    items: [
      {
        ref: "Test product page · Test page – know more",
        ratio: "tall",
        caption: "**Teach, then price.** The explanation sits above the buy, not behind a link.",
      },
      {
        ref: "Cart + duplicates",
        ratio: "tall",
        caption: "**The cart is where customisation gets expensive.** Give people a catalogue and they will buy the same marker twice, cheerfully.",
      },
    ],
  },
  {
    type: "text",
    text: "That duplicate case is the whole trade-off in miniature. ~~The cart flags overlaps and lets you resolve them; it doesn't silently strip anything, because a cart that edits itself is a cart you stop trusting — and sometimes buying the marker twice is the point.~~",
  },

  { type: "marker", label: "Act two · reports", progress: 72 },
  { type: "heading", text: "Summary before evidence. Action before data. Every time." },
  { type: "text", text: "The report got a spine, and the order of it is the argument:" },
  {
    type: "spine",
    items: [
      { title: "Your health today", text: "The thirty-second answer. One state, in plain words." },
      { title: "What matters most", text: "Top concerns, top wins, ranked by consequence rather than by how far outside range they sit." },
      { title: "Health areas", text: "The three human groups — functioning, day to day, future risk." },
      { title: "Recommended actions", text: "Consults, follow-up tests, lifestyle changes. Attached to findings, never floating." },
      { title: "Detailed results", text: "Every value, every range. Last, but never absent — power users and doctors need it." },
    ],
  },
  {
    type: "figures",
    items: [
      {
        ref: "Reports revamp → prototype drafts 1–4",
        ratio: "wide",
        caption: "**The spine, top to bottom.** Detailed Results is fifth on purpose. Most reports open there and call it transparency.",
      },
    ],
  },
  { type: "subheading", text: "Every finding answers the same four questions" },
  {
    type: "text",
    text: "I wrote these on the wall and then refused to ship a card that couldn't fill all four. It turns out most of what made the old report frightening was answering the first one and stopping.",
  },
  {
    type: "beats",
    items: [
      { title: "What's happening", text: "Named in the words a person would use." },
      { title: "Why it matters", text: "The consequence, not the mechanism." },
      { title: "What to do", text: "One next step, always available." },
      { title: "How urgent", text: "Time, not just severity." },
    ],
  },
  { type: "subheading", text: "And then the interesting part: connecting them" },
  {
    type: "text",
    text: "Individually, a raised triglyceride, a raised ALT, a fatty liver note on the ultrasound and a widening waist are four unremarkable lines in four different documents. Together they are one story. The drill-down says so out loud — *all four findings point to: excess fat storage* — then shows its work: how we know, what it means, what could happen, what to do next.",
  },
  {
    type: "note",
    text: "~~That synthesis is the most ambitious thing in the report and the most carefully fenced: it only asserts patterns from a reviewed rule set, it always names its evidence, and it never diagnoses — it points.~~",
  },
  {
    type: "figures",
    layout: "two",
    items: [
      {
        ref: "Health summary findings → bottom sheet",
        ratio: "tall",
        caption: "**Evidence on demand.** Finding, then how we know, then what it means — one sheet, no new page.",
      },
      {
        ref: "Health areas → concept groups + supporting biomarkers",
        ratio: "tall",
        caption: "**Before / after.** A flat list of LDL, HDL, ApoB, hsCRP becomes *Cholesterol Health* with the markers underneath it.",
      },
    ],
  },
  {
    type: "text",
    text: "That last move is the one I'd defend hardest. The old report handed you the ingredients and expected you to cook. The new one gives you the dish and lets you ask what's in it.",
  },

  { type: "marker", label: "Act three · severity", progress: 82 },
  { type: "heading", text: "The old report had two emotional states: fine, and red" },
  {
    type: "text",
    text: "A reference range is a population statistic. The old design treated it as a verdict — which meant a value sitting a rounding error outside the range and a value that needs a doctor this week looked identical, and both looked like bad news.",
  },
  { type: "text", text: "So severity became a real scale, and each level owes the product something specific." },
  {
    type: "table",
    head: ["Level", "What it means", "What the product must then do"],
    rows: [
      { level: "Healthy", tone: "good", cells: ["In range, no pattern attached", "Say so. Wins are information too."] },
      { level: "Monitor", tone: "watch", cells: ["Drifting, or in range but trending", "Show the trend; suggest when to re-test."] },
      { level: "Needs attention", tone: "watch", cells: ["Out of range, or part of a pattern", "Explain the pattern; offer a consult or a follow-up test."] },
      { level: "Urgent", tone: "alert", cells: ["Clinically significant", "Say *this week*, and put a human within one tap."] },
    ],
  },
  {
    type: "note",
    text: "~~Level names are the version I'd argue for — “needs attention” over “abnormal”, “monitor” over “borderline” — because the label has to survive being read at 11pm by someone who is already worried.~~",
  },
  {
    type: "specimen",
    label: "Specimen · a value in context",
    value: "LDL cholesterol",
    tone: "watch",
    toneLabel: "Needs attention",
    position: 74,
    ends: ["Low", "Optimal 50–99 mg/dL", "High"],
    text: "132 mg/dL — above optimal, and part of a pattern with ApoB and triglycerides.",
  },
  {
    type: "text",
    text: "Colour never carries severity alone. Every level has a word, a chip, and a position on the range — which is an accessibility requirement and, more usefully, the only way a flag survives being screenshotted and sent to a family group chat.",
  },

  { type: "marker", label: "The loop", progress: 90 },
  { type: "heading", text: "A recommendation inside a medical document is one wrong move from an upsell" },
  {
    type: "text",
    text: "This is the part everyone gets wrong, usually by putting a carousel at the bottom. The rules I held to: a recommended test only ever appears attached to a specific finding, it always states its reason, and declining costs one tap and never asks twice.",
  },
  {
    type: "text",
    text: "The same pipe runs the other way. ~~A telehealth consult ends with the doctor's advice, and the tests in it are detected, matched to the catalogue, and dropped into a cart the user still has to confirm — with honest states for nothing detected, partially detected, and detected-but-we-don't-offer-it.~~ A machine-populated cart of medical tests without a review step is a lawsuit with a checkout button.",
  },
  {
    type: "figures",
    items: [
      {
        ref: "Detected tests · – expanded · – minimum tests detected · – not available tests",
        ratio: "squat",
        caption: "**Consult → cart.** The product proposes; the person confirms. Every state in between is designed, including the empty one.",
      },
    ],
  },

  { type: "marker", label: "What didn't ship", progress: 95 },
  { type: "heading", text: "Three things I drew and then deleted" },
  {
    type: "principles",
    items: [
      {
        title: "The clinical structure",
        text: "Eleven medically-grouped health areas, fully built out. Attractive because it was correct. Deleted because correctness isn't comprehension.",
      },
      {
        title: "Findings as the middle layer",
        text: "Naming groups after what's wrong — *High Cholesterol, Insulin Resistance, Reduced Kidney Function.* Punchier, more urgent, and structurally broken for every healthy user, which is most of them.",
      },
      {
        title: "~~The second information route~~",
        text: "~~Two competing hierarchies came out of the same three user needs. One led with health areas and let findings surface inside them; the other led with findings and used areas only as evidence. The second one won on the thirty-second test and lost everywhere else.~~",
        killed: "There is a note on my canvas next to the losing branch that reads, in full: *x Dropping this.* Design documentation is rarely more honest than that.",
      },
    ],
  },

  { type: "marker", label: "Shipping it", progress: 98 },
  { type: "heading", text: "Where it stands" },
  {
    type: "text",
    text: "Handoff covered eight flows — home, product, package and test pages, booking, cart, tracking, search, add-to-cart — with ~~roughly 250 frames~~ including every loader, every empty state, the failure paths for address edits, the unserviceable-pincode case with a notify-me, and three separate drop-off states for people who abandon after address, after slot, or before either.",
  },
  {
    type: "text",
    text: "I'll be honest about outcomes: there are no post-launch numbers yet. What I have is qualitative — ~~usability sessions on the report, where the thing that consistently broke was people trying to tap the summary text as if it were the drill-down, which is how the evidence sheet ended up where it is.~~",
  },
  {
    type: "figures",
    items: [
      {
        ref: "Designs → full hand-off canvas, zoomed out",
        ratio: "squat",
        caption: "Eight flows, every state. The interesting design decisions are in the previous sections; this is just the receipt.",
      },
    ],
  },
  { type: "subheading", text: "What I'd watch, and what would tell me I was wrong" },
  {
    type: "metrics",
    items: [
      { title: "Mix", text: "Share of orders containing a group or a single test. If it stays under a tenth, customisation was a story we told ourselves." },
      { title: "Depth", text: "Scroll past the summary, and evidence-sheet open rate. High opens mean the summary is trusted enough to interrogate; zero opens mean it's being ignored." },
      { title: "Action", text: "Clickthrough on recommended actions — and the decline rate, which is the honesty check on the upsell question." },
      { title: "Support", text: "Volume of “what does my report mean” tickets. This one should fall, and it's the only metric here I'd stake the project on." },
      { title: "Guardrail", text: "Average order value. Modular ordering can quietly cannibalise packages; if AOV falls faster than order volume rises, the pricing model needs the redesign, not the UI." },
    ],
  },

  { type: "marker", label: "In hindsight", progress: 100 },
  { type: "heading", text: "What I'd do differently" },
  {
    type: "text",
    text: "I spent weeks getting the health-area taxonomy right before I tested whether anyone reads past the first screen. The reframe that made this project work — from clinical grouping to human questions — was available on day one from five sentences people say out loud. I found it late, by building the wrong thing thoroughly first.",
  },
  {
    type: "text",
    text: "~~And I still haven't solved the first-time report. Every trend, every “compared to last time,” every bit of the narrative that makes this design good depends on a second data point. The first report a person ever sees is the one they judge us on, and it's the one with the least to say.~~",
  },

  {
    type: "footnote",
    text: "Some product and commercial details are generalised for confidentiality.",
  },

  {
    type: "appendix",
    title: "Assumptions to verify or replace",
    intro: "Every marked phrase above is an inference drawn from the Figma file, not something confirmed. Correct or confirm each one, then drop the ~~ marks from content/health-checkup.ts and this section goes with them.",
    items: [
      "**Timeline and status.** Written as “2026” and “shipped in phases.” Replace with the real dates and state.",
      "**Platform.** Assumed iOS and Android, no web.",
      "**Imaging in scope.** The file lists ECG, CT calcium score, MRI, DEXA, PFT, retinal and genetics. The piece implies these all land in the unified report — confirm which actually do.",
      "**Why packages-only existed.** The business reasons given (pricing, lab routing, explainability) are invented. Replace with the real ones.",
      "**What a “group” formally is.** Defined here as concern-led rather than discount-led. The single most important thing to correct — the whole Act One argument rests on it.",
      "**Duplicate handling.** Claims you surface and let the user resolve, rather than auto-removing. Confirm the actual behaviour and the reasoning.",
      "**Default-open accordions.** Claims the default set favours first-time buyers over clinical completeness.",
      "**The synthesis engine.** Written as a reviewed rule set that never diagnoses. If it's a model, clinician review, or something else, this needs rewriting — it's the most load-bearing claim in the piece.",
      "**Severity level names.** Healthy / Monitor / Needs attention / Urgent is a proposal. The file only confirms “Needs attention” and “Healthy.”",
      "**Telehealth pipeline.** Reads the *Detected tests* frames as a consult being parsed into a cart. If it's actually prescription upload, relabel.",
      "**Route 1 vs Route 2.** Both descriptions are invented. This section is the strongest credibility play in the piece, so it's worth getting exact.",
      "**Frame count.** “Roughly 250 frames” — around 258 top-level nodes were counted. Use the real number.",
      "**Usability findings.** The tapping-the-summary detail is invented as an example of the right *shape* of finding. Swap in something real, or cut the sentence.",
      "**The first-report problem.** Written as unsolved. If you solved it, this becomes a much better section than a reflection.",
    ],
  },
];
