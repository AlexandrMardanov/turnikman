# Exercises Feature

## Overview

The Exercises feature provides a database of calisthenics exercises that users can browse, filter, and track. All exercises are user-created and stored in Supabase. For each exercise, users can set a personal goal value and view a log history.

**Status**: 🚧 In Progress

### Exercise Types

- `weight` — sets and reps based (e.g. pull-ups, push-ups)
- `time` — duration based in seconds (e.g. plank, L-sit)
- `emom` — EMOM protocol (no type-specific parameters yet)

## Navigation

The exercises feature is accessible from the **Exercises** tab in the bottom tab navigation.

**Routes**:

- `app/(tabs)/(exercises)/_layout.tsx` — Stack navigation layout
- `app/(tabs)/(exercises)/index.tsx` — Exercise list (main screen)
- `app/(tabs)/(exercises)/[id].tsx` — Exercise detail
- `app/(tabs)/(exercises)/add-edit.tsx` — Add/Edit form

**Header Button**: The list screen has an "Add" button in the header for creating exercises.

## Screens & Components

### ExerciseListScreen

**Location**: `components/exercises/list/ExerciseListScreen.tsx`

The main screen displaying all exercises with filtering:

- **FilterButton** — tappable button in the header that opens the filter sheet
- **FilterBottomSheet** — bottom sheet with chip filters for muscle group, difficulty, and type; each category is single-select and toggleable
- **FlatList** of **ExerciseItem** cards — shows name, muscle group badge, DifficultyBars, and type badge
- **Empty state** — shown when no exercises match the active filters
- Refreshes automatically on screen focus (via `useFocusEffect`)

### ExerciseDetailScreen

**Location**: `components/exercises/detail/ExerciseDetailScreen.tsx`

A scrollable detail view for a single exercise:

- **ExerciseImage** — displays `image_url`; falls back to a barbell icon placeholder
- Exercise name as a heading
- **ExerciseInfo** — muscle group badge, DifficultyBars, type badge, **ExerciseGoalBadge** (shows `goal_value` with unit if set), description, primary and secondary muscle sections
- **ExerciseTechnique** — technique card (only rendered when `technique` is set)
- **ExerciseLogSection** — placeholder; shows "Історія" title and "Немає записів" (log add/delete not yet implemented)
- Edit button shown in the header once the exercise loads; navigates to the add-edit form
- Refreshes automatically on screen focus via `useRefreshOnFocus`

### AddEditExerciseForm

**Location**: `components/exercises/add-edit/AddEditExerciseForm.tsx`

Form for creating or editing an exercise:

- **Image URL** — tap "URL" button to enter an image URL; shows **ImagePreview** with remove button when an image is set
- **Name** — required text input (auto-focused when adding)
- **Type** — chip selector: Силова / На час / EMOM
- **Muscle group** — chip selector: required
- **Difficulty** — chip selector: easy / medium / hard (defaults to `medium`)
- **Description** — multiline text input
- **Primary muscles** — comma-separated text input
- **Secondary muscles** — comma-separated text input
- **Technique** — multiline text input for technique notes and common mistakes
- **Goal value** — numeric input; label is "Макс. повторень (ціль)" by default, changes to "Макс. секунд (ціль)" for `time` type
- **Save / Cancel** buttons
- **Delete button** — trash icon in the header; only visible in edit mode; shows a confirmation alert before deleting the exercise and navigating back to the list

Form behavior:

- When adding: name input is auto-focused
- When editing: all fields pre-populated from the existing exercise data fetched from Supabase

## Data Model

### Storage

All data is stored in Supabase (PostgreSQL) with Row Level Security — each user sees only their own exercises and logs.

- **exercises** table — user-created exercises; RLS scoped by `user_id`
- **exercise_logs** table — workout logs per exercise; RLS scoped by `user_id`, FK to `exercises(id)` with `ON DELETE CASCADE`

### Data Types

```typescript
type MuscleGroup = 'back' | 'chest' | 'legs' | 'abs' | 'shoulders' | 'arms';
type Difficulty = 'easy' | 'medium' | 'hard';
type ExerciseType = 'weight' | 'time' | 'emom';

type Exercise = {
  id: string;
  name: string;
  type: ExerciseType;
  muscle_group: MuscleGroup;
  difficulty: Difficulty;
  description: string | null;
  image_url: string | null;
  primary_muscles: string[];
  secondary_muscles: string[];
  technique: string | null;
  goal_value: number | null;     // reps for weight/emom, seconds for time
  created_at: string;
};

type ExerciseLog = {
  id: string;
  user_id: string;
  exercise_id: string;
  date: string;                  // ISO date "YYYY-MM-DD"
  sets?: number;                 // weight type
  reps?: number;                 // weight type
  weight_kg?: number;            // weight type, optional
  duration_sec?: number;         // time type
  rounds_completed?: number;     // emom type
  notes: string | null;
  created_at: string;
};

type ExerciseFilters = {
  muscleGroup: MuscleGroup | null;
  difficulty: Difficulty | null;
  type: ExerciseType | null;
};

type ExerciseCreate = Omit<Exercise, 'id' | 'created_at'>;
type ExerciseUpdate = Partial<Omit<Exercise, 'id' | 'created_at'>>;
```

