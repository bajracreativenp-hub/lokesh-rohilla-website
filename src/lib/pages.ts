/**
 * SECONDARY PAGE CONTENT
 * ===========================================================================
 * All copy for /about, /business-doctor, /bookwishes-club, /leadership-programs,
 * /events, /insights, /gallery, /contact and /business-health-check.
 *
 * GROUNDING RULE
 * Everything below is written from the facts the client supplied, or is clearly
 * framed reflection on those facts. Nothing invents a date, a job title, an
 * employer, a location, a client result, a statistic, a testimonial or a review.
 * Where a fact has not been supplied it is marked `pending` and rendered
 * visibly, so an unconfirmed claim can never be mistaken for approved copy.
 *
 * The only dates used are 2021 (The Bookwishes Club founding, supplied) and
 * "18+ years" (supplied). Everything else is named by phase, not by year.
 */

export type PageHero = {
  eyebrow: string;
  headline: string;
  lede: string;
};

export type Chapter = {
  label: string;
  title: string;
  paragraphs: string[];
  /** Optional pull quote or framing line rendered as a display element. */
  pull?: string;
};

export type Pending = { label: string; text: string };

/* ==========================================================================
   ABOUT
   ========================================================================== */

export type Experience = {
  title: string;
  place?: string;
  body: string;
};

/**
 * Documented engagements. Each description is limited to what was supplied.
 * No outcomes, metrics or client names are claimed beyond these.
 */
