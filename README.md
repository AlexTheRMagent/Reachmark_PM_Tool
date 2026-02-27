# Reachmark PM Tool (ClickUp-like MVP)

Production-oriented MVP built with Next.js App Router, TypeScript, Tailwind, Prisma/Postgres, NextAuth credentials auth, Zustand, and Socket.IO realtime events.

## Stack
- Next.js 15 App Router + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma ORM
- NextAuth credentials provider
- Zustand state store
- Socket.IO realtime event server
- Vitest tests
- Docker Compose for local Postgres

## Included Scope
- Workspace hierarchy: Workspace > Space > Folder > List > Task > Subtask
- Core tasking: statuses, priority, multiple list membership model, assignees relation, comments, attachments metadata, activity log
- Views baseline: List/Board/Calendar/Table switcher in task surfaces
- Modules: Home, Inbox, Space/Folder/List pages, Task detail page, Docs editor, Goals, Dashboards widgets baseline, Automations trigger-condition-action baseline
- Roles and sharing baseline: Owner/Admin/Member/Guest model + share permissions UI/API
- Global search page + search API
- Notifications center with mark-all-read + realtime event feed
- Seed scripts and test scripts

## Explicitly Excluded
- Integrations/connectors
- AI features (including AI notetaker)
- Time tracking
- In-app video recording
- 2FA
- Templates
- Customer support tooling
- Workload management
- Mind maps
- Timeline view
- Google SSO
- Billing

## Project Structure
- `src/app` - App Router pages and API routes
- `src/components` - layout/ui/feature components
- `src/lib` - auth, prisma client, permissions, realtime utilities
- `src/store` - Zustand stores
- `src/server/socket.ts` - Socket.IO server + emit bridge endpoint
- `prisma/schema.prisma` - domain model
- `prisma/seed.ts` - demo data seed
- `tests` - critical-flow tests

## Domain Model
Prisma entities include:
- Workspace, WorkspaceMember, User, Team, TeamMember
- Space, Folder, List
- Task, TaskList, TaskAssignee, TaskDependency, Status
- CustomField, TaskCustomFieldValue
- Comment, Attachment
- Doc
- Goal
- Dashboard
- AutomationRule
- Notification, NotificationPref
- SharePermission
- ActivityLog

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env
```

3. Start Postgres:
```bash
docker compose up -d
```

4. Generate Prisma client + migrate + seed:
```bash
npx prisma migrate dev --name init
npm run db:seed
```

5. Start realtime server (terminal 1):
```bash
npm run socket
```

6. Start web app (terminal 2):
```bash
npm run dev
```

7. Create/check demo user if needed:
```bash
curl http://localhost:3000/api/register
```

8. Login:
- Email: `demo@reachmark.dev`
- Password: `demo1234`

## Validation Commands
```bash
npm run lint
npm run test
npm run build
```

## Critical Flows Implemented
- Create task in list and view task details
- Add task comments
- Create/edit docs
- Create goals and progress bars
- Create dashboards with baseline widgets
- Create automation rules
- Global search across tasks/docs/goals
- Notifications center and realtime events for key actions
- Basic permissions and share records

## Gap Notes (MVP Tradeoffs)
- Views are baseline abstractions; board/calendar/table currently reuse list-level task data instead of full specialized UI engines.
- Docs editor is plain textarea-based and supports task/doc comments model, not rich block editing.
- Automation engine stores rules and emits events but does not execute asynchronous workflow jobs yet.
- Sharing controls persist permissions but enforcement is baseline and not comprehensive across every query path.
- No file upload binary handling; attachments are metadata model only.
- No import/export wizard UI yet.
- Mobile-specific UX is responsive baseline, not native-parity feature complete.

## Scripts
- `npm run dev` - start Next.js dev
- `npm run socket` - start Socket.IO server
- `npm run build` - prisma generate + next build
- `npm run lint` - lint
- `npm run test` - run tests
- `npm run db:seed` - seed demo data