## User Flows

### Browse Exercises

1. User opens the Exercises tab
2. List loads all user exercises from Supabase
3. User taps the filter button to open the filter bottom sheet
4. User taps a chip to narrow results (muscle group, difficulty, or type); tap again to deselect
5. User taps an exercise card to view its detail

### View Exercise Detail

1. User taps an exercise in the list
2. Detail screen loads exercise data and log history in parallel
3. Image or placeholder is shown at the top
4. Exercise info, goal badge, and technique (if set) are displayed
5. Log history section shows placeholder ("Немає записів")

### Add an Exercise

1. User taps the "+" button in the list screen header
2. Add form opens with name auto-focused
3. User fills in required fields (name, type, muscle group, difficulty) and any optional fields
4. Optionally enters an image URL
5. User taps Save — exercise is stored in Supabase and appears in the list

### Edit an Exercise

1. User opens the detail screen of an exercise
2. User taps the Edit button in the header
3. Add-edit form opens pre-populated with existing data
4. User modifies fields and taps Save
5. Exercise is updated in Supabase

### Delete an Exercise

1. User opens the detail screen of an exercise
2. User taps the Edit button in the header
3. Add-edit form opens with a trash icon in the header
4. User taps the trash icon — a confirmation alert appears
5. User confirms — exercise (and all its logs) is deleted; user is navigated back to the list

## Custom Hooks

### useExerciseData

**Location**: `components/exercises/shared/hooks/useExerciseData.ts`

Central hook for the exercise list with CRUD operations:

```typescript
function useExerciseData(filters?: ExerciseFilters) {
  return {
    exercises: Exercise[],
    loading: boolean,
    error: string | null,
    addExercise: (data: ExerciseCreate) => Promise<Exercise>,
    updateExercise: (id: string, data: ExerciseUpdate) => Promise<Exercise>,
    deleteExercise: (id: string) => Promise<void>,
    refresh: () => void,   // silent refresh, no loading spinner
  };
}
```

- Re-fetches automatically when filter values change
- CRUD operations trigger a silent refresh after completion
- Refreshed on list screen focus via `useFocusEffect`

### useExerciseFilters

**Location**: `components/exercises/list/hooks/useExerciseFilters.ts`

Manages filter chip state for the filter bottom sheet:

```typescript
function useExerciseFilters() {
  return {
    filters: ExerciseFilters,
    muscleGroup: MuscleGroup | null,
    difficulty: Difficulty | null,
    type: ExerciseType | null,
    toggleMuscleGroup: (value: MuscleGroup) => void,
    toggleDifficulty: (value: Difficulty) => void,
    toggleType: (value: ExerciseType) => void,
  };
}
```

### useFilterSheet

**Location**: `components/exercises/shared/hooks/useFilterSheet.ts`

Manages the bottom sheet open/close state for the filter UI.

### useExerciseDetail

**Location**: `components/exercises/detail/hooks/useExerciseDetail.ts`

Loads exercise data and log history for the detail screen:

```typescript
function useExerciseDetail(exerciseId: string) {
  return {
    exercise: Exercise | null,
    logs: ExerciseLog[],      // sorted newest first; currently not displayed
    loading: boolean,
    error: string | null,
    refresh: () => void,      // re-fetches exercise and logs; used by useRefreshOnFocus
  };
}
```

- Loads exercise and logs in parallel with `Promise.all`
- RLS scopes logs to the current user automatically (no `user.id` needed)

### useExerciseForm

**Location**: `components/exercises/add-edit/hooks/useExerciseForm.ts`

Manages add/edit form state and submission:

```typescript
type FormState = {
  name: string;
  type: ExerciseType;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  description: string;
  primaryMuscles: string;     // comma-separated raw input
  secondaryMuscles: string;   // comma-separated raw input
  technique: string;
  goalValue: string;
  imageUri: string | null;
};

function useExerciseForm(options: { id?: string }) {
  return {
    form: FormState,
    setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void,
    loading: boolean,          // submission in progress
    initialLoading: boolean,   // loading existing data in edit mode
    handleSubmit: () => void,
    handleCancel: () => void,
  };
}
```

- In edit mode, pre-loads existing exercise data from Supabase
- Validates required fields (name, type, muscle group, difficulty) before submission
- Parses comma-separated muscle inputs into arrays on submit
- Navigates back on successful save

## Service Layer

**Location**: `lib/exercise-service.ts`

All data operations for the exercises feature (Supabase; RLS enforces per-user scoping):

```typescript
// Read
async function getExercises(filters?: ExerciseFilters): Promise<Exercise[]>
// Returns user's exercises from Supabase; applies optional filters

async function getExercise(id: string): Promise<Exercise>
// Returns single exercise; throws "Вправу не знайдено" if not found (PGRST116)

// CRUD
async function addExercise(data: ExerciseCreate): Promise<Exercise>
// Gets user_id from active session internally

async function updateExercise(id: string, data: ExerciseUpdate): Promise<Exercise>
// RLS prevents editing other users' exercises

async function deleteExercise(id: string): Promise<void>
// RLS prevents deleting other users' exercises

// Logs
async function getExerciseLogs(exerciseId: string): Promise<ExerciseLog[]>
// Returns logs sorted newest first; RLS scopes to current user
```