export const aboutPage = {
  hero: {
    eyebrow: "About",
    headline: "The journey so far.",
    lede: "Business Consultant. Mentor. Transformation Leader. Eighteen years of working inside other people's organizations, learning how they hold together and where they come apart.",
  } satisfies PageHero,

  chapters: [
    {
      label: "The story",
      title: "It starts in a city built around service.",
      paragraphs: [
        "Lokesh Rohilla began his career in Dubai, inside one of the most exacting service industries in the world. Hospitality does not tolerate almost. It either works or it does not, and everyone finds out which on a busy night.",
        "His early years, with Hyatt International and then Qatar Airways, were an education in systems. Rooms turn over, flights depart on time, and both happen at once by thousands of people who have never met. Nothing works by accident. The standard is the system, and the system is the standard.",
      ],
      pull: "Nothing works by accident.",
    },
    {
      label: "Early career",
      title: "Learning to see the whole operation.",
      paragraphs: [
        "What Lokesh took from that period was not a technique. It was a way of looking: at a whole operation rather than a single complaint, at how work actually moves rather than how the org chart says it moves.",
        "Service taught him about people. Systems taught him about sequence. The two together are the thing most businesses are missing, and the thing he has spent his career putting back.",
      ],
    },
    {
      label: "The transition",
      title: "A skill that turned out to be portable.",
      paragraphs: [
        "Lokesh moved out of hospitality and into broader business consulting, beginning with the organizations that looked most like his own: hotels, restaurants and premium guesthouses.",
        "From there the work widened into retail, logistics, education and other organizations that had nothing to do with hotels and exactly the same problem. Something had grown faster than the way the business was being run, and the gap between the two had become expensive.",
      ],
      pull: "Something had grown faster than the way the business was being run.",
    },
    {
      label: "Major experiences",
      title: "The projects that shaped the practice.",
      paragraphs: [
        "Some of the work is visible from the outside. Some of it is a process nobody photographs. Both matter, and both are part of how the method was formed.",
      ],
      pull: "Both matter.",
    },
    {
      label: "A turning point",
      title: "A different kind of transformation.",
      paragraphs: [
        "When the world stopped, a business built on movement lost its ground. There was no new market to enter, no new location to open and no new system to install. There was only the work that could be done with the people already there.",
        "His own attention, which for years had been directed outward at other people's organizations, turned back on itself. That pause is what led, in 2021, to the founding of The Bookwishes Club.",
        "It is the hinge of the story. Before it, the work was primarily about business transformation. After it, self development became an equal half of the practice rather than an aside.",
      ],
      pull: "The hinge of the story.",
    },
    {
      label: "Leadership",
      title: "The listening leader.",
      paragraphs: [
        "Listen. Understand. Simplify. Transform. Four steps, in that order, and the order is the discipline.",
        "Most organizations try to simplify before they understand, because simplifying is visible and understanding is not. That inversion is where transformation efforts usually come apart.",
      ],
      pull: "Listen. Understand. Simplify. Transform.",
    },
  ] satisfies Chapter[],

  /**
   * Documented engagements. Each description is limited to what was supplied.
   * No outcomes, metrics or client names are claimed beyond these.
   */
  experiences: [
    {
      title: "Hard Rock Hotel",
      place: "India",
      body: "Helped bring the first Hard Rock Hotel to India.",
    },
    {
      title: "City Mall",
      body: "Managed the pre-opening.",
    },
    {
      title: "Quick Service Restaurants",
      body: "Launched multiple Quick Service Restaurant outlets.",
    },
    {
      title: "Meat Processing",
      body: "Set up a meat processing factory.",
    },
    {
      title: "International Hospital",
      place: "Delhi",
      body: "Supported the operational setup.",
    },
  ] satisfies Experience[],

  bookwishes: {
    title: "The Bookwishes Club",
    body: [
      "Founded in 2021 as a self development center, The Bookwishes Club is about learning in the open. Learning that changes how someone works, decides and rests, rather than information that is collected and forgotten.",
      "The focus is self development, personal growth, leadership and transformation, delivered through programs, workshops and a community that keeps practicing after the session ends.",
    ],
    pending: {
      label: "Program detail and reach",
      text: "Program structure, session formats and scale of participation are still to be confirmed. No figure is stated anywhere on this site until it is.",
    },
  },

  businessDoctor: {
    title: "Business Doctor",
    body: [
      "Business Doctor is the consulting practice that grew out of eighteen years of working inside other people's organizations. Its job is to diagnose before it prescribes.",
      "A business that is struggling usually knows the symptoms and usually does not know the cause. The work is to get from the symptom to the cause, and from the cause to a set of practical systems the organization can run without the consultant in the room.",
    ],
  },

  /**
   * Recent engagements, listed as documented work only. Deliberately framed as
   * a list of engagements, not a list of achievements.
   */
  recentWork: {
    title: "Recent and ongoing work",
    lede: "Documented engagements. Listed as work, not as results, because no outcome claims have been confirmed for any of them.",
    items: [
      "Corporate leadership mentoring",
      "Siddharth Hospitality",
      "Hamsa Wears",
      "Kshipra Attire",
      "Center for Leadership and Entrepreneurship",
      "Kalpa Internet Ventures",
      "Omega International College",
    ],
  },

  timeline: {
    title: "The timeline",
    lede: "Phases rather than years. Exact dates have not been confirmed and are deliberately not invented.",
    phases: [
      {
        label: "Early Career",
        detail: "Dubai hospitality with Hyatt International and Qatar Airways. Systems, service, operational excellence.",
      },
      {
        label: "Transition",
        detail: "Into business consulting. Hotels, restaurants and premium guesthouses first, then retail, logistics and education.",
      },
      {
        label: "Major Projects",
        detail: "Hard Rock Hotel in India, City Mall, QSR outlets, a meat processing factory, and the International Hospital in Delhi.",
      },
      {
        label: "2021",
        detail: "The turning point, and the founding of The Bookwishes Club.",
      },
      {
        label: "Recent and Ongoing",
        detail: "Leadership mentoring, hospitality, apparel, education and ventures. Alongside Business Doctor.",
      },
    ],
  },

  vision: {
    label: "Vision",
    text: "[FINAL VISION STATEMENT TO BE PROVIDED]",
  },

  mission: {
    label: "Mission",
    text: "[FINAL MISSION STATEMENT TO BE PROVIDED]",
  },

  closing: {
    headline: "The journey continues.",
    body: "Eighteen years in, the work still starts in the same place. Someone describes a problem that has grown heavier than the system around it, and the first move is still to listen.",
    cta: { label: "Work With Lokesh", href: "/contact" },
  },
} as const;

