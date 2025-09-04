# Pull Request Best Practices for OpenHealth

## 🎯 Core Philosophy: Small, Focused, Testable

Every PR should be small enough to review in 5-10 minutes, focused enough to explain in one sentence, and complete enough to deploy independently.

## 📏 The Golden Rules

### Rule 1: Size Limits (Non-Negotiable)
```yaml
MAX_LINES: 200          # Total additions + deletions
MAX_FILES: 5            # Ideally 1-3 files
MAX_COMMITS: 3          # Ideally 1 commit
MAX_TIME: 30 minutes    # If it takes longer, split it
```

### Rule 2: One PR = One Purpose
- ✅ Each PR does exactly ONE thing
- ✅ Can be described in one sentence
- ✅ Addresses a single issue or feature
- ❌ No "while I'm here" changes
- ❌ No mixing features with fixes

### Rule 3: Always Deployable
- Every PR must leave the app in a working state
- Must pass all tests
- Could be deployed to production alone
- No "part 1 of X" PRs

## 📊 PR Size Classification

### Micro PR (Ideal) 🟢
- **Lines**: 1-50
- **Files**: 1
- **Time**: 5-10 minutes
- **Example**: Fix typo, add validation, update color

### Small PR (Good) 🟡
- **Lines**: 50-100
- **Files**: 2-3
- **Time**: 10-20 minutes
- **Example**: Add utility function + use it, fix bug + test

### Medium PR (Acceptable) 🟠
- **Lines**: 100-200
- **Files**: 3-5
- **Time**: 20-30 minutes
- **Example**: Add feature to one component

### Large PR (Must Split) 🔴
- **Lines**: 200+
- **Files**: 5+
- **Time**: 30+ minutes
- **Action**: STOP and break into smaller PRs

## 🔄 Workflow Examples

### Example 1: Implementing Authentication Rate Limiting

❌ **WRONG WAY (One Large PR)**
```
PR: Add complete rate limiting system (500+ lines)
- Creates types, store, middleware
- Updates all endpoints
- Adds tests and documentation
```

✅ **RIGHT WAY (5 Small PRs)**
```
PR #1: Add rate limit types and interfaces
├── src/lib/rate-limit/types.ts
├── 30 lines
└── 10 minutes

PR #2: Implement in-memory store
├── src/lib/rate-limit/store.ts
├── 45 lines
└── 15 minutes

PR #3: Create rate limit middleware
├── src/lib/rate-limit/middleware.ts
├── 60 lines
└── 20 minutes

PR #4: Apply to authentication endpoints
├── src/app/api/auth/register/route.ts
├── src/app/api/auth/login/route.ts
├── 20 lines total
└── 10 minutes

PR #5: Add documentation
├── docs/rate-limiting.md
├── 40 lines
└── 10 minutes
```

### Example 2: Adding Email Validation

✅ **PERFECT PR**
```
Branch: feat/email-validation
Files: 2
  - src/lib/validators/email.ts (new, 15 lines)
  - src/app/register/page.tsx (modified, +5 lines)
Total: 20 lines
Time: 10 minutes
Test: Try registering with invalid email
```

## 🧪 Testing Strategy

### Every PR Must Be Testable
```markdown
## How to Test This PR
1. Navigate to registration page
2. Enter "invalid-email" in email field
3. Click submit
4. Should see "Invalid email format" error
```

### Testing Checklist
- [ ] `npm run build` passes
- [ ] `npm run dev` works
- [ ] Manual test completed
- [ ] Edge cases considered
- [ ] No console errors

## 📝 Commit Best Practices

### Conventional Commit Format
```
type(scope): description

[optional body]
[optional footer]
```

### Common Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Testing
- `chore`: Maintenance

### Good Commit Examples
```bash
feat: add email validation to registration
fix: prevent null pointer in user lookup
docs: update rate limiting documentation
style: fix indentation in chat component
refactor: extract auth logic to hook
perf: optimize health data query
test: add unit tests for encryption
chore: update dependencies to latest
```

### Bad Commit Examples
```bash
"WIP"                           # Too vague
"Fixed stuff"                   # What stuff?
"Updates"                       # Updates to what?
"asdfasdf"                     # Meaningless
"feat: multiple improvements"   # Should be multiple commits
```

## 🚫 Anti-Patterns to Avoid

