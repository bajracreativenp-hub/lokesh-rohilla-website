/**
 * PAGE CONTENT
 * ===========================================================================
 * Every section of every page, in one file.
 *
 * Each page is a hero plus an ordered list of sections. Sections have an anchor
 * so the in-page navigation rail and the redirect map can both point at them,
 * and each one carries its own copy rather than being generated from a template.
 *
 * BLOCK KINDS
 *   prose    a heading and body paragraphs
 *   cards    a grid of short items, optional whole-card links
 *   steps    a grid where the label is a verb, not a number
 *   list     a numbered index, set as rows rather than bullets
 *   note     a visible statement that something is unconfirmed
 *   cta      a dark band with one button
 *   form     a lead capture form, wired to a client component
 *   quiz     the interactive business health checker
 *   frames   reserved image or video frames with their real aspect ratios
 *
 * GROUNDING RULE, absolute: no invented testimonials, reviews, ratings,
 * statistics, dates, prices, client names or outcomes. Unconfirmed items render
 * through a `note` block, visibly. Delete the note only when real content
 * replaces it.
 */

/**
 * One phase in the journey timeline.
 *
 * THERE IS NO `year` AND NO `date` FIELD, AND THAT IS DELIBERATE.
 *
 * THE OBVIOUS LAYOUT FOR THIS IS BUILT ENTIRELY ON DATES: a black pill reading
 * "2021", a large heading reading "May/2021", and a giant ghosted year numeral
 * behind everything. Only one year in this career has ever been confirmed, 2021 for
 * the founding of The Bookwishes Club. Every other year and month would have to be
 * invented to fill the layout.
 *
 * So the ordinal carries the position, the phase name carries the label, and the
 * confirmed year appears inside the body text where it belongs. The composition is
 * preserved exactly; only the invented numbers are absent. Adding a `year` field
 * here is the single change that would let the date-led version be built literally,
 * and it should only happen when the client confirms real years.
 */
/**
 * One editorial photograph with an optional caption.
 *
 * Added because every service page was a wall of text: overview prose, then cards,
 * then steps, with nothing to look at on any of them. Trust on a services page is
 * carried by evidence of the work, which is a photograph or it is nothing.
 *
 * `spec` is the exact pixel size and `ratio` the CSS aspect ratio. Both are
 * recorded so the reserved box matches the delivered file and a real image drops in
 * with no reflow. `ratio` is the CSS value, `spec` is for the client.
 */
export type Photo = {
  label: string;
  spec: string;
  ratio: string;
  /** Art direction, surfaced as a data attribute for the asset manifest. */
  direction: string;
  caption?: string;
  /**
   * How much room the photograph gets beside the copy.
   *
   * "wide"  photograph and caption stacked, photograph full width
   * "half"  photograph beside a caption or paragraph
   */
  layout: "wide" | "half";
  /**
   * Pairs this photograph with the text block it sits next to. `false` gives a
   * standalone band, which is what a page with no adjacent prose wants.
   */
  paired?: boolean;
};

export type TimelinePhase = {
  /** Two digit position, "01" to "05". A count, not a date. */
  ordinal: string;
  /** The phase name. */
  label: string;
  body: string;
  /** Circular image on the far side. */
  image: { label: string; spec: string; direction: string };
};

export type Block =
  | { kind: "prose"; title: string; paragraphs: string[] }
  | {
      kind: "cards";
      title: string;
      lede?: string;
      items: { title: string; body: string; meta?: string; href?: string }[];
    }
  | { kind: "steps"; title: string; lede?: string; items: { verb: string; body: string }[] }
  | { kind: "list"; title: string; lede?: string; items: string[] }
  | { kind: "note"; title: string; text: string }
  | { kind: "cta"; title: string; body: string; label: string; href: string }
  | {
      kind: "timeline";
      title: string;
      lede?: string;
      items: TimelinePhase[];
    }
  | { kind: "photo"; title: string; photo: Photo }
  | { kind: "form"; title: string; form: string }
  | { kind: "quiz" }
  | {
      kind: "search";
      categories: { slug: string; label: string; note: string }[];
    }
  | {
      kind: "frames";
      title: string;
      lede?: string;
      items: { label: string; spec: string; ratio: string; meta?: string }[];
    };

export type PageSection = {
  /** Anchor. Also the redirect target suffix. */
  id: string;
  /** Shown in the in-page rail. */
  label: string;
  /** The section heading itself. */
  title: string;
  /** Optional line under the heading. */
  lede?: string;
  /** Dark band, for rhythm. At most two per page. */
  tone?: "canvas" | "surface" | "dark";
  blocks: Block[];
};

export type PageDef = {
  href: string;
  eyebrow: string;
  title: string;
  lede: string;
  /** One line, used on the homepage platform grid and in search. */
  summary: string;
  sections: PageSection[];
};

/* ==========================================================================
   MY STORY  /about
   ========================================================================== */