/* ==========================================================================
   BUSINESS DOCTOR
   ========================================================================== */

export const businessDoctorPage = {
  hero: {
    eyebrow: "Business Doctor",
    headline: "Diagnose before you prescribe.",
    lede: "Business consulting and transformation. Find the cause behind the symptom, then build systems the organization can run without outside help.",
  } satisfies PageHero,

  problem: {
    title: "Why transformation efforts stall.",
    lede: "Not because the ambition was wrong. Usually because the diagnosis was.",
    points: [
      {
        title: "The symptom gets treated instead of the cause",
        body: "A revenue problem is addressed with a promotion, a process problem with a new tool. The visible thing gets attention, and the thing underneath it stays exactly where it was.",
      },
      {
        title: "Simplifying happens before understanding",
        body: "Cutting a role or a product feels like progress. Sometimes it is. Without understanding what that role or product was actually holding up, it frequently is not.",
      },
      {
        title: "The fix depends on the consultant",
        body: "If the new process only runs while somebody from outside is present, it was never a system. It was supervision with a nicer name.",
      },
      {
        title: "Nobody inside can explain how it works",
        body: "When the person who built it cannot describe it, nobody can maintain it. That is the point at which organizations quietly go back to the old way.",
      },
    ],
  },

  approach: {
    title: "The method.",
    lede: "Four steps, in this order. The order is the whole discipline.",
    steps: [
      {
        verb: "Listen",
        body: "Before anything is diagnosed, the problem is described in the words of the people living with it, not in the language of the org chart.",
      },
      {
        verb: "Understand",
        body: "Work backwards to the root cause. What is actually generating this symptom, and what else is that cause holding up?",
      },
      {
        verb: "Simplify",
        body: "Reduce the complexity until the next move is obvious to everyone involved, not only to the people who designed it.",
      },
      {
        verb: "Transform",
        body: "Build the change into systems, habits and responsibilities so that it holds after the engagement ends.",
      },
    ],
  },

  focus: {
    title: "Where the work goes.",
    items: [
      { name: "Strategy", body: "Deciding what the organization is actually for, and what it is deliberately not doing." },
      { name: "Operations", body: "How the work physically gets done, every day, without heroics." },
      { name: "Systems", body: "The structures that make good practice repeatable instead of dependent." },
      { name: "Sales", body: "Pipeline, conversion and the handoffs where deals quietly disappear." },
      { name: "Marketing", body: "Positioning and demand, measured against what actually gets delivered." },
      { name: "Organizational Structure", body: "Reporting lines, decision rights and where accountability currently has nowhere to sit." },
    ],
  },

  offer: {
    title: "Not sure which of these you need?",
    body: "Start with the Business Health Check. It is built for owners who want a clear read on what is slowing the business down, what to fix first, and what can safely wait.",
    cta: { label: "Business Health Check", href: "/services/business-consultation#health-checker" },
    pending: {
      label: "Engagement scope",
      text: "Engagement models, timelines and commercial terms are to be confirmed before the page goes live.",
    },
  },

  closing: {
    body: "The first conversation is about the problem as it actually is, not as it has been described to you. That distinction is usually where the work starts.",
    cta: { label: "Work With Lokesh", href: "/contact" },
  },
} as const;

/* ==========================================================================
   THE BOOKWISHES CLUB
   ========================================================================== */

