# Weight Tracking Feature

## Overview

The Weight Tracking feature allows authenticated users to log, view, and analyze their weight over time. It provides a comprehensive dashboard with weight visualization through charts, period-based statistics, and detailed history of all weight entries. Users can add new weight records, edit existing ones, and delete entries as needed.

**Status**: ✅ Complete

## Navigation

The weight tracking feature is accessible from the **Weight** tab in the bottom tab navigation. It consists of three screens:

**Routes**:

- `app/(tabs)/(weight)/index.tsx` — Dashboard (main weight screen)
- `app/(tabs)/(weight)/history.tsx` — History (full list of all entries)
- `app/(tabs)/(weight)/add-edit.tsx` — Add/Edit form (for creating or modifying entries)

**Header Button**: The dashboard has an "Add" button in the header for quick access to add new weight entries.

## Screens & Components

### WeightDashboardScreen

**Location**: `components/weight/dashboard/WeightDashboardScreen.tsx`

The main dashboard displaying:

- **WeightReminder** — badge notification if user hasn't logged weight today
- **PeriodFilter** — filter buttons for selecting time ranges (day, week, month, year, all)
- **WeightChart** — line chart visualizing weight changes over the selected period
- **PeriodStats** — statistics for the selected period (current, min, max, avg, change)
- **RecentEntriesSection** — displays the 5 most recent weight entries with quick delete action

### WeightHistoryScreen

**Location**: `components/weight/history/WeightHistoryScreen.tsx`

A scrollable list of all weight entries with pull-to-refresh functionality:

- Displays all entries in chronological order (newest first)
- Shows weight change from previous entry
- Allows deletion of entries
- Pull-to-refresh to sync latest data
- Empty state when no entries exist

### AddEditWeightForm

**Location**: `components/weight/add-edit/AddEditWeightForm.tsx`

A form for adding or editing weight entries:

- **Weight Input** — decimal number input for weight in kilograms
- **Date Picker** — inline date picker with maximum date set to today
- **Save Button** — submits form and updates database
- **Cancel Button** — cancels operation and navigates back
- **Loading State** — shows loader during form submission

Form behavior:

- When adding: weight input is auto-focused, current date is pre-selected
- When editing: existing weight and date are pre-filled from database
- Date picker limits selection to today or earlier

## Data Model

Weight data is stored in **Supabase** PostgreSQL database in the `weight_entries` table.

### Database Schema

```sql
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  weight DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE(user_id, date)  -- One entry per date per user
);
```

### Data Types

```typescript
type WeightEntry = {
  id: string;
  user_id: string;
  weight: number;
  date: string; // ISO date format: "YYYY-MM-DD"
  created_at: string;
  updated_at: string;
};

type WeightEntryCreate = Omit<WeightEntry, 'id' | 'created_at' | 'updated_at'>;
type WeightEntryUpdate = Partial<Pick<WeightEntry, 'weight' | 'date'>>;
```

### Weight Change Calculation

Each entry includes a `change` field calculated relative to the previous entry:

```typescript
type WeightEntryWithChange = WeightEntry & {
  change: number | null; // null for first entry, otherwise difference from previous
};
```

- Positive values indicate weight gain
- Negative values indicate weight loss

## User Flows

### View Dashboard

1. User opens Weight tab
2. Dashboard loads all weight entries
3. Entries filtered by selected period (default: month)
4. Chart and statistics calculated for the period
5. Recent 5 entries displayed in section
6. If no entries exist, empty state shown

### View History

1. User is on dashboard
2. User taps "View All" in Recent Entries section
3. History screen opens with all entries in scrollable list
4. Each entry shows date, weight, and change from previous

### Add Weight Entry

1. User taps "+" button in header or navigates to add-edit screen
2. Form loads with today's date pre-selected
3. User enters weight value
4. User taps Save
5. Entry added to database
6. Dashboard refreshes to show new data
7. Reminder badge clears (entry logged today)
8. Navigation returns to dashboard

### Edit Weight Entry

1. User taps on an entry in history or dashboard
2. Add-edit form loads with entry ID
3. Form pre-fills existing weight and date
4. User modifies weight and/or date
5. User taps Save
6. Entry updated in database
7. Dashboard refreshes with updated data
8. Navigation returns to previous screen

### Delete Weight Entry

1. User swipes or taps delete on an entry
2. Confirmation dialog appears
3. If confirmed:

- Entry deleted from database
- Dashboard refreshes
- Reminder badge recalculated

### Change Period Filter

1. User is on dashboard
2. User taps a period filter button (Day, Week, Month, Year, All)
3. Chart and statistics update immediately
4. Recent entries remain unchanged (always shows most recent)
5. Selected period persists during session

## Custom Hooks

### useWeightData

**Location**: `components/weight/shared/hooks/useWeightData.ts`

