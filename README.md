[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=calendar-appointments)](https://calendar-appointments.vercel.app/) [![Codecov](https://codecov.io/gh/DoctorDerek/doctorderek-portfolio-calendar/graph/badge.svg)](https://app.codecov.io/gh/DoctorDerek/doctorderek-portfolio-calendar)

# Calendar & Appointments

A responsive TypeScript calendar for creating, color-coding, reviewing, and deleting reminders.

[Open the production application →](https://calendar-appointments.vercel.app/)

## Product highlights

- Navigate a responsive six-week monthly calendar.
- Create reminders with a selected date, time, color, and maximum 30-character description.
- Keep reminders chronologically ordered and review or delete them from a daily agenda.
- Switch calendar entries between compact icons and visible appointment times.
- Choose an explicit light or dark theme independently of the operating-system preference.
- Keep theme, display-mode, and navigation controls separated across mobile and desktop headers.

## Technology

| Domain                 | Implementation                                                       |
| ---------------------- | -------------------------------------------------------------------- |
| Application            | Next.js 16 and React 19                                              |
| State                  | Redux Toolkit 2 and React Redux 9                                    |
| Interface              | Material UI 6, MUI X 7, Tailwind CSS 4, and Emotion 11               |
| Interaction            | Motion 12 and next-themes 0.4                                        |
| Dates                  | Day.js 1                                                             |
| Tooling                | TypeScript 6, ESLint 9, Prettier 3, Node.js 24, and pnpm 11          |
| Quality infrastructure | Vitest 4, Playwright 1, GitHub Actions, Vercel previews, and Codecov |

Production builds run strict TypeScript validation. Pull requests run ESLint and Vitest coverage, while Playwright is connected to successful Vercel preview deployments. Test infrastructure is configured, but the current repository does not yet contain test or spec files; rebuilding high-value integration and end-to-end coverage remains active work.

## Local development

The repository pins Node.js 24 in `.node-version` and pnpm 11 in `package.json`.

```bash
fnm use
corepack enable pnpm
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

Run the project’s current quality gates before submitting changes:

```bash
pnpm build
pnpm lint
pnpm format
pnpm exec tsc --noEmit
git diff --check
```

The repository also exposes `pnpm test`, `pnpm test:e2e`, and `pnpm test:e2e:ui` for its configured Vitest and Playwright environments.

## Project history and provenance

[AmTote](https://github.com/AmTote/calendar-appointments) supplied the original React and Redux calendar as a take-home exercise and instructed candidates to fork it and submit a completed repository link. This portfolio edition preserves that provenance while documenting Dr. Derek Austin’s substantial modernization and product work, including the reminder workflow, Redux Toolkit state, strict TypeScript architecture, Next.js migration, responsive interface, theme system, continuous integration, and Vercel delivery.

## License and credits

Copyright © 2026 Dr. Derek Austin. All rights reserved. See [LICENSE.txt](LICENSE.txt).

- Background photograph by Benjamin Patin via [Unsplash](https://unsplash.com/).
- Animated theme control by [@bartkozal](https://codesandbox.io/s/dark-mode-toggle-si6k2?file=/src/DarkModeToggle.js), used with permission.
- Spiral-calendar favicon generated from Twitter Twemoji under CC BY 4.0; see the complete [favicon attribution](public/favicon-io/about.txt).
