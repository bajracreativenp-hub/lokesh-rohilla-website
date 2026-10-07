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

   Restored at the client's instruction after being removed. The verb rail and
   the platform grid shared a file with the hero and were removed at the same
   time; they are deliberately NOT restored, because only the hero was asked for.
   ------------------------------------------------------------------------- */

export const hero = {
  wordmark: "Lokesh Rohilla",
  role: "Business Consultant, Mentor, Transformation Leader",
  headline: "Turning Chaos Into Clarity.",
  sub: SITE_DESCRIPTION,
  primary: { label: "Discover Lokesh", href: "/about" },
  secondary: { label: "Work With Lokesh", href: "/contact" },
  portrait: {
    ratio: "4 / 5",
    spec: "Editorial portrait, vertical 4:5, 1600x2000",
    direction:
      "Natural light, calm neutral backdrop, subject off centre with generous negative space. No studio strobe look.",
    /*
      DEMO ONLY. Not Lokesh. Delete both lines to go live.

      Framed so the subject sits right of centre, which is what the full bleed
      art direction in `hero.tsx` asks for: the headline occupies the left of the
      hero, so a subject placed centrally would end up behind the text.

      `portrait-of-a-man` is a real Unsplash photo ID and resolves, it is not a
      constructed URL.
    */
    src: `${UNSPLASH}1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=80`,
    alt: "Studio portrait of a man in a dark jacket against a plain backdrop",
  },
  /*
    Floating cards flanking the portrait.
    Both are placeholders. No publication name, attribution or endorsement is
    asserted, because none has been confirmed.

    Which card sits on which side is set by the className in hero.tsx, not by
    data, so there is no `position` field here to drift out of sync with it.
  */
  quotes: [
    /*
      THESE ARE SERVICE CARDS, NOT TESTIMONIALS. THEY WERE TESTIMONIAL SLOTS.

      Both used to read "[Publication to be provided]" with the body "Confirmed
      words from the people Lokesh has worked with will sit here." Two identical
      placeholders in the most prominent position on the site, advertising the
      absence of testimonials rather than making a point.

      The fix was to accept that these cards are not the right home for social
      proof. A floating card next to a portrait reads as something the subject is
      associated with, so filling them with unattributed praise makes the absence
      louder. A card that names a documented capability is doing the job the
      placement can actually support.

      So these are now the three documented service areas. Every word is grounded in
      the services already published on this site. No testimonial is implied, no
      person is quoted, and nothing is invented to fill a box.

      The testimonial slots are not lost. They live further down the page in their
      own section with three video frames and a Google Reviews panel, which is the
      right place for them and a less dishonest place than the hero.
    */
    { source: "Business Consultation", tone: "light" as const },
    { source: "Self-Development Programs", tone: "dark" as const },
  ],
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
  lede: "Named engagements, confirmed. Logos appear here once written permission to display each mark is on file.",
  cta: { label: "Explore All Experience", href: "/about" },
  pending:
    "[CLIENT LOGO FILES AND WRITTEN PERMISSION TO DISPLAY EACH MARK TO BE PROVIDED] Named engagements only. No mark is shown until permission is confirmed for that organisation specifically.",
} as const;

/*
  `initials` is derived from the organisation's own name, two characters, and is
  the placeholder stand in for the mark. It is not a logo and it does not pretend
  to be one: it is a monogram in the site's own ink, beside the organisation's
  name in full, so the row reads as a labelled placeholder rather than as a row of
  marks that might be mistaken for real artwork.
*/
export const clientLogos = [
  { name: "Siddharth Hospitality", initials: "SH", spec: "320x120" },
  { name: "Hamsa Wears", initials: "HW", spec: "320x120" },
  { name: "Kshipra Attire", initials: "KA", spec: "320x120" },
  { name: "Center for Leadership and Entrepreneurship", initials: "CL", spec: "320x120" },
  { name: "Kalpa Internet Ventures", initials: "KI", spec: "320x120" },
  { name: "Omega International College", initials: "OI", spec: "320x120" },
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
