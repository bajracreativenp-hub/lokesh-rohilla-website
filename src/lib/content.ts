/**
 * LOKESH ROHILLA - HOME CONTENT
 * ===========================================================================
 * Single source of truth for every visible string on the homepage.
 */

export const UNSPLASH = "https://images.unsplash.com/photo-";

export const PENDING = {
  contact: "Direct enquiries: connect@lokeshrohilla.com • Executive Consulting & The Bookwishes Club • Monday to Saturday, 10:00 AM – 6:00 PM",
} as const;

export const SITE_DESCRIPTION =
  "18+ years helping businesses, leaders and individuals navigate complexity, build stronger systems, and create meaningful transformation.";

/* -------------------------------------------------------------------------
   SECTION 1 - HERO
   ------------------------------------------------------------------------- */

export const hero = {
  wordmark: "Lokesh",
  mark: "*",
  lede: SITE_DESCRIPTION,
  primary: { label: "Work With Lokesh", href: "/contact" },
  secondary: {
    label: "Discover Lokesh",
    href: "/about",
    ariaLabel: "Discover Lokesh, read Lokesh's story",
  },
  artwork: {
    spec: "Hero artwork, landscape 16:9, 2048x1152",
    direction:
      "Supplied. Lokesh seated at a desk in his office, centred, bookshelves and plants behind him. Face in the upper third so the wordmark lands across the suit rather than across his face.",
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
   SECTION 4 - WHAT I HELP TRANSFORM
   ------------------------------------------------------------------------- */

export const transformPaths = {
  eyebrow: "Choose your path",
  headline: "What I Help Transform",
  lede: "Start from whichever of these sounds most like you. The three paths lead to different places, and the first conversation is the same.",
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
        src: `${UNSPLASH}1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80`,
        alt: "A group standing at a whiteboard mid workshop, backs and profiles to camera",
      },
      cta: { label: "Explore Leaders & Teams", href: "/services/leaders-teams" },
    },
  ],
} as const;

/* -------------------------------------------------------------------------
   SECTION 7 - WORKED WITH
   ------------------------------------------------------------------------- */

export const workedWith = {
  eyebrow: "Worked with",
  headline: "Organizations he has worked with.",
  lede: "Trusted across hospitality, aviation, healthcare, retail, logistics, and executive education.",
  cta: { label: "Explore All Experience", href: "/about" },
  pending:
    "Every organisation listed here reflects a direct operational, consulting, or leadership engagement acrossLokesh Rohilla's eighteen-year career.",
} as const;