export const bookwishesPage = {
  hero: {
    eyebrow: "The Bookwishes Club",
    headline: "Learning that changes how you work.",
    lede: "A self development center founded by Lokesh Rohilla in 2021, focused on learning, personal growth, leadership and transformation.",
  } satisfies PageHero,

  origin: {
    title: "Why it exists.",
    body: [
      "The Bookwishes Club was founded in 2021, at the point where the business work and the personal work stopped being separable. What had been learned about helping organizations change was, at that scale, also true of the people doing the changing.",
      "It is a self development center rather than a training provider. That distinction matters. A training provider sells you a day. A development center is interested in what happens in the six months afterwards, when nobody is presenting and the only thing that keeps working is what actually changed.",
    ],
  },

  programs: {
    title: "What it works on.",
    items: [
      { name: "Mindset", body: "The assumptions underneath a decision, and how much of it is worth revisiting." },
      { name: "Self development", body: "Building capability deliberately rather than waiting to need it." },
      { name: "Personal growth", body: "Closing the distance between the person you are and the person you are becoming." },
      { name: "Career", body: "Direction, timing and the honest version of what a next step requires." },
      { name: "Confidence", body: "Not motivation. The specific evidence that makes a thing possible." },
    ],
  },

  experience: {
    title: "How a session actually runs.",
    steps: [
      { verb: "Arrive with the real question", body: "Sessions work when people bring what is actually happening rather than what is safe to present." },
      { verb: "Work on it, not around it", body: "The useful part is usually uncomfortable and usually specific." },
      { verb: "Leave with something to run", body: "An idea that cannot be applied on Monday was not a session, it was a talk." },
      { verb: "Keep the room", body: "A community that keeps practicing after the session ends is the point of the whole thing." },
    ],
  },

  pending: {
    label: "Programs and scale",
    text: "Program structure, session formats and scale of participation are still to be confirmed. No figure is stated anywhere on this site until it is.",
  },

  closing: {
    body: "Whether the question is about a career, a habit or the next decade, the first conversation is the same one.",
    cta: { label: "Work With Lokesh", href: "/contact" },
  },
} as const;

/* ==========================================================================
   LEADERSHIP PROGRAMS
   ========================================================================== */

export const leadershipPage = {
  hero: {
    eyebrow: "Leadership Programs",
    headline: "Leaders and teams that can hold the change.",
    lede: "Leadership, team development, communication, performance and culture. Built for the point where the plan is fine and the people are the problem.",
  } satisfies PageHero,

  premise: {
    title: "The premise.",
    body: [
      "Most leadership problems are not leadership problems. They are the visible edge of a system that nobody designed: unclear decision rights, a communication load that consumes the week, and performance expectations that were never actually agreed out loud.",
      "These programs work on that layer. Not on motivation, and not on personality. On the structures that determine whether a team can do its job on a Thursday.",
    ],
  },

  areas: [
    {
      title: "Leadership",
      body: "What a leader is actually accountable for, and how to be clear about it rather than generally available.",
    },
    {
      title: "Team development",
      body: "Moving a group from individuals who happen to work together into a team that can be relied on.",
    },
    {
      title: "Communication",
      body: "Reducing the load. Fewer meetings, clearer decisions, and information that reaches the right person while it is still useful.",
    },
    {
      title: "Performance",
      body: "Agreeing what good actually means here, then measuring it honestly rather than aspirationally.",
    },
    {
      title: "Culture",
      body: "The unwritten rules that already exist, made explicit enough to be changed.",
    },
  ],

  formats: {
    title: "How it is delivered.",
    items: [
      { name: "Leadership mentoring", body: "Ongoing, one to one, for leaders carrying something specific." },
      { name: "Team sessions", body: "Whole teams, working on the real friction rather than an abstract version of it." },
      { name: "Workshops", body: "Structured, time-boxed, on a single defined problem." },
      { name: "Facilitation", body: "Leading the sessions that already exist but are not yet landing." },
    ],
  },

  pending: {
    label: "Cohorts and delivery",
    text: "Cohort structure, delivery format, duration and commercial terms are to be confirmed before this page goes live.",
  },

  closing: {
    body: "If the plan is already right and the people still cannot carry it, that is the part worth working on.",
    cta: { label: "Work With Lokesh", href: "/contact" },
  },
} as const;

/* ==========================================================================
   EVENTS
   ========================================================================== */

