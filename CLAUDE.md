# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start        # Start Expo dev server
npm run ios          # Run on iOS simulator
npm run lint         # ESLint via expo lint
npm run format       # Prettier with auto import sorting
npm run publish      # EAS update to production (iOS)
```

No test suite is configured.

**After every code change**: run `npm run lint` and fix all errors before considering the task done.

## Architecture

**ТурнікМен** is a React Native calisthenics/fitness tracking app built with Expo 55, React 19, TypeScript, and Supabase.

### Navigation (Expo Router)
File-based routing under `app/`:
- `(auth)/` — unauthenticated screens (login, signup, forgot-password, verify-otp)
- `(tabs)/` — protected tab navigation
  - `(dashboard)/` — main dashboard
  - `(weight)/` — weight tracking (dashboard, history, add-edit)
  - `(exercises)/` — exercises database (in progress)

Auth state drives automatic redirection via `useAuthRedirect` hook.

### State & Data
- **Supabase** (`lib/supabase.ts`) — PostgreSQL + Auth backend; env vars `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Service layer**: `lib/auth-service.ts`, `lib/weight-service.ts` — all Supabase calls go here
- **React Context**: `contexts/` — `AuthContext`, `TabBarContext`, `WeightReminderContext`
- **AsyncStorage** — local persistence

### Component/Feature Structure
```
components/
  <feature>/           # e.g., weight/, auth/, dashboard/
    <page>/            # e.g., dashboard/, history/, add-edit/
      components/      # Page-specific components
      hooks/           # Page-specific hooks (useHookName)
      utils/           # One function per file
      constants/
    shared/            # Feature-shared code
  shared/              # App-wide shared components (Button, ErrorState, LoadingState, etc.)
app/                   # Minimal — only routing/layout files
contexts/
  hooks/               # Context-specific custom hooks
lib/                   # Service layer
constants/             # colors.ts, fonts.ts
```

Keep `app/` files minimal — business logic belongs in `components/`.

## Development Principles

**Think before coding**: State assumptions explicitly. If uncertain, ask. Surface tradeoffs.

**Simplicity first**: Minimum code that solves the problem. No speculative features, abstractions for single-use code, or error handling for impossible scenarios. Ask: "Would a senior engineer say this is overcomplicated?" If yes, rewrite it.

**Surgical changes**: Touch only what you must. Match existing style. Don't "improve" adjacent code or refactor unrelated things. Every changed line should trace directly to the task.

**Goal-driven execution**: Define success criteria before implementing. Transform vague tasks into verifiable goals:
- "Add validation" → Write tests for invalid inputs, then make them pass
- "Fix the bug" → Write a test that reproduces it, then make it pass
- "Refactor X" → Ensure tests pass before and after

## Code Conventions

**Types over interfaces**: Always use `type`, never `interface`.

**Props pattern**:
```ts
type Props = { label: string; onPress: () => void }

export function MyComponent(props: Props) {
  const { label, onPress } = props  // destructure in body, not signature
```

**Event handlers**: Use function declarations named `handleAction` (e.g., `handleSubmit`, `handleChange`). Place them after hooks, before return.

**Empty line before return**: Always add a blank line before `return` statements in functions and components.

**Imports**: Path alias `@/` maps to the repo root. Prettier auto-sorts imports: react → third-party → `@/` → relative.

**Naming**: kebab-case folders, PascalCase components, `useXxx` hooks, one exported function per utility file.

**Dependencies**: Always install packages with exact versions (`npm install --save-exact` / `--save-exact`). No `^` or `~` prefixes.

**Commits**: Conventional commits — `feat:`, `fix:`, `refactor:`, `style:`, `perf:`, `docs:`, `chore:`. Max 50 chars, no period.

## Completion Status

- ✅ Authentication (login, signup, OTP-based password reset)
- ✅ Weight tracking (dashboard with chart, add/edit, history, reminders)
- ❌ Not started: Training programs, skills tracking, exercises database, achievements, workout history
