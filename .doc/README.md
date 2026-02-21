# Documentation

This directory contains feature documentation for the ТурнікМен app. Each file documents a specific feature, including its structure, components, data model, and user flows.

## Features

- [Authentication](./auth.md) — User sign up, sign in, and password recovery via OTP
- [Dashboard](./dashboard.md) — Main entry screen with weight summary, stats, and trend
- [Weight Tracking](./weight.md) — Weight logging, dashboard with charts, history, and statistics
- [Profile](./profile.md) — User profile management (view/edit name, logout)

## Adding New Docs

When documenting a new feature:

1. Create a new `.md` file with the feature name (e.g., `weight-tracking.md`, `exercises.md`)
2. Follow the structure used in existing documentation
3. Include sections for: Overview, Navigation, Screens & Components, Data Model, User Flows, and File Structure
4. Add a link to the new file in this README under the Features section

## Documentation Structure

Each feature documentation should include:

- **Overview** — brief description and completion status
- **Navigation** — how users access the feature
- **Screens & Components** — UI structure and components
- **Data Model** — data storage and types
- **User Flows** — step-by-step user interactions
- **Custom Hooks** (if applicable) — custom React hooks used
- **Service Layer** (if applicable) — backend/data layer functions
- **Context Integration** (if applicable) — context providers used
- **File Structure** — directory tree of feature files
- **Future Enhancements** — potential improvements
- **Testing Considerations** — key areas to test
