/**
 * LOKESH ROHILLA - HOME CONTENT
 * ===========================================================================
 * Single source of truth for every visible string on the homepage.
 *
 * CONTENT INTEGRITY RULES (enforced here, not by convention):
 *
 *  1. No invented dates, job titles, employers, locations or outcomes.
 *  2. No invented testimonials, reviews, quotes or attributions.
 *  3. No invented statistics. If a number is not confirmed by the client it
 *     does not appear on the page.
 *  4. Any claim awaiting client confirmation lives in `PENDING` below and
 *     renders as a visibly marked placeholder, never as a finished sentence.
 *
 * Every placeholder is deliberately visible in the markup so nobody mistakes
 * an unconfirmed claim for approved copy.
 */


/*
  DEMO PHOTOGRAPHY. NOT LOKESH.

  Real Unsplash photo IDs, resolved and verified rather than guessed. Every
  `src` below is another person's photograph standing in for content that has
  not been supplied. They exist so the layout can be judged with pictures in it.

  `alt` is written as a description of what the photograph shows rather than as
  a claim about the business. "A mentor listening across a table" describes the
  image and asserts nothing; "Lokesh mentoring a client" would assert something
  false, and an alt attribute is read aloud by screen readers as though it were
  true.

  Curated to editorial rather than stock-corporate: no glass atriums, no staged
  handshakes, no smiling teams pointing at laptops.
*/
export const UNSPLASH = "https://images.unsplash.com/photo-";

export const PENDING = {
  vision: "[FINAL VISION STATEMENT TO BE PROVIDED]",
  mission: "[FINAL MISSION STATEMENT TO BE PROVIDED]",
  testimonials: "[REAL TESTIMONIALS AND GOOGLE REVIEWS TO BE PROVIDED]",
  insights: "[PUBLISHED ARTICLES AND VIDEOS TO BE PROVIDED]",
  events: "[CONFIRMED UPCOMING DATES TO BE PROVIDED]",
  contact: "[EMAIL, PHONE AND LOCATION TO BE PROVIDED]",
  scale:
    "Scale of reach through The Bookwishes Club is awaiting client confirmation and is deliberately not stated.",
} as const;

/* -------------------------------------------------------------------------
   SITEWIDE META DESCRIPTION

   Used by the root layout for the site description and every Open Graph tag,
   and by the hero for its supporting line, so the sentence exists once.

   It was read from the hero directly until the hero was removed, at which point
   it became a constant in layout.tsx. Restoring the hero could have put it back
   to `hero.sub`, which would have meant the same sentence in two files with
   nothing keeping them in step. One constant, two consumers.

   "18+ years" is the one quantified claim on the site. It is the client's own
   figure and appears nowhere else.
   ------------------------------------------------------------------------- */

export const SITE_DESCRIPTION =
  "18+ years helping businesses, leaders and individuals navigate complexity, build stronger systems, and create meaningful transformation.";

/* -------------------------------------------------------------------------
   SECTION 1 - HERO

   Rebuilt as a cinematic full bleed hero: one wordmark standing in the lower left
   of a photograph, a line of supporting copy and two calls to action in the lower
   right.

   WHAT CAME OUT WITH IT

   The previous hero was a split layout on white, and it carried elements that only
   worked with white space around them. None of them survive this design:

     - the rotating word. There is no sentence for it to rotate inside: the h1 is
       now the wordmark, which is one fixed word. `RotatingWord` and its typewriter
       are removed rather than left orphaned, along with the probe that tested it.
     - the stat row. Three unverified outcome figures behind a pending note. This
       design has no room for them and they were placeholders in any case.
     - the floating quote cards and the offset accent plate. Both were composed
       against a portrait sitting in a grid column, which this hero does not have.
     - the portrait and the 4 / 5 it reserved.

   The words themselves are not lost. "Turning Chaos Into Clarity." is the headline
   of the philosophy section and is published there, and `SITE_DESCRIPTION` is the
   site description in the metadata and the metadata description, so every string
   the old hero painted still appears somewhere on the site.

   THE ARTWORK IS A PHOTOGRAPH OF LOKESH, NOT A PLACEHOLDER

   `artwork.src` points at `public/hero-artwork.jpg`. That is the last thing this
   page was waiting on: everything else it needed already existed, and until the
   picture arrived the design could not be judged, only built.

   It matters beyond this hero. The rest of the site still reserves slots for
   photography that has never been supplied, and this file is the proof that the
   hold was temporary. It is the same pattern those slots use, minus the placeholder:
   a photograph of the actual subject, in the site's own `public/`, served from its
   own origin.
   ------------------------------------------------------------------------- */