const aboutPage: PageDef = {
  href: "/about",
  eyebrow: "About",
  title: "The journey so far.",
  summary: "The story, the journey, the philosophy and the standards held to.",
  lede: "Eighteen years across hospitality, consulting and education. The biography in full, rather than a summary.",
  sections: [
    {
      id: "story",
      label: "My Story",
      title: "How this started.",
      lede: "Hospitality taught systems. Consulting taught diagnosis. Education taught both.",
      blocks: [
        {
          kind: "prose",
          title: "The first sixteen years",
          paragraphs: [
            "Lokesh Rohilla began in hospitality with Hyatt International and Qatar Airways, in Dubai. It is an industry that does not tolerate ambiguity: a room is either ready or it is not, a service is either delivered or it is not. That is an unusually honest education in what a system actually is.",
            "The move into business consulting came through hotels, restaurants and premium guesthouses first, then retail, logistics and education. Each new sector repeated the same lesson from a different angle. The problem is almost never the people. It is the structure the problem is happening inside.",
          ],
        },
        {
          kind: "cards",
          title: "Documented engagements",
          lede: "Described only as far as the record goes.",
          items: [
            { title: "Hard Rock Hotel", meta: "India", body: "Helped bring the first Hard Rock Hotel to India." },
            { title: "City Mall", body: "Managed the pre-opening." },
            { title: "Quick Service Restaurants", body: "Launched multiple outlets." },
            { title: "Meat Processing", body: "Set up a meat processing factory." },
            { title: "International Hospital", meta: "Delhi", body: "Supported the operational setup." },
          ],
        },
      ],
    },
    {
      id: "journey",
      label: "Journey",
      title: "Eighteen years, in phases.",
      lede: "Named by phase rather than by year. Exact dates have not been confirmed and are deliberately not invented.",
      blocks: [
        {
          kind: "timeline",
          title: "The phases",
          lede: "Move through with the arrows, or jump to a phase. Everything is reachable by keyboard and by screen reader, and the whole timeline is laid out in full on a phone.",
          items: [
            {
              ordinal: "01",
              label: "Early Career",
              body: "Dubai hospitality with Hyatt International and Qatar Airways. Systems, service, operational excellence.",
              image: {
                label: "Hospitality career",
                spec: "1200x1200",
                direction:
                  "A hotel or airline interior at work, staff in frame rather than an empty corridor. Natural light, candid, not a stock handshake.",
              },
            },
            {
              ordinal: "02",
              label: "Transition",
              body: "Into business consulting. Hotels, restaurants and premium guesthouses first, then retail, logistics and education.",
              image: {
                label: "Consulting work",
                spec: "1200x1200",
                direction:
                  "Lokesh with a client in their own setting, a notebook or printed process visible. Real premises, not a meeting room.",
              },
            },
            {
              ordinal: "03",
              label: "Major Projects",
              body: "Hard Rock Hotel in India, City Mall, Quick Service Restaurant outlets, a meat processing factory, and the International Hospital in Delhi.",
              image: {
                label: "Major projects",
                spec: "1200x1200",
                direction:
                  "Exterior or atrium of a large hospitality or retail project. Wide, architectural, daylight. No people posing.",
              },
            },
            {
              ordinal: "04",
              label: "2021",
              body: "The turning point, and the founding of The Bookwishes Club as a self development center.",
              image: {
                label: "Founding The Bookwishes Club",
                spec: "1200x1200",
                direction:
                  "A first session or an empty room set up for one. Warm light, a small number of people, the start of something.",
              },
            },
            {
              ordinal: "05",
              label: "Recent and Ongoing",
              body: "Leadership mentoring, hospitality, apparel, education and ventures. Alongside consulting practice.",
              image: {
                label: "Ongoing work",
                spec: "1200x1200",
                direction:
                  "A mentoring conversation, two or three people, mid discussion. Ordinary room, natural light.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "philosophy",
      label: "Philosophy",
      title: "Listen. Understand. Simplify. Transform.",
      lede: "Four steps, in that order. The order is the discipline.",
      tone: "dark",
      blocks: [
        {
          kind: "prose",
          title: "The listening leader",
          paragraphs: [
            "Most organizations try to simplify before they understand, because simplifying is visible and understanding is not. That inversion is where transformation efforts usually come apart.",
            "Clarity before prescription, every time.",
          ],
        },
        {
          kind: "steps",
          title: "The method",
          items: [
            { verb: "Listen", body: "Before diagnosing anything, make space for the real problem to be said out loud." },
            { verb: "Understand", body: "Look for the root cause rather than the symptom that is easiest to point at." },
            { verb: "Simplify", body: "Reduce complexity until the next move is obvious to everyone involved." },
            { verb: "Transform", body: "Build the change into systems and habits so it holds afterwards." },
          ],
        },
      ],
    },
    {
      id: "vision-mission",
      label: "Vision & Mission",
      title: "Vision and mission.",
      lede: "A formal vision and mission statement has not been supplied yet.",
      blocks: [
        {
          kind: "note",
          title: "Vision",
          text: "[FINAL VISION STATEMENT TO BE PROVIDED] Nothing has been written in its place. A guessed vision statement is worse than an acknowledged gap, because it would be published as though it were Lokesh's own words.",
        },
        {
          kind: "note",
          title: "Mission",
          text: "[FINAL MISSION STATEMENT TO BE PROVIDED] Same reasoning. This slot stays visibly empty until the client supplies it.",
        },
      ],
    },
    {
      id: "media",
      label: "Media & Press",
      title: "Media and press.",
      lede: "Coverage, interviews and features, once confirmed.",
      blocks: [
        {
          kind: "note",
          title: "No coverage listed",
          text: "[CONFIRMED PRESS AND MEDIA COVERAGE TO BE PROVIDED] No publication names, headlines or dates are shown here, because none have been confirmed. Inventing a Forbes or NYT mention would be the single most damaging thing this site could do to Lokesh's credibility.",
        },
        {
          kind: "cta",
          title: "Media enquiries",
          body: "Journalists and podcasters can reach Lokesh through the contact page.",
          label: "Contact Lokesh",
          href: "/contact",
        },
      ],
    },
    {
      id: "awards",
      label: "Awards",
      title: "Awards and recognition.",
      lede: "Held to the same standard as everything else on this page.",
      blocks: [
        {
          kind: "note",
          title: "Nothing listed",
          text: "[AWARDS AND RECOGNITION TO BE PROVIDED] No award names, issuing bodies or years appear here until the client confirms them.",
        },
      ],
    },
  ],
};

/* ==========================================================================
   BUSINESS CONSULTATION  /services/business-consultation
   ========================================================================== */

const businessConsultationPage: PageDef = {
  href: "/services/business-consultation",
  eyebrow: "Services",
  title: "Diagnosis before prescription.",
  summary: "Diagnosis first. Business consulting and transformation.",
  lede: "Business consulting and transformation. Most of the work starts by finding out what the real problem is, because it is rarely the one that was booked.",
  sections: [
    {
      id: "overview",
      label: "Overview",
      title: "What this practice does.",
      lede: "Businesses stall at transformation for one predictable reason, and it is not a lack of effort.",
      blocks: [
        {
          kind: "prose",
          title: "The premise",
          paragraphs: [
            "Organizations do not fail at transformation because people lack energy. They stall because the work starts with a solution, and the solution gets chosen before anyone agrees on the problem.",
            "By the time the real cause surfaces there is already a program attached to it, a budget approved against it, and a timeline everyone is defending. Changing direction at that point costs more than starting over, which is why the argument happens late and gets settled by whoever is loudest.",
            "This practice exists to reverse that order.",
          ],
        },
        {
          kind: "cards",
          title: "What an engagement is",
          items: [
            { title: "A diagnosis you can act on", body: "Enough work to know what the real problem is, before anything is recommended." },
            { title: "A plan argued, not assumed", body: "Sequencing defended rather than asserted, so the first step is genuinely the first step." },
            { title: "Work alongside your people", body: "A plan handed over and forgotten is not a transformation." },
            { title: "Your team owns it at the end", body: "If they cannot run it without me, it has not been built properly." },
          ],
        },
      ],
    },
    {
      id: "how-we-help",
      label: "How We Help",
      title: "Where transformation usually stalls.",
      lede: "Not on effort. On the order in which things get decided.",
      blocks: [
        {
          kind: "steps",
          title: "The order that avoids it",
          items: [
            { verb: "Listen", body: "Make space for the real problem to be said out loud, in the room, without being solved yet." },
            { verb: "Understand", body: "Find the root cause rather than the symptom that is easiest to point at." },
            { verb: "Simplify", body: "Reduce the complexity until the next move is obvious to everyone involved." },
            { verb: "Transform", body: "Build the change into systems and habits so it holds after the engagement ends." },
          ],
        },
        {
          kind: "cards",
          title: "What this looks like in practice",
          items: [
            { title: "Strategy that survives contact", body: "Decisions made against what the organization can actually deliver, not against what the plan assumes." },
            { title: "Operations that need no heroics", body: "Work that gets done on a normal week by ordinary people, without someone rescuing it." },
            { title: "Systems instead of effort", body: "Good practice made repeatable, so it does not depend on who happens to be in the room." },
            { title: "Teams that can hold the change", body: "The human layer, which is where most transformations are lost." },
          ],
        },
        {
          kind: "photo",
          title: "The work, in the client's own setting",
          photo: {
            label: "Consulting engagement in a client's premises",
            spec: "16:9, 1920x1080",
            ratio: "16 / 9",
            layout: "wide",
            direction:
              "Lokesh with a client team in their own premises, a printed process or a whiteboard visible. Natural light, people mid discussion rather than posed. Not a handshake, not a stock boardroom.",
            caption:
              "Every engagement runs in the client's own setting. What is left behind is a process they own, not a deck they were shown.",
          },
        },
      ],
    },
    {
      id: "health-checker",
      label: "Business Health Checker",
      title: "Ten questions about your company.",
      lede: "Answer honestly and the page will tell you which area to look at first. It takes about three minutes and needs nothing from us.",
      tone: "dark",
      blocks: [{ kind: "quiz" }],
    },
    {
      id: "transformation-programs",
      label: "Transformation Programs",
      title: "Six areas where the work usually starts.",
      lede: "Each one begins with a diagnosis, not a solution.",
      blocks: [
        {
          kind: "cards",
          title: "The six areas",
          items: [
            { title: "Strategy", body: "Deciding what the organization is for, and what it is deliberately not doing." },
            { title: "Operations", body: "How work physically gets done, every day, without heroics." },
            { title: "Systems", body: "The structures that make good practice repeatable rather than dependent." },
            { title: "Sales", body: "Pipeline, conversion, and the handoffs where deals quietly disappear." },
            { title: "Marketing", body: "Positioning and demand, measured against what actually gets delivered." },
            { title: "Organizational Structure", body: "Reporting lines, decision rights, and where accountability currently has nowhere to sit." },
          ],
        },
      ],
    },
    {
      id: "case-studies",
      label: "Case Studies",
      title: "Documented engagements.",
      lede: "Described exactly as far as the record goes.",
      blocks: [
        {
          kind: "cards",
          title: "Selected engagements",
          items: [
            { title: "Hard Rock Hotel", meta: "India", body: "Helped bring the first Hard Rock Hotel to India." },
            { title: "City Mall", body: "Managed the pre-opening." },
            { title: "Quick Service Restaurants", body: "Launched multiple Quick Service Restaurant outlets." },
            { title: "Meat Processing", body: "Set up a meat processing factory." },
            { title: "International Hospital", meta: "Delhi", body: "Supported the operational setup." },
          ],
        },
        {
          kind: "note",
          title: "No outcomes claimed",
          text: "No metrics, percentages, revenue figures or client names appear against any engagement above, because none have been confirmed. A case study that invents its own results is not a case study.",
        },
      ],
    },
    {
      id: "clients",
      label: "Clients",
      title: "Organizations worked with.",
      lede: "Named only where permission to do so has been given.",
      blocks: [
        {
          kind: "list",
          title: "Confirmed engagements",
          items: [
            "Siddharth Hospitality",
            "Hamsa Wears",
            "Kshipra Attire",
            "Center for Leadership and Entrepreneurship",
            "Kalpa Internet Ventures",
            "Omega International College",
          ],
        },
        {
          kind: "note",
          title: "A note on logos",
          text: "Client logos are not shown until written permission is on file for each one. An implied endorsement is not the same as a granted one.",
        },
      ],
    },
    {
      id: "video-testimonials",
      label: "Video Testimonials",
      title: "Video testimonials.",
      lede: "Real clients, filmed, on the record.",
      blocks: [
        {
          kind: "frames",
          title: "Awaiting real footage",
          lede: "16:9 frames are reserved for each video. No placeholder names, quotes or stock footage are used here.",
          items: [
            { label: "Client one", spec: "1920x1080", ratio: "16 / 9" },
            { label: "Client two", spec: "1920x1080", ratio: "16 / 9" },
            { label: "Client three", spec: "1920x1080", ratio: "16 / 9" },
          ],
        },
        {
          kind: "note",
          title: "Awaiting real footage",
          text: "[REAL VIDEO TESTIMONIALS TO BE PROVIDED] Fabricated testimonials would be both dishonest and, in practice, obvious.",
        },
      ],
    },
    {
      id: "free-masterclass",
      label: "Free Masterclass",
      title: "One problem, one room, taken all the way.",
      lede: "Free to attend, with no obligation to engage any service afterwards.",
      blocks: [
        {
          kind: "cards",
          title: "What a masterclass is",
          items: [
            { title: "One problem", body: "Not a survey of a subject. A single problem, taken all the way." },
            { title: "Interactive", body: "You work on your own situation, not on the facilitator's examples." },
            { title: "Aimed", body: "Specific enough that you can tell before registering whether it is for you." },
            { title: "Free", body: "And free means free. There is a sales pitch afterwards, because there is not one." },
          ],
        },
        { kind: "form", title: "Register free", form: "masterclass" },
      ],
    },
    {
      id: "work-with-me",
      label: "Work With Me",
      title: "Start a consulting conversation.",
      lede: "A short brief is enough. A full proposal is not required at this stage.",
      blocks: [
        {
          kind: "prose",
          title: "What happens after you get in touch",
          paragraphs: [
            "You describe the situation as it actually is. In return you get an answer that engages with it, including, quite often, the answer that this is not something Lokesh does.",
            "If there is a fit, the next step is a scoping conversation rather than a proposal. Proposals written before anyone has looked at the business are how both sides waste a month.",
          ],
        },
        {
          kind: "note",
          title: "Not an engagement yet",
          text: "[SCOPE, DURATION AND COMMERCIAL TERMS TO BE CONFIRMED] No fee, duration or package is published here. Quoting a number before seeing the problem would be a guess presented as a price.",
        },
        {
          kind: "cta",
          title: "Make contact",
          body: "The general contact form reaches Lokesh directly. Corporate enquiries have their own route on the Leaders and Team Development page.",
          label: "Work With Lokesh",
          href: "/contact",
        },
      ],
    },
  ],
};

/* ==========================================================================
   SELF-DEVELOPMENT PROGRAMS  /services/self-development
   ========================================================================== */

const selfDevelopmentPage: PageDef = {
  href: "/services/self-development",
  eyebrow: "Services",
  title: "A self development center, founded 2021.",
  summary: "A self development center founded in 2021. Learning that changes how you work.",
  lede: "The Bookwishes Club was founded in 2021 as a self development center. Not a motivation program: nobody leaves a session feeling inspired and then behaves exactly as before on Monday.",
  sections: [
    {
      id: "overview",
      label: "Overview",
      title: "What this is, and is not.",
      lede: "The work is closer to calibration than inspiration.",
      tone: "dark",
      blocks: [
        {
          kind: "prose",
          title: "What this is not",
          paragraphs: [
            "This is not a motivation program. Inspiration was never the missing part.",
            "The work here is noticing what you actually do under pressure, deciding whether it is what you want, and building something that survives a difficult week.",
          ],
        },
        {
          kind: "steps",
          title: "How a session runs",
          items: [
            { verb: "Diagnose", body: "Work out what you default to under pressure, before deciding what to change." },
            { verb: "Practise", body: "The skill is rehearsed in the room, not just described." },
            { verb: "Apply", body: "One thing to use in the following week. One, not five." },
            { verb: "Review", body: "What actually changed, including when the honest answer is nothing." },
          ],
        },
      ],
    },
    {
      id: "programs",
      label: "Programs",
      title: "Four program areas.",
      lede: "Each one is a distinct body of work, not a module of a bigger course.",
      blocks: [
        {
          kind: "cards",
          title: "The areas",
          items: [
            { title: "Public Speaking", body: "Saying the point first, handling the nerves, and preparing for the question you hoped nobody would ask.", href: "/services/self-development#public-speaking" },
            { title: "Personality Development", body: "Awareness of your own patterns before anyone tries to adjust them. Clarity, not reinvention.", href: "/services/self-development#personality-development" },
            { title: "Law of Attraction", body: "The honest half of it, which is sustained attention, framed without the promises.", href: "/services/self-development#law-of-attraction" },
            { title: "Community", body: "The room after the session, which is where a training day either holds or does not.", href: "/services/self-development#community" },
          ],
        },
        {
          kind: "photo",
          title: "A session, with the room actually working",
          photo: {
            label: "Self development workshop in session",
            spec: "16:9, 1920x1080",
            ratio: "16 / 9",
            layout: "wide",
            direction:
              "A small workshop group mid session, seated in a circle or at tables rather than in rows facing a screen. Lokesh speaking or listening, not posing at the front. Warm daylight, ordinary room, people engaged with their own work.",
            caption:
              "The room after the session matters as much as the session. This is where a training day either holds or quietly does not.",
          },
        },
      ],
    },
    {
      id: "public-speaking",
      label: "Public Speaking",
      title: "Say the thing clearly.",
      lede: "Public speaking training for people whose work depends on being understood.",
      blocks: [
        {
          kind: "cards",
          title: "What it works on",
          items: [
            { title: "Structure", body: "Saying the point first, then supporting it, instead of building up to it." },
            { title: "Nerves", body: "The physical reality of being looked at, and what is actually happening in the room." },
            { title: "Questions", body: "The part nobody prepares for, which is most of what an audience remembers." },
            { title: "Clarity", body: "Removing the sentence you added because the silence felt long." },
          ],
        },
      ],
    },
    {
      id: "personality-development",
      label: "Personality Development",
      title: "Awareness before adjustment.",
      lede: "Not a new personality. A clearer view of the current one.",
      blocks: [
        {
          kind: "cards",
          title: "What it covers",
          items: [
            { title: "Awareness", body: "How you behave under pressure, and what that behaviour is protecting." },
            { title: "Confidence", body: "Built from specific evidence rather than from positive thinking." },
            { title: "Communication", body: "Saying the difficult thing without either avoiding it or over-explaining." },
            { title: "Decisions", body: "The pattern underneath the choices you keep second guessing." },
          ],
        },
      ],
    },
    {
      id: "law-of-attraction",
      label: "Law of Attraction",
      title: "Attraction, honestly framed.",
      lede: "What this does and does not claim.",
      blocks: [
        {
          kind: "prose",
          title: "The useful half",
          paragraphs: [
            "The part of this that holds up is attention. What you consistently notice, you consistently act on. A system that keeps your attention on the work rather than on the noise changes outcomes. That is not mysticism, it is just focus.",
          ],
        },
        {
          kind: "prose",
          title: "The half that does not",
          paragraphs: [
            "Thinking about something is not the same as producing it. No framework here will promise that a specific outcome follows from a specific mindset. Anyone who tells you otherwise is selling something.",
            "What gets taught is the discipline of sustained attention, and the honesty to notice when effort and outcome have stopped being connected.",
          ],
        },
      ],
    },
    {
      id: "community",
      label: "Community",
      title: "The room after the session.",
      lede: "A training provider sells you a day. A development center is interested in the six months afterwards.",
      blocks: [
        {
          kind: "cards",
          title: "How it holds",
          items: [
            { title: "Practice, not attendance", body: "Members who apply one thing beat members who attend everything." },
            { title: "Peer reference", body: "The person in the group who has already solved your problem is worth more than the facilitator." },
            { title: "Honest check-ins", body: "What actually changed, including when the answer is nothing." },
          ],
        },
      ],
    },
    {
      id: "success-stories",
      label: "Success Stories",
      title: "Success stories.",
      lede: "Real members, told with their names and their permission.",
      blocks: [
        {
          kind: "note",
          title: "Awaiting real stories",
          text: "[REAL SUCCESS STORIES TO BE PROVIDED] Nothing appears here until a member has agreed to be named. Anonymised composites would be a different thing entirely, and would be labelled as such.",
        },
      ],
    },
    {
      id: "articles-videos",
      label: "Articles & Videos",
      title: "Articles and videos.",
      lede: "Material worth using, not just consuming.",
      blocks: [
        {
          kind: "cards",
          title: "From the blog",
          items: [
            { title: "Personal Development", body: "Awareness and capability that survives a difficult week.", href: "/blog#categories" },
            { title: "Mindset & Motivation", body: "The assumptions underneath a decision.", href: "/blog#categories" },
            { title: "Public Speaking", body: "Saying the thing clearly.", href: "/blog#categories" },
          ],
        },
        {
          kind: "cta",
          title: "Everything published",
          body: "The full index of writing and video, searchable by category.",
          label: "Visit the Blog",
          href: "/blog",
        },
      ],
    },
    {
      id: "join",
      label: "Join",
      title: "Join the programs.",
      lede: "Membership details, once confirmed.",
      tone: "dark",
      blocks: [
        {
          kind: "cards",
          title: "Joining gives you",
          items: [
            { title: "Sessions", body: "Public speaking, personality development and the attention work, as they are scheduled." },
            { title: "Community access", body: "The group between sessions, which is where most of the value actually lands." },
            { title: "Recorded material", body: "Where a session has been recorded, access to the recording." },
            { title: "Resources", body: "The articles and material published for members." },
          ],
        },
        {
          kind: "note",
          title: "Terms pending",
          text: "[MEMBERSHIP FEES, JOINING TERMS AND SCHEDULE TO BE PROVIDED] No fee, duration or cancellation policy is stated here, because none has been confirmed. A club that cannot say what membership costs cannot honestly ask anyone to join.",
        },
        {
          kind: "cta",
          title: "Want first notice?",
          body: "The newsletter reaches members before a batch is public.",
          label: "Join the newsletter",
          href: "/contact#join-newsletter",
        },
      ],
    },
    {
      id: "upcoming-batches",
      label: "Upcoming Batches",
      title: "Upcoming batch details.",
      lede: "Dates, seats and formats, once confirmed.",
      blocks: [
        {
          kind: "note",
          title: "No dates listed",
          text: "[CONFIRMED BATCH DATES, SEAT COUNTS AND FEES TO BE PROVIDED] Nothing is listed rather than listing a date that might move.",
        },
      ],
    },
  ],
};

/* ==========================================================================
   LEADERS & TEAM DEVELOPMENT  /services/leaders-teams
   ========================================================================== */

const leadersTeamsPage: PageDef = {
  href: "/services/leaders-teams",
  eyebrow: "Services",
  title: "Leaders and teams that can hold the change.",
  summary: "Leadership, communication, performance and culture for organizations.",
  lede: "Built for the point where the plan is fine and the people are the problem.",
  sections: [
    {
      id: "overview",
      label: "Overview",
      title: "The premise.",
      lede: "Most leadership problems are not leadership problems.",
      tone: "dark",
      blocks: [
        {
          kind: "prose",
          title: "The visible edge of an undesigned system",
          paragraphs: [
            "They are the visible edge of a system that nobody designed: unclear decision rights, a communication load that consumes the week, and performance expectations that were never actually agreed out loud.",
            "These programs work on that layer. Not on motivation, and not on personality. On the structures that determine whether a team can do its job on a Thursday.",
          ],
        },
      ],
    },
    {
      id: "leadership-programs",
      label: "Leadership Programs",
      title: "Leadership programs.",
      lede: "One to one mentoring and group cohorts, for leaders carrying something specific.",
      blocks: [
        {
          kind: "cards",
          title: "Formats",
          items: [
            { title: "Leadership Mentoring", body: "Ongoing and one to one, for a defined problem rather than general ambition." },
            { title: "Cohort Programs", body: "A group of leaders working the same themes at their own pace." },
            { title: "Intensive Sessions", body: "Short, high density, on one question." },
            { title: "Advisory Retainers", body: "Ongoing access for leadership teams who need a sounding board." },
          ],
        },
        {
          kind: "photo",
          title: "Mentoring, one conversation at a time",
          photo: {
            label: "Leadership mentoring conversation",
            spec: "16:9, 1920x1080",
            ratio: "16 / 9",
            layout: "wide",
            direction:
              "Two people in a genuine conversation across a table, not a workshop and not a posed handshake. Lokesh listening more than speaking. Ordinary room, daylight from a window, notebooks on the table.",
            caption:
              "Most of this work happens in single conversations. The outcome is a leader who can hold the decision without being asked.",
          },
        },
      ],
    },
    {
      id: "team-development",
      label: "Team Development",
      title: "Teams that can be relied on.",
      lede: "Moving a group from individuals who happen to work together into something that holds under pressure.",
      blocks: [
        {
          kind: "cards",
          title: "What changes",
          items: [
            { title: "Roles", body: "Who is actually accountable for what, written down rather than assumed." },
            { title: "Handoffs", body: "The moments where work is dropped, and what each of them is really about." },
            { title: "Disagreement", body: "A way to disagree that does not require a meeting to be defended." },
            { title: "Trust", body: "Built by predictability rather than by sentiment." },
          ],
        },
      ],
    },
    {
      id: "communication-training",
      label: "Communication Training",
      title: "Less communication, better received.",
      lede: "Most organizations have a communication load problem, not a communication willingness problem.",
      blocks: [
        {
          kind: "cards",
          title: "The work",
          items: [
            { title: "Cutting the load", body: "Fewer meetings that exist because nobody decided not to have them." },
            { title: "Decision records", body: "What was decided, by whom, and what would reverse it." },
            { title: "Timing", body: "Information reaching the right person while it is still useful." },
            { title: "Upward", body: "Bad news travelling faster than good news is a structural problem, not a personality one." },
          ],
        },
      ],
    },
    {
      id: "performance-improvement",
      label: "Performance Improvement",
      title: "Agree what good actually means.",
      lede: "Performance conversations fail because nobody defined the standard out loud.",
      blocks: [
        {
          kind: "prose",
          title: "Where it usually breaks",
          paragraphs: [
            "Expectations live in the head of whoever set them. Two people then manage to the same role with completely different definitions of success, and both consider the other unreasonable.",
            "The work is unglamorous. Write the standard down, agree what evidence counts, and decide in advance what happens when it is missed.",
          ],
        },
        {
          kind: "steps",
          title: "The sequence",
          items: [
            { verb: "Define", body: "State the standard in terms someone else could check." },
            { verb: "Agree", body: "Confirm it with the person, not about them." },
            { verb: "Measure", body: "Pick the evidence before the conversation, not after." },
            { verb: "Review", body: "On a schedule, whether or not there is news." },
          ],
        },
      ],
    },
    {
      id: "organizational-culture",
      label: "Organizational Culture",
      title: "The unwritten rules.",
      lede: "Every organization has a culture. It is simply the one that already exists, written down or not.",
      blocks: [
        {
          kind: "prose",
          title: "Making it explicit",
          paragraphs: [
            "The useful exercise is not a values workshop. It is to write down what this organization actually rewards, using the last three difficult decisions as evidence, and then compare that to what it says it values.",
            "The gap between those two documents is the culture. Everything else is branding.",
          ],
        },
      ],
    },
    {
      id: "corporate-workshops",
      label: "Corporate Workshops",
      title: "Corporate workshops.",
      lede: "Delivered to your organization, on a problem you actually have.",
      blocks: [
        {
          kind: "cards",
          title: "Formats",
          items: [
            { title: "Half day", body: "One team, one defined problem." },
            { title: "Full day", body: "A leadership group working the same themes in parallel." },
            { title: "Multi session", body: "A series, where the later sessions depend on what the earlier ones produced." },
            { title: "On site or remote", body: "Delivered either way, with the same material either way." },
          ],
        },
      ],
    },
    {
      id: "case-studies",
      label: "Case Studies",
      title: "Corporate case studies.",
      lede: "Documented engagements. No invented outcomes.",
      blocks: [
        {
          kind: "list",
          title: "Recent and ongoing",
          items: [
            "Corporate leadership mentoring.",
            "Center for Leadership and Entrepreneurship.",
            "Omega International College.",
            "Siddharth Hospitality.",
          ],
        },
        {
          kind: "note",
          title: "No results claimed",
          text: "These are listed as engagements, not achievements. No metric appears against any of them, because none has been confirmed.",
        },
      ],
    },
    {
      id: "client-testimonials",
      label: "Client Testimonials",
      title: "What clients say.",
      lede: "Consented, attributed, and unedited.",
      blocks: [
        {
          kind: "note",
          title: "Awaiting real quotes",
          text: "[CLIENT TESTIMONIALS TO BE PROVIDED] No names, no job titles, no company names and no quotes appear here until each one has been supplied and approved.",
        },
      ],
    },
    {
      id: "enquiry",
      label: "Enquiry / Get a Quote",
      title: "Corporate enquiry.",
      lede: "For organizations looking to bring a program in.",
      tone: "dark",
      blocks: [
        {
          kind: "prose",
          title: "What to include",
          paragraphs: [
            "How many people, what the specific problem is, and roughly when. That is enough to have a useful first conversation. A full brief is not required at this stage.",
            "If the honest answer is that this is not the right program for you, you will get that answer instead of a proposal.",
          ],
        },
        { kind: "form", title: "Enquiry form", form: "corporate" },
      ],
    },
  ],
};

/* ==========================================================================
   EVENTS  /events
   ========================================================================== */

const eventsPage: PageDef = {
  href: "/events",
  eyebrow: "Events",
  title: "Where we meet.",
  summary: "Masterclasses, workshops, corporate training and live events.",
  lede: "Masterclasses, workshops, corporate trainings and live events. Dates are added here once they are confirmed.",
  sections: [
    {
      id: "upcoming-events",
      label: "Upcoming Events",
      title: "Upcoming events.",
      lede: "Confirmed dates only.",
      blocks: [
        {
          kind: "note",
          title: "Nothing scheduled yet",
          text: "[CONFIRMED EVENT DATES, VENUES AND SEAT COUNTS TO BE PROVIDED] Nothing is listed rather than listing a date that might move. Register your interest below and the next session reaches you before it is public.",
        },
      ],
    },
    {
      id: "masterclasses",
      label: "Masterclasses",
      title: "Masterclasses.",
      lede: "Open registration, one topic, one room.",
      blocks: [
        {
          kind: "cards",
          title: "What a masterclass is",
          items: [
            { title: "One problem", body: "Not a survey of a subject. A single problem, taken all the way." },
            { title: "Interactive", body: "You work on your own situation, not on the facilitator's examples." },
            { title: "Aimed", body: "Specific enough that you can tell before registering whether it is for you." },
          ],
        },
        {
          kind: "cta",
          title: "Register free",
          body: "The masterclass registration form is on the Business Consultation page.",
          label: "Register free",
          href: "/services/business-consultation#free-masterclass",
        },
      ],
    },
    {
      id: "workshops",
      label: "Workshops",
      title: "Workshops.",
      lede: "Hands-on, time-boxed, built around one defined problem.",
      blocks: [
        {
          kind: "list",
          title: "When a workshop suits you",
          items: [
            "You have a specific, current problem rather than a general ambition.",
            "You can get the right people in a room for the whole session.",
            "You are willing to work on your own situation rather than listen to someone else's.",
          ],
        },
      ],
    },
    {
      id: "corporate-training",
      label: "Corporate Training",
      title: "Corporate trainings.",
      lede: "Sessions delivered to your organization, by prior arrangement.",
      blocks: [
        {
          kind: "cards",
          title: "What is available",
          items: [
            { title: "Leadership", body: "Decision rights, accountability, and the difference between being available and being responsible." },
            { title: "Team effectiveness", body: "Roles, handoffs and how disagreement gets handled." },
            { title: "Communication", body: "Fewer meetings, clearer decisions, information that arrives while it is still useful." },
            { title: "Performance", body: "Agreeing what good means, then measuring it honestly." },
          ],
        },
        {
          kind: "cta",
          title: "Invite Lokesh",
          body: "Corporate enquiries go straight to the enquiry form on the Leaders and Team Development page.",
          label: "Enquiry / Get a Quote",
          href: "/services/leaders-teams#enquiry",
        },
      ],
    },
    {
      id: "event-photos",
      label: "Event Photos",
      title: "Photographs from past events.",
      lede: "Masterclasses, workshops and corporate sessions.",
      blocks: [
        {
          kind: "frames",
          title: "Awaiting photography",
          lede: "4:3 frames reserved. Real rooms and real people, never conference stock imagery.",
          items: [
            { label: "Event one", spec: "1600x1200", ratio: "4 / 3" },
            { label: "Event two", spec: "1600x1200", ratio: "4 / 3" },
            { label: "Event three", spec: "1600x1200", ratio: "4 / 3" },
            { label: "Event four", spec: "1600x1200", ratio: "4 / 3" },
          ],
        },
      ],
    },
    {
      id: "past-events",
      label: "Past Events",
      title: "Past events.",
      lede: "An archive, once there is something to put in it.",
      blocks: [
        {
          kind: "note",
          title: "Archive empty",
          text: "[PAST EVENT RECORDS TO BE PROVIDED] No event is listed here that has not been confirmed as having taken place.",
        },
      ],
    },
    {
      id: "event-registration",
      label: "Event Registration",
      title: "Event registration.",
      lede: "Choose a session, register, and get a confirmation.",
      tone: "dark",
      blocks: [
        {
          kind: "prose",
          title: "The four steps",
          paragraphs: [
            "One. Choose an event. Two. Fill the form below. Three. Make payment, where the event is paid. Four. Receive a confirmation by email, and a WhatsApp message for in person sessions.",
            "Steps one and two work now. Three needs a payment provider and four needs an email service, so both are named rather than hidden. A registration form that silently fails to take payment is how people end up queueing on the door.",
          ],
        },
        { kind: "form", title: "Register", form: "event" },
      ],
    },
    {
      id: "faqs",
      label: "Event FAQs",
      title: "Event FAQs.",
      lede: "Practical questions, answered plainly.",
      blocks: [
        {
          kind: "cards",
          title: "Common questions",
          items: [
            { title: "How do I register?", body: "Through the registration form above. You will need a name and an email address." },
            { title: "Is payment required?", body: "Where an event is paid, payment is taken at registration. Nothing is charged before you confirm." },
            { title: "Can I transfer my place?", body: "Yes, in most cases. Contact the address on your confirmation." },
            { title: "What if I need to cancel?", body: "The cancellation terms will be stated on the specific event before you register, not after." },
          ],
        },
      ],
    },
  ],
};

/* ==========================================================================
   SHOP  /shop
   ========================================================================== */

const shopPage: PageDef = {
  href: "/shop",
  eyebrow: "Shop",
  title: "Books, workbooks and recorded programs.",
  summary: "Books, workbooks and recorded programs.",
  lede: "The catalogue is being prepared. Nothing is listed until a title, a format and a price are confirmed.",
  sections: [
    {
      id: "all-products",
      label: "All Products",
      title: "The full catalogue.",
      lede: "Frames are reserved at the real aspect ratios, so the catalogue drops in with no layout shift.",
      blocks: [
        {
          kind: "frames",
          title: "Awaiting catalogue",
          lede: "A shop full of invented products is worse than an honest empty one.",
          items: [
            { label: "Books", spec: "1200x1800", ratio: "2 / 3" },
            { label: "Workbooks", spec: "1200x1800", ratio: "2 / 3" },
            { label: "Recorded Programs", spec: "1920x1080", ratio: "16 / 9" },
            { label: "Templates", spec: "1200x1200", ratio: "1 / 1" },
          ],
        },
        {
          kind: "note",
          title: "Nothing priced yet",
          text: "[PRODUCT CATALOGUE, PRICING, FORMATS AND STOCK TO BE PROVIDED] No product, price or availability appears anywhere in the shop until it is confirmed.",
        },
      ],
    },
    {
      id: "categories",
      label: "Categories",
      title: "Browse by type.",
      blocks: [
        {
          kind: "list",
          title: "Planned categories",
          items: [
            "Books. Long form, by Lokesh.",
            "Workbooks. Something you write in during the work.",
            "Recorded Programs. The session, on your own schedule.",
            "Templates. The systems used in live engagements.",
          ],
        },
      ],
    },
    {
      id: "featured",
      label: "Featured Products",
      title: "Featured products.",
      lede: "A short list rather than a long one.",
      blocks: [
        {
          kind: "note",
          title: "Nothing featured yet",
          text: "[FEATURED PRODUCTS TO BE PROVIDED] A featured list with no products on it would be worse than an empty page.",
        },
      ],
    },
    {
      id: "product-details",
      label: "Product Details",
      title: "Every product page carries the same information.",
      lede: "So that comparing two things is actually possible.",
      blocks: [
        {
          kind: "list",
          title: "What a product page states",
          items: [
            "Format and length. Print, PDF, audio, or video, and how long it is.",
            "Who it is for, and who it is not for.",
            "What is inside, chapter by chapter or session by session.",
            "Access. Lifetime, or time limited, and whether downloads are limited.",
            "Price, and what is included at checkout.",
          ],
        },
        {
          kind: "note",
          title: "No product pages exist yet",
          text: "[PRODUCT DETAIL CONTENT TO BE PROVIDED] The catalogue is empty, so there is nothing to attach a detail page to. A sample layout is not shown here rather than showing a product that does not exist.",
        },
      ],
    },
    {
      id: "add-to-cart",
      label: "Add to Cart",
      title: "Your basket.",
      lede: "Add to cart, change quantities, and the basket is kept on this device.",
      tone: "dark",
      blocks: [
        {
          kind: "cards",
          title: "How the basket behaves",
          items: [
            { title: "It works", body: "Add, edit quantity, remove, clear. All of it works now and survives a reload." },
            { title: "It is local", body: "Your basket is stored in this browser only. No account is needed to use it." },
            { title: "It is not connected", body: "Nothing is reserved and nothing is charged until a payment provider is connected." },
          ],
        },
        {
          kind: "cta",
          title: "Open the cart",
          body: "Review what is in your basket, change quantities, and see the running total.",
          label: "View cart",
          href: "/cart",
        },
      ],
    },
    {
      id: "checkout",
      label: "Checkout",
      title: "Checkout.",
      lede: "Delivery details and payment, on one page.",
      blocks: [
        {
          kind: "cards",
          title: "What checkout will do",
          items: [
            { title: "Delivery details", body: "Name, address and contact, validated before anything is submitted." },
            { title: "Payment", body: "Card, UPI, bank transfer or pay on delivery, depending on what is enabled." },
            { title: "Confirmation", body: "An order confirmation by email, with the download or delivery details." },
          ],
        },
        {
          kind: "note",
          title: "Payment not connected",
          text: "[PAYMENT PROVIDER, ORDER STORE AND FULFILMENT NOT YET CONNECTED] The checkout page is built and validated, but every payment method is disabled. Nothing is charged and no fake success state is shown.",
        },
        {
          kind: "cta",
          title: "Open checkout",
          body: "The checkout page is ready and waiting for a payment provider.",
          label: "Go to checkout",
          href: "/checkout",
        },
      ],
    },
    {
      id: "track-order",
      label: "Track Order",
      title: "Track your order.",
      lede: "Order tracking, once an order system exists.",
      blocks: [
        {
          kind: "note",
          title: "Tracking not connected",
          text: "[ORDER SYSTEM AND FULFILMENT PROVIDER TO BE CONFIRMED] There is no order database behind this site yet, so there is nothing for a tracking form to query. This section is built and waiting rather than pretending to look something up.",
        },
      ],
    },
    {
      id: "returns",
      label: "Return / Refund Policy",
      title: "Returns and refunds.",
      lede: "The policy, in full, before anyone buys anything.",
      blocks: [
        {
          kind: "note",
          title: "Policy pending",
          text: "[RETURN AND REFUND POLICY TO BE PROVIDED] A shop that cannot say what its refund terms are should not take money yet.",
        },
      ],
    },
    {
      id: "faqs",
      label: "Shop FAQs",
      title: "Shop FAQs.",
      lede: "Delivery, formats and access.",
      blocks: [
        {
          kind: "cards",
          title: "Questions to answer once the catalogue is live",
          items: [
            { title: "Delivery", body: "How long, how it is tracked, and what happens if it is late." },
            { title: "Digital products", body: "Format, lifetime access, and whether downloads are limited." },
            { title: "Tax", body: "What is included at checkout." },
            { title: "Payment", body: "Which methods are accepted." },
          ],
        },
        {
          kind: "note",
          title: "Answers pending",
          text: "[DELIVERY, TAX AND PAYMENT TERMS TO BE PROVIDED] The questions above are the ones every shop gets asked. The answers are not invented here.",
        },
      ],
    },
  ],
};

/* ==========================================================================
   BLOG  /blog
   ========================================================================== */

const BLOG_CATEGORIES = [
  {
    slug: "business-growth",
    label: "Business Growth",
    note: "Operating realities and the decisions behind them.",
  },
  {
    slug: "leadership",
    label: "Leadership",
    note: "How teams actually change how they work, as opposed to how they are asked to.",
  },
  {
    slug: "personal-development",
    label: "Personal Development",
    note: "Awareness and capability that survives a difficult week.",
  },
  {
    slug: "public-speaking",
    label: "Public Speaking",
    note: "Saying the thing clearly, especially when it is the difficult thing.",
  },
  {
    slug: "mindset-motivation",
    label: "Mindset & Motivation",
    note: "The assumptions underneath a decision.",
  },
];

const blogPage: PageDef = {
  href: "/blog",
  eyebrow: "Blog",
  title: "Writing on the work.",
  summary: "Writing and video on business, leadership and self development.",
  lede: "Everything published is listed here in full, searchable, with nothing held back for a newsletter.",
  sections: [
    {
      id: "all-articles",
      label: "All Articles",
      title: "Everything published.",
      lede: "Newest first. Nothing is held back.",
      blocks: [
        {
          kind: "frames",
          title: "Awaiting articles",
          lede: "Three frames reserved for the first three pieces, so the index layout is already correct.",
          items: [
            { label: "Article one", spec: "1600x900", ratio: "16 / 9" },
            { label: "Article two", spec: "1600x900", ratio: "16 / 9" },
            { label: "Article three", spec: "1600x900", ratio: "16 / 9" },
          ],
        },
        {
          kind: "note",
          title: "Nothing published yet",
          text: "[ARTICLES TO BE PROVIDED] No headline is invented to fill the index. A plausible fake headline is worse than an empty page, because it will be mistaken for something Lokesh wrote.",
        },
      ],
    },
    {
      id: "categories",
      label: "Categories",
      title: "Five categories.",
      lede: "Use search to filter, or pick a category.",
      blocks: [{ kind: "search", categories: BLOG_CATEGORIES }],
    },
    {
      id: "video-blog",
      label: "Video Blog",
      title: "Video blog.",
      lede: "Recorded pieces, with captions on every upload.",
      tone: "dark",
      blocks: [
        {
          kind: "frames",
          title: "Awaiting footage",
          lede: "16:9 frames reserved. Captions are required on every upload, not optional.",
          items: [
            { label: "Video one", spec: "1920x1080", ratio: "16 / 9" },
            { label: "Video two", spec: "1920x1080", ratio: "16 / 9" },
          ],
        },
      ],
    },
  ],
};

/* ==========================================================================
   GALLERY  /gallery
   ========================================================================== */

const galleryPage: PageDef = {
  href: "/gallery",
  eyebrow: "Gallery",
  title: "Photographs and footage.",
  summary: "Photography and video from the work, the sessions and the stage.",
  lede: "Real rooms and real people. No conference stock imagery is used as a substitute, anywhere.",
  sections: [
    {
      id: "event-photos",
      label: "Photos & Event Photos",
      title: "Photos from the work.",
      lede: "Sessions, stages and the rooms in between.",
      blocks: [
        {
          kind: "frames",
          title: "Awaiting photography",
          lede: "4:3 frames reserved at full width. These drop in with no layout shift.",
          items: [
            { label: "Session one", spec: "1600x1200", ratio: "4 / 3" },
            { label: "Session two", spec: "1600x1200", ratio: "4 / 3" },
            { label: "Session three", spec: "1600x1200", ratio: "4 / 3" },
            { label: "Session four", spec: "1600x1200", ratio: "4 / 3" },
            { label: "Stage one", spec: "1600x1200", ratio: "4 / 3" },
            { label: "The room before", spec: "1600x1200", ratio: "4 / 3" },
          ],
        },
      ],
    },
    {
      id: "media-coverage",
      label: "Media Coverage",
      title: "Media coverage.",
      lede: "Features, interviews and press.",
      blocks: [
        {
          kind: "note",
          title: "Awaiting confirmation",
          text: "[CONFIRMED MEDIA COVERAGE TO BE PROVIDED] No publication names are shown until confirmed. An implied endorsement is not the same as a granted one.",
        },
      ],
    },
    {
      id: "behind-the-scenes",
      label: "Behind the Scenes",
      title: "Behind the scenes.",
      lede: "How the work actually gets made.",
      blocks: [
        {
          kind: "list",
          title: "Worth photographing",
          items: [
            "A working session, mid disagreement.",
            "Printed process diagrams covered in edits.",
            "The room before anyone arrives.",
            "The whiteboard nobody photographed at the time.",
          ],
        },
      ],
    },
  ],
};

/* ==========================================================================
   CONTACT  /contact
   ========================================================================== */

const contactPage: PageDef = {
  href: "/contact",
  eyebrow: "Contact",
  title: "Get in touch.",
  summary: "Get in touch, book a consultation, or bring Lokesh to your organization.",
  lede: "One form reaches Lokesh directly. Everything below is a faster route to the same place.",
  sections: [
    {
      id: "contact-form",
      label: "Contact Form",
      title: "Send a message.",
      lede: "The general route. Corporate enquiries are faster through the dedicated form.",
      tone: "dark",
      blocks: [{ kind: "form", title: "Contact form", form: "contact" }],
    },
    {
      id: "book-a-consultation",
      label: "Book a Consultation",
      title: "Book a consultation.",
      lede: "One conversation, about one problem.",
      blocks: [
        {
          kind: "prose",
          title: "What to expect",
          paragraphs: [
            "You describe the situation as it is, not as it has been described to you. In return you get a reply that engages with it, including, quite often, the answer that this is not the right place to start.",
            "Bring the real problem. That is the whole preparation required.",
          ],
        },
        {
          kind: "form",
          title: "Request a time",
          form: "consultation",
        },
      ],
    },
    {
      id: "office-details",
      label: "Office Details",
      title: "Office details.",
      lede: "Address, hours and directions.",
      blocks: [
        {
          kind: "note",
          title: "Address pending",
          text: "[OFFICE ADDRESS, HOURS AND DIRECTIONS TO BE PROVIDED] No address, map or hours are guessed here. The contact form reaches Lokesh directly in the meantime.",
        },
      ],
    },
    {
      id: "social-media",
      label: "Social Media Links",
      title: "Social media.",
      lede: "Official profiles only.",
      blocks: [
        {
          kind: "note",
          title: "Links pending",
          text: "[CONFIRMED SOCIAL PROFILES TO BE PROVIDED] Impersonation risk is the reason nothing is linked before the client confirms each profile URL. A wrong link here would send visitors to somebody else's account wearing Lokesh's name.",
        },
      ],
    },
    {
      id: "join-newsletter",
      label: "Join Newsletter",
      title: "Reading and sessions, occasionally.",
      lede: "One email when there is something worth sending. Not a schedule, and not a drip campaign.",
      blocks: [
        {
          kind: "cards",
          title: "What you would get, and not get",
          items: [
            { title: "You would get", body: "New writing, when there is some. Masterclass and workshop dates, before they are public." },
            { title: "You would not get", body: "More than one email per piece of writing. Offers for services you did not ask about." },
            { title: "Your address", body: "Would not be shared with anyone, and would not be sold. That is the whole policy." },
          ],
        },
        { kind: "form", title: "Subscribe", form: "newsletter" },
      ],
    },
  ],
};

export const PAGES: PageDef[] = [
  aboutPage,
  businessConsultationPage,
  selfDevelopmentPage,
  leadersTeamsPage,
  eventsPage,
  shopPage,
  blogPage,
  galleryPage,
  contactPage,
];

export const pageByHref = (href: string) => PAGES.find((p) => p.href === href);

/** Section id to page href, used to validate redirects and build the rail. */
export const sectionIndex = new Map<string, string>();
for (const page of PAGES) {
  for (const section of page.sections) {
    sectionIndex.set(`${page.href}#${section.id}`, section.title);
  }
}

export { BLOG_CATEGORIES };