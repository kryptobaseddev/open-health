# PR Organization Plan - OpenHealth Sessions 1-4

## Current State Analysis

### Existing PRs on Fork (kryptobaseddev/open-health)
- **PR #1**: Model Provider Abstraction (feat/model-provider-v2) - OPEN ✅
- **PR #2**: AES-256-GCM Encryption Upgrade (feat/aes-256-gcm-encryption) - OPEN ✅  
- **PR #3**: Rate Limiting Middleware (feat/rate-limit-middleware) - OPEN ✅

### Commit Analysis (Sessions 1-4)

#### Session 1: Docker & Deployment (Commits: 7e44bfe → 7d46b11)
**Status**: ❌ NOT IN PR - Need to create
```
7e44bfe - docs: Add comprehensive deployment and testing documentation
f024173 - fix: Add simplified Portainer stack configuration  
93cc3da - fix: Add Portainer web editor deployment solutions
b177e16 - feat: Simplify deployment with automatic Docker Hub builds
ecbe614 - fix: add docker hub username to compose
1497f66 - fix: Fix Docker build failures and GitHub Actions
38f5d51 - fix: Resolve Docker build ESLint errors and security warnings
8674a38 - simplify: Use single docker-compose.yml and optimize builds
a0ce42f - fix: Rename docker-compose.yaml to .yml for Portainer compatibility
1395bae - fix: Fix app startup issues in Docker container
82d368f - fix: Correct Next.js standalone server path in Docker
407d5ca - fix: Disable health checks and add messages folder
0e85e9b - fix: Use prisma db push instead of migrate
366656c - fix: Fix redirect to container hostname after login
7d46b11 - fix: Make navbar sticky on mobile
```

#### Session 2: API Keys & Models (Commits: 589a8a9, 167bb8a)
**Status**: ❌ NOT IN PR - Need to create
```
589a8a9 - fix: Add missing Anthropic Claude 4 and 3.7 models
167bb8a - fix: Add environment variable fallback for API keys
```

#### Session 3: Model Provider Abstraction (Commit: 6d55954)
**Status**: ✅ IN PR #1 - Already created
```
6d55954 - feat: Implement cached model provider abstraction layer
```

#### Session 4: Security & UX (Commit: 613055c)
**Status**: ⚠️ PARTIALLY IN PRS #2 & #3 - Need to split properly
```
613055c - feat: Security and UX improvements for Session 4
```

#### Documentation Commits
**Status**: ❌ NOT IN PR - Could be separate or bundled
```
c8f74b1 - docs: Add comprehensive PR guidelines and best practices
a04fb3d - docs: Update session 4 documentation and recovery prompt
b5233c6 - chore: Session 3 checkpoint - model provider abstraction complete
82d5e9f - docs: Add Session 2 documentation and PR files
40e91f1 - docs: Add comprehensive session documentation system
f023fa4 - fix: Add hardcoded Anthropic model list for dropdown (pre-abstraction)
```

## PR Organization Strategy

### Following Best Practices (Max 200 lines, 5 files, 30 minutes)

#### PR #4: Docker Deployment Fixes
**Branch**: `feat/docker-deployment-improvements`
**Size**: ~150 lines across 4-5 files
**Commits**: 82d368f → 366656c (Docker core fixes only)
```yaml
What: Fix Docker deployment for Portainer environments
Why: Enable production deployment via Docker containers
Changes:
  - Fix Next.js standalone server path
  - Replace migrate with db push for initialization
  - Fix container hostname redirects
Files: 4 (docker-compose.yml, Dockerfile.production, next.config.ts, auth.ts)
Lines: ~120
```

#### PR #5: Build & CI Improvements  
**Branch**: `feat/build-optimizations`
**Size**: ~80 lines across 3 files
**Commits**: 38f5d51, 8674a38, a0ce42f
```yaml
What: Optimize Docker builds and fix CI/CD pipeline
Why: Reduce build time and enable automated deployments
Changes:
  - Resolve ESLint errors in builds
  - Simplify to single docker-compose.yml
  - Add automated Docker Hub publishing
Files: 3 (.github/workflows/, docker-compose.yml, next.config.ts)
Lines: ~80
```