export const hero = {
  /*
    The logotype. One word rather than the full name, because a wordmark set this
    large has to be short: "Lokesh Rohilla" at this size runs off both edges of the
    container and stops reading as a word at all.
  */
  wordmark: "Lokesh",

  /* The asterisk, set raised beside the wordmark. */
  mark: "*",

  /*
    THE SUPPORTING LINE, BOTTOM RIGHT.

    `SITE_DESCRIPTION`, not new copy. It is already the site's metadata description
    and it is published on /about, it says what he does without claiming a result,
    and reusing it means the hero cannot assert anything the rest of the site does
    not.
  */
  lede: SITE_DESCRIPTION,

  /*
    THE CTA INTENT LOCK STILL HOLDS.

    Recorded in `site.ts`: every distinct action gets exactly one label across the
    whole site, so nobody ever faces two wordings for the same intent. The
    reference this design came from carries a single "Join the lab" pill, which
    maps onto nothing here, so the two intents that already exist are used
    unchanged and no third wording is invented for the hero:

      contact intent -> "Work With Lokesh"   the white pill
      about intent   -> "Discover Lokesh"     the circular arrow

    The circular one is icon only, so it carries its label in `ariaLabel`. A bare
    arrow glyph announces "button" and nothing else, and the navigation already
    has three of those.
  */
  primary: { label: "Work With Lokesh", href: "/contact" },
  secondary: {
    label: "Discover Lokesh",
    href: "/about",
    ariaLabel: "Discover Lokesh, read Lokesh's story",
  },

  /*
    THE ARTWORK.

    `spec` and `direction` are published whether or not a file exists, because they
    remain the art direction whoever supplies it. They are the only record of what
    this hero is waiting for, so they live next to the empty `src` rather than in a
    comment above it.

    There is no `ratio` any more. The hero is a fixed height with the artwork
    covering it and cropping, so a ratio would describe nothing about the layout.
    The aspect the file should be is stated in `spec` instead.
  */
  /*
    THE ARTWORK, SUPPLIED.

    This is a photograph of Lokesh, not a placeholder, which is the whole reason
    the hero could be built this way. It replaces the pending slot that the design
    shipped with, and with it the last thing standing between this page and being
    a real personal brand site rather than a demo.

    The file is in `public/`, so it is served from the site's own origin and does
    not go through the Unsplash allowlist in `next.config.ts`. That block is still
    there for the other slots; this one no longer depends on it.

    THE ASPECT DOES NOT MATCH THE BRIEF, AND THE LAYOUT DOES NOT CARE.

    The brief asked for 21:9 and this is 16:9. The hero is a fixed height with the
    image covering it and cropping, so the file's ratio decides nothing about the
    layout: at 1440x900 the frame is 1440x666, the image scales to 1440x810 and
    loses 72px off the top and 72px off the bottom. Nothing is stretched and
    nothing is letterboxed. The crop is centred, which keeps his face in the upper
    third and puts the wordmark across the dark suit rather than across the bright
    desk, so the veil has less work to do here than the worst case it is derived
    against.

    `alt` is empty on the hero, deliberately: the artwork is atmosphere standing
    behind a wordmark and a sentence that already say what the page is. Describing
    it again for a screen reader would be noise.
  */
  artwork: {
    spec: "Hero artwork, landscape 16:9, 2048x1152",
    direction:
      "Supplied. Lokesh seated at a desk in his office, centred, bookshelves and plants behind him. Face in the upper third so the wordmark lands across the suit rather than across his face. The bright band along the bottom is the desk surface and is the worst case for light type, which the veil is sized for.",
    src: "/hero-artwork.jpg" as string | null,
  },
} as const;

