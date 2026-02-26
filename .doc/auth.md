# Authentication Feature

## Overview

The Authentication feature handles user identity management for the ТурнікМен app. It provides complete authentication flow including sign up, sign in, and password recovery through OTP verification. All authentication is powered by **Supabase Auth** with secure password-based authentication and OTP-based password reset.

**Status**: ✅ Complete

## Navigation

The authentication feature is accessible before a user logs in. It consists of four screens organized in the `(auth)` group:

**Routes**:

- `app/(auth)/login.tsx` — Login screen (entry point for existing users)
- `app/(auth)/signup.tsx` — Sign up screen (account creation)
- `app/(auth)/forgot-password.tsx` — Forgot password screen (OTP request)
- `app/(auth)/verify-otp.tsx` — Verify OTP and reset password screen

**Navigation Flow**:

1. User opens app → Auth state checked
2. If unauthenticated → Redirect to login screen
3. From login: User can sign up or initiate password recovery
4. From signup: User can return to login
5. Password recovery: Email → OTP verification → Password reset
6. On successful auth → Automatic redirect to dashboard

## Screens & Components

### LoginScreen

**Location**: `components/auth/login/LoginScreen.tsx`

Main login interface for existing users:

- **Title** — "Авторизація" (Authorization) with subtitle
- **Icon** — Branded push-up illustration
- **LoginInputs** — Email and password input fields
- **ForgotPasswordLink** — Link to password recovery
- **Login Button** — Submit credentials
- **LoginFooter** — Link to sign up

User interaction flow:

- User enters email and password
- Login button validates inputs and sends credentials
- On success: Automatic redirect to dashboard
- On error: Alert displays error message (invalid credentials, network error, etc.)
- Loading state prevents multiple submissions

### SignUpScreen

**Location**: `components/auth/signup/SignUpScreen.tsx`

Account creation screen for new users:

- **Title** — "Реєстрація" (Registration) with subtitle
- **Icon** — Branded push-up illustration
- **SignUpInputs** — Name, email, password, and confirm password fields
- **SignUp Button** — Submit registration
- **SignUpFooter** — Link back to login

Form validation:

- Name: Required, non-empty string (trimmed)
- Email: Required, valid email format
- Password: Required, at least 8 characters with uppercase and special character
- Confirm Password: Must match password exactly

User interaction flow:

- User fills all fields
- Sign up button validates all inputs
- On success: User is registered and must log in
- On error: Alert displays validation or error message
- Loading state prevents multiple submissions

### ForgotPasswordScreen

**Location**: `components/auth/forgot-password/ForgotPasswordScreen.tsx`

Password recovery initiation screen:

- **Title** — "Відновлення пароля" (Password Recovery) with subtitle
- **Icon** — Branded illustration
- **ForgotPasswordInputs** — Email input and submit button
- **ForgotPasswordFooter** — Link back to login

User interaction flow:

- User enters registered email
- Submit sends OTP code to email
- On success: Redirect to OTP verification screen
- On error: Alert displays error message (user not found, etc.)
- Loading state during submission

### VerifyOTPScreen

**Location**: `components/auth/verify-otp/VerifyOTPScreen.tsx`

OTP verification and password reset screen:

- **Title** — "Верифікація коду" (Code Verification) with subtitle
- **Icon** — Branded illustration
- **VerifyOTPInputs** — OTP code, new password, confirm password fields
- **Verify Button** — Submit verification and password reset
- **VerifyOTPFooter** — Link back to login

Form validation:

- OTP Code: Required, 6-character code
- New Password: Required, at least 8 characters with uppercase and special character
- Confirm Password: Must match new password

User interaction flow:

- User enters OTP received via email
- User enters new password twice
- Submit verifies OTP and updates password
- On success: Redirect to login to sign in with new password
- On error: Alert displays error (invalid OTP, password requirements not met, etc.)
- Loading state during submission

## Data Model

Authentication data is managed by **Supabase Auth** and user profiles are stored in Supabase's `auth.users` table.

### Auth User Type

```typescript
type User = {
  id: string; // UUID
  email: string;
  user_metadata: {
    name?: string; // User's full name
  };
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  last_sign_in_at: string | null; // Last login timestamp
  email_confirmed_at: string | null;
  phone_confirmed_at: string | null;
};
```

### Service Data Types

```typescript
type SignInData = {
  email: string;
  password: string;
};

type SignUpData = {
  email: string;
  password: string;
  name: string;
};

type UpdateProfileData = {
  name: string;
};

type VerifyOTPData = {
  email: string;
  token: string;
  newPassword: string;
};
```

