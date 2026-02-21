# Code Review Command

Request a code review with git context before merging or after completing a task.

## Usage

```bash
# Review changes since last commit
/review

# Review changes between two commits/branches
/review base-branch..HEAD
/review abc1234..def5678
```

## What Happens

1. Gets git diff between base and head
2. Lists files changed with line counts
3. Dispatches code reviewer agent with full context
4. Provides verdict: Ready to merge? Yes/No/With fixes

## Example Output

```
[Collecting git context...]
Base: origin/main (abc1234)
Head: feature/exercises (def5678)
Files changed: 12 (+450, -120 lines)

[Dispatching reviewer agent...]

### Summary
Added exercise filtering UI with new useExerciseFilters hook. Implementation follows conventions well.

### Critical
None

### Warning
1. Missing accessibility labels on filter buttons
   - File: components/exercises/list/components/FilterBar.tsx:45-48
   - Issue: Interactive buttons need accessibilityLabel
   - Fix: Add accessibilityLabel prop to each button

### Suggestion
1. Extract filter constants to separate file
   - File: components/exercises/list/components/FilterBar.tsx:12-25
   - Issue: Filter options defined inline
   - Impact: Harder to reuse or test
   - Fix: Move to components/exercises/list/constants/filterOptions.ts

---

## Verdict

**Ready to merge?** With fixes

**Reasoning:** Core implementation is solid and well-structured. Fix the accessibility warning before merging to maintain accessibility standards.
```

## Integration

Add git context to your review request:

```bash
# Get base and head commits
BASE=$(git merge-base --fork-point origin/master HEAD)
HEAD=$(git rev-parse HEAD)

# Review with context
git diff --stat $BASE..$HEAD
git diff $BASE..$HEAD
```

Then ask: "Review these changes. WHAT_WAS_IMPLEMENTED: [feature name], GIT_BASE_SHA: $BASE, GIT_HEAD_SHA: $HEAD"