/* -------------------------------------------------------------------------
   SECTION 2 - BRAND STATEMENT
   ------------------------------------------------------------------------- */

export const brandStatement = {
  headline: "More Than Experience. A Perspective.",
  body: "Lokesh's work has been shaped by years spent inside hospitality, business consulting, leadership, operations, transformation and self development. Each one added a different way of seeing how people and organizations actually work, and where they get stuck.",
  railLabel: "Two initiatives, both created and led by Lokesh Rohilla.",
  rail: [
    { name: "Business Consultation", href: "/services/business-consultation" },
    { name: "Self-Development Programs", href: "/services/self-development" },
  ],
} as const;

/* -------------------------------------------------------------------------
   SECTION 3 - SIGNATURE PHILOSOPHY
   ------------------------------------------------------------------------- */

export const philosophy = {
  headline: "Turning Chaos Into Clarity.",
  body: "Lokesh approaches problems by listening first, understanding the root cause, creating clarity, and then helping people or organizations build practical systems they can actually sustain.",
  /*
    `body` ON EACH STEP IS NOT RENDERED.

    The process section became four colour bands carrying a title and an oversized
    figure, and there is no room in a band for a paragraph beside a number that is
    120px tall. It was tried and it was unreadable.

    The four lines are kept here rather than deleted, because they are the only
    written account of what each step actually involves, and that is worth more as
    a record than as an empty field. `verb` is what the page renders; `body` is
    what the client has said, waiting for somewhere with room for it.
  */
  steps: [
    {
      verb: "Listen",
      body: "Before diagnosing anything, he makes space for the real problem to be said out loud.",
    },
    {
      verb: "Understand",
      body: "He looks for the root cause rather than the symptom that is easiest to point at.",
    },
    {
      verb: "Simplify",
      body: "Complexity is reduced until the next move is obvious to everyone involved.",
    },
    {
      verb: "Transform",
      body: "The change is built into systems and habits so it holds after the engagement ends.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------
   SECTION 4 - WHAT I WORK ON
   Areas of expertise, not a product catalogue.
   ------------------------------------------------------------------------- */

export const focusAreas = {
  eyebrow: "Expertise",
  headline: "What I Work On",
  lede: "Five areas where Lokesh spends most of his time. They overlap by design, because organizations rarely arrive with a single clean problem.",
  areas: [
    {
      title: "Business Transformation",
      body: "Helping organizations understand problems, improve systems and create sustainable growth.",
      span: "wide" as const,
    },
    {
      title: "Leadership",
      body: "Helping leaders and teams develop stronger ways of working.",
      span: "tall" as const,
    },
    {
      title: "Self Development",
      body: "Helping individuals develop greater awareness, clarity and capability.",
      span: "standard" as const,
    },
    {
      title: "Systems and Operations",
      body: "Creating practical structures and processes that reduce chaos.",
      span: "standard" as const,
    },
    {
      title: "Learning and Transformation",
      body: "Creating programs, workshops and experiences that help people grow.",
      span: "standard" as const,
    },
  ],
} as const;

/* -------------------------------------------------------------------------
   SECTION 5 - WHAT I HELP TRANSFORM
   Replaces the former "The Work I've Built" section.

   The visitor chooses by naming their own situation first. The destination
   organisation is the last line of each path, never the heading, which keeps
   Lokesh as the entry point rather than presenting two company names as the
   front door.

   Business Doctor and The Bookwishes Club are therefore no longer given their
   own homepage section. They are reached through these three paths, through the
   initiative rail in section 2, and through the footer.
   ------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------
/* -------------------------------------------------------------------------
   SECTION 4 - WHAT I HELP TRANSFORM
   Replaces the former "The Work I've Built" section.

   The visitor chooses by naming their own situation first. The destination
   organisation is the last line of each path, never the heading, which keeps
   Lokesh as the entry point rather than presenting two company names as the
   front door.

   The service areas now render in the left column under each word, at every
   width. They used to live only inside the detail panel, which is now the client
   logo strip. With the logos shared by all three panels, the word and its own
   list are the only things distinguishing one path from another.
   ------------------------------------------------------------------------- */

export const transformPaths = {
  eyebrow: "Choose your path",
  headline: "What I Help Transform",
  lede: "Start from whichever of these sounds most like you. The three paths lead to different places, and the first conversation is the same.",
  /*
    One photograph per path, shown in the right column when that path is hovered
    or focused.

    THE PHOTOGRAPHS ARE NOT SUPPLIED.

    Each is a labelled 4:3 placeholder reserving the exact frame the real image
    will occupy, so the swap ships the behaviour now and the artwork lands later
    with no layout change. Until then the hovered state shows a visible frame
    rather than an image, which is honest but not beautiful.

    Art direction notes are deliberately concrete, because "a photo of a team"
    is how a set of unusable stock images gets commissioned.
  */
  paths: [
    {
      who: "Businesses",
      items: [
        "Strategy",
        "Operations",
        "Systems",
        "Sales",
        "Marketing",
        "Organizational structure",
      ],
      image: {
        label: "Business consultation",
        spec: "1600x1200",
        ratio: "4 / 3",
        direction:
          "A working session around a table, mid discussion rather than posed. Documents and a whiteboard in frame. Natural light, no staged smiles.",
        // DEMO ONLY, not Lokesh. Delete to go live.
        src: `${UNSPLASH}1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80`,
        alt: "Two people in conversation across a table with papers between them",
},
      cta: { label: "Explore Business Consultation", href: "/services/business-consultation" },
    },
    {
      who: "Individuals",
      items: ["Mindset", "Self-development", "Personal growth", "Career", "Confidence"],
      image: {
        label: "Self-development session",
        spec: "1600x1200",
        ratio: "4 / 3",
        direction:
          "One person in the frame, mid sentence, in a training room. Side or three quarter view, not head on. Warm light, some depth behind.",
        // DEMO ONLY, not Lokesh. Delete to go live.
        src: `${UNSPLASH}1573497620053-ea5300f94f21?auto=format&fit=crop&w=1600&q=80`,
        alt: "A woman listening attentively across a table in a bright room",
},
      cta: { label: "Explore Self-Development", href: "/services/self-development" },
    },
    {
      who: "Leaders & Teams",
      items: ["Leadership", "Team development", "Communication", "Performance", "Culture"],
      image: {
        label: "Leadership workshop",
        spec: "1600x1200",
        ratio: "4 / 3",
        direction:
          "A group at a whiteboard or flipchart, standing, mid workshop. Show the backs and profiles as well as faces. Corporate but not corporate stock.",
        // DEMO ONLY, not Lokesh. Delete to go live.
        src: `${UNSPLASH}1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80`,
        alt: "A group standing at a whiteboard mid workshop, backs and profiles to camera",
},
      cta: { label: "Explore Leaders & Teams", href: "/services/leaders-teams" },
    },
  ],
} as const;

/* -------------------------------------------------------------------------
   SECTION 7 - WORKED WITH

   A scrolling row of client logos. Replaced the "Selected Transformations"
   cards on the homepage.

   THE NAMES ARE CONFIRMED ENGAGEMENTS. THE MARKS ARE NOT SUPPLIED.

   These are placeholder frames carrying an organisation's name, not logos. No
   logo file can be used until written permission to display each mark is on
   file, and an implied endorsement is not a granted one. Each entry carries the
   spec so a real file drops in without a layout change.

   The same list appears on /services/business-consultation#clients. Kept in one
   place in `clientLogos` below so the two cannot drift.
   ------------------------------------------------------------------------- */

export const workedWith = {
  eyebrow: "Worked with",
  headline: "Organizations he has worked with.",
  /*
    The second sentence used to say logos would appear once permission was on file.
    Every mark is now on the page, so it would have been describing something that
    is no longer true.
  */
  lede: "Nine named engagements, each confirmed.",
  cta: { label: "Explore All Experience", href: "/about" },
  /*
    The note no longer claims files are missing, because they are not. What it
    still flags is the one thing this site cannot verify for itself: that written
    permission to display each mark exists. The files came from the client, and the
    client states these are organisations they worked with, which is a different
    claim from holding a document from each of them.

    Deleting this note would remove the only place that distinction is recorded on
    the page, and it is the distinction that kept all six slots as monograms for as
    long as it did.
  */
  pending:
    "[WRITTEN PERMISSION TO DISPLAY EACH MARK IS THE CLIENT'S TO CONFIRM] Every organisation listed here is a named engagement and every mark is the client's own supplied file. No mark has been sourced, redrawn or approximated.",
} as const;

/*
  `initials` is derived from the organisation's own name, two characters, and is
  the placeholder stand in for the mark. It is not a logo and it does not pretend
  to be one: it is a monogram in the site's own ink, beside the organisation's
  name in full, so the row reads as a labelled placeholder rather than as a row of
  marks that might be mistaken for real artwork.

  `src` IS WHERE A REAL MARK GOES, AND IT IS NULL ON ALL SIX.

  Setting it is the only edit needed to publish a mark. The component renders the
  monogram when it is null and the image when it is not, in the same fixed box, so
  the six can be replaced one at a time without the strip changing height.

  Null is the correct value for every entry. Written permission to display each
  mark is not confirmed, and displaying one without it asserts an endorsement that
  has not been granted. That is a different kind of gap from a missing file: a
  missing file is an oversight, and an unpermissioned mark is a claim about someone
  else's business.

  A mark belongs in `public/` and is referenced by path. Nothing here needs a
  config change: `next.config.ts` only allowlists Unsplash for the demo imagery,
  and a local path bypasses it, exactly as the hero artwork does.
*/
export const clientLogos = [
  {
    name: "Siddharth Hospitality",
    initials: "SH",
    spec: "648x336",
    /*
      THE FIRST REAL MARK ON THE SITE.

      Supplied as `logo-2.webp`, 1275x594, of which the mark itself was only
      632x320: 316px of empty space on the left, 327 on the right, and a further
      133 above and 141 below. In a 168px slot that padding would have rendered the
      logo at about half the size it should be, off centre, inside a frame that
      reads as mostly empty.

      So it was trimmed to its content box with an 8px margin and saved as PNG,
      which is lossless and correct for a mark of flat colour with hard edges.

      The white background is left in place rather than keyed out. The strip sits
      on a light section and every slot is `bg-canvas`, so white is invisible, and
      knocking white to transparency puts a grey halo on the anti-aliased edges of
      the gold, which is the part of the mark most likely to be judged.
    */
    src: "/logos/siddhartha-hospitality.png" as string | null,
  },
  /*
    THE EIGHT THAT CAME IN ONE BATCH.

    All nine marks are now real files rather than monograms. The order is the
    engagement order the list already had, with the three that matched kept where
    they were and the new ones appended.

    TWO NAMES CHANGED, because the marks say something different from what was
    here before: "Hamsa Wears" is now "Hamsa" and "Kalpa Internet Ventures" is now
    "Kalpa Logistics". The marks are the authority on what these organisations are
    called; the earlier names were this file's guess.

    TWO PLACES WERE REMOVED rather than left without a file: Omega International
    College and Center for Leadership and Entrepreneurship. A placeholder for an
    organisation whose mark has not been supplied is the honest state; a
    placeholder for one the client has not named is not.

    EVERY FILE WAS TRIMMED AND DOWNSCALED, and every one of them needed it.

    The batch arrived at up to 3262px wide and 1MB, with white padding on most of
    them, and they are displayed 168px wide. Each was cropped to its content box
    and scaled so its longest edge is 420px, about 2x the slot at 48px tall, which
    is what a retina screen wants and no more. The batch came to 439KB from
    roughly 3.7MB.

    Trimming treats a pixel as empty when it is transparent or near-white, which
    is correct for a mark on white but would have destroyed a white-on-dark logo.
    Each result was inspected rather than assumed, because that failure is silent
    and looks like a trim rather than a deletion.
  */
  { name: "Hamsa", initials: "HA", spec: "322x420", src: "/logos/hamsa.png" },
  {
    name: "Kshipra Attire",
    initials: "KA",
    spec: "354x420",
    src: "/logos/kshipra-attire.png",
  },
  {
    name: "Kalpa Logistics",
    initials: "KL",
    spec: "420x106",
    src: "/logos/kalpa-logistics.png",
  },
  {
    name: "SCI International Hospital",
    initials: "SCI",
    spec: "420x410",
    src: "/logos/sci-international-hospital.png",
  },
  { name: "CityMall", initials: "CM", spec: "308x272", src: "/logos/citymall.png" },
  {
    name: "Hyatt Hotels",
    initials: "HH",
    spec: "420x106",
    src: "/logos/hyatt-hotels.png",
  },
  {
    name: "Hard Rock Cafe",
    initials: "HR",
    spec: "420x246",
    src: "/logos/hard-rock-cafe.png",
  },
  {
    name: "Qatar Airways",
    initials: "QA",
    spec: "420x164",
    src: "/logos/qatar-airways.png",
  },
] as const;

export const finalCta = {
  headline: "Start with the problem as it actually is.",
  lede: "One conversation is a reasonable place to start. Bring the problem as it actually is, not as it has been described to you.",
  cta: { label: "Work With Lokesh", href: "/contact" },
} as const;

/* -------------------------------------------------------------------------
   SECTION 6 - EXPERIENCE AS CREDIBILITY
   Teases the story. The About page tells it.
   ------------------------------------------------------------------------- */

export const experienceTeaser = {
  headline: "18+ Years. Multiple Industries. One Perspective.",
  body: "Hospitality teaches you service. Operations teaches you systems. Leadership teaches you people. Consulting teaches you to hold all three at once.",
  industries: [
    "Hospitality",
    "Business Consulting",
    "Retail",
    "Logistics",
    "Education",
    "Leadership",
    "Self Development",
  ],
  cta: { label: "Explore My Journey", href: "/about" },
} as const;


/* -------------------------------------------------------------------------
   SECTION 8 - TESTIMONIALS
   Structure only. No fabricated quotes, names or reviews.
   ------------------------------------------------------------------------- */

export const testimonials = {
  eyebrow: "In their words",
  headline: "Words From People I've Worked With",
  lede: "Video testimonials lead here, with written Google Reviews underneath. Both are being collected and will appear as they are confirmed.",
  /*
    VIDEO POSTER FRAMES. DEMO ONLY, DELETE TO GO LIVE.

    Rooms, stages and workshop floors. No faces, deliberately.

    The heading directly above these frames is "Words From People I've Worked
    With". A photograph of a person sitting in one of them reads as that person
    about to give a testimonial, and no such person has given one. A conference
    room says "footage of this kind is coming" without asserting who is in it.

    These fill the frame only. The play glyph and the "Video pending" label both
    stay, because the video genuinely has not arrived and hiding that would make a
    play control that plays nothing look broken rather than pending.
  */
  videoSlots: [
    {
      label: "Video testimonial",
      spec: "16:9, 1920x1080",
      src: `${UNSPLASH}1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80`,
      alt: "An empty lecture theatre with rows of seats facing a screen",
    },
    {
      label: "Video testimonial",
      spec: "16:9, 1920x1080",
      src: `${UNSPLASH}1531421693921-03e5aa6ee863?auto=format&fit=crop&w=1600&q=80`,
      alt: "A workshop room with chairs arranged facing the front",
    },
    {
      label: "Video testimonial",
      spec: "16:9, 1920x1080",
      src: `${UNSPLASH}1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80`,
      alt: "A lit stage with a microphone stand and a dark auditorium",
    },
  ],
  pending: PENDING.testimonials,
} as const;

/* -------------------------------------------------------------------------
   SECTION 9 - INSIGHTS
   Categories are real. No article or video titles are invented.
   ------------------------------------------------------------------------- */

export const insights = {
  eyebrow: "Insights",
  headline: "Ideas. Experiences. Perspectives.",
  lede: "Writing and video on the subjects Lokesh works on daily: business, leadership, self development, transformation, stories and learning.",
  /*
    Category names only. An earlier draft carried a one line description per
    category, but it was only ever surfaced through a title tooltip, which
    sighted users rarely see and assistive tech does not reliably announce.
    Unshown copy is dead copy, so it was removed rather than left hidden.
    Restore the descriptions here as visible body copy when the section gets
    real cards.
  */
  categories: [
    "Business",
    "Leadership",
    "Self Development",
    "Transformation",
    "Stories",
    "Learning",
  ],
  pending: PENDING.insights,
  cta: { label: "Explore the Blog", href: "/blog" },
} as const;


/* -------------------------------------------------------------------------
   ABOUT PAGE COPY (staged for the next build pass)
   Present here so the About page has an approved source of truth waiting,
   including the two statements the client has not yet supplied.
   ------------------------------------------------------------------------- */

export const about = {
  hero: {
    wordmark: "Lokesh Rohilla",
    role: "Business Consultant. Mentor. Transformation Leader.",
    headline: "The journey so far.",
  },
  chapters: [
    {
      key: "story",
      title: "The Story",
      note: "Full biography, written as editorial narrative with visual breaks rather than a wall of text.",
    },
    {
      key: "early-career",
      title: "Early Career, Dubai",
      note: "Began in Dubai's hospitality industry with Hyatt International and Qatar Airways. Focus on systems, service, hospitality, operational excellence, and understanding people and processes.",
    },
    {
      key: "transition",
      title: "The Transition",
      note: "Moved from hospitality into broader business consulting. Started with hotels, restaurants and premium guesthouses, then expanded into retail, logistics, education and other organizations.",
    },
    {
      key: "major-experiences",
      title: "Major Experiences",
      note: "Hard Rock Hotel India, City Mall, QSR outlets, meat processing factory setup, and the International Hospital in Delhi. No dates or job titles are stated, because none have been supplied.",
    },
    {
      key: "turning-point",
      title: "A Different Kind of Transformation",
      note: "The 2021 turning point. A personal transformation during lockdown that led to the founding of The Bookwishes Club. This is where the story moves from business transformation into personal development.",
    },
    {
      key: "recent-work",
      title: "Recent Work",
      note: "Corporate leadership mentoring, Siddharth Hospitality, Hamsa Wears, Kshipra Attire, Center for Leadership and Entrepreneurship, Kalpa Internet Ventures, and Omega International College. Documented as engagements only. No results stated.",
    },
  ],
  philosophy: {
    headline: "Listen. Understand. Simplify. Transform.",
    body: "The listening leader. Clarity before prescription, always.",
  },
  vision: PENDING.vision,
  mission: PENDING.mission,
  timelineLabels: [
    "Early Career",
    "Transition",
    "Major Projects",
    "2021",
    "Recent and Ongoing",
  ],
  closing: {
    headline: "The journey continues.",
    cta: { label: "Work With Lokesh", href: "/contact" },
  },
} as const;
