# LearnFlow LMS

LearnFlow is a production-minded learning management system for focused, self-paced learning. It includes a learner dashboard, searchable course library, course detail pages, a lesson player, authenticated lesson progress, and an admin overview.

The application uses React, Vite, Express, tRPC, Drizzle ORM, and MySQL 8+. Without a database it remains usable with the bundled demo catalog; with a database it enables real courses, lesson content, progress, activity, and admin metrics.

## Features

- Learner dashboard with continue-learning, activity, streak, and upcoming-work panels.
- Searchable course catalog with category filters and responsive layouts.
- Database-backed course, module, lesson, and lesson-content delivery.
- Lesson completion persisted per authenticated user and validated against the owning course.
- Admin workspace with learner, enrollment, course, and completion metrics.
- Seed migration containing four published courses and sixteen lessons.
- Health endpoint at `GET /api/health`.
- Container build and local MySQL service via Docker Compose.
- Architecture source diagram in [`docs/architecture.mmd`](docs/architecture.mmd).

## Architecture

![LearnFlow architecture](docs/architecture.png)

The browser loads the React/Vite client. Client data access uses the typed tRPC API exposed by Express. Server procedures use the platform session for authentication and Drizzle ORM for MySQL access. Course content is public, while progress mutations and learner progress queries require an authenticated session.

```text
React/Vite client -> tRPC over HTTP -> Express procedures -> Drizzle ORM -> MySQL 8+
        |                    |              |
        +-- public catalog   +-- OAuth      +-- progress/activity validation
        +-- lesson player    +-- admin      +-- course/module/lesson queries
```

## Prerequisites

- Node.js 22 or newer.
- Corepack-enabled package manager; the repository pins `pnpm@10.18.0`.
- MySQL 8.0+ for database-backed mode.
- Docker and Docker Compose are optional but recommended for local MySQL.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sunanda-devops/learnflow-LMS.git
   cd learnflow-LMS
   ```

2. Install locked dependencies:

   ```bash
   corepack enable
   pnpm install --frozen-lockfile
   ```

3. Create local configuration:

   ```bash
   cp .env.example .env
   ```

4. Start MySQL:

   ```bash
   docker compose up -d mysql
   ```

5. Apply the schema and seed data:

   ```bash
   pnpm db:migrate
   ```

6. Start the development server:

   ```bash
   pnpm dev
   ```

Open `http://localhost:3000`. The server binds to `0.0.0.0` and honors `PORT`.

## Configuration

The minimum local `.env` is:

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://learnflow:learnflow@127.0.0.1:3306/learnflow
```

For hosted deployments, provide platform authentication values through the hosting environment. Never commit `.env`, database passwords, OAuth secrets, or API keys. `.env.example` contains safe development defaults only.

## Scripts

| Command           | Purpose                                               |
| ----------------- | ----------------------------------------------------- |
| `pnpm dev`        | Start Vite-powered development mode through Express.  |
| `pnpm build`      | Build the browser bundle and production server.       |
| `pnpm start`      | Serve the production build.                           |
| `pnpm check`      | Run strict TypeScript validation.                     |
| `pnpm test`       | Run Vitest tests.                                     |
| `pnpm db:migrate` | Apply checked-in Drizzle migrations.                  |
| `pnpm db:push`    | Generate and apply schema changes during development. |
| `pnpm format`     | Format source files with Prettier.                    |

## Database model

- `users`: platform identities and roles.
- `categories`: catalog grouping.
- `courses`: published, draft, and archived learning products.
- `modules`: ordered sections inside a course.
- `lessons`: ordered content and duration inside a module.
- `enrollments`: learner-course membership.
- `progress`: per-user lesson completion and last-viewed timestamps.
- `activity`: learner and publishing timeline events.

Run migrations in shared environments only after reviewing their SQL. The migration history includes table creation and seed content.

## API surface

The typed router is in [`server/routers.ts`](server/routers.ts):

- `lms.courses`: list published courses.
- `lms.courseBySlug`: fetch a course with ordered modules and lessons.
- `lms.lessonById`: fetch a published lesson with its module and course.
- `lms.myProgress`: fetch the signed-in learner's progress for a course.
- `lms.completeLesson`: create or update completion and append activity.
- `lms.adminSummary`: return aggregate admin metrics for an authorized admin.

## Verification

```bash
pnpm check
pnpm test
pnpm build
curl -fsS http://localhost:3000/api/health
```

The health endpoint returns `{"status":"ok"}`.

## Troubleshooting

### `DATABASE_URL` is missing

The app intentionally falls back to the demo catalog when the database is unavailable. To enable persisted courses and progress, copy `.env.example`, set `DATABASE_URL`, start MySQL, and run `pnpm db:migrate`.

### MySQL connection refused

Check the service and logs:

```bash
docker compose ps
docker compose logs mysql
docker compose up -d mysql
```

MySQL can take several seconds to become ready. Wait for the health check to report `healthy`, then rerun `pnpm db:migrate`.

### Migration already applied or schema drift

For a disposable local database only, remove the volume and recreate it:

```bash
docker compose down -v
docker compose up -d mysql
pnpm db:migrate
```

Never use `down -v` against a shared or production database.

### Lesson completion does not persist

Completion requires an authenticated user and a valid numeric database lesson ID. Confirm the browser session is active, the lesson belongs to the selected course, and the server can write to `progress` and `activity`. The API rejects course/lesson mismatches instead of silently writing incorrect progress.

### Port already in use

```bash
PORT=3100 pnpm dev
```

### Build or type errors after dependency changes

```bash
rm -rf node_modules
pnpm install --frozen-lockfile
pnpm format
pnpm check
```

## Container deployment

Build and run the application container after supplying a reachable `DATABASE_URL`:

```bash
docker build -t learnflow:local .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL='mysql://learnflow:learnflow@host.docker.internal:3306/learnflow' \
  learnflow:local
```

The container exposes port `3000` and starts with `node dist/index.js`. Use `/api/health` as the readiness check.

## Project layout

```text
client/       React application, routes, styles, and public route manifest
server/       Express server, tRPC router, authentication, and database access
shared/       Shared types and constants
drizzle/      MySQL schema, migrations, and seed content
docs/         Architecture source and rendered documentation assets
Dockerfile    Reproducible production image build
```

## Screenshots

The interface is composed from CSS and data-driven components so screenshots can be generated against the running app in CI or a deployment preview. Recommended capture routes are `/`, `/courses`, `/courses/strategic-storytelling`, and `/admin`; the architecture diagram above is included as a stable documentation visual that does not depend on a running service.

## License

MIT