### Session Management

Supabase manages user sessions automatically:

- Session token stored securely by Supabase SDK
- Session persisted across app restarts via AsyncStorage (Supabase SDK handles this)
- Session checked on app startup via `useAuthSession` hook
- Session listeners watch for auth state changes in real-time

## User Flows

### Sign Up (New User)

1. User taps "Зареєструватися" link on login screen
2. Navigates to sign up screen
3. Enters name, email, password, and confirm password
4. Form validates all inputs
5. User taps "Зареєструватися" button
6. On success:
   - Account created in Supabase
   - Success alert shown
   - Auto-navigate to login screen
7. On error:
   - Alert displays error (email already exists, invalid email, password too weak, etc.)
   - User can correct and retry

### Sign In (Existing User)

1. User opens app → shown login screen
2. Enters email and password
3. User taps "Увійти" button
4. Form validates inputs
5. On success:
   - Supabase creates session
   - AuthContext updates with user data
   - App auto-redirects to dashboard
6. On error:
   - Alert displays error (invalid credentials, network error, etc.)
   - User remains on login screen

### Forgot Password Recovery

1. User on login screen taps "Забули пароль?" link
2. Navigates to forgot password screen
3. Enters registered email
4. Taps "Надіслати код"
5. On success:
   - OTP code sent to email
   - Auto-navigate to OTP verification screen
6. On error:
   - Alert displays error
   - User remains on forgot password screen

### Reset Password via OTP

1. User on OTP verification screen (after requesting recovery)
2. Enters:
   - 6-digit OTP code received via email
   - New password (with requirements: 8+ chars, uppercase, special char)
   - Confirm password
3. Taps "Підтвердити"
4. On success:
   - Password updated in Supabase
   - Alert shown
   - Auto-navigate to login screen to sign in with new password
