# Pull Request Best Practices for OpenHealth

## ⚠️ IMMUTABLE RULES - NO EXCEPTIONS

**These rules are NON-NEGOTIABLE and MUST be followed by every contributor.**

## 🎯 Core Philosophy: Small, Focused, Testable

Every PR should be small enough to review in 5-10 minutes, focused enough to explain in one sentence, and complete enough to deploy independently.

## 🔥 FORK-FIRST WORKFLOW - MANDATORY

**All development MUST follow this workflow:**

### Phase 1: Develop & Test on YOUR Fork
1. **Fork Repository**: `OpenHealthForAll/open-health` → `your-username/open-health`
2. **Create Feature Branch**: `git checkout -b feat/your-specific-change`
3. **Develop Following Size Rules**: Max 200 lines, 5 files, 30 minutes
4. **Create PR to YOUR Fork**: Test thoroughly in your environment
5. **Merge to Your Fork's Main**: Only after successful testing

### Phase 2: Contribute to Upstream (Only After Testing)
1. **Create Upstream Branch**: `git checkout -b feat/your-change-upstream upstream/main`
2. **Cherry-pick Tested Commit**: `git cherry-pick <tested-commit-hash>`
3. **Create Upstream PR**: Reference your fork's testing in description
4. **Include Testing Evidence**: Link to your fork's PR and test results

### Why Fork-First?
- ✅ **Safe testing environment** - No risk to main project
- ✅ **Proven contributions** - Only submit validated, working code
- ✅ **Fast iteration** - Quick feedback loop on your fork
- ✅ **Quality assurance** - Catch issues before upstream submission

## 📏 THE GOLDEN RULES (ABSOLUTE)

### Rule 1: Size Limits (HARD LIMITS)
```yaml
MAX_LINES: 200          # Total additions + deletions - NO EXCEPTIONS
MAX_FILES: 5            # Ideally 1-3 files - STRICT LIMIT
MAX_COMMITS: 3          # Ideally 1 commit - FIRM BOUNDARY  
MAX_TIME: 30 minutes    # If longer, MUST split - NON-NEGOTIABLE
```

**VIOLATION = IMMEDIATE REJECTION**

### Rule 2: One PR = One Purpose (MANDATORY)
- ✅ Each PR does **EXACTLY ONE THING**
- ✅ Can be described in **ONE SENTENCE**
- ✅ Addresses **SINGLE ISSUE** or feature
- ❌ **ZERO** "while I'm here" changes
- ❌ **ZERO** mixing features with fixes
- ❌ **ZERO** bundling unrelated changes

**VIOLATION = AUTOMATIC CLOSE**

### Rule 3: Always Deployable (REQUIRED)
- Every PR **MUST** leave app in working state
- **MUST** pass all tests (`npm run build`)
- **COULD** be deployed to production alone
- **NO** "part 1 of X" PRs allowed
- **NO** breaking changes without migration

**VIOLATION = IMMEDIATE BLOCK**

## 🚨 ENFORCEMENT MECHANISMS

### Automatic Rejections
- **Size > 200 lines**: Auto-close with size violation notice
- **Files > 5**: Auto-close with scope violation notice
- **Mixed changes**: Auto-close with focus violation notice
- **No test instructions**: Auto-close with testing violation notice

### Review Blockers
- **Title too vague**: Must describe specific change
- **No fork testing**: Must show evidence of testing on fork
- **Multiple purposes**: Must split into separate PRs
- **Build failure**: Must fix before review

## 📊 PR Size Classification (STRICT)

### Micro PR (IDEAL) 🟢
- **Lines**: 1-50
- **Files**: 1
- **Time**: 5-10 minutes
- **Review Time**: 2-3 minutes
- **Example**: Fix typo, add validation, update color

### Small PR (GOOD) 🟡  
- **Lines**: 50-100
- **Files**: 2-3
- **Time**: 10-20 minutes
- **Review Time**: 5-8 minutes
- **Example**: Add utility function + use it, fix bug + test

### Medium PR (ACCEPTABLE) 🟠
- **Lines**: 100-200
- **Files**: 3-5
- **Time**: 20-30 minutes
- **Review Time**: 10-15 minutes
- **Example**: Add feature to one component

### Large PR (FORBIDDEN) 🔴
- **Lines**: 200+
- **Files**: 5+
- **Time**: 30+ minutes
- **Action**: **STOP IMMEDIATELY** - Split into smaller PRs
- **Status**: **WILL BE REJECTED**

## ✅ MANDATORY TESTING REQUIREMENTS

### Fork Testing Checklist
Before creating upstream PR:
- [ ] **Build passes** on your fork: `npm run build`
- [ ] **Dev server works** on your fork: `npm run dev`
- [ ] **Feature tested manually** on your fork
- [ ] **No regressions** in existing functionality
- [ ] **Performance acceptable** on your fork
- [ ] **Mobile responsive** (if UI changes)

### Upstream PR Requirements
- [ ] **Fork PR linked** in description
- [ ] **Test results documented** from fork
- [ ] **Evidence of manual testing** provided
- [ ] **Screenshot/video** if UI changes
- [ ] **Performance benchmarks** if relevant

## 🚫 ABSOLUTE PROHIBITIONS

### The Kitchen Sink (BANNED)
```diff
❌ FORBIDDEN
- Title: "Improve app security and UI"
- Changes: 15 files, 500+ lines
- Mixes: encryption + rate limiting + UI + fixes
- Result: IMMEDIATE REJECTION
```

