# Exercises Feature

## Overview

The Exercises feature provides a curated database of calisthenics exercises that users can browse, filter, and track. It includes 10 predefined exercises and allows authenticated users to create custom ones. For each exercise, users can set a personal goal and log individual workout sessions.

**Status**: 🚧 In Progress

### Exercise Types

- `weight` — sets and reps based (e.g. pull-ups, push-ups)
- `time` — duration based in seconds (e.g. plank, L-sit)
- `emom` — EMOM protocol with configurable duration, work interval, and rest interval

## Navigation

The exercises feature is accessible from the **Exercises** tab in the bottom tab navigation.

**Routes**:

- `app/(tabs)/(exercises)/_layout.tsx` — Stack navigation layout
- `app/(tabs)/(exercises)/index.tsx` — Exercise list (main screen)
- `app/(tabs)/(exercises)/[id].tsx` — Exercise detail
- `app/(tabs)/(exercises)/add-edit.tsx` — Add/Edit form (custom exercises only)

**Header Button**: The list screen has an "Add" button in the header for creating custom exercises.

## Screens & Components

### ExerciseListScreen

**Location**: `components/exercises/list/ExerciseListScreen.tsx`

The main screen displaying all exercises with filtering:

- **FilterBar** — horizontal scrollable chip filters; each category is single-select and toggleable (tap again to deselect)
  - Muscle group: back, chest, legs, abs, shoulders, arms
  - Difficulty: easy, medium, hard
  - Type: weight, time, EMOM
- **FlatList** of **ExerciseItem** cards — shows name, type badge, muscle group, and difficulty
- **Empty state** — shown when no exercises match the active filters
- Refreshes automatically on screen focus (via `useFocusEffect`)

### ExerciseDetailScreen

**Location**: `components/exercises/detail/ExerciseDetailScreen.tsx`

A scrollable detail view for a single exercise:

- **ExerciseImage** — displays `image_url` from Supabase Storage; falls back to a barbell icon placeholder
- Exercise name as a heading
- **ExerciseInfo** — type badge, muscle group, difficulty, description, primary and secondary muscles
- **EmomDetails** — duration, work time, rest time (only rendered for `emom` type)
- **ExerciseTips** — tips card (only rendered when `tips` is set)
- **ExerciseGoal** — set/update target value; toggle achieved status (authenticated users only)
- **ExerciseLogSection** — type-specific add-log form plus scrollable log history with delete (authenticated users only)
- Edit button in header: navigates to the add-edit form; shown only for custom exercises (predefined exercises are read-only)

### AddEditExerciseForm

**Location**: `components/exercises/add-edit/AddEditExerciseForm.tsx`

Form for creating or editing a custom exercise:

- **Image picker** — gallery only; selected image is uploaded to Supabase Storage and the resulting URL saved to `image_url`
- **Name** — required text input
- **Type** — chip selector: Силова / На час / EMOM
- **Muscle group** — chip selector: required
- **Difficulty** — chip selector: easy / medium / hard (defaults to `easy`)
- **EMOM params** — duration (min), work time (sec), rest time (sec); only shown when type is `emom`
- **Description** — multiline text input
- **Primary muscles** — comma-separated text input
- **Secondary muscles** — comma-separated text input
- **Tips** — multiline text input
- **Save / Cancel** buttons

Form behavior:

- When adding: name input is auto-focused
- When editing: all fields pre-populated from the existing exercise
- Predefined exercises cannot be edited (only custom exercises created by the user)

## Data Model

### Storage

- **Predefined exercises**: `lib/mock/exercises-data.ts` — hardcoded array of 10 exercises, never modified
- **Custom exercises**: AsyncStorage key `@custom_exercises` — user-created exercises, merged with predefined at read time
- **Goals**: AsyncStorage key `@exercise_goals_{userId}` — one goal per user per exercise
- **Logs**: AsyncStorage key `@exercise_logs_{userId}` — multiple logs per exercise, sorted newest first

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
  image_url: string | null;           // Supabase Storage URL
  primary_muscles: string[];
  secondary_muscles: string[];
  tips: string | null;
  emom_duration_min?: number;         // emom only
  emom_work_sec?: number;             // emom only
  emom_rest_sec?: number;             // emom only
  created_at: string;
};

