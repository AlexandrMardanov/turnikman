---
paths:
  - lib/*-service.ts
  - lib/**/*-service.ts
---

# Service Layer Rules

All Supabase interactions go through service files in `lib/`. Components never call Supabase directly.

## Pattern

- Export async functions that return typed results
- Handle errors inside the service — return `{ data, error }` objects or throw
- Use the shared Supabase client from `lib/supabase.ts`
- Type all Supabase responses — no `any`

## Naming

- File: `<feature>-service.ts` (e.g., `weight-service.ts`, `auth-service.ts`)
- Functions: verb-first (e.g., `getWeightEntries`, `createWeightEntry`, `deleteWeightEntry`)

## Example

```ts
import { supabase } from '@/lib/supabase';

export async function getWeightEntries(userId: string) {
  const { data, error } = await supabase
    .from('weight_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;

  return data;
}
```