## Utility Functions

### Formatting

**formatDifficulty** (`components/exercises/shared/utils/formatDifficulty.ts`) — converts `Difficulty` to Ukrainian label

**formatExerciseType** (`components/exercises/shared/utils/formatExerciseType.ts`) — converts `ExerciseType` to Ukrainian label

**formatMuscleGroup** (`components/exercises/shared/utils/formatMuscleGroup.ts`) — converts `MuscleGroup` to Ukrainian label

### Styling

**getDifficultyColor** (`components/exercises/shared/utils/getDifficultyColor.ts`) — returns a color constant for a given `Difficulty` level

**getDifficultyDots** (`components/exercises/shared/utils/getDifficultyDots.ts`) — returns dot config for `DifficultyBars` component

### Goal display

**getGoalUnit** (`components/exercises/detail/utils/getGoalUnit.ts`) — returns the unit label ("повт." / "сек.") for a given `ExerciseType`

### Validation

**validateExerciseInput** (`components/exercises/add-edit/utils/validateExerciseInput.ts`) — validates required fields before submission

### Constants

All chip option arrays are in `components/exercises/shared/constants/`:

- `difficulties.ts` — `{ value, label }` pairs for difficulty chips
- `exerciseTypes.ts` — `{ value, label }` pairs for type chips
- `muscleGroups.ts` — `{ value, label }` pairs for muscle group chips

## File Structure

```
components/exercises/
├── list/
│   ├── ExerciseListScreen.tsx               # Main list with filters and FlatList
│   ├── components/
│   │   ├── AddExerciseButton.tsx            # Header "+" button → add-edit screen
│   │   ├── ExerciseItem.tsx                 # Card: name, muscle group, difficulty bars, type
│   │   ├── FilterBottomSheet.tsx            # Bottom sheet with filter chips
│   │   └── FilterButton.tsx                 # Header button that opens the filter sheet
│   └── hooks/
│       └── useExerciseFilters.ts            # Filter state with toggle functions
│
├── detail/
│   ├── ExerciseDetailScreen.tsx             # Scrollable detail view
│   ├── components/
│   │   ├── ExerciseGoalBadge.tsx            # Read-only goal_value badge (shown in ExerciseInfo)
│   │   ├── ExerciseImage.tsx                # Image with barbell icon fallback
│   │   ├── ExerciseInfo.tsx                 # Type, muscle, difficulty, goal badge, description, muscles
│   │   ├── ExerciseLogSection.tsx           # Placeholder: "Історія" + "Немає записів"
│   │   ├── ExerciseTechnique.tsx            # Technique card (conditional)
│   │   └── MuscleSection.tsx               # Labelled list of muscle names
│   ├── hooks/
│   │   └── useExerciseDetail.ts             # Loads exercise and logs
│   └── utils/
│       └── getGoalUnit.ts                   # Returns unit label for goal_value display
│
├── add-edit/
│   ├── AddEditExerciseForm.tsx              # Full add/edit form
│   ├── components/
│   │   ├── ChipSelector.tsx                 # Reusable chip selector
│   │   ├── DeleteExerciseButton.tsx         # Delete with confirmation
│   │   ├── ImagePreview.tsx                 # Image preview with remove button
│   │   └── ImageUrlModal.tsx               # Modal for entering an image URL
│   ├── hooks/
│   │   └── useExerciseForm.ts               # Form state, validation, submit
│   └── utils/
│       └── validateExerciseInput.ts         # Required field validation
│
└── shared/
    ├── components/
    │   └── DifficultyBars.tsx               # Visual difficulty indicator (dot bars)
    ├── constants/
    │   ├── difficulties.ts                  # Difficulty chip options
    │   ├── exerciseTypes.ts                 # Type chip options
    │   └── muscleGroups.ts                  # Muscle group chip options
    ├── hooks/
    │   ├── useExerciseData.ts               # Exercise list + CRUD operations
    │   └── useFilterSheet.ts               # Filter bottom sheet open/close state
    └── utils/
        ├── formatDifficulty.ts
        ├── formatExerciseType.ts
        ├── formatMuscleGroup.ts
        ├── getDifficultyColor.ts
        └── getDifficultyDots.ts

app/(tabs)/(exercises)/
├── _layout.tsx                              # Stack layout
├── index.tsx                               # List route
├── [id].tsx                                # Detail route
└── add-edit.tsx                            # Add/edit route

lib/
└── exercise-service.ts                     # All data operations (Supabase)
```

## Future Enhancements

- Workout logging: type-specific add-log form, log history list, delete log
- EMOM type: duration, work interval, rest interval parameters
- Camera capture or gallery upload for exercise images (currently URL-only)
- Exercise search by name
- Link exercises into training programs and workout sessions
- Progress charts for goal and log history
- Share / export exercise logs