export const clientLogos = [
  {
    name: "Siddharth Hospitality",
    initials: "SH",
    spec: "648x336",
    src: "/logos/siddhartha-hospitality.png" as string | null,
  },
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
   SECTION 8 - TESTIMONIALS
   ------------------------------------------------------------------------- */

export const testimonials = {
  eyebrow: "In their words",
  headline: "Words From People I've Worked With",
  lede: "Reflections and outcomes from founders, executive teams, and members of The Bookwishes Club.",
  videoSlots: [
    {
      label: "Executive Systems & Turnaround Session",
      spec: "16:9, 1920x1080",
      src: `${UNSPLASH}1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80`,
      alt: "An executive lecture theatre with rows of seats facing a screen",
    },
    {
      label: "The Bookwishes Club — Public Speaking Cohort",
      spec: "16:9, 1920x1080",
      src: `${UNSPLASH}1531421693921-03e5aa6ee863?auto=format&fit=crop&w=1600&q=80`,
      alt: "A workshop room with chairs arranged facing the front",
    },
    {
      label: "Leadership & Team Alignment Keynote",
      spec: "16:9, 1920x1080",
      src: `${UNSPLASH}1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80`,
      alt: "A lit stage with a microphone stand and a dark auditorium",
    },
  ],
  googleReviews: {
    businessName: "The Bookwishes Club",
    rating: 4.6,
    reviewCount: "318+",
    url: "https://share.google/MNnpINkRvgzdZAJTH",
    note: "Public Speaking & Self-Development Center",
    reviews: [
      {
        author: "Anit Shakya",
        rating: 5,
        text: "Attending the public speaking classes at The Bookwishes Club has been a transformative experience! The sessions are well-structured, engaging, and full of practical exercises that really helped boost my confidence.",
        time: "Google Review",
      },
      {
        author: "Bivan Tulachan",
        rating: 5,
        text: "Joining Book Wishes Club has been very rewarding. It improved my speaking ability and made me more confident. The classes are fun and encouraging, and the instructors are very helpful and friendly.",
        time: "Google Review",
      },
      {
        author: "Chandani Shah",
        rating: 5,
        text: "I am truly grateful for the incredible classes. Joining these sessions was one of the best decisions I have made and now, I am proud to say I have gained real confidence.",
        time: "Google Review",
      },
      {
        author: "Nirakar God",
        rating: 5,
        text: "After joining I have a clear vision about what it takes to be a successful person who is able to handle any situation. I genuinely suggest people to be a member of Bookwishes Club.",
        time: "Google Review",
      },
    ],
  },
} as const;

/* -------------------------------------------------------------------------
   RESULTS & IMPACT METRICS
   ------------------------------------------------------------------------- */

export const impactMetrics = [
  {
    value: "18+",
    unit: "Years",
    label: "Transformation Experience",
    sub: "Hospitality, retail, manufacturing, logistics and enterprise consulting.",
  },
  {
    value: "4.6",
    unit: "★",
    label: "Google Review Rating",
    sub: "Rated 4.6 across 318+ verified reviews for The Bookwishes Club.",
    isRating: true,
  },
  {
    value: "2",
    unit: "Practices",
    label: "Core Transformation Arms",
    sub: "Business Doctor (Turnaround & Systems) and The Bookwishes Club (Self-Development).",
  },
  {
    value: "100%",
    unit: "Grounded",
    label: "Diagnostic Before Prescription",
    sub: "Pinpoint root causes before touching budget, team, or processes.",
  },
] as const;

/* -------------------------------------------------------------------------
   CORE TRANSFORMATION PILLARS
   ------------------------------------------------------------------------- */

export const transformationPillars = {
  eyebrow: "Choose Your Path",
  headline: "Two paths to lasting |t|ransformation.",
  lede: "Whether building resilient systems for your business or mastering your articulation and mindset. Choose the path that matches what you need to transform next.",
  items: [
    {
      number: "01",
      audience: "FOR YOUR BUSINESS",
      title: "Business Systems, Scaling & Turnaround",
      subtitle: "Powered by Business Doctor",
      description: "Eliminating operational chaos, broken sales handoffs, and founder dependency. Building predictable systems and execution rhythms so your company scales without burning you out.",
      highlights: [
        "Full operational diagnostic before prescribing changes",
        "Eliminating single points of failure & founder bottlenecks",
        "Clear decision rights & sales handoff accountability",
        "Cash flow clarity, systems structure & repeatable growth",
      ],
      href: "/services/business-consultation",
      cta: "Explore Business Doctor",
    },
    {
      number: "02",
      audience: "FOR YOURSELF",
      title: "Public Speaking, Mindset & Executive Presence",
      subtitle: "Powered by The Bookwishes Club",
      description: "Mastering stage presence, impromptu articulation, and cognitive confidence. Transforming personal hesitation into commanding communication through continuous practice.",
      highlights: [
        "Conquering stage fright & speaking with authority",
        "Structured impromptu articulation & executive delivery",
        "Deep reading culture, mindset shifts & learning habits",
        "Active community with 318+ 4.6★ verified member transformations",
      ],
      href: "/services/self-development",
      cta: "Explore The Bookwishes Club",
    },
  ],
} as const;

/* -------------------------------------------------------------------------
   HOMEPAGE DIAGNOSTIC SECTION
   ------------------------------------------------------------------------- */

export const diagnosticSection = {
  eyebrow: "Growth Path Tool",
  headline: "Find out what is actually |s|lowing you down.",
  lede: "Choose a growth path for your business or yourself. Ten focused questions to pinpoint friction and uncover your highest-leverage priority in 3 minutes.",
} as const;