### The Kitchen Sink
```diff
- Title: "Improve app"
- Changes: 15 files, 500+ lines
- Mixes: features, fixes, refactors
```

### The Stealth Change
```diff
- Title: "Fix typo in README"
- Reality: Also refactored auth system
```

### The Broken Series
```diff
- PR #1: "Add feature part 1" (app broken)
- PR #2: "Add feature part 2" (app broken)
- PR #3: "Fix feature" (app works)
```

### The Monolith
```diff
- One PR for entire feature
- 1000+ lines changed
- 20+ files modified
- Impossible to review properly
```

## 🎯 PR Templates

### Feature PR Template
```markdown
## What
Add [specific feature] to [specific component]

## Why
Users need [specific capability] to [achieve goal]

## Changes
- Added [specific file/function]
- Modified [specific file] to [specific change]

## Test
1. [Step to test]
2. [Expected result]

## Size
- Files: 2
- Lines: +45 -5
```

### Bug Fix PR Template
```markdown
## What
Fix [specific bug] in [specific component]

## Why
[Bug description] causes [problem]

## Root Cause
[Technical explanation]

## Fix
[How you fixed it]

## Test
1. [Steps to reproduce bug]
2. [Verify fix works]

## Size
- Files: 1
- Lines: +10 -8
```

## 📈 Success Metrics

### Good PR Indicators
- ✅ Reviewed within 2 hours
- ✅ Approved on first review
- ✅ No merge conflicts
- ✅ Merged same day
- ✅ No rollback needed

### Bad PR Indicators
- ❌ Multiple review rounds
- ❌ Sitting for days
- ❌ Merge conflicts
- ❌ Causes production issues
- ❌ Needs follow-up fixes

## 🔍 Review Guidelines

### For Authors
1. Self-review before submitting
2. Ensure all checks pass
3. Test your changes
4. Fill out PR template completely
5. Respond to feedback quickly

### For Reviewers
1. Review within 2-4 hours
2. Focus on functionality first
3. Check test instructions
4. Verify size limits
5. Approve or request changes clearly

## 💡 Pro Tips

### Tip 1: Plan Before Coding
- Break down the task first
- Identify natural boundaries
- Plan your PR sequence

### Tip 2: Resist Scope Creep
- See something else to fix? Make a note
- Create a separate PR later
- Stay focused on current task

### Tip 3: Use Stacked PRs
- Build features incrementally
- Each PR builds on the last
- All independently deployable

### Tip 4: Communicate
- Describe changes clearly
- Explain the "why"
- Provide context for reviewers

## 📚 Examples From Session 4

### What NOT to Do (Session 4 Mistakes)
```yaml
Single Commit (613055c):
  - Upgraded encryption (170 lines)
  - Added rate limiting (180 lines)
  - Enhanced UI (50 lines)
  - Fixed bugs (30 lines)
  Total: 430+ lines across 6 files
  Problem: Too many unrelated changes
```

### How It Should Have Been
```yaml
Commit 1: feat: upgrade to AES-256-GCM
  - Only encryption changes
  - 170 lines, 1 file
  
Commit 2: feat: add rate limit middleware
  - Only middleware creation
  - 180 lines, 1 file
  
Commit 3: feat: apply rate limiting
  - Apply to endpoints
  - 30 lines, 2 files
  
Commit 4: feat: enhance model dropdown UI
  - Only UI changes
  - 50 lines, 1 file
  
Commit 5: fix: correct deployment env access
  - Only bug fixes
  - 30 lines, 1 file
```

## 🎓 Learning From Mistakes

### Session 4 Lessons
1. **Don't combine** security + UI + fixes
2. **Don't rush** - small PRs are faster overall
3. **Don't assume** - test each change independently
4. **Don't bundle** - each improvement stands alone

### Going Forward
- One feature at a time
- Test after each change
- Commit immediately when working
- Create PR before moving on

## 📖 Summary

**Remember**: If you can't review a PR in 5-10 minutes, it's too big. If you can't explain it in one sentence, it's doing too much. If it touches more than one feature area, it should be split.

Small PRs = Happy Developers = Stable Production = Happy Users

---

*Last Updated: Session 4 Review*
*Key Takeaway: Small, focused, tested PRs are the foundation of a maintainable codebase*