Central hook for managing weight entry data and operations:

```typescript
function useWeightData() {
  const {
    entries: WeightEntry[],              // All weight entries
    entriesWithChanges: WeightEntryWithChange[],  // Entries with change calculations
    loading: boolean,                    // Loading state
    error: string | null,                // Error message
    filterByPeriod: (period) => WeightEntry[],    // Filter entries by time period
    addEntry: (data) => Promise<void>,   // Add new entry
    updateEntry: (id, data) => Promise<void>,     // Update existing entry
    deleteEntry: (id) => Promise<void>,  // Delete entry
    refresh: () => Promise<void>,        // Refresh data (silent, no loader)
  } = useWeightData();
}
```

Features:

- Automatic data loading on mount
- Handles all CRUD operations
- Integrates with weight reminder context
- Filters and aggregates entries based on period
- Calculates weight changes between entries
- Provides silent refresh for pull-to-refresh

### useWeightForm

**Location**: `components/weight/add-edit/hooks/useWeightForm.ts`

Manages form state and submission for add/edit operations:

```typescript
function useWeightForm(options: { id?: string }) {
  const {
    weight: string,                      // Weight input value
    setWeight: (value: string) => void,  // Update weight
    date: Date,                          // Selected date
    setDate: (date: Date) => void,       // Update date
    loading: boolean,                    // Submission loading state
    initialLoading: boolean,             // Initial data load state (edit mode)
    handleSubmit: () => Promise<void>,   // Submit form
    handleCancel: () => void,            // Cancel and navigate back
  } = useWeightForm({ id });
}
```

Features:

- Validates weight input before submission
- Handles both add and edit modes
- Pre-loads entry data in edit mode
- Manages loading states
- Shows success/error alerts
- Auto-navigates back on successful submission

### useWeightEntryActions

**Location**: `components/weight/shared/hooks/useWeightEntryActions.ts`

Manages entry-level actions like delete with confirmation:

```typescript
function useWeightEntryActions() {
  const {
    handleDelete: (id: string) => Promise<void>,  // Delete with confirmation
  } = useWeightEntryActions();
}
```

### useWeightReminder

**Location**: `contexts/hooks/useWeightReminder.ts`

Manages the daily weight logging reminder:

```typescript
function useWeightReminder() {
  const {
    shouldShowBadge: boolean,            // Show reminder badge
    refresh: () => void,                 // Recalculate reminder state
  } = useWeightReminder();
}
```

Features:

- Tracks whether user has logged weight today
- Shows badge on dashboard when not logged
- Automatically clears after entry is added
- Refreshes on screen focus

## Service Layer

**Location**: `lib/weight-service.ts`

All database operations for weight entries:

```typescript
async function getWeightEntries(userId: string): Promise<WeightEntry[]>;
// Fetches all weight entries for user, ordered newest first

async function getWeightEntry(id: string): Promise<WeightEntry | null>;
// Fetches single weight entry by ID

async function addWeightEntry(data: WeightEntryCreate): Promise<WeightEntry>;
// Creates new weight entry (prevents duplicate dates per user)

async function updateWeightEntry(id: string, data: WeightEntryUpdate): Promise<WeightEntry>;
// Updates weight and/or date (prevents duplicate dates per user)

async function deleteWeightEntry(id: string): Promise<void>;
// Deletes weight entry by ID
```

Error handling:

- **Duplicate date error** — shows "Запис з цією датою вже існує" (Entry with this date already exists)
- **Not found error** — shows "Запис не знайдено" (Entry not found)
- **Network error** — shows generic error messages in Ukrainian

## Context Integration

### WeightReminderContext

**Location**: `contexts/WeightReminderContext.tsx`

Provides reminder state across the app:

```typescript
type WeightReminderContextType = {
  shouldShowBadge: boolean; // Show reminder badge
  refresh: () => void; // Recalculate reminder state
};
```

Wrap the app with `WeightReminderProvider` to use this context.

### AuthContext

Used for accessing the current user's ID when fetching/modifying entries.

## Utility Functions

### Data Filtering & Aggregation

**filterEntriesByPeriod**

- Filters entries by selected period (day, week, month, year, all)
- Returns entries within the selected time range

**aggregateEntries**

- Reduces number of data points to fit chart display
- Limits chart to `MAX_CHART_POINTS` for performance

**calculateWeightChanges**

- Adds `change` field to each entry relative to previous
- Used for displaying weight delta in lists

**calculatePeriodStats**

- Calculates statistics for a set of entries
- Returns: current, min, max, average, change since start

### Formatting

**formatFullDate** — Formats date to display format (e.g., "21 лютого 2026")
**formatDateLabel** — Formats date for chart axis labels
**formatDateToString** — Converts Date to ISO string "YYYY-MM-DD"

### Validation

