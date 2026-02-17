Analyze the staged git changes and create a commit following the project conventions.

## Steps

1. Run `git diff --staged` to understand what is staged for commit
2. Run `git status` to see the full picture
3. Based on the staged changes, generate a conventional commit message:
   - Prefix: `feat:`, `fix:`, `refactor:`, `style:`, `perf:`, `docs:`, `chore:`
   - Max 50 characters total
   - No period at the end
   - Written in English
   - Imperative mood (e.g. "add", not "added" or "adds")
4. Show the proposed commit message and ask for confirmation before creating the commit
5. After confirmation, create the commit with the generated message — do NOT include `Co-Authored-By` lines

## Commit type rules

- `feat:` — new feature or capability visible to the user
- `fix:` — bug fix
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `style:` — formatting, missing semicolons, no logic change
- `perf:` — performance improvement
- `docs:` — documentation only
- `chore:` — build process, dependencies, tooling

## Example messages

```
feat: add weight history filter by date range
fix: prevent duplicate entries on double tap
refactor: extract weight formatting to util
chore: update expo sdk to 55
```