#### PR #6: Mobile & UX Improvements
**Branch**: `feat/mobile-improvements`
**Size**: ~40 lines across 2 files
**Commits**: 7d46b11
```yaml
What: Make navbar sticky on mobile devices
Why: Improve mobile user experience
Changes:
  - Fix navbar positioning on mobile
Files: 1-2 (navbar component, styles)
Lines: ~40
```

#### PR #7: API Key Configuration Fix
**Branch**: `feat/api-key-fallback`  
**Size**: ~60 lines across 2 files
**Commits**: 167bb8a
```yaml
What: Add environment variable fallback for API keys
Why: Enable production deployment without manual key entry
Changes:
  - Implement database → env var fallback chain
  - Improve error handling for decryption failures
Files: 2 (models route, messages route)
Lines: ~60
```

#### PR #8: Anthropic Models Update
**Branch**: `feat/claude-4-models`
**Size**: ~30 lines across 1 file
**Commits**: 589a8a9
```yaml
What: Add missing Claude 4 and 3.7 models
Why: Support latest Anthropic model releases
Changes:
  - Add Claude 4 Opus and Sonnet
  - Add Claude 3.7 Sonnet
Files: 1 (models route)
Lines: ~30
```

### Already Created PRs (Keep as is)

#### PR #1: Model Provider Abstraction ✅
- Commit: 6d55954
- Status: Ready for review
- Size: Within guidelines

#### PR #2: Encryption Upgrade ✅ 
- Part of commit: 613055c (encryption changes only)
- Status: Ready for review
- Size: Within guidelines

#### PR #3: Rate Limiting ✅
- Part of commit: 613055c (rate limiting changes only)  
- Status: Ready for review
- Size: Within guidelines

## Implementation Plan

### Phase 1: Create Missing PRs (Immediate)
1. Create branches for PRs #4-8
2. Cherry-pick specific commits to each branch
3. Create PRs with proper templates
4. Test each PR independently

### Phase 2: Validation & Testing
1. Test each PR on fork
2. Ensure each is deployable independently
3. Validate size/scope guidelines
4. Get review feedback

### Phase 3: Upstream Contribution (After validation)
1. Merge tested PRs on fork
2. Create corresponding PRs to upstream
3. Reference fork testing in descriptions

## Rules Applied

✅ **Size Limits**:
- All PRs under 200 lines
- All PRs under 5 files
- All PRs under 30 minutes implementation

✅ **Single Purpose**:
- Each PR addresses one specific area
- No mixing of concerns
- Clear, testable objectives

✅ **Deployable**:
- Each PR leaves app in working state
- Can be deployed independently
- No "part 1 of X" PRs

## Next Steps

1. ✅ Create PR tracking document (this file)
2. ⏳ Create branches for PRs #4-8  
3. ⏳ Cherry-pick commits to appropriate branches
4. ⏳ Create PRs with templates
5. ⏳ Test and validate each PR

## Commit to PR Mapping

| Commit | Description | Target PR | Status |
|--------|-------------|-----------|---------|
| 6d55954 | Model provider abstraction | PR #1 | ✅ Done |
| 613055c (encryption) | AES-256-GCM upgrade | PR #2 | ✅ Done |  
| 613055c (rate limit) | Rate limiting middleware | PR #3 | ✅ Done |
| 82d368f-366656c | Docker deployment fixes | PR #4 | ⏳ TODO |
| 38f5d51-a0ce42f | Build optimizations | PR #5 | ⏳ TODO |
| 7d46b11 | Mobile improvements | PR #6 | ⏳ TODO |
| 167bb8a | API key fallback | PR #7 | ⏳ TODO |
| 589a8a9 | Claude 4 models | PR #8 | ⏳ TODO |

---

*Generated for OpenHealth Session organization*
*Following .github/PR-BEST-PRACTICES.md guidelines*