5. On error:
   - Alert displays error (invalid OTP, passwords don't match, etc.)
   - User can correct and retry

### Sign Out

1. User navigates to Profile tab
2. Taps "Вийти" (Logout) button
3. Session terminated in Supabase
4. AuthContext cleared
5. Auto-redirect to login screen

## Custom Hooks

### useAuthSession

**Location**: `contexts/hooks/useAuthSession.ts`

Manages user session and authentication state initialization:

```typescript
function useAuthSession() {
  const {
    user: User | null,           // Current authenticated user (null if not logged in)
    loading: boolean,            // Loading state while checking session
  } = useAuthSession();
}
```

Features:

- Checks for existing session on app startup
- Listens for real-time auth state changes (login, logout, token refresh)
- Handles session recovery from async storage
- Provides loading state during initialization
- Auto-clears user on sign out

### useAuthOperations

**Location**: `contexts/hooks/useAuthOperations.ts`

Wraps all authentication operations:

```typescript
function useAuthOperations() {
  const {
    signIn: (email: string, password: string) => Promise<void>,
    signUp: (email: string, password: string, name: string) => Promise<void>,
    signOut: () => Promise<void>,
    sendPasswordResetOTP: (email: string) => Promise<void>,
    verifyOTPAndResetPassword: (email: string, token: string, newPassword: string) => Promise<void>,
    updatePassword: (newPassword: string) => Promise<void>,
  } = useAuthOperations();
}
```

Features:

- Delegates to `lib/auth-service.ts` functions
- Provides consistent interface across app
- Error handling delegated to service layer

### useLogin

**Location**: `components/auth/login/hooks/useLogin.ts`

Manages login form state and submission:

```typescript
function useLogin() {
  const {
    email: string,
    setEmail: (value: string) => void,
    password: string,
    setPassword: (value: string) => void,
    loading: boolean,
    handleLogin: () => Promise<void>,
  } = useLogin();
}
```

### useSignUp

**Location**: `components/auth/signup/hooks/useSignUp.ts`

Manages sign up form state, validation, and submission:

```typescript
function useSignUp() {
  const {
    name: string,
    setName: (value: string) => void,
    email: string,
    setEmail: (value: string) => void,
    password: string,
    setPassword: (value: string) => void,
    confirmPassword: string,
    setConfirmPassword: (value: string) => void,
    loading: boolean,
    handleSignUp: () => Promise<void>,
  } = useSignUp();
}
```

Features:

- Validates all inputs before submission
- Shows validation errors inline
- Prevents submission with invalid data
- Handles network errors

### useForgotPassword

**Location**: `components/auth/forgot-password/hooks/useForgotPassword.ts`

Manages forgot password form and OTP request:

```typescript
function useForgotPassword() {
  const {
    email: string,
    setEmail: (value: string) => void,
    loading: boolean,
    handleSendOTP: () => Promise<void>,
  } = useForgotPassword();
}
```

### useVerifyOTP

**Location**: `components/auth/verify-otp/hooks/useVerifyOTP.ts`

Manages OTP verification and password reset:

```typescript
function useVerifyOTP() {
  const {
    otpCode: string,
    setOtpCode: (value: string) => void,
    newPassword: string,
    setNewPassword: (value: string) => void,
    confirmPassword: string,
    setConfirmPassword: (value: string) => void,
    loading: boolean,
    handleVerifyOTP: () => Promise<void>,
  } = useVerifyOTP();
}
```

## Service Layer

**Location**: `lib/auth-service.ts`

All authentication operations:

```typescript
async function signIn(data: SignInData): Promise<User>;
// Sign in with email and password
// Throws: "Невдалося увійти" on error

async function signUp(data: SignUpData): Promise<void>;
// Register new account
// Throws: "Невдалося зареєструватися" on error

async function signOut(): Promise<void>;
// Sign out current user
// Throws: "Невдалося вийти" on error

async function updateProfile(userId: string, data: UpdateProfileData): Promise<void>;
// Update user profile (name)
// Throws: "Невдалося оновити профіль" on error

async function sendPasswordResetOTP(email: string): Promise<void>;
// Send OTP code to email for password reset
// Throws: "Невдалося надіслати код для відновлення пароля" on error

async function verifyOTPAndResetPassword(data: VerifyOTPData): Promise<void>;
// Verify OTP and update password
// Throws: "Невдалося верифікувати код OTP" or "Невдалося оновити пароль" on error

async function updatePassword(newPassword: string): Promise<void>;
// Update password for authenticated user
// Throws: "Невдалося оновити пароль" on error

async function getCurrentUser(): Promise<User | null>;
// Get current authenticated user
// Returns null if not authenticated

async function getCurrentSession();
// Get current session object (contains tokens, etc.)
```

## Context Integration

### AuthContext

**Location**: `contexts/AuthContext.tsx`

Provides authentication state and operations across the entire app:

```typescript
type AuthContextType = {
  user: User | null; // Current authenticated user
  loading: boolean; // Loading state during auth check
  signIn: (email, password) => Promise<void>;
  signUp: (email, password, name) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (name) => Promise<void>;
  sendPasswordResetOTP: (email) => Promise<void>;
  verifyOTPAndResetPassword: (email, token, newPassword) => Promise<void>;
  updatePassword: (newPassword) => Promise<void>;
};
```

Usage:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  // Use auth data and operations
}
```

**Important**: Wrap entire app with `<AuthProvider>` in root layout to enable authentication context throughout the app.

## Utility Functions

### Email Validation

**validateEmail** — Validates email format using regex pattern

### Password Validation

**validatePassword** — Validates password meets requirements:

- Minimum 8 characters
- At least one uppercase letter
- At least one special character

### Password Match Validation

**validatePasswordMatch** — Ensures two password inputs match

### Name Validation

**validateName** — Validates name is non-empty string

### OTP Code Validation

**validateOTPCode** — Validates OTP is 6-digit code

## File Structure

```
components/auth/
├── login/
│   ├── LoginScreen.tsx              # Main login component
│   ├── components/
│   │   ├── LoginInputs.tsx          # Email/password inputs
│   │   ├── LoginFooter.tsx          # Sign up link
│   │   └── ForgotPasswordLink.tsx   # Password recovery link
│   └── hooks/
│       └── useLogin.ts              # Login form logic
│
├── signup/
│   ├── SignUpScreen.tsx             # Main sign up component
│   ├── components/
│   │   ├── SignUpInputs.tsx         # Name/email/password inputs
│   │   └── SignUpFooter.tsx         # Login link
│   └── hooks/
│       └── useSignUp.ts             # Sign up form logic
│
├── forgot-password/
│   ├── ForgotPasswordScreen.tsx      # Password recovery start
│   ├── components/
│   │   ├── ForgotPasswordInputs.tsx  # Email input
│   │   └── ForgotPasswordFooter.tsx  # Login link
│   └── hooks/
│       └── useForgotPassword.ts      # OTP request logic
│
├── verify-otp/
│   ├── VerifyOTPScreen.tsx          # OTP verification & reset
│   ├── components/
│   │   └── VerifyOTPInputs.tsx      # OTP/password inputs
│   └── hooks/
│       └── useVerifyOTP.ts          # OTP verification logic
│
└── shared/
    ├── components/
    │   └── AuthFooter.tsx            # Shared footer component
    └── utils/
        ├── validateEmail.ts          # Email validation
        ├── validatePassword.ts       # Password validation
        ├── validatePasswordMatch.ts  # Password match check
        ├── validateName.ts           # Name validation
        └── validateOTPCode.ts        # OTP validation

