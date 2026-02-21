Generate a pull request description from the current branch changes.

## Steps

1. Run `git log main..HEAD --oneline` to list all commits on this branch
2. Run `git diff main...HEAD --stat` to see changed files summary
3. Run `git diff main...HEAD` to understand the actual changes
4. Generate a PR description in this format:

## Output Format

```markdown
## What

<1-3 sentence summary of what this PR does>

## Changes

- <bullet point for each meaningful change>

## Testing

- <how to test these changes>
```

## Rules

- Focus on the "why" not the "what" — explain intent
- Group related changes together
- Keep it concise — no more than 10 bullet points
- Use English
- If there are UI changes, mention which screens are affected

$ARGUMENTS
