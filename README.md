[![Production](https://img.shields.io/website?url=https%3A%2F%2Fportfolio-calendar.doctorderek.com%2F&up_message=live&down_message=offline&label=production&logo=vercel&logoColor=white)](https://portfolio-calendar.doctorderek.com/) [![Codecov](https://codecov.io/gh/DoctorDerek/doctorderek-portfolio-calendar/graph/badge.svg)](https://app.codecov.io/gh/DoctorDerek/doctorderek-portfolio-calendar) [![Test and Lint](https://github.com/DoctorDerek/doctorderek-portfolio-calendar/actions/workflows/test-and-lint.yml/badge.svg)](https://github.com/DoctorDerek/doctorderek-portfolio-calendar/actions/workflows/test-and-lint.yml) [![Playwright E2E](https://github.com/DoctorDerek/doctorderek-portfolio-calendar/actions/workflows/playwright.yml/badge.svg)](https://github.com/DoctorDerek/doctorderek-portfolio-calendar/actions/workflows/playwright.yml)

# Calendar

A responsive TypeScript calendar for creating, color-coding, reviewing, and deleting reminders.

[Open the production application →](https://portfolio-calendar.doctorderek.com)

## Product highlights

- Navigate a responsive six-week monthly calendar.
- Create reminders with a selected date, time, color, and maximum 30-character description.
- Keep reminders chronologically ordered and review or delete them from a daily agenda.
- Switch calendar entries between compact icons and visible appointment times.
- Choose light or dark mode manually, or follow the operating-system preference by default.
- Keep theme, display-mode, and navigation controls separated across mobile and desktop headers.

## Technology

| Domain                 | Implementation                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| Application            | Next.js 16 and React 19                                                                                       |
| State                  | Redux Toolkit 2 and React Redux 9                                                                             |
| Interface              | Material UI 9, MUI X 9, Tailwind CSS 4, and Emotion 11                                                        |
| Interaction            | next-themes 0.4, Motion reminder-list choreography, native CSS transitions, and system reduced-motion support |
| Dates                  | Day.js 1                                                                                                      |
| Delivery               | Bounded responsive WebP optimization, one-year image caching, static asset hashes, and self-hosted Roboto     |
| Tooling                | TypeScript 6, ESLint 9, Prettier 3, Node.js 24, and pnpm 11                                                   |
| Quality infrastructure | Vitest 4 with 100% measured coverage, Playwright 1, GitHub Actions, Vercel previews, and Codecov              |

Production builds run strict TypeScript validation. Pull requests run ESLint and Vitest coverage, while successful protected Vercel preview deployments trigger Playwright across Chromium, Firefox, and WebKit with short-lived GitHub OIDC authentication refreshed for every test. The test suite covers calendar navigation and day selection, theme and display toggles, reminder persistence and workflows, keyboard interaction, accessibility-sensitive behavior, and reduced-motion behavior.

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

## Provenance

[AmTote](https://github.com/AmTote/calendar-appointments) supplied the original React and Redux calendar as a take-home exercise and instructed candidates to fork it and submit a completed repository link. This portfolio edition preserves that provenance while documenting Dr. Derek Austin’s substantial modernization and product work, including the reminder workflow, Redux Toolkit state, strict TypeScript architecture, Next.js migration, responsive interface, theme system, continuous integration, and Vercel delivery.

## License and credits

Copyright © 2026 Dr. Derek Austin. All rights reserved. See [LICENSE.txt](LICENSE.txt).

- Background photograph by Benjamin Patin via [Unsplash](https://unsplash.com/).
- Animated theme control by [@bartkozal](https://codesandbox.io/s/dark-mode-toggle-si6k2?file=/src/DarkModeToggle.js), used with permission.
- Spiral-calendar favicon generated from Twitter Twemoji under CC BY 4.0; see the complete [favicon attribution](public/favicon-io/about.txt).