app/(auth)/
├── _layout.tsx                       # Auth stack navigation
├── login.tsx                         # Login route
├── signup.tsx                        # Sign up route
├── forgot-password.tsx               # Password recovery route
└── verify-otp.tsx                    # OTP verification route

lib/
└── auth-service.ts                   # Service layer (Supabase)

contexts/
├── AuthContext.tsx                   # Auth provider and hook
└── hooks/
    ├── useAuthSession.ts             # Session management
    └── useAuthOperations.ts          # Operation wrappers
```

## Password Requirements

Passwords must meet these criteria:

- **Minimum length**: 8 characters
- **Uppercase letter**: At least one uppercase letter (A-Z)
- **Special character**: At least one special character (!@#$%^&\*)

Example valid passwords:

- `MyPassword123!`
- `Secure@Pass2026`

Example invalid passwords:

- `short1!` (too short)
- `noupperca$e1` (no uppercase)
- `NoSpecial123` (no special character)

## Error Messages

All error messages are displayed in Ukrainian via `Alert.alert()`:

### Sign Up Errors

- "Невдалося зареєструватися" — General registration error
- "Ця адреса електронної пошти вже використовується" — Email already registered
- "Невальна адреса електронної пошти" — Invalid email format

### Sign In Errors

- "Невдалося увійти" — General login error
- "Невірна адреса електронної пошти або пароль" — Invalid credentials

### Password Recovery Errors

- "Невдалося надіслати код для відновлення пароля" — Failed to send OTP
- "Користувача з такою адресою не знайдено" — User not found

### OTP Verification Errors

- "Невдалося верифікувати код OTP" — Invalid or expired OTP
- "Невдалося оновити пароль" — Password update failed

## Security Considerations

### Password Security

- Passwords sent directly to Supabase over HTTPS
- Passwords never logged or stored in app
- Minimum complexity requirements enforced
- Password reset via OTP prevents account takeover without email access

### Session Management

- Sessions managed securely by Supabase SDK
- Session tokens stored in secure storage by SDK
- Automatic token refresh handled by Supabase
- Sessions cleared on sign out

### Email Verification

- OTP codes sent via email for password recovery
- OTP codes have expiration (handled by Supabase)
- OTP required to verify identity before password reset

## API Integration

### Supabase Auth Endpoints Used

- `signInWithPassword()` — User login
- `signUp()` — New account registration
- `signOut()` — Session termination
- `updateUser()` — Profile/password updates
- `signInWithOtp()` — Send OTP for recovery
- `verifyOtp()` — Verify OTP code
- `getUser()` — Get current user
- `getSession()` — Get current session
- `onAuthStateChange()` — Listen for auth changes

## Future Enhancements

Possible improvements to authentication:

- **Biometric login** — Touch/Face ID support
- **Social login** — Sign in with Google, Apple, etc.
- **Two-factor authentication** — Email/SMS 2FA
- **Email verification** — Verify email on sign up
- **Account deletion** — Allow users to delete accounts
- **Session management** — List and revoke active sessions
- **Login history** — Track login attempts and locations
- **Security keys** — Hardware security key support

## Testing Considerations

Key areas to test:

- **Sign Up**
  - Test with valid inputs
  - Test email already exists error
  - Test password requirements validation
  - Test name with special characters
  - Test very long inputs

- **Sign In**
  - Test with valid credentials
  - Test with invalid email
  - Test with incorrect password
  - Test with unregistered email
  - Test network error handling

- **Forgot Password**
  - Test OTP sent successfully
  - Test with unregistered email
  - Test with invalid email format
  - Test network error during OTP send

- **OTP Verification**
  - Test valid OTP code
  - Test invalid/expired OTP
  - Test password requirements validation
  - Test passwords don't match error
  - Test successful password update

- **Session Management**
  - Test session persists on app restart
  - Test session cleared on sign out
  - Test auto-redirect when unauthenticated
  - Test auto-redirect after sign in
  - Test loading state during auth check

- **Error Handling**
  - Test network error messages
  - Test server error messages
  - Test validation error messages
  - Test alert display and dismissal
