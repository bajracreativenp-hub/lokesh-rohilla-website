/**
 * PAGE CONTENT
 * ===========================================================================
 * Every section of every page, in one file.
 */

import { UNSPLASH } from "@/lib/content";

export type Photo = {
  label: string;
  spec: string;
  ratio: string;
  direction: string;
  src?: string;
  alt?: string;
  caption?: string;
  layout: "wide" | "half";
  paired?: boolean;
};

export type TimelinePhase = {
  ordinal: string;
  label: string;
  body: string;
  image: { label: string; spec: string; direction: string; src?: string; alt?: string };
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
      items: {
        label: string;
        spec: string;
        ratio: string;
        meta?: string;
        src?: string;
        alt?: string;
      }[];
    };

export type PageSection = {
  id: string;
  label: string;
  title: string;
  lede?: string;
  tone?: "canvas" | "surface" | "dark";
  blocks: Block[];
};

export type PageDef = {
  href: string;
  eyebrow: string;
  title: string;
  lede: string;
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
          lede: "Key operational and turnaround milestones across sectors.",
          items: [
            { title: "Hard Rock Hotel", meta: "India", body: "Supported the launch and operational standards of the first Hard Rock Hotel in India." },
            { title: "City Mall", meta: "Retail", body: "Led pre-opening systems, vendor workflows, and operational readiness." },
            { title: "Quick Service Restaurants", meta: "F&B", body: "Built repeatable kitchen, service, and multi-outlet expansion playbooks." },
            { title: "Meat Processing", meta: "Manufacturing", body: "Designed end-to-end production workflows and quality control systems from the ground up." },
            { title: "International Hospital", meta: "Delhi", body: "Guided patient-flow operations, service standards, and departmental coordination." },
          ],
        },
      ],
    },
    {
      id: "journey",
      label: "Journey",
      title: "Eighteen years, in phases.",
      lede: "From international aviation and luxury hospitality to enterprise turnarounds and founding The Bookwishes Club.",
      blocks: [
        {
          kind: "timeline",
          title: "The phases",
          lede: "Move through with the arrows, or jump to a phase.",
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
                src: `${UNSPLASH}1621293954908-907159247fc8?auto=format&fit=crop&w=1200&q=80`,
                alt: "A hotel interior with staff working in the background",
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
                src: `${UNSPLASH}1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80`,
                alt: "Two people reviewing printed documents across a table",
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
                src: `${UNSPLASH}1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80`,
                alt: "A large modern building interior with an atrium",
              },
            },
            {
              ordinal: "04",
              label: "2021",
              body: "The turning point, and the founding of The Bookwishes Club as a dedicated self-development and public speaking center.",
              image: {
                label: "Founding The Bookwishes Club",
                spec: "1200x1200",
                direction:
                  "A first session or an empty room set up for one. Warm light, a small number of people, the start of something.",
                src: `${UNSPLASH}1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80`,
                alt: "Books stacked on a table ready for a reading session",
              },
            },
            {
              ordinal: "05",
              label: "Recent and Ongoing",
              body: "Leading Business Doctor and The Bookwishes Club—advising founders across hospitality, apparel, logistics, and education while coaching executive communication.",
              image: {
                label: "Ongoing work",
                spec: "1200x1200",
                direction:
                  "A mentoring conversation, two or three people, mid discussion. Ordinary room, natural light.",
                src: `${UNSPLASH}1573497491208-6b1acb260507?auto=format&fit=crop&w=1200&q=80`,
                alt: "Two people in a mentoring conversation across a table",
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
      lede: "Building self-sustaining organizations and articulate, grounded individuals.",
      blocks: [
        {
          kind: "cards",
          title: "What guides both practices",
          items: [
            {
              title: "Vision",
              meta: "Long-Term Horizon",
              body: "To build businesses that scale on clarity and repeatable systems rather than founder exhaustion, and individuals who speak, think, and lead with unmistakable conviction.",
            },
            {
              title: "Mission — Business Doctor",
              meta: "For Organizations",
              body: "To diagnose structural bottlenecks across strategy, operations, sales, and culture before prescribing action—leaving every client team independent and self-reliant.",
            },
            {
              title: "Mission — The Bookwishes Club",
              meta: "For Individuals",
              body: "To provide a disciplined practice ground where professionals conquer stage anxiety, sharpen impromptu articulation, and build lifelong reading and leadership habits.",
            },
          ],
        },
      ],
    },
    {
      id: "media",
      label: "Media & Press",
      title: "Media, speaking and press.",
      lede: "Keynotes, industry panels, and leadership conversations.",
      blocks: [
        {
          kind: "cards",
          title: "Speaking & editorial topics",
          items: [
            {
              title: "Diagnosis Before Prescription",
              meta: "Keynote & Executive Forum",
              body: "Why high-growth companies stall when solutions are funded before root operational causes are agreed upon.",
            },
            {
              title: "Hospitality-Grade Systems in Any Industry",
              meta: "Industry Panel",
              body: "Applying the zero-ambiguity service standards of international aviation and five-star hotels to retail, healthcare, and logistics.",
            },
            {
              title: "Commanding the Room Without Memorizing Scripts",
              meta: "Public Speaking Workshop",
              body: "How structured thinking frameworks replace stage fright with calm, articulate executive presence.",
            },
          ],
        },
        {
          kind: "cta",
          title: "Media & speaking enquiries",
          body: "Journalists, podcast hosts, and conference organizers can reach Lokesh's office through the contact page.",
          label: "Contact Lokesh",
          href: "/contact",
        },
      ],
    },
    {
      id: "awards",
      label: "Awards",
      title: "Milestones and recognition.",
      lede: "Grounded in eighteen years of operational delivery and community impact.",
      blocks: [
        {
          kind: "cards",
          title: "Career highlights",
          items: [
            {
              title: "International Hospitality & Aviation Pedigree",
              meta: "Dubai & India",
              body: "Trained and operated inside world-class service environments with Hyatt International, Qatar Airways, and the launch of Hard Rock Hotel India.",
            },
            {
              title: "Cross-Sector Turnaround Track Record",
              meta: "9+ Named Organizations",
              body: "Delivered pre-opening setups, operational restructures, and leadership mentoring across hospitals, shopping malls, apparel brands, and logistics.",
            },
            {
              title: "318+ Verified 4.6★ Member Reviews",
              meta: "The Bookwishes Club",
              body: "Recognized as a premier self-development and public speaking center transforming hundreds of professionals, students, and executives since 2021.",
            },
          ],
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
              "Lokesh with a client team in their own premises, a printed process or a whiteboard visible.",
            caption:
              "Every engagement runs in the client's own setting. What is left behind is a process they own, not a deck they were shown.",
            src: `${UNSPLASH}1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80`,
            alt: "A person working at a laptop in a bright office",
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
      lede: "Real operational turnarounds, pre-openings, and structural setups across five industries.",
      blocks: [
        {
          kind: "cards",
          title: "Selected engagements",
          items: [
            { title: "Hard Rock Hotel", meta: "Hospitality • India", body: "Supported the launch and service systems for the first Hard Rock Hotel in India, establishing departmental SOPs and pre-opening readiness." },
            { title: "City Mall", meta: "Commercial Retail", body: "Managed the pre-opening operational architecture, tenant coordination workflows, and facility management standards." },
            { title: "Quick Service Restaurants", meta: "Multi-Outlet F&B", body: "Launched multiple QSR outlets with standardized kitchen prep, inventory controls, and staff onboarding playbooks." },
            { title: "Meat Processing Facility", meta: "Manufacturing", body: "Set up an end-to-end meat processing factory, structuring floor workflows, hygiene compliance, and dispatch logistics." },
            { title: "SCI International Hospital", meta: "Healthcare • Delhi", body: "Supported the operational setup, patient-journey handoffs, and administrative accountability across departments." },
          ],
        },
      ],
    },
    {
      id: "clients",
      label: "Clients",
      title: "Organizations worked with.",
      lede: "Across hospitality, aviation, healthcare, retail, apparel, logistics, and education.",
      blocks: [
        {
          kind: "list",
          title: "Confirmed engagements",
          items: [
            "Siddharth Hospitality — Hospitality & Hotel Operations",
            "Hyatt Hotels — International Hospitality",
            "Qatar Airways — Aviation Service Excellence",
            "Hard Rock Cafe / Hotel — Hospitality Launch",
            "SCI International Hospital — Healthcare Operations",
            "CityMall — Commercial Retail Pre-Opening",
            "Hamsa — Apparel & Brand Operations",
            "Kshipra Attire — Retail & Garment Systems",
            "Kalpa Logistics — Supply Chain & Fulfillment",
          ],
        },
      ],
    },
    {
      id: "video-testimonials",
      label: "Video Testimonials",
      title: "Inside our consulting sessions.",
      lede: "Field recordings, workshop rooms, and executive alignment debriefs.",
      blocks: [
        {
          kind: "frames",
          title: "Session highlights",
          lede: "Working directly with founders and department heads in their own premises.",
          items: [
            { label: "Executive Diagnostic Debrief", meta: "Strategy & Decision Rights", spec: "1920x1080", ratio: "16 / 9", src: `${UNSPLASH}1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80`, alt: "Two people at a table reviewing printed material" },
            { label: "Operations & Handoff Mapping", meta: "90-Day Turnaround Sprint", spec: "1920x1080", ratio: "16 / 9", src: `${UNSPLASH}1517048676732-d65bc937f952?auto=format&fit=crop&w=1920&q=80`, alt: "A team standing around a whiteboard in a meeting room" },
            { label: "Leadership & Role Scorecard Alignment", meta: "Senior Management Cohort", spec: "1920x1080", ratio: "16 / 9", src: `${UNSPLASH}1573164574572-cb89e39749b4?auto=format&fit=crop&w=1920&q=80`, alt: "A meeting room set up with chairs around a table" },
          ],
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
            { title: "Free", body: "Focused purely on practical diagnosis and immediate operational clarity." },
          ],
        },
        { kind: "form", title: "Register free", form: "masterclass" },
      ],
    },
    {
      id: "work-with-me",
      label: "Work With Me",
      title: "Start a consulting conversation.",
      lede: "A short brief is enough. Every engagement is scoped only after a real diagnostic conversation.",
      blocks: [
        {
          kind: "prose",
          title: "What happens after you get in touch",
          paragraphs: [
            "You describe the situation as it actually is. In return you get an answer that engages with it, including, quite often, the answer that this is not something Lokesh does.",
            "If there is a fit, the next step is a scoping conversation rather than a generic proposal. Proposals written before anyone has looked at the business are how both sides waste a month.",
          ],
        },
        {
          kind: "cards",
          title: "How engagements are structured",
          items: [
            {
              title: "01. Operational Diagnostic Audit",
              meta: "2–3 Weeks",
              body: "A focused audit of your current workflows, decision rights, sales handoffs, and bottlenecks—concluding with a prioritized turnaround roadmap.",
            },
            {
              title: "02. 90-Day Systems & Turnaround Sprint",
              meta: "Hands-On Implementation",
              body: "Working directly alongside your leadership team to install SOPs, role scorecards, and weekly execution rhythms that hold without heroics.",
            },
            {
              title: "03. Executive Advisory Retainer",
              meta: "Ongoing Monthly Partnership",
              body: "Dedicated strategic counsel and monthly accountability reviews for founders and managing directors navigating scale or transition.",
            },
          ],
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
              "A small workshop group mid session, seated in a circle or at tables rather than in rows facing a screen.",
            caption:
              "The room after the session matters as much as the session. This is where a training day either holds or quietly does not.",
            src: `${UNSPLASH}1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80`,
            alt: "A trainer speaking to a seated group",
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
      title: "Member transformations.",
      lede: "Verified reflections from members of The Bookwishes Club (4.6★ across 318+ Google reviews).",
      blocks: [
        {
          kind: "cards",
          title: "In our members' words",
          items: [
            {
              title: "Anit Shakya",
              meta: "Public Speaking Cohort",
              body: "“Attending the public speaking classes at The Bookwishes Club has been a transformative experience! The sessions are well-structured, engaging, and full of practical exercises that really helped boost my confidence.”",
            },
            {
              title: "Bivan Tulachan",
              meta: "Club Member",
              body: "“Joining Bookwishes Club has been very rewarding. It improved my speaking ability and made me more confident. The classes are fun and encouraging, and the instructors are very helpful and friendly.”",
            },
            {
              title: "Chandani Shah",
              meta: "Self-Development Program",
              body: "“I am truly grateful for the incredible classes. Joining these sessions was one of the best decisions I have made and now, I am proud to say I have gained real confidence.”",
            },
            {
              title: "Nirakar God",
              meta: "Mindset & Leadership",
              body: "“After joining I have a clear vision about what it takes to be a successful person who is able to handle any situation. I genuinely suggest people to be a member of Bookwishes Club.”",
            },
          ],
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
      lede: "Structured cohorts and ongoing practice memberships at The Bookwishes Club.",
      tone: "dark",
      blocks: [
        {
          kind: "cards",
          title: "Joining gives you",
          items: [
            { title: "Live Practice Sessions", body: "Public speaking, impromptu articulation, and personality development in small, high-feedback rooms." },
            { title: "Community Access", body: "Weekly reading circles, peer accountability, and practice between formal sessions." },
            { title: "Recorded Material", body: "Access to recorded masterclasses, frameworks, and speaking drills." },
            { title: "Direct Feedback", body: "Honest, specific calibration on vocal pacing, posture, and clarity of thought." },
          ],
        },
        {
          kind: "cta",
          title: "Apply for the next cohort",
          body: "Reach out to reserve your seat or schedule a brief orientation visit at The Bookwishes Club.",
          label: "Join the newsletter",
          href: "/contact#join-newsletter",
        },
      ],
    },
    {
      id: "upcoming-batches",
      label: "Upcoming Batches",
      title: "Cohort formats & schedules.",
      lede: "Small groups capped at 18–20 participants so everyone speaks in every session.",
      blocks: [
        {
          kind: "cards",
          title: "Active tracks",
          items: [
            {
              title: "Foundation Public Speaking Cohort",
              meta: "6 Weeks • In-Person",
              body: "Structured stage practice covering opening hooks, impromptu thinking, vocal projection, and handling Q&A under pressure.",
            },
            {
              title: "Executive Presence & Articulation Lab",
              meta: "4 Weeks • Hybrid",
              body: "Designed for managers, founders, and professionals leading high-stakes meetings, boardroom pitches, and client presentations.",
            },
            {
              title: "Bookwishes Reading & Mindset Circle",
              meta: "Ongoing Weekly • Community",
              body: "Deep reading habit formation, mental models discussion, and applied personal discipline with fellow members.",
            },
          ],
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
              "Two people in a genuine conversation across a table, not a workshop and not a posed handshake.",
            caption:
              "Most of this work happens in single conversations. The outcome is a leader who can hold the decision without being asked.",
            src: `${UNSPLASH}1573497620053-ea5300f94f21?auto=format&fit=crop&w=1920&q=80`,
            alt: "Two people in conversation across a table",
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
      title: "Corporate leadership engagements.",
      lede: "Institutional and executive team development programs delivered across sectors.",
      blocks: [
        {
          kind: "cards",
          title: "Recent and ongoing",
          items: [
            {
              title: "Siddharth Hospitality",
              meta: "Executive & Property Leadership",
              body: "Aligned unit heads and operational managers around service consistency, clear escalation paths, and cross-departmental ownership.",
            },
            {
              title: "Center for Leadership and Entrepreneurship",
              meta: "Leadership Development",
              body: "Designed and delivered structured leadership modules focused on decision-making, public articulation, and execution discipline.",
            },
            {
              title: "Omega International College",
              meta: "Academic & Faculty Leadership",
              body: "Facilitated communication and leadership workshops for faculty and emerging student leaders.",
            },
            {
              title: "Executive 1-on-1 Mentoring",
              meta: "Founders & Directors",
              body: "Ongoing private advisory for business owners transitioning from hands-on operator to strategic chief executive.",
            },
          ],
        },
      ],
    },
    {
      id: "client-testimonials",
      label: "Client Testimonials",
      title: "What changes inside the team.",
      lede: "The consistent shifts reported by leadership teams after installing clear role scorecards and decision rights.",
      blocks: [
        {
          kind: "cards",
          title: "Observed outcomes across client teams",
          items: [
            {
              title: "From Escalation to Ownership",
              meta: "Department Heads",
              body: "Department leads stop bringing every routine operational trade-off to the founder's desk once decision boundaries are written down.",
            },
            {
              title: "Shorter, Decisive Weekly Reviews",
              meta: "Management Rhythm",
              body: "Status-update marathons are replaced by 45-minute scorecard reviews focused strictly on exceptions, commitments, and next actions.",
            },
            {
              title: "Clean Cross-Team Handoffs",
              meta: "Sales to Operations",
              body: "Friction between sales promises and operational delivery disappears when handoff checklists are agreed upon by both sides.",
            },
          ],
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
  lede: "Masterclasses, workshops, corporate trainings and live events led by Lokesh Rohilla.",
  sections: [
    {
      id: "upcoming-events",
      label: "Upcoming Events",
      title: "Upcoming live sessions.",
      lede: "Open-registration masterclasses and in-person intensives. Reserve your seat below.",
      blocks: [
        {
          kind: "cards",
          title: "Open for registration",
          items: [
            {
              title: "The Systems & Scale Masterclass",
              meta: "Live Online • Founders & Directors • 30 Seats",
              body: "A 90-minute diagnostic working session on eliminating founder dependency, fixing broken handoffs, and installing weekly operational scorecards.",
              href: "/events#event-registration",
            },
            {
              title: "Command the Room: Public Speaking Intensive",
              meta: "In-Person • The Bookwishes Club • 20 Seats",
              body: "A two-day weekend immersion in impromptu articulation, vocal authority, stage presence, and handling high-stakes Q&A.",
              href: "/events#event-registration",
            },
            {
              title: "Executive Decision & Alignment Forum",
              meta: "In-Person Roundtable • Senior Leaders • 15 Seats",
              body: "A closed-door half-day workshop for leadership teams working through a live organizational restructuring or growth bottleneck.",
              href: "/events#event-registration",
            },
          ],
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
          title: "Inside the room",
          lede: "Moments from keynotes, executive roundtables, and speaking cohorts.",
          items: [
            { label: "Executive Keynote Address", meta: "Leadership & Systems", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80`, alt: "A speaker on a lit stage facing a seated audience" },
            { label: "Annual Leadership Forum", meta: "Auditorium Session", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80`, alt: "A large audience seated in rows facing a stage" },
            { label: "Hospitality Operations Summit", meta: "Industry Panel", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1621293954908-907159247fc8?auto=format&fit=crop&w=1600&q=80`, alt: "A bright modern hotel lobby with seating and plants" },
            { label: "The Bookwishes Club Cohort", meta: "Interactive Workshop", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1531421693921-03e5aa6ee863?auto=format&fit=crop&w=1600&q=80`, alt: "People gathered around a table in a workshop room" },
          ],
        },
      ],
    },
    {
      id: "past-events",
      label: "Past Events",
      title: "Past events archive.",
      lede: "Selected masterclasses, corporate intensives, and community forums hosted by Lokesh Rohilla.",
      blocks: [
        {
          kind: "cards",
          title: "Recent sessions",
          items: [
            {
              title: "Hospitality & Service Systems Intensive",
              meta: "Siddharth Hospitality • Corporate Workshop",
              body: "Full-day operational leadership alignment on guest experience standards, SOP adherence, and supervisory accountability.",
            },
            {
              title: "Impromptu Speaking & Stage Mastery",
              meta: "The Bookwishes Club • Cohort Graduations",
              body: "Live stage evaluations and public speaking showcases completed by over 200+ cohort members since 2021.",
            },
            {
              title: "Entrepreneurial Decision-Making Seminar",
              meta: "Center for Leadership & Entrepreneurship",
              body: "Interactive seminar for emerging founders on diagnosing business bottlenecks before scaling headcount.",
            },
          ],
        },
      ],
    },
    {
      id: "event-registration",
      label: "Event Registration",
      title: "Event registration.",
      lede: "Choose a session, register, and receive your confirmation.",
      tone: "dark",
      blocks: [
        {
          kind: "prose",
          title: "How registration works",
          paragraphs: [
            "Select your preferred session below and enter your contact details. Once submitted, our team will send your calendar invitation, venue or Zoom coordinates, and pre-session preparation sheet via email and WhatsApp.",
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
            { title: "Is payment required?", body: "Open masterclasses are complimentary. For paid weekend intensives, payment details are sent with your seat confirmation." },
            { title: "Can I transfer my place?", body: "Yes, in most cases. Contact the address on your confirmation at least 48 hours prior." },
            { title: "What if I need to cancel?", body: "Full refunds or credit transfers to the next cohort are available up to 72 hours before an in-person intensive." },
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
  lede: "Practical field guides, operational playbooks, and recorded programs built from eighteen years of consulting and coaching.",
  sections: [
    {
      id: "all-products",
      label: "All Products",
      title: "The full catalogue.",
      lede: "Field-tested tools designed to be used inside your business or personal practice.",
      blocks: [
        {
          kind: "frames",
          title: "Signature resources & toolkits",
          lede: "Available in print, interactive digital workbook, and recorded video formats.",
          items: [
            { label: "Diagnosis Before Prescription (Field Guide)", meta: "Book • Print & Digital Edition", spec: "1200x1800", ratio: "2 / 3", src: `${UNSPLASH}1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80`, alt: "A stack of hardcover books on a wooden surface" },
            { label: "The 90-Day Operations & Systems Workbook", meta: "Workbook • SOPs & Scorecards", spec: "1200x1800", ratio: "2 / 3", src: `${UNSPLASH}1618365908648-e71bd5716cba?auto=format&fit=crop&w=1600&q=80`, alt: "An open notebook with a pen laid across the page" },
            { label: "Speak Without Notes (Recorded Masterclass)", meta: "6-Module Video Program", spec: "1920x1080", ratio: "16 / 9", src: `${UNSPLASH}1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80`, alt: "A laptop on a desk beside a notebook" },
            { label: "Decision Rights & Accountability Playbook", meta: "Executive Template Pack", spec: "1200x1200", ratio: "1 / 1", src: `${UNSPLASH}1506784881475-0e408bbca849?auto=format&fit=crop&w=1600&q=80`, alt: "A printed planner page with sections and notes" },
          ],
        },
        {
          kind: "cards",
          title: "Edition details",
          items: [
            {
              title: "Diagnosis Before Prescription",
              meta: "Book • Hardcover & PDF",
              body: "A practical guide for founders on identifying structural bottlenecks across strategy, operations, sales handoffs, and culture.",
              href: "/contact#contact-form",
            },
            {
              title: "The 90-Day Operations Workbook",
              meta: "Interactive Workbook",
              body: "Step-by-step worksheets used in Business Doctor engagements to map core workflows and remove key-person dependency.",
              href: "/contact#contact-form",
            },
            {
              title: "Speak Without Notes Masterclass",
              meta: "Recorded Video Series",
              body: "The core curriculum from The Bookwishes Club for structuring thoughts on the spot and commanding high-stakes rooms.",
              href: "/contact#contact-form",
            },
          ],
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
          title: "Resource formats",
          items: [
            "Books — Long-form operational and leadership field guides by Lokesh Rohilla.",
            "Workbooks — Structured print and digital manuals you write in during team or personal diagnostics.",
            "Recorded Programs — Self-paced video masterclasses with downloadable exercises.",
            "Templates — The exact role scorecards, SOP checklists, and meeting agendas used in live consulting.",
          ],
        },
      ],
    },
    {
      id: "featured",
      label: "Featured Products",
      title: "Featured releases.",
      lede: "The two most requested toolkits by founders and Bookwishes Club members.",
      blocks: [
        {
          kind: "cards",
          title: "Most requested",
          items: [
            {
              title: "Founder's Operational Diagnostic Kit",
              meta: "Business Doctor Edition",
              body: "Combines the 90-Day Operations Workbook with the Decision Rights & Role Scorecard Template Pack for leadership teams.",
              href: "/contact#contact-form",
            },
            {
              title: "The Articulate Leader Bundle",
              meta: "The Bookwishes Club Edition",
              body: "Includes the Speak Without Notes Recorded Masterclass and the 30-Day Impromptu Speaking Practice Journal.",
              href: "/contact#contact-form",
            },
          ],
        },
      ],
    },
    {
      id: "product-details",
      label: "Product Details",
      title: "Every resource is built for application.",
      lede: "Clear specifications so you know exactly what is inside before ordering.",
      blocks: [
        {
          kind: "list",
          title: "What every edition includes",
          items: [
            "Format and length — Available in physical print, high-resolution PDF, or HD video modules.",
            "Who it is for — Clear suitability criteria so you pick the right tool for your current stage.",
            "Chapter-by-chapter breakdown — Full syllabus and worksheet index provided upfront.",
            "Lifetime digital updates — Every template pack includes revised editions at no extra cost.",
          ],
        },
      ],
    },
    {
      id: "add-to-cart",
      label: "Add to Cart",
      title: "Your basket.",
      lede: "Add to cart, change quantities, and your basket is saved on this device.",
      tone: "dark",
      blocks: [
        {
          kind: "cards",
          title: "How ordering works",
          items: [
            { title: "Instant Basket Sync", body: "Add items, adjust quantities for team orders, and review your subtotal anytime." },
            { title: "No Account Required", body: "Check out directly as a guest or use your member email to link purchases." },
            { title: "Concierge Fulfilment", body: "Digital links are emailed immediately; print workbooks are dispatched via tracked courier." },
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
      lede: "Delivery details and payment options on one clean page.",
      blocks: [
        {
          kind: "cards",
          title: "Checkout process",
          items: [
            { title: "Delivery details", body: "Name, shipping address, and email validated cleanly before submission." },
            { title: "Flexible payment", body: "Card, digital wallet/QR, direct bank transfer, or cash on delivery for print editions." },
            { title: "Confirmation", body: "Direct email confirmation with your invoice, download links, and courier tracking." },
          ],
        },
        {
          kind: "cta",
          title: "Open checkout",
          body: "Proceed to the checkout page to complete your order.",
          label: "Go to checkout",
          href: "/checkout",
        },
      ],
    },
    {
      id: "track-order",
      label: "Track Order",
      title: "Track your order.",
      lede: "Real-time dispatch updates for physical books and workbooks.",
      blocks: [
        {
          kind: "cards",
          title: "How order tracking works",
          items: [
            {
              title: "Digital Editions & Templates",
              meta: "Immediate Delivery",
              body: "Sent directly to your inbox within minutes of order confirmation. Check your spam folder or email connect@lokeshrohilla.com to resend.",
            },
            {
              title: "Print Books & Workbooks",
              meta: "3–5 Business Days",
              body: "Dispatched with a courier tracking link sent to your email and WhatsApp as soon as your package leaves our office.",
            },
          ],
        },
      ],
    },
    {
      id: "returns",
      label: "Return / Refund Policy",
      title: "Returns and refunds.",
      lede: "Straightforward, fair terms on every physical and digital purchase.",
      blocks: [
        {
          kind: "cards",
          title: "Our 7-day guarantee",
          items: [
            {
              title: "Physical Books & Workbooks",
              body: "Return any unmarked physical book or workbook within 7 days of delivery for a full refund or immediate replacement if damaged in transit.",
            },
            {
              title: "Recorded Programs",
              body: "If a recorded masterclass does not meet your expectations, request a full refund within 7 days of purchase—no hoops required.",
            },
          ],
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
          title: "Frequently asked questions",
          items: [
            { title: "Delivery", body: "Print editions ship within 24 hours and arrive in 3–5 business days with WhatsApp and email tracking." },
            { title: "Digital products", body: "Delivered in universal PDF and Notion/Excel-ready formats with lifetime access and unlimited personal downloads." },
            { title: "Bulk corporate orders", body: "Ordering 10+ workbooks for your leadership team? Contact us for custom corporate pricing and branded covers." },
            { title: "Payment", body: "We accept major cards, QR/digital wallets, bank transfers, and cash on delivery for physical shipments." },
          ],
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
  lede: "Essays, diagnostic frameworks, and field notes on business systems, leadership, and public speaking.",
  sections: [
    {
      id: "all-articles",
      label: "All Articles",
      title: "Featured essays.",
      lede: "Practical writing drawn directly from consulting rooms and speaking cohorts.",
      blocks: [
        {
          kind: "frames",
          title: "Editor's picks",
          lede: "Three foundational essays to start with.",
          items: [
            { label: "Diagnosis Before Prescription: Why Turnarounds Stall", meta: "Business Growth • 6 min read", spec: "1600x900", ratio: "16 / 9", src: `${UNSPLASH}1501618669935-18b6ecb13d6d?auto=format&fit=crop&w=1600&q=80`, alt: "A desk with a laptop, notebook and morning light" },
            { label: "Say the Point First: Impromptu Speaking Under Pressure", meta: "Public Speaking • 5 min read", spec: "1600x900", ratio: "16 / 9", src: `${UNSPLASH}1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80`, alt: "An audience seated in a lecture room" },
            { label: "Cutting the Meeting Load with Clear Decision Rights", meta: "Leadership • 7 min read", spec: "1600x900", ratio: "16 / 9", src: `${UNSPLASH}1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80`, alt: "A quiet modern office with desks and daylight" },
          ],
        },
      ],
    },
    {
      id: "categories",
      label: "Categories",
      title: "Browse & search all essays.",
      lede: "Use the search bar or click a category pill to filter articles instantly.",
      blocks: [{ kind: "search", categories: BLOG_CATEGORIES }],
    },
    {
      id: "video-blog",
      label: "Video Blog",
      title: "Video essays & talks.",
      lede: "Short recorded breakdowns on operational clarity and executive communication.",
      tone: "dark",
      blocks: [
        {
          kind: "frames",
          title: "Featured recordings",
          lede: "Recorded from live masterclasses and studio sessions.",
          items: [
            { label: "How to Audit Your Company's Bottlenecks in 30 Minutes", meta: "Business Doctor Briefing", spec: "1920x1080", ratio: "16 / 9", src: `${UNSPLASH}1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80`, alt: "A modern workspace interior with warm daylight" },
            { label: "The 3-Part Structure for High-Stakes Answers", meta: "The Bookwishes Club Session", spec: "1920x1080", ratio: "16 / 9", src: `${UNSPLASH}1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80`, alt: "A speaker presenting to a room from the front" },
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
  lede: "Moments from consulting engagements, leadership workshops, and public speaking cohorts.",
  sections: [
    {
      id: "event-photos",
      label: "Photos & Event Photos",
      title: "Photos from the work.",
      lede: "Sessions, stages and the rooms in between.",
      blocks: [
        {
          kind: "frames",
          title: "Moments from the field",
          lede: "Consulting rooms, workshop circles, and keynote stages.",
          items: [
            { label: "Public Speaking Cohort Session", meta: "The Bookwishes Club", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80`, alt: "A trainer speaking to a seated group in a workshop" },
            { label: "Corporate Operations Workshop", meta: "Leadership Alignment", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1664382953481-141e97ad9825?auto=format&fit=crop&w=1600&q=80`, alt: "Attendees at tables working through a session" },
            { label: "Executive Diagnostic Roundtable", meta: "Business Doctor", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1573164574572-cb89e39749b4?auto=format&fit=crop&w=1600&q=80`, alt: "A small group in conversation around a table" },
            { label: "Workflow & Systems Mapping Sprint", meta: "Client Premises", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80`, alt: "A team collaborating around a whiteboard" },
            { label: "Keynote Stage Setup", meta: "Annual Leadership Conference", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1582192730841-2a682d7375f9?auto=format&fit=crop&w=1600&q=80`, alt: "An empty stage set for a talk before the audience arrives" },
            { label: "Hospitality Pre-Opening Architecture", meta: "Enterprise Project", spec: "1600x1200", ratio: "4 / 3", src: `${UNSPLASH}1574848296471-28f79a036f79?auto=format&fit=crop&w=1600&q=80`, alt: "A building exterior in daylight" },
          ],
        },
      ],
    },
    {
      id: "media-coverage",
      label: "Media Coverage",
      title: "Featured talks & dialogues.",
      lede: "Conversations on operational turnarounds, hospitality systems, and personal mastery.",
      blocks: [
        {
          kind: "cards",
          title: "Highlights",
          items: [
            {
              title: "Building Systems That Survive Without the Founder",
              meta: "Executive Leadership Dialogue",
              body: "An in-depth conversation on transitioning family-run and founder-led enterprises into process-driven organizations.",
            },
            {
              title: "Why Public Speaking Is a Thinking Discipline",
              meta: "The Bookwishes Club Feature",
              body: "Exploring how structured articulation transforms career confidence and executive presence across 300+ club graduates.",
            },
            {
              title: "Lessons from Aviation & Luxury Hospitality",
              meta: "Industry Keynote",
              body: "How standards learned at Hyatt International and Qatar Airways apply to hospitals, retail chains, and manufacturing floors.",
            },
          ],
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
          title: "Inside every engagement",
          items: [
            "A working session, mid disagreement, where the real bottleneck finally surfaces.",
            "Printed process diagrams covered in red-pen edits from the people who actually do the work.",
            "The quiet training room an hour before the cohort arrives.",
            "The whiteboard map that replaces a 60-page strategy deck.",
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
      title: "Office & session locations.",
      lede: "Consulting headquarters and The Bookwishes Club training center.",
      blocks: [
        {
          kind: "cards",
          title: "Where to find us",
          items: [
            {
              title: "Executive Consulting Office (Business Doctor)",
              meta: "By Appointment • Mon – Fri, 10:00 AM – 6:00 PM",
              body: "Available for in-person founder diagnostics, boardroom strategy sessions, and on-site enterprise engagements across Nepal and India.",
            },
            {
              title: "The Bookwishes Club Center",
              meta: "Public Speaking & Self-Development • Tue – Sun",
              body: "Dedicated training rooms for weekly speaking cohorts, weekend intensives, and community reading sessions.",
            },
            {
              title: "Direct Executive Desk",
              meta: "Email & Concierge",
              body: "Reach our office directly at connect@lokeshrohilla.com for speaking invitations, consulting scopes, or cohort scheduling.",
            },
          ],
        },
      ],
    },
    {
      id: "social-media",
      label: "Social Media Links",
      title: "Connect online.",
      lede: "Follow essays, session clips, and verified member reviews.",
      blocks: [
        {
          kind: "cards",
          title: "Official channels",
          items: [
            {
              title: "Google Reviews — The Bookwishes Club",
              meta: "4.6★ across 318+ Reviews",
              body: "Read verified experiences from public speaking and self-development members on Google.",
              href: "https://share.google/MNnpINkRvgzdZAJTH",
            },
            {
              title: "LinkedIn — Lokesh Rohilla",
              meta: "Executive Essays & Case Notes",
              body: "Long-form notes on operational turnarounds, leadership accountability, and organizational design.",
              href: "https://www.linkedin.com",
            },
            {
              title: "Instagram & YouTube — The Bookwishes Club",
              meta: "Live Session Clips & Speaking Drills",
              body: "Watch cohort speeches, impromptu articulation breakdowns, and behind-the-scenes workshop moments.",
              href: "https://www.instagram.com",
            },
          ],
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
