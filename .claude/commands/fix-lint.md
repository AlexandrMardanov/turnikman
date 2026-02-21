Run the linter and fix all reported errors.

## Steps

1. Run `npm run lint` and capture the output
2. Parse all errors and warnings
3. For each error:
   - Open the file
   - Fix the issue following project conventions
   - Verify the fix doesn't introduce new errors
4. Run `npm run lint` again to confirm zero errors remain
5. Run `npm run format` to ensure consistent formatting
6. Report a summary of all fixes made

## Rules

- Never suppress errors with `eslint-disable` comments unless the error is a known false positive
- If a fix requires a judgment call, explain the choice
- Preserve existing code behavior — only fix lint/format issues