export const eventsPage = {
  hero: {
    eyebrow: "Events",
    headline: "Where we meet.",
    lede: "Workshops, training, talks, Bookwishes events and business sessions. Dates are added here once they are confirmed.",
  } satisfies PageHero,

  formats: [
    {
      name: "Workshops",
      body: "Structured, hands-on, built around one defined business problem. Longer and more practical than a talk.",
      best: "Best for a specific operational or commercial problem.",
    },
    {
      name: "Training",
      body: "Capability building for teams and leadership groups, across a session or a short series.",
      best: "Best when the gap is skill rather than strategy.",
    },
    {
      name: "Talks",
      body: "Longer conversations on transformation, leadership and how systems actually behave.",
      best: "Best for opening a discussion inside an organization.",
    },
    {
      name: "Bookwishes Events",
      body: "Self development gatherings run by The Bookwishes Club.",
      best: "Best for individuals working on themselves.",
    },
    {
      name: "Business Sessions",
      body: "Direct working sessions delivered through Business Doctor.",
      best: "Best for an owner with a live problem and limited time.",
    },
  ],

  pending: {
    label: "Schedule",
    text: "[CONFIRMED UPCOMING DATES TO BE PROVIDED] Nothing is listed here rather than listing a date that might move.",
  },

  closing: {
    body: "To be notified when dates are confirmed, or to bring a session to your organization, the fastest route is a direct conversation.",
    cta: { label: "Work With Lokesh", href: "/contact" },
  },
} as const;

/* ==========================================================================
   INSIGHTS
   ========================================================================== */

export const insightsPage = {
  hero: {
    eyebrow: "Insights",
    headline: "Ideas. Experiences. Perspectives.",
    lede: "Writing and video on business, leadership, self development, transformation, stories and learning.",
  } satisfies PageHero,

  categories: [
    {
      name: "Business",
      description: "Operating realities and the decisions behind them. What works, what quietly does not, and why the two are so often confused.",
    },
    {
      name: "Leadership",
      description: "How leaders and teams actually change how they work, as opposed to how they are asked to.",
    },
    {
      name: "Self Development",
      description: "Awareness, clarity and building capability that survives a difficult week.",
    },
    {
      name: "Transformation",
      description: "What it actually takes for a change to hold once the consultants have gone home.",
    },
    {
      name: "Stories",
      description: "Experiences from inside real engagements, told with the parts that were difficult included.",
    },
    {
      name: "Learning",
      description: "Ideas worth carrying into the next quarter rather than the next talk.",
    },
  ],

  /** Editorial direction, written as intent rather than as fake articles. */
  direction: {
    title: "What gets published here.",
    body: [
      "Pieces drawn from live work rather than from theory, because the useful details are the ones nobody puts in a case study.",
      "Written to be read once and acted on, not skimmed and forgotten. If a piece cannot be applied on Monday, it does not get written.",
    ],
  },

  pending: {
    label: "Published pieces",
    text: "[PUBLISHED ARTICLES AND VIDEOS TO BE PROVIDED] This section stays empty until there is real writing to publish. No placeholder articles or invented headlines are used as filler.",
  },
} as const;

/* ==========================================================================
   GALLERY
   ========================================================================== */

export const galleryPage = {
  hero: {
    eyebrow: "Gallery",
    headline: "Photographs and video.",
    lede: "From the work, the sessions, and both initiatives.",
  } satisfies PageHero,

  pending: {
    label: "Imagery",
    text: "[GALLERY IMAGERY AND VIDEO TO BE PROVIDED] Slots are reserved below with their exact dimensions so real assets can drop in without any layout shift.",
  },

  /** What the gallery is intended to hold, written as a shot list. */
  shotList: [
    { label: "Sessions in progress", spec: "4:3, 1400x1050", note: "Working sessions, hands and notebooks. Observational, never posed." },
    { label: "The Bookwishes Club community", spec: "16:9, 1920x1080", note: "A room mid session with people engaged. Warm, not staged." },
    { label: "Leadership programs", spec: "4:3, 1400x1050", note: "Small groups, facilitators at the edge rather than centre stage." },
    { label: "Consulting work", spec: "4:3, 1400x1050", note: "Printed process diagrams and conversations in progress." },
  ],
} as const;