type ExerciseGoal = {
  id: string;
  user_id: string;
  exercise_id: string;
  target_value: number;               // reps for weight, seconds for time, rounds for emom
  is_achieved: boolean;
  created_at: string;
};

type ExerciseLog = {
  id: string;
  user_id: string;
  exercise_id: string;
  date: string;                       // ISO date "YYYY-MM-DD"
  sets?: number;                      // weight type
  reps?: number;                      // weight type
  weight_kg?: number;                 // weight type, optional
  duration_sec?: number;              // time type
  rounds_completed?: number;          // emom type
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
type ExerciseGoalUpsert = Omit<ExerciseGoal, 'id' | 'created_at'>;
type ExerciseLogCreate = Omit<ExerciseLog, 'id' | 'created_at'>;
```

### Log Fields by Exercise Type


| Type     | Required fields    | Optional fields |
| -------- | ------------------ | --------------- |
| `weight` | `sets`, `reps`     | `weight_kg`     |
| `time`   | `duration_sec`     | —               |
| `emom`   | `rounds_completed` | —               |


## User Flows

### Browse Exercises

1. User opens the Exercises tab
2. List loads all predefined + custom exercises
3. User taps a filter chip to narrow results (muscle group, difficulty, or type)
4. Tapping the same chip again deselects it
5. User taps an exercise card to view its detail

### View Exercise Detail

1. User taps an exercise in the list
2. Detail screen loads exercise data, goal, and logs in parallel
3. Image or placeholder is shown at the top
4. Exercise info, tips, and EMOM params (if applicable) are displayed
5. Goal section and log history are shown for authenticated users

### Log a Workout

1. User is on the exercise detail screen
2. User fills in the type-specific log form (sets/reps, duration, or rounds)
3. Optionally adds notes
4. User taps Add — new log appears at the top of the history
5. User can delete any log entry with a confirmation

### Set / Update a Goal

1. User is on the exercise detail screen
2. User taps the goal section to set or edit the target value
3. User can mark the goal as achieved
4. Goal is saved immediately (upsert — creates or updates)

### Add a Custom Exercise

1. User taps the "+" button in the list screen header
2. Add form opens with name auto-focused
3. User fills in required fields (name, muscle group) and any optional fields
4. If type is EMOM, duration/work/rest fields appear
5. Optionally user picks an image from the gallery (uploaded to Supabase Storage)
6. User taps Save — exercise is stored in AsyncStorage and appears in the list

### Edit a Custom Exercise

1. User opens the detail screen of a custom exercise
2. Edit button appears in the header (absent for predefined exercises)
3. User taps Edit — add-edit form opens pre-populated
4. User modifies fields and taps Save
5. Exercise is updated in AsyncStorage

## Custom Hooks

### useExerciseData

**Location**: `components/exercises/shared/hooks/useExerciseData.ts`

Central hook for the exercise list with CRUD operations:

```typescript
function useExerciseData(filters?: ExerciseFilters) {
  return {
    exercises: Exercise[],                             // Filtered exercise list
    loading: boolean,
    error: string | null,
    addExercise: (data: ExerciseCreate) => Promise<Exercise>,
    updateExercise: (id: string, data: ExerciseUpdate) => Promise<Exercise>,
    deleteExercise: (id: string) => Promise<void>,
    refresh: () => void,                               // Silent refresh, no loader
  };
}
```

Features:

- Loads predefined + custom exercises merged together
- Re-fetches automatically when filter values change
- Refreshed on list screen focus via `useFocusEffect`
- CRUD operations silently refresh the list after completion

### useExerciseFilters

**Location**: `components/exercises/list/hooks/useExerciseFilters.ts`

Manages filter chip state for the list screen:

```typescript
function useExerciseFilters() {
  return {
    filters: ExerciseFilters,                         // Combined filter object
    muscleGroup: MuscleGroup | null,
    difficulty: Difficulty | null,
    type: ExerciseType | null,
    toggleMuscleGroup: (value: MuscleGroup) => void,  // Selects or deselects
    toggleDifficulty: (value: Difficulty) => void,
    toggleType: (value: ExerciseType) => void,
  };
}
```

### useExerciseDetail

**Location**: `components/exercises/detail/hooks/useExerciseDetail.ts`

Loads all data for the detail screen and provides mutation functions:

```typescript
function useExerciseDetail(exerciseId: string) {
  return {
    exercise: Exercise | null,
    goal: ExerciseGoal | null,
    logs: ExerciseLog[],              // Sorted newest first
    loading: boolean,
    error: string | null,
    saveGoal: (data: ExerciseGoalUpsert) => Promise<void>,
    addLog: (data: ExerciseLogCreate) => Promise<void>,
    deleteLog: (logId: string) => Promise<void>,
  };
}
```

Features:

- Loads exercise, goal, and logs in parallel with `Promise.all`
- Mutations update local state optimistically without re-fetching
- Requires authenticated user — reads `user.id` from `AuthContext`

### useExerciseForm

**Location**: `components/exercises/add-edit/hooks/useExerciseForm.ts`

Manages add/edit form state, image upload, and submission:

```typescript
function useExerciseForm(options: { id?: string }) {
  return {
    name: string,
    setName: (v: string) => void,
    type: ExerciseType,
    setType: (v: ExerciseType) => void,
    muscleGroup: MuscleGroup,
    setMuscleGroup: (v: MuscleGroup) => void,
    difficulty: Difficulty,
    setDifficulty: (v: Difficulty) => void,
    description: string,
    setDescription: (v: string) => void,
    primaryMuscles: string,           // comma-separated raw input
    setPrimaryMuscles: (v: string) => void,
    secondaryMuscles: string,
    setSecondaryMuscles: (v: string) => void,
    tips: string,
    setTips: (v: string) => void,
    emomDuration: string,
    setEmomDuration: (v: string) => void,
    emomWork: string,
    setEmomWork: (v: string) => void,
    emomRest: string,
    setEmomRest: (v: string) => void,
    imageUri: string | null,          // local URI before upload
    setImageUri: (v: string | null) => void,
    loading: boolean,                 // submission in progress
    initialLoading: boolean,          // loading existing data in edit mode
    handleSubmit: () => Promise<void>,
    handleCancel: () => void,
  };
}
```

Features:

- In edit mode, pre-loads existing exercise data from AsyncStorage
- Validates required fields (name, muscle group) before submission
- Uploads gallery image to Supabase Storage, stores resulting URL
- Parses comma-separated muscle inputs into arrays on submit
- Navigates back on successful save

## Service Layer

**Location**: `lib/exercise-service.ts`

All data operations for the exercises feature:

```typescript
// Read
async function getExercises(filters?: ExerciseFilters): Promise<Exercise[]>
// Returns predefined + custom exercises merged; applies optional filters

async function getExercise(id: string): Promise<Exercise>
// Returns single exercise; checks predefined first, then custom

// Custom exercise CRUD (predefined exercises are immutable)
async function addExercise(data: ExerciseCreate): Promise<Exercise>
async function updateExercise(id: string, data: ExerciseUpdate): Promise<Exercise>
// Throws if exercise is not custom: "Редагувати можна лише власні вправи"

async function deleteExercise(id: string): Promise<void>
// Throws if exercise is not custom: "Видаляти можна лише власні вправи"

// Goals (one per user per exercise, upsert semantics)
async function getExerciseGoal(userId: string, exerciseId: string): Promise<ExerciseGoal | null>
async function upsertExerciseGoal(data: ExerciseGoalUpsert): Promise<ExerciseGoal>

// Logs
async function getExerciseLogs(userId: string, exerciseId: string): Promise<ExerciseLog[]>
// Returns logs sorted newest first

async function addExerciseLog(data: ExerciseLogCreate): Promise<ExerciseLog>
async function deleteExerciseLog(userId: string, id: string): Promise<void>
```

## Context Integration

### AuthContext

Used in `useExerciseDetail` and `useExerciseForm` to access the current `user.id` for scoping goals and logs. Goal/log sections are hidden when no authenticated user is present.

## Utility Functions

### Formatting

**formatDifficulty** (`components/exercises/shared/utils/formatDifficulty.ts`) — converts `Difficulty` enum to Ukrainian label

**formatExerciseType** (`components/exercises/shared/utils/formatExerciseType.ts`) — converts `ExerciseType` enum to Ukrainian label

**formatMuscleGroup** (`components/exercises/shared/utils/formatMuscleGroup.ts`) — converts `MuscleGroup` enum to Ukrainian label

### Styling

**getDifficultyColor** (`components/exercises/shared/utils/getDifficultyColor.ts`) — returns a color constant for a given `Difficulty` level

### Validation

**validateExerciseInput** (`components/exercises/add-edit/utils/validateExerciseInput.ts`) — validates that required fields (name, muscle group) are present before submission

### Constants

**difficulties** (`components/exercises/list/constants/difficulties.ts`) — array of `{ value, label }` pairs for difficulty filter chips

**exerciseTypes** (`components/exercises/list/constants/exerciseTypes.ts`) — array of `{ value, label }` pairs for type filter chips

**muscleGroups** (`components/exercises/list/constants/muscleGroups.ts`) — array of `{ value, label }` pairs for muscle group filter chips

## File Structure

```
components/exercises/
├── list/
│   ├── ExerciseListScreen.tsx               # Main list with filters and FlatList
│   ├── components/
│   │   ├── AddExerciseButton.tsx            # Header button → add-edit screen
│   │   ├── ExerciseItem.tsx                 # Card: name, type badge, muscle group, difficulty
│   │   └── FilterBar.tsx                    # Horizontal scrollable chip filters
│   ├── hooks/
│   │   └── useExerciseFilters.ts            # Filter state with toggle functions
│   └── constants/
│       ├── difficulties.ts                  # Difficulty chip options
│       ├── exerciseTypes.ts                 # Type chip options
│       └── muscleGroups.ts                  # Muscle group chip options
│
├── detail/
│   ├── ExerciseDetailScreen.tsx             # Scrollable detail view
│   ├── components/
│   │   ├── ExerciseImage.tsx                # Image with barbell icon fallback
│   │   ├── ExerciseInfo.tsx                 # Type, muscle, difficulty, description, muscles
│   │   ├── EmomDetails.tsx                  # Duration / work / rest (emom only)
│   │   ├── ExerciseTips.tsx                 # Tips card
│   │   ├── ExerciseGoal.tsx                 # Goal set / achieved toggle
│   │   ├── ExerciseLogSection.tsx           # Add-log form + log list
│   │   └── ExerciseLogItem.tsx              # Individual log row with delete
│   └── hooks/
│       └── useExerciseDetail.ts             # Loads exercise, goal, logs; exposes mutations
│
├── add-edit/
│   ├── AddEditExerciseForm.tsx              # Full add/edit form
│   ├── components/
│   │   └── TypeSpecificFields.tsx           # EMOM param inputs (shown when type = emom)
│   ├── hooks/
│   │   └── useExerciseForm.ts               # Form state, image upload, submit
│   └── utils/
│       └── validateExerciseInput.ts         # Required field validation
│
└── shared/
    ├── hooks/
    │   └── useExerciseData.ts               # Merged exercise list + CRUD operations
    └── utils/
        ├── formatDifficulty.ts
        ├── formatExerciseType.ts
        ├── formatMuscleGroup.ts
        └── getDifficultyColor.ts

app/(tabs)/(exercises)/
├── _layout.tsx                              # Stack layout (minimal back button)
├── index.tsx                               # List route
├── [id].tsx                                # Detail route
└── add-edit.tsx                            # Add/edit route

lib/
├── exercise-service.ts                     # All data operations (AsyncStorage)
└── mock/
    └── exercises-data.ts                   # 10 predefined calisthenics exercises
```

## Future Enhancements

- Migrate custom exercises, goals, and logs to Supabase (PostgreSQL)
- Camera capture for exercise images (currently gallery only)
- Exercise search by name
- Link exercises into training programs and workout sessions
- Progress charts for goals and log history
- Share / export exercise logs

