---
paths:
  - app/**/*.tsx
---

# Routing Rules (app/ directory)

Files in `app/` are Expo Router routes. Keep them minimal.

## What belongs here

- Import and render the screen component from `components/`
- Call `useScreenOptions()` for header configuration
- Export default function named after the route

## What does NOT belong here

- Business logic, state management, data fetching
- Complex JSX beyond a single component render
- Inline styles or layout code
- Direct Supabase calls

## Example

```tsx
import { ExerciseListScreen } from '@/components/exercises/list/ExerciseListScreen';
import { useScreenOptions } from '@/hooks/useScreenOptions';

export default function Exercises() {
  useScreenOptions({ title: 'Вправи' });

  return <ExerciseListScreen />;
}
```

## Layout files

`_layout.tsx` files may contain navigation configuration (Stack, Tabs) but should not contain business logic.
