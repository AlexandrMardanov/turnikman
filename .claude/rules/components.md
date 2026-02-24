---
paths:
  - components/**/*.tsx
  - components/**/*.ts
---

# Component Rules

## Structure

- Organize by feature group, then by page: `components/<feature>/<page>/`
- Each page folder contains: `PageScreen.tsx`, `components/`, `hooks/`, `utils/`
- Shared code within a feature goes in `components/<feature>/shared/`
- App-wide shared components go in `components/shared/`

## Props

- Define `type ComponentProps = { ... }` above the component
- Pass as `props: ComponentProps` in the function signature
- Destructure inside the body: `const { label, onPress } = props`
- Never destructure in the function signature

## Handlers

- Use function declarations: `function handleSubmit() { ... }`
- Never use const arrow functions for handlers
- Place handlers after all hooks and before the return statement
- Name with `handle` prefix: `handlePress`, `handleChange`, `handleDelete`

## General

- Always add an empty line before `return` statements
- Use `type`, never `interface`
- One exported function per utility file, filename matches function name
- Extract complex logic to custom hooks in the `hooks/` folder
