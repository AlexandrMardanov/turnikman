# Profile Feature

## Overview

The Profile feature provides authenticated users with the ability to view and manage their account information. It is a minimal implementation that allows users to view their profile details (name and email) and log out of the application.

**Status**: ✅ Complete

## Navigation

The profile screen is accessible from the **Dashboard** tab via the profile button in the header (not a separate tab). When the user taps the profile button in the dashboard header, the tab bar is automatically hidden, focusing attention on the profile content.

**Route**: `app/(tabs)/(dashboard)/profile.tsx`

## Screens & Components

### ProfileScreen

**Location**: `components/profile/ProfileScreen.tsx`

The main container component that orchestrates all profile-related sub-components. It wraps the profile content in `ScreenContainer` and renders:
- `ProfileInfo` — displays user's name and email
- `EditNameModal` — modal for editing the user's name

### ProfileInfo

**Location**: `components/profile/components/ProfileInfo.tsx`

Displays the user's profile information in a clean, read-only format:
- **Name** — displays user's name with an edit icon button; shows "Не вказано" (Not specified) if name is empty
- **Email** — displays user's email; shows "Не вказано" if email is not available

Uses the `InfoItem` component for consistent label-value display styling.

### EditNameModal

**Location**: `components/profile/components/EditNameModal.tsx`

A modal dialog for editing the user's name. Features:
- Blur overlay with modal centered on screen
- Text input field pre-filled with current name
- Input validation (trimming whitespace)
- Save and Cancel buttons
- Loading state during API call
- Success/error alerts after submission

### InfoItem

**Location**: `components/profile/components/InfoItem.tsx`

A reusable sub-component for displaying label-value pairs consistently. Used for name and email display.

### LogoutButton

**Location**: `components/profile/components/LogoutButton.tsx`

Header icon button for logging out. Features:
- Icon-based button rendered in the header
- Confirmation dialog before logout
- Uses `useLogout` hook for logout logic
- Redirects to login screen after successful logout

## Data Model

Profile data is stored in **Supabase Auth** (`auth.users`), not in a separate profile table.

### Data Source

- **User Metadata** — `auth.users.user_metadata`
  - `name` (string) — user's display name, editable via the profile UI

- **Auth User Object** — `auth.users`
  - `email` (string) — user's email, read-only in profile UI

### Data Types

```typescript
// No separate profile type; uses Supabase auth user object
type User = {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
  // ... other auth fields
};

// Update profile data
type UpdateProfileData = {
  name: string;
};
```

## User Flows

### View Profile

1. User is on Dashboard tab
2. User taps profile button in header
3. Tab bar hides
4. Profile screen displays with current name and email
5. Name and email are fetched from Supabase auth user object

### Edit Name

1. User is on Profile screen
2. User taps edit icon next to name
3. `EditNameModal` opens with current name pre-filled
4. User edits the name and taps Save
5. Loading indicator appears
6. Request sent to `updateProfile` in auth service
7. Supabase updates `user_metadata.name`
8. Success alert shown
9. Modal closes and ProfileInfo updates with new name
10. (On error: error alert shown, user can retry)

### Logout

1. User is on Profile screen
2. User taps logout button in header
3. Confirmation dialog appears
4. If confirmed:
   - `signOut` called from auth service
   - Supabase session cleared
   - Auth state cleared
   - Automatic redirect to login screen

## Custom Hooks

### useProfileEdit

**Location**: `components/profile/hooks/useProfileEdit.ts`

Manages state and logic for editing the user's name:
- `isModalVisible` — controls modal visibility
- `editedName` — current value in edit input
- `isLoading` — API call loading state
- `openModal()` — opens edit modal with current name pre-filled
- `closeModal()` — closes modal without saving
- `handleSave()` — validates, calls `updateProfile`, shows alerts, closes modal

### useLogout

**Location**: `components/profile/hooks/useLogout.ts`

Manages logout flow with confirmation:
- `handleLogout()` — shows confirmation dialog
- On confirm: calls `signOut`, waits for redirect
- On cancel: does nothing

## Service Layer

### updateProfile

**Location**: `lib/auth-service.ts`

Updates user profile information in Supabase:

```typescript
async function updateProfile(updates: UpdateProfileData): Promise<User>
```

- Takes an object with `name` field
- Calls `supabase.auth.updateUser({ data: { name } })`
- Returns updated user object
- Throws error on failure

### signOut

Already exists in auth service; handles session cleanup and user state clearing.

## Context Integration

### AuthContext

**Location**: `contexts/AuthContext.tsx`

Provides profile-related functions and state:
- `user` — current authenticated user object (includes email and name from metadata)
- `updateProfile(updates)` — updates user profile in Supabase
- `signOut()` — clears session and auth state

These are used throughout the profile feature for managing user state and API calls.

## File Structure

```
components/profile/
├── ProfileScreen.tsx                 # Main screen component
├── components/
│   ├── ProfileInfo.tsx               # Name and email display
│   ├── EditNameModal.tsx             # Edit name modal
│   ├── InfoItem.tsx                  # Label-value pair display
│   └── LogoutButton.tsx              # Header logout button
└── hooks/
    ├── useProfileEdit.ts             # Edit name state logic
    └── useLogout.ts                  # Logout confirmation logic

app/(tabs)/(dashboard)/
└── profile.tsx                       # Route/page component

lib/
└── auth-service.ts                   # updateProfile, signOut functions

contexts/
└── AuthContext.tsx                   # user, updateProfile, signOut
```

## Future Enhancements

Possible expansions to the profile feature:

- **Avatar/Photo** — profile picture upload and display
- **Additional Fields** — bio, date of birth, height, weight goal
- **Settings** — preferences, language selection, theme
- **Password Management** — change password option
- **Account Management** — delete account, data export
- **Statistics** — workout count, weight stats, streak display
- **Email Management** — change email address, email verification

## Testing Considerations

Key areas to test:

- **View Profile** — verify name/email display with various data (empty names, long emails)
- **Edit Name** — test validation, empty input handling, error cases
- **Logout** — confirm dialog, session cleanup, redirect to login
- **Loading States** — verify loading indicators appear during API calls
- **Error Handling** — network errors, server errors, validation failures
