# Calendar Appointments (MQA Baseline)

This repository is built upon the **Minimum QREAM Architecture (MQA)**. It is meticulously engineered for extreme velocity, aesthetic excellence, deterministic resolution, and frictionless graphical workflows.

## Architecture & Principles

- **The Pillar of Good Taste (QREAM):** UI/UX is paramount. We prioritize motion, micro-interactions, and flawless typography.
- **The Pillar of The GUI Cowboy:** Local development utilizes GitHub Desktop and Visual Studio Code. Terminal usage is minimized and restricted to hyper-specific tasks. No blocking Git hooks (Husky/Lint-staged are banned).
- **The Pillar of Sovereign Time:** All configuration files are hyper-minimal. Pedantic linting is suppressed (`only-warn`), and formatting is fully automated on save (`@ianvs/prettier-plugin-sort-imports`).
- **The Pillar of Idiomatic Instantiation:** The lockfile mathematically guarantees deterministic builds across all environments.

## Technology Stack

- **Core:** Next.js (App Router Migration in Progress)
- **UI Framework:** React
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS + Vanilla CSS (MUI is being phased out)
- **Package Manager:** `pnpm` (v11 strict)
- **Node Version:** `v24` (via `fnm`)

## Local Initialization

This repository enforces strict sovereign tooling. Follow these exact incantations to bootstrap the local environment on Windows:

1. **Install fnm (Fast Node Manager) & Corepack:**
   Ensure `fnm` is installed and run:
   ```powershell
   fnm use
   corepack enable pnpm
   ```
2. **Install Dependencies:**
   All installations MUST go through `pnpm` (v11):
   ```powershell
   pnpm install
   ```
3. **Run Development Server:**
   ```powershell
   pnpm dev
   ```
