# Contributing to OpenHealth

We firmly believe that AI can significantly improve personal health management. OpenHealth is built on this conviction, and we welcome contributions from everyone who shares this vision.

## 🌟 Our Core Principles

### 1. Help Others 🤝
AI has the potential to improve personal health, but using it safely and effectively isn't always easy. Share knowledge, guide newcomers, and help others make the most of AI in healthcare. All community standards prioritize helping people improve their health.

### 2. Rationality, Intelligence, and Constructive Discussion 🧠
The healthcare industry is full of marketing hype, pseudoscience, and misinformation. That's why we stay critical, think rationally, and demand real evidence for claims. If something works, why? If it doesn't, why not? Keep discussions logical, thoughtful, and constructive.

### 3. Your Health, Your Risk ⚠️
AI can be wrong. But so can traditional medicine. Ultimately, you are responsible for your health decisions. Before making any important choices, verify information from multiple sources and think critically.

## 🚀 Ways to Contribute

### For Developers

⚠️ **MANDATORY READING**: [.github/PR-BEST-PRACTICES.md](.github/PR-BEST-PRACTICES.md)

**All code contributions MUST follow our immutable PR rules:**
- **Max 200 lines per PR** (HARD LIMIT - NO EXCEPTIONS)
- **Test on your fork first** (MANDATORY - NO DIRECT UPSTREAM PRs)
- **One feature per PR** (ABSOLUTE RULE - NO BUNDLING)

- **Submit Pull Requests**: After reading our PR rules and testing on your fork first!
- **Start with Good First Issues**: Check out our [good first issues](https://github.com/OpenHealthForAll/open-health/labels/good%20first%20issue) to get started.
- **Collaborate**: If you have an existing service, we're open to exploring synergies and integration possibilities. Let's work together to create something greater!

## 📏 Pull Request Guidelines - IMPORTANT

### PR Size Rules (Strictly Enforced)
We believe in small, focused, easily reviewable changes:

- **Maximum 200 lines changed** (additions + deletions)
- **Maximum 5 files changed** (ideally 1-3)
- **Maximum 3 commits** (ideally 1)
- **Should take under 30 minutes to implement**

### Why Small PRs?
- ✅ Reviews complete in 5-10 minutes (not hours)
- ✅ Easier to test and validate
- ✅ Lower risk of introducing bugs
- ✅ Simple rollbacks if issues arise
- ✅ Minimal merge conflicts
- ✅ Clear, readable git history

### One PR = One Purpose
✅ **GOOD PR Examples:**
- Add rate limiting to a single endpoint
- Fix a specific bug in user validation
- Add email validation to registration
- Update styling of navigation bar
- Add a single utility function
- Fix a typo in documentation

❌ **BAD PR Examples:**
- "Security improvements" (too vague, multiple changes)
- Fix bug + add new feature in same PR
- Refactor code + change functionality
- Any PR touching more than one feature area
- Any PR over 200 lines

### Development Workflow

1. **Plan your change** - Can it be done in under 200 lines?
2. **Create focused branch** - `feat/specific-change-name`
3. **Make ONE change** - Resist "while I'm here" temptation
4. **Test locally** - `npm run build` must pass
5. **Commit with clear message** - Use conventional commits
6. **Push and create PR** - Use our PR template
7. **Get it merged** - Small PRs merge fast!

### Commit Message Format
We use [Conventional Commits](https://www.conventionalcommits.org/):
```
type: brief description

Examples:
feat: add email validation to registration form
fix: correct null check in user authentication
docs: update API endpoint documentation
style: fix indentation in chat component
refactor: extract encryption logic to utility
perf: optimize database query for health data
test: add unit tests for rate limiter
chore: update dependencies
```

### Breaking Down Large Features
Large features MUST be split into multiple small PRs:

**Example: Adding Rate Limiting (The RIGHT Way)**
- PR #1: Create rate limit types (30 lines)
- PR #2: Add rate limit store (45 lines) 
- PR #3: Create middleware (60 lines)
- PR #4: Apply to auth endpoints (20 lines)
- PR #5: Apply to API endpoints (25 lines)

Each PR is small, focused, testable, and can be deployed independently.

### Testing Requirements
Every PR must include:
1. **Build passing**: `npm run build` succeeds
2. **Runs locally**: `npm run dev` works
3. **Test instructions**: Clear steps in PR description
4. **Tested by author**: You've verified it works

### PR Checklist
Before submitting:
- [ ] Under 200 lines changed
- [ ] Under 5 files (ideally 1-3)
- [ ] Does ONE thing only
- [ ] All tests pass
- [ ] Includes test instructions
- [ ] Uses conventional commit format
- [ ] Could be deployed alone

### For Users

- **Share Your Experience**: Your success stories matter! Share how OpenHealth has helped you on our [Reddit community](https://www.reddit.com/r/AIDoctor/). Collective knowledge becomes a powerful resource.
- **Report Issues**: Encountered something that could be improved? Let us know through:
  - [GitHub Issues](https://github.com/OpenHealthForAll/open-health/issues)
  - [Reddit Channel](https://www.reddit.com/r/AIDoctor/)

## 💫 Let's Make Healthcare Better Together

Every contribution, whether it's code, feedback, or sharing experiences, helps make OpenHealth better for everyone. Join us in our mission to improve personal health management through AI. 