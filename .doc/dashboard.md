# Dashboard Feature

## Overview

The Dashboard is the main entry point of the app for authenticated users. It provides a summary of the user's weight tracking data — current weight, 30-day statistics, and a trend indicator — with quick navigation to the weight tracking and profile features.

**Status**: 🚧 IN PROGRESS

## Navigation

The Dashboard is the first tab in the bottom tab bar, accessible immediately after login.

**Route**: `app/(tabs)/(dashboard)/index.tsx`

From the dashboard, users can navigate to:

- **Profile** — via the profile icon button in the header → `app/(tabs)/(dashboard)/profile.tsx`
- **Weight tab** — by tapping the weight card → `/(tabs)/(weight)`
- **Add weight** — via the "Додати вагу" button (empty state or reminder badge) → `/(tabs)/(weight)/add-edit`

## Screens & Components

### DashboardScreen

**Location**: `components/dashboard/DashboardScreen.tsx`

The main screen component. Uses `useDashboardData` hook to load weight data and refreshes on every screen focus via `useFocusEffect`. Renders:

- `LoadingState` while data is loading
- `ErrorState` on fetch failure
- `WeightCard` when weight data exists
- `EmptyWeightState` when the user has no weight entries

### WeightCard

**Location**: `components/dashboard/components/WeightCard.tsx`

The primary card shown when weight data is available. Displays:

- Current weight (large number + "кг") and the date of the last entry
- A warning badge with an "Додати вагу" button if the weight reminder is active
- A period badge showing the 30-day date range
- `WeightStats` — min, max, and count of entries
- `WeightTrend` — month-over-month change in kg and percentage

Tapping the card navigates to the Weight tab.

### WeightStats

**Location**: `components/dashboard/components/WeightStats.tsx`

Displays three statistics in a horizontal row:

- **Мін** — minimum weight in the 30-day period
- **Макс** — maximum weight in the 30-day period
- **Записів** — total number of entries in the period

### WeightTrend

**Location**: `components/dashboard/components/WeightTrend.tsx`

Shows the month-over-month weight change:

- Trend icon (chevron up / down / minus)
- Absolute change in kg
- Percentage change

Color coding: primary (red) for weight gain, success (green) for weight loss, secondary (gray) for no change.

### EmptyWeightState

**Location**: `components/dashboard/components/EmptyWeightState.tsx`

Shown when the user has no weight entries. Contains a scale icon, a title, a short message, and a "Додати вагу" button that navigates to the add-weight screen.

### ProfileButton

**Location**: `components/dashboard/components/ProfileButton.tsx`

A header icon button (person icon) rendered in the top-right corner of the dashboard. Navigates to the profile screen. Implemented using the shared `HeaderIconButton` component.

## Custom Hooks

### useDashboardData

**Location**: `components/dashboard/hooks/useDashboardData.ts`

Manages all data fetching and metric calculation for the dashboard.

**Returns**:

```typescript
type DashboardWeightData = {
  currentWeight: number;
  currentDate: string;
  monthChange: number | null;
  monthChangePercent: number | null;
  lastMonthEntries: WeightEntry[];
  average: number;
  min: number;
  max: number;
  count: number;
  allEntries: WeightEntry[];
  periodStart: string;
  periodEnd: string;
};

// Hook return value
{
  weightData: DashboardWeightData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
```

**Behavior**:

1. Fetches all weight entries for the current user via `getWeightEntries(user.id)`
2. Derives the current weight from the most recent entry
3. Filters entries from the last 30 days to compute the period
4. Calculates min, max, average, and count for the period
5. Computes month change (kg and %) if multiple entries exist
6. Supports silent refresh (no loading spinner) for focus-triggered updates

## Service Layer

### getWeightEntries

**Location**: `lib/weight-service.ts`

```typescript
getWeightEntries(userId: string): Promise<WeightEntry[]>
```

Fetches all weight entries from the Supabase `weight_entries` table, filtered by `user_id` and ordered by `date` descending (newest first).

## Data Model

### WeightEntry

```typescript
type WeightEntry = {
  id: string;
  user_id: string;
  weight: number;
  date: string; // ISO format "YYYY-MM-DD"
  created_at: string;
  updated_at: string;
};
```

Weight entries are stored in the `weight_entries` Supabase table. The dashboard reads but never writes entries directly — writes happen in the Weight feature.

## Context Integration

### AuthContext

- Provides the `user` object
- `user.id` is used when fetching weight entries
- `user.user_metadata.name` is displayed in the header title ("ТурнікМен {name}")

### WeightReminderContext

- Provides the `shouldShowBadge` boolean
- When `true`, a warning icon is shown on the date badge in `WeightCard` and an "Додати вагу" button appears, prompting the user to log their weight

## Utilities

### formatDate

**Location**: `components/dashboard/utils/formatDate.ts`

Formats a date string for the current weight entry date:

- Today → "Сьогодні"
- Yesterday → "Вчора"
- Other → "21 лютого" (day + full month name in Ukrainian)

### formatShortDate

**Location**: `components/dashboard/utils/formatShortDate.ts`

Formats a date string as a short date for the period badge:

- "21 лют" (day + abbreviated month name in Ukrainian)

## User Flows

### Viewing the dashboard

1. User logs in or switches to the Dashboard tab
2. `useDashboardData` fetches weight entries from Supabase
3. If entries exist, `WeightCard` is displayed with current weight, stats, and trend
4. If no entries exist, `EmptyWeightState` is displayed

### Navigating to weight tracking

- Tap the `WeightCard` → navigates to the Weight tab
- Tap "Додати вагу" button (empty state or reminder badge) → navigates directly to add-weight screen

### Navigating to profile

- Tap the profile icon button in the header → navigates to the profile screen (tab bar hidden)

### Refresh on focus

Every time the user returns to the dashboard tab, `useFocusEffect` triggers a silent refresh so data is always up to date after adding or editing weight entries elsewhere.

## File Structure

```
app/(tabs)/(dashboard)/
├── _layout.tsx          # Stack navigator config
├── index.tsx            # Dashboard route (sets title, renders DashboardScreen)
└── profile.tsx          # Profile route (hides tab bar, renders ProfileScreen)

components/dashboard/
├── DashboardScreen.tsx        # Main screen component
├── components/
│   ├── WeightCard.tsx         # Weight summary card
│   ├── WeightStats.tsx        # Min/Max/Count stats row
│   ├── WeightTrend.tsx        # Month-over-month trend indicator
│   ├── EmptyWeightState.tsx   # Empty state when no entries
│   └── ProfileButton.tsx      # Header profile icon button
├── hooks/
│   └── useDashboardData.ts    # Data fetching and metric calculation
└── utils/
    ├── formatDate.ts          # Full date formatter (Ukrainian)
    └── formatShortDate.ts     # Short date formatter (Ukrainian)
```

## Future Enhancements

- Add workout/training summary card alongside weight card
- Show recent achievements or skill progress
- Add quick-action buttons for common tasks (log workout, log weight)
- Support multiple summary widgets configurable by the user
- Add pull-to-refresh gesture on the scroll view

## Testing Considerations

- `useDashboardData` metric calculations (min, max, month change, percentage)
- `formatDate` output for today, yesterday, and arbitrary dates
- `WeightCard` reminder badge visibility when `shouldShowBadge` is true/false
- `EmptyWeightState` rendering when no weight entries exist
- Silent refresh behavior on screen focus
- Navigation from WeightCard and EmptyWeightState to the correct routes