### The Stealth Change (BANNED)
```diff
❌ FORBIDDEN  
- Title: "Fix typo in README"
- Reality: Also refactored entire auth system
- Result: PERMANENT CONTRIBUTOR BAN
```

### The Broken Series (BANNED)
```diff
❌ FORBIDDEN
- PR #1: "Add feature part 1" (app broken)
- PR #2: "Add feature part 2" (app broken)  
- PR #3: "Fix feature" (app works)
- Result: ALL REJECTED
```

### The WIP Submission (BANNED)
```diff
❌ FORBIDDEN
- "Work in progress"
- "Will fix in next PR"
- "Not ready but wanted feedback"
- Result: IMMEDIATE CLOSE
```

## 📝 COMMIT STANDARDS (ENFORCED)

### Conventional Commits (MANDATORY)
```bash
type(scope): description

feat: add email validation to registration
fix: prevent null pointer in user lookup  
docs: update API documentation
style: fix indentation in chat component
refactor: extract auth logic to utility
perf: optimize database query performance
test: add unit tests for encryption
chore: update dependencies to latest
```

### FORBIDDEN Commit Messages
```bash
❌ "WIP"                    # Too vague - REJECTED
❌ "Fixed stuff"            # What stuff? - REJECTED  
❌ "Updates"                # Updates to what? - REJECTED
❌ "asdfasdf"              # Meaningless - REJECTED
❌ "feat: multiple things"  # Should be separate - REJECTED
```

## 🔄 MANDATORY WORKFLOW STEPS

### Every PR Must Follow This Sequence:
1. **Plan**: Can this be done in <200 lines, <30 minutes?
2. **Branch**: `git checkout -b feat/specific-change-name`
3. **Develop**: Make ONE focused change only
4. **Test**: `npm run build && npm run dev` must pass
5. **Commit**: Use conventional commit format
6. **Fork PR**: Test on your fork first
7. **Validate**: Prove it works in fork environment
8. **Upstream PR**: Only after successful fork testing
9. **Reference**: Include fork testing evidence

### SKIP ANY STEP = AUTOMATIC REJECTION

## 📈 SUCCESS METRICS (MEASURED)

### Excellent PR Indicators
- ✅ **Reviewed in <2 hours**
- ✅ **Approved on first review**  
- ✅ **Zero merge conflicts**
- ✅ **Merged same day**
- ✅ **Zero rollbacks needed**
- ✅ **Fork testing documented**

### PR Failure Indicators  
- ❌ **Multiple review rounds** (indicates poor quality)
- ❌ **Days without merge** (indicates size/scope issues)
- ❌ **Merge conflicts** (indicates poor planning)
- ❌ **Production issues** (indicates insufficient testing)
- ❌ **Follow-up fixes needed** (indicates incomplete work)

## 🎯 UPSTREAM PR TEMPLATE (REQUIRED)

```markdown
## What (ONE SENTENCE ONLY)
[Specific change] to [specific component]

## Fork Testing Evidence (REQUIRED)
- Fork PR: your-username/open-health#123
- Test environment: [link to deployment]  
- Build status: ✅ Passed
- Manual testing: ✅ Completed
- Screenshots: [attach if UI changes]

## Changes (MAXIMUM 3 BULLET POINTS)
- [Specific change 1]
- [Specific change 2] 
- [Specific change 3]

## Test Instructions (REQUIRED)
1. [Exact step 1]
2. [Exact step 2]
3. Expected result: [Specific outcome]

## Size Compliance (REQUIRED)
- Files changed: X (must be ≤5)
- Lines: +X -Y (must be ≤200 total)
- Time to implement: X minutes (must be ≤30)

## Deployment Safety (REQUIRED)
- [ ] Can be deployed alone
- [ ] No breaking changes
- [ ] Backward compatible
- [ ] No database migrations
```

## 🚨 ENFORCEMENT ACTIONS

### First Violation
- PR closed with violation notice
- Required to read this document
- Must acknowledge understanding

### Second Violation  
- 1-week contribution timeout
- Mandatory training on PR best practices
- Must demonstrate understanding

### Third Violation
- Permanent contributor restriction
- All future PRs require pre-approval
- Escalation to project maintainers

### Repeat Offenders
- Removal from contributor list
- Blocked from all future contributions
- Public documentation of violations

## 📖 THE ABSOLUTE TRUTH

**These rules exist for ONE reason: To maintain a stable, maintainable, secure codebase that serves healthcare users safely.**

### Non-Negotiable Principles:
1. **Small PRs** = Fast reviews = Stable releases
2. **Fork testing** = Zero production issues  
3. **Single purpose** = Clear code history
4. **Documented testing** = Confident deployments
5. **Size limits** = Sustainable development

### Remember:
- **If you can't review it in 5 minutes, it's too big**
- **If you can't explain it in one sentence, it's doing too much**  
- **If it touches multiple areas, it should be multiple PRs**
- **If it's not tested on your fork, it's not ready for upstream**

---

## 🔒 IMMUTABLE COMMITMENT

**By contributing to OpenHealth, you commit to following these rules without exception. These practices protect the health data of real users - there are no acceptable compromises.**

*Last Updated: Session 4+ (Post-Fork Workflow Implementation)*  
*Status: IMMUTABLE TRUTH - DO NOT MODIFY WITHOUT UNANIMOUS MAINTAINER APPROVAL*