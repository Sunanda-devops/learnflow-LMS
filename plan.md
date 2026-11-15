# LearnFlow LMS — plan

## Product scope

LearnFlow is a new learning management system inspired by the core information architecture of the public Ashokm96/LMS repository, but with an original product identity, interface, and implementation. It serves three role-aware audiences: learners who need a clear next lesson and visible progress, instructors who need curriculum control and cohort visibility, and administrators who need oversight of users, enrollments, and course health.

The first implementation will make the learner dashboard the default experience, with course discovery, course detail, focused lesson delivery, persistent-progress-ready data structures, instructor/admin views, and seeded demo content so the product is immediately legible in Preview. Manus OAuth remains the real authentication provider supplied by the starter; the UI will preserve a useful logged-out demo state while exposing the real sign-in action.

## Implementation approach

- **Frontend:** React + TypeScript + Wouter routes + Tailwind CSS. The application will use a responsive shell with a left navigation rail on desktop and a compact top/bottom navigation pattern on smaller screens.
- **Backend:** Existing Express + tRPC starter. The current authentication context and protected/admin procedures will be reused rather than replaced.
- **Persistence:** Extend the Drizzle MySQL schema with categories, courses, modules, lessons, enrollments, progress, and activity records. Add typed data-access helpers and tRPC procedures for dashboard, course detail, progress updates, and admin summaries. The UI includes deterministic demo data as a resilient first-render fallback while the database is empty or unavailable.
- **Routes:** `/` dashboard, `/courses` catalog, `/courses/:slug` course detail, `/learn/:lessonId` lesson experience, and `/admin` role-aware management workspace. `public/manus-routes.json` will declare every page route.
- **Validation:** Run TypeScript diagnostics, `pnpm check`, `pnpm test`, and `pnpm build`; start the dev server and verify `/api/health` and `/manus-routes.json`.

## Design direction

### Candidate styles

1. **Editorial learning studio** — quiet paper surfaces, ink typography, and a warm signal color that makes progress feel personal. (0.07)
2. **Command-center SaaS** — dark glass panels, electric accents, and dense operational tables for high-frequency admin work. (0.06)
3. **Playful cohort notebook** — colorful tabs, rounded cards, and expressive illustrations that emphasize community. (0.08)

### Chosen style: Editorial learning studio

- **Design movement:** Contemporary editorial dashboard with the restraint of a premium course catalog and the clarity of a field notebook.
- **Core principles:** Make the next action obvious; let progress read at a glance; use generous whitespace around dense information; distinguish learner warmth from admin precision.
- **Color philosophy:** Ink navy anchors trust and focus; warm parchment keeps long lesson pages calm; a saturated coral-orange acts as the ownable “keep going” signal; sage and muted lilac differentiate states without turning the interface into a rainbow.
- **Layout paradigm:** A persistent left rail frames a wide editorial canvas. The main column reads like a daily brief, while secondary course and activity information sits in offset panels rather than a uniform card grid.
- **Signature elements:** Orange progress strokes with rounded caps; oversized serif section headlines paired with small uppercase metadata; a “Today’s focus” panel that behaves like a bookmark.
- **Interaction philosophy:** Every screen answers “what should I do next?” Actions use concise verbs and preserve context. Completion feedback should feel like a small, confident confirmation rather than a modal interruption.
- **Animation:** Use short 160–220ms ease-out transitions for navigation, progress fills, and card hover lift. Avoid looping decorative motion; use a single soft pulse for active lesson status and respect reduced-motion preferences.
- **Typography system:** Use `DM Sans` for controls, labels, and body copy, with `DM Serif Display` for page titles and course headlines. Establish strong size contrast between editorial headlines and compact metadata.
- **Brand essence:** A learning workspace that turns scattered study into a visible rhythm — focused, reassuring, quietly ambitious.
- **Brand voice:** Clear, encouraging, and specific. Example lines: “Pick up where your thinking left off.” and “One focused lesson is enough for today.”
- **Wordmark & logo:** “LearnFlow” is set as a compact wordmark with a coral underline that breaks into three ascending study marks, suggesting lessons becoming momentum.
- **Signature brand color:** Signal Coral `#F26B4F`, reserved for the next-action button, active progress, and the LearnFlow mark.

## Project structure

- `client/src/App.tsx` — route map and shared providers.
- `client/src/pages/Home.tsx` — learner dashboard, catalog, course detail, lesson, and admin UI compositions for the first product slice.
- `client/src/index.css` — design tokens, editorial typography, responsive shell, and bespoke dashboard utilities.
- `drizzle/schema.ts` — durable LMS entities and inferred types.
- `server/db.ts` — database access helpers and seed-friendly queries.
- `server/routers.ts` — public, protected, progress, and admin tRPC procedures.
- `public/manus-routes.json` — page route manifest for preview and published routing.
- `TODO.md` — delivery outcomes and acceptance criteria.

## Product behavior

The learner dashboard opens with a personalized greeting, a “Today’s focus” resume action, active-course progress, upcoming learning, and recent activity. Course detail shows modules and lessons with completion state. Lesson view supports previous/next navigation and completion. Catalog supports category filtering and search. The admin workspace exposes summary metrics, course publishing state, learner enrollment, and recent learner activity. All important actions have clear empty/loading/error-friendly presentation states, and the layout collapses cleanly on mobile.