**validateWeightInput** — Validates weight value is positive number

### Chart Configuration

**prepareChartData** — Converts weight entries to chart-ready format
**chartConfig** — Constants for chart styling and animation

## File Structure

```
components/weight/
├── dashboard/
│   ├── WeightDashboardScreen.tsx        # Main dashboard component
│   ├── components/
│   │   ├── PeriodFilter.tsx             # Period selection buttons
│   │   ├── WeightChart.tsx              # Line chart visualization
│   │   ├── PeriodStats.tsx              # Statistics cards
│   │   ├── RecentEntriesSection.tsx     # Recent 5 entries
│   │   └── WeightReminder.tsx           # Daily reminder badge
│   ├── utils/
│   │   ├── calculatePeriodStats.ts      # Stats calculation
│   │   ├── formatDateLabel.ts           # Chart date formatting
│   │   └── prepareChartData.ts          # Chart data preparation
│   ├── constants/
│   │   ├── chartConfig.ts               # Chart styling
│   │   └── recentEntriesLimit.ts        # Limit for recent entries (5)
│
├── history/
│   └── WeightHistoryScreen.tsx          # Full history list
│
├── add-edit/
│   ├── AddEditWeightForm.tsx            # Form component
│   ├── hooks/
│   │   └── useWeightForm.ts             # Form state management
│   └── utils/
│       ├── validateWeightInput.ts       # Weight validation
│       └── formatDateToString.ts        # Date to string conversion
│
├── shared/
│   ├── components/
│   │   ├── AddWeightButton.tsx          # Header add button
│   │   ├── WeightEntryItem.tsx          # Entry list item
│   │   └── EmptyState.tsx               # Empty state display
│   ├── hooks/
│   │   ├── useWeightData.ts             # Central data hook
│   │   └── useWeightEntryActions.ts     # Entry actions
│   ├── utils/
│   │   ├── filterEntriesByPeriod.ts     # Period filtering
│   │   ├── aggregateEntries.ts          # Data aggregation
│   │   ├── calculateWeightChanges.ts    # Change calculation
│   │   ├── formatFullDate.ts            # Full date formatting
│   │   └── maxChartPoints.ts            # Chart limit constant

app/(tabs)/(weight)/
├── _layout.tsx                          # Stack navigation layout
├── index.tsx                            # Dashboard route
├── history.tsx                          # History route
└── add-edit.tsx                         # Add/edit form route

lib/
└── weight-service.ts                    # Database operations

contexts/
├── WeightReminderContext.tsx            # Reminder provider
└── hooks/
    └── useWeightReminder.ts             # Reminder logic
```

## Period Filters

Users can view statistics and charts for different time periods:

- **Week** — last 7 days
- **Month** — last 30 days (default)
- **Year** — last 365 days
- **All** — all recorded data

Each period affects:

- Chart data and range
- Statistics (min, max, average, change)
- Date labels on chart axis

## Future Enhancements

Possible expansions to the weight feature:

- **Goal Setting** — set target weight and track progress toward goal
- **Weight Predictions** — ML-based weight trend predictions
- **Weekly Reports** — email summaries of weight changes
- **Multiple Weight Units** — support for pounds, stones, etc.
- **Workout Impact Analysis** — correlate weight with exercises
- **Photo Progress** — take before/after photos with dates
- **Export Data** — download weight history as CSV
- **Multi-Device Sync** — sync entries across devices
- **Reminders** — configurable daily/weekly notifications
- **Advanced Analytics** — trend analysis, volatility, body composition

## Testing Considerations

Key areas to test:

- **Add Entry** — verify entry is created and appears on dashboard
  - Test with today's date
  - Test with past dates
  - Test duplicate date error handling
- **Edit Entry** — verify changes are saved and reflected
  - Test weight change
  - Test date change
  - Test moving entry to date that conflicts with existing entry
- **Delete Entry** — verify entry is removed
  - Test deletion confirmation
  - Test entry disappears from lists
  - Test reminder badge updates after deletion
- **Filter by Period** — verify chart/stats update
  - Test each period filter
  - Test entries outside period are not included
  - Test statistics are calculated correctly
- **Reminder Badge** — verify badge appears/disappears
  - Test badge shows when no entry today
  - Test badge clears after adding entry
  - Test badge recalculates on app focus
- **Data Persistence** — verify data survives app restart
  - Test entries are persisted in Supabase
  - Test offline handling
  - Test sync on reconnect
- **Empty States** — verify messaging when no data
  - Test empty dashboard message
  - Test empty history message
- **Error Handling** — verify errors are handled gracefully
  - Test network errors
  - Test invalid data
  - Test server errors (500, 403, etc.)
- **Loading States** — verify loaders appear during operations
  - Test initial load
  - Test refresh
  - Test form submission
  - Test pull-to-refresh