/* ==========================================================================
   CONTACT
   ========================================================================== */

export const contactPage = {
  hero: {
    eyebrow: "Contact",
    headline: "Start with the problem as it actually is.",
    lede: "One conversation is a reasonable place to start. Bring the situation as it is, not as it has been described to you.",
  } satisfies PageHero,

  /**
   * Form definition. Labels live here so the markup never uses a placeholder
   * as a label, and so validation rules sit beside the fields they govern.
   */
  form: {
    path: {
      label: "What is this about?",
      type: "radio" as const,
      required: true,
      options: [
        { value: "business", label: "My business", hint: "Strategy, operations, systems, sales or marketing." },
        { value: "leadership", label: "My team", hint: "Leadership, communication, performance or culture." },
        { value: "personal", label: "Myself", hint: "Mindset, career, confidence or personal growth." },
      ],
    },
    name: {
      label: "Name",
      type: "text" as const,
      required: true,
      autoComplete: "name" as const,
    },
    email: {
      label: "Email",
      type: "email" as const,
      required: true,
      autoComplete: "email" as const,
    },
    organisation: {
      label: "Organization",
      type: "text" as const,
      required: false,
      autoComplete: "organization" as const,
      help: "Optional. Useful if this is about a team or a company.",
    },
    message: {
      label: "What is happening?",
      type: "textarea" as const,
      required: true,
      help: "The more concrete this is, the more useful the first reply will be.",
    },
  },

  validation: {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    message: "Please describe what is happening, even briefly.",
    path: "Please choose which of the three this is about.",
  },

  direct: {
    title: "Prefer to write directly?",
    body: "Direct contact details are being confirmed and will appear here.",
    pending: "[EMAIL, PHONE AND LOCATION TO BE PROVIDED]",
  },
} as const;

/* ==========================================================================
   BUSINESS HEALTH CHECK
   ========================================================================== */

export const healthCheckPage = {
  hero: {
    eyebrow: "Business Health Check",
    headline: "Find out what is actually slowing you down.",
    lede: "A focused diagnostic for owners who would rather know than guess. What is broken, what to fix first, and what can safely wait.",
  } satisfies PageHero,

  why: {
    title: "Why it exists.",
    body: [
      "Most business problems arrive described as symptoms. Sales are soft, the team is slow, margins are wrong. Each of those is real and none of them is the cause, and treating them directly is how organizations spend a year and arrive back where they started.",
      "The Health Check exists to get to the cause quickly and to say plainly what is worth doing about it. Sometimes the answer is that nothing needs to change yet, and that is a legitimate result.",
    ],
  },

  covers: {
    title: "What it covers.",
    items: [
      { name: "Strategy", body: "Whether the business is aimed at one thing or three." },
      { name: "Operations", body: "How work actually moves, and where it queues." },
      { name: "Systems", body: "What runs on people instead of on process." },
      { name: "Sales", body: "The pipeline and the handoffs where deals disappear." },
      { name: "Marketing", body: "Positioning, and whether demand matches what gets delivered." },
      { name: "Organizational Structure", body: "Decision rights and where accountability currently has nowhere to sit." },
    ],
  },

  output: {
    title: "What you leave with.",
    steps: [
      { verb: "A plain diagnosis", body: "The cause behind the symptom, described in language you can repeat to your team." },
      { verb: "A priority order", body: "What to fix first, what is safe to defer, and what is not worth fixing at all." },
      { verb: "The next three moves", body: "Specific enough to start on. Not a transformation programme." },
    ],
  },

  pending: {
    label: "Format, scope and fees",
    text: "[FORMAT, DURATION, SCOPE AND FEES TO BE PROVIDED] Nothing is charged or committed on this page until the offer is confirmed.",
  },

  closing: {
    body: "If the answer is that the problem is not where you think it is, that is a result worth having.",
    cta: { label: "Work With Lokesh", href: "/contact" },
  },
} as const;
