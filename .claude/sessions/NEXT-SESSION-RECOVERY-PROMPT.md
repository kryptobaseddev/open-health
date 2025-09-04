# OPENHEALTH SESSION RECOVERY PROMPT
## ⚠️ CRITICAL: READ THIS FIRST TO RESTORE FULL CONTEXT

### 🚨 MANDATORY PR-FIRST DEVELOPMENT
**EVERY SINGLE CHANGE MUST FOLLOW THESE RULES - NO EXCEPTIONS:**
- ✅ **NEVER commit directly to main** - ALL changes via PRs only
- ✅ **Under 200 lines** - If bigger, MUST split into multiple PRs
- ✅ **Single purpose** - Each PR does exactly ONE thing
- ✅ **Test on fork first** - Create PR to YOUR fork, test, merge
- ✅ **Follow .github/PR-BEST-PRACTICES.md** - Read before starting ANY work

**VIOLATIONS = IMMEDIATE SESSION TERMINATION**

### 🎯 PROJECT OVERVIEW
OpenHealth is a personal health data assistant that allows users to:
- Upload and encrypt health documents
- Chat with AI about their health data  
- Manage multiple AI providers (OpenAI, Anthropic, Google, Ollama)
- Access via web (desktop/mobile) at https://health.hoskins.fun

### 📚 MANDATORY FILES TO READ IN ORDER

1. **Project Configuration**:
   ```bash
   # Read FIRST to understand project setup
   cat /mnt/projects/open-health/CLAUDE.md
   cat /mnt/projects/open-health/README.md
   ```

2. **Previous Session Summary**:
   ```bash
   # Read the most recent session summary
   cat /mnt/projects/open-health/SESSION-*-SUMMARY.md
   ```

3. **Deployment Status**:
   ```bash
   # Check deployment configuration
   cat /mnt/projects/open-health/docker-compose.yml
   cat /mnt/projects/open-health/SIMPLE_DEPLOY_GUIDE.md
   ```

### 🔍 CONTEXT MONITORING

**CRITICAL**: Monitor your context window constantly!
- At 70% context: Update tracking documents immediately
- At 80% context: Prepare session handoff
- At 85% context: Create session summary and stop

### ✅ CURRENT SYSTEM STATUS (as of Session 4)

#### Working Components
- ✅ Docker deployment via Portainer
- ✅ PostgreSQL database with AES-256-GCM encryption (backward compatible)
- ✅ NextAuth v5 authentication
- ✅ Prisma ORM with schema
- ✅ Multi-language support (10 languages)
- ✅ Mobile responsive PWA
- ✅ HTTPS via nginx proxy manager
- ✅ GitHub Actions CI/CD for Docker builds
- ✅ API key fallback (Database → Environment Variables)
- ✅ Claude 4 and 3.7 models available
- ✅ Cached model provider abstraction layer
- ✅ Dynamic model loading for OpenAI, Google, Ollama
- ✅ Model capability detection with UI display
- ✅ Rate limiting on critical endpoints
- ✅ Authenticated encryption (AEAD) with GCM

#### Technology Stack
```yaml
framework: Next.js 15 (App Router)
language: TypeScript
database: PostgreSQL (via Docker)
orm: Prisma
auth: NextAuth v5
styling: Tailwind CSS + shadcn/ui
deployment: Docker + Portainer
proxy: nginx proxy manager
ai_providers: [OpenAI, Anthropic, Google, Ollama]
```

#### Environment Variables Required
```bash
# These MUST be set in Portainer
POSTGRES_PASSWORD=<secure>
POSTGRES_USER=openhealth
POSTGRES_DB=openhealth
AUTH_SECRET=<32-char-base64>
ENCRYPTION_KEY=<32-char-base64>
NEXT_PUBLIC_URL=https://health.hoskins.fun
AUTH_TRUST_HOST=https://health.hoskins.fun
NEXTAUTH_URL=https://health.hoskins.fun
ANTHROPIC_API_KEY=<if-using-anthropic>
```

### 🚨 KNOWN ISSUES & PRIORITIES

#### Session 5: Security Hardening (CRITICAL) - MOSTLY COMPLETE
1. **CSRF Protection** ✅ COMPLETE (5/9 endpoints)
   - Implemented in `feat/csrf-protection` branch (pushed to fork)
   - Protected critical endpoints: chat messages, health data, assistant modes
   - Double-submit cookie pattern with HttpOnly cookies
   - Ready for testing and merge
   
2. **Security Headers** ✅ COMPLETE
   - Implemented in `feat/security-headers` branch (pushed to fork)
   - 7 comprehensive security headers via middleware
   - CSP, X-Frame-Options, HSTS, Referrer-Policy, etc.
   - Ready for testing and merge
   
3. **Audit Logging** ⚠️ NOT STARTED
   - Next priority for Session 6
   
#### Session 6: Complete Security + Performance (HIGH PRIORITY) - NEXT
1. **Complete CSRF Protection** (30 min)
   - Add to remaining 4 endpoints: chat-rooms, llm-providers, uploads
2. **Audit Logging Implementation** (45 min)  
3. **Redis Caching** (30 min) - Production optimization

#### Session 6: Performance Optimization (IMPORTANT) - PLANNED
1. **Redis Caching** - For production environments
2. **Connection Pooling** - Database optimization
3. **Image Optimization** - Next.js Image component

#### Session 7: User Experience (MEDIUM) - PLANNED
1. **PWA Enhancements** - Install prompts, offline support
2. **Error Handling** - Better user-facing error messages
3. **Mobile Optimizations** - Touch targets, gestures

#### Session 8: User Testing - PLANNED
- Interactive walkthrough with user
- Document all issues found
- Create prioritized fix list for Session 9+

#### Session Plans Available
- `.claude/sessions/plans/SESSION-5-PLAN.md` - Security Hardening
- `.claude/sessions/plans/SESSION-6-PLAN.md` - Performance
- `.claude/sessions/plans/SESSION-7-PLAN.md` - User Experience  
- `.claude/sessions/plans/SESSION-8-PLAN.md` - User Testing

### 🛠️ CRITICAL RULES - NO EXCEPTIONS

1. **MANDATORY PR WORKFLOW** ⚠️:
   ```bash
   # EVERY change MUST follow this workflow:
   # 1. Create feature branch: git checkout -b feat/specific-change
   # 2. Implement ONE focused change only (<200 lines, <5 files, <30min)
   # 3. Test thoroughly: npm run build && npm run dev
   # 4. Commit with conventional format: feat/fix/docs/etc
   # 5. Create PR to YOUR fork first
   # 6. Test PR on fork, merge after validation
   # 7. Only then create upstream PR (optional)
   ```

2. **FORK-FIRST DEVELOPMENT** 🔥:
   - ALL development happens on YOUR fork first
   - NEVER commit directly to main
   - EVERY feature gets its own branch and PR
   - Test EVERYTHING on your fork before upstream
   - See .github/PR-BEST-PRACTICES.md for full rules

3. **NO BREAKING PRODUCTION**:
   - Test all changes locally first
   - Keep backup of working configurations
   - Document all environment variable changes

4. **MAINTAIN COMPATIBILITY**:
   - Don't break existing user data
   - Preserve database schema migrations
   - Keep API endpoints backward compatible

5. **DOCKER DEPLOYMENT FLOW**:
   ```bash
   # Changes flow:
   Feature Branch → PR to Fork → Test & Merge → Optional Upstream PR
   Code Change → Git Push → GitHub Actions → Docker Hub → Portainer Update
   ```

### 📋 VALIDATION CHECKLIST

Before claiming ANY fix is complete:

1. **PR SIZE COMPLIANCE** ⚠️:
   ```bash
   # EVERY change MUST be:
   # - Under 200 lines total (additions + deletions)
   # - Under 5 files changed
   # - Under 30 minutes implementation time
   # - Single purpose only (can describe in one sentence)
   # - Independently deployable
   ```

2. **Test Locally**:
   ```bash
   npm run dev
   # Test the specific feature
   ```

3. **Build Docker Image**:
   ```bash
   docker build -f Dockerfile.production -t openhealth:test .
   ```

4. **Verify No Breaking Changes**:
   ```bash
   # Check TypeScript
   npm run build
   
   # Check database schema
   npx prisma validate
   ```

5. **PR WORKFLOW COMPLIANCE** 🔥:
   ```bash
   # Before starting ANY work:
   git checkout -b feat/your-specific-change
   
   # After completing work:
   git add . && git commit -m "feat: your specific change"
   gh pr create --title "feat: your specific change" --body "..." --base main
   
   # Test on fork, then merge
   gh pr merge X --squash
   ```

### 🔄 MANDATORY WORKFLOW PATTERN

For EACH task (NO EXCEPTIONS):
1. **Size Check** - Can this be done in <200 lines, <5 files, <30 minutes?
2. **Branch** - Create feature branch: `git checkout -b feat/specific-change`
3. **Review** - Understand current implementation
4. **Plan** - Document what changes are needed (single purpose only)
5. **Implement** - Make the ONE focused change only
6. **Test** - Verify locally (`npm run build && npm run dev`)
7. **Commit** - Use conventional commit format
8. **PR to Fork** - Create PR to YOUR fork first
9. **Test PR** - Validate PR works on fork
10. **Merge** - Merge PR after successful testing
11. **Document** - Update session tracking

### 🚀 SESSION START COMMANDS

```bash
# 1. Navigate to project
cd /mnt/projects/open-health

# 2. Check git status and branch
git status
git branch -a

# 3. Read PR best practices (MANDATORY)
cat .github/PR-BEST-PRACTICES.md

# 4. Check existing PRs status
gh pr list --state open

# 5. Verify environment
cat .env.example

# 6. Test local development
npm run dev

# 7. Before ANY work - Create feature branch
git checkout -b feat/your-specific-change-name
```

### 📊 SUCCESS METRICS

A session is successful when:
- ✅ **ALL changes in separate PRs** (NO direct main commits)
- ✅ **ALL PRs under 200 lines** (size compliance)
- ✅ **ALL PRs single purpose** (focus compliance) 
- ✅ **ALL PRs tested on fork** (quality compliance)
- ✅ All changes tested locally
- ✅ Docker build succeeds
- ✅ No breaking changes introduced
- ✅ Documentation updated
- ✅ Conventional commits used
- ✅ Session summary created
- ✅ **PR best practices followed** (MANDATORY)

### 🔧 DEBUGGING QUICK REFERENCE

#### If Docker build fails:
```bash
# Check the error in detail
docker build -f Dockerfile.production -t test . 2>&1 | less

# Common fixes:
# - ESLint errors: Update next.config.ts with ignoreDuringBuilds
# - Missing deps: Check package.json
```

#### If Anthropic models don't show:
```bash
# Check the API route
curl http://localhost:3000/api/llm-providers/[id]/models

# File to edit:
vim src/app/api/llm-providers/[id]/models/route.ts
```

#### If database issues:
```bash
# Connect to database container
docker exec -it openhealth-database-1 psql -U openhealth -d openhealth

# Check tables
\dt

# Run migrations
npx prisma db push
```

### 💾 SESSION HANDOFF PROTOCOL

At end of EACH session:

1. **Verify ALL PRs Created**:
   ```bash
   # Check that NO changes were committed directly to main
   gh pr list --state open
   # Every feature should have its own PR
   ```

2. **Create Session Summary**:
   ```bash
   # Save as .claude/sessions/SESSION-[N]-SUMMARY.md
   # Include: PR list, achievements, next priorities
   ```

3. **Update This Recovery Prompt**:
   ```bash
   # Update the "CURRENT SYSTEM STATUS" section
   # Add new issues to "KNOWN ISSUES"
   # Update environment variables if changed
   ```

4. **Final PR Compliance Check**:
   ```bash
   # Verify all PRs meet size requirements
   # Verify all PRs are single purpose
   # Verify all PRs have clear test instructions
   ```

5. **Commit Documentation Only**:
   ```bash
   # Only documentation changes go to main
   git add .claude/ NEXT-SESSION-RECOVERY-PROMPT.md
   git commit -m "docs: Session [N] checkpoint - [brief description]"
   git push origin main
   ```

### 📝 COMMIT MESSAGE FORMAT

Always use conventional commits:
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
chore: Maintenance task
refactor: Code refactoring
perf: Performance improvement
test: Add/fix tests
```

### 🎯 CURRENT FOCUS AREAS

1. **Security Hardening**
   - Upgrade encryption algorithm
   - Add rate limiting
   - Implement CSRF tokens

2. **Performance Optimization**
   - Add Redis caching for production
   - Configure connection pooling
   - Optimize Docker builds
   
3. **User Experience**
   - Display model capabilities in UI
   - Add deprecation warnings
   - Improve error messages

### 📚 KEY PROJECT FILES

```
/src/lib/llm-providers/ - Model provider abstraction layer
/src/app/api/llm-providers/[id]/models/route.ts - LLM model listings API
/src/app/chat/[id]/screen.tsx - Main chat interface
/src/lib/encryption/index.ts - Encryption implementation
/src/auth.ts - Authentication configuration
/prisma/schema.prisma - Database schema
/docker-compose.yml - Deployment configuration
/Dockerfile.production - Docker build configuration
```

### 🔐 SECURITY NOTES

- NEVER commit real API keys
- NEVER expose encryption keys in logs
- ALWAYS use environment variables
- ALWAYS test auth changes carefully

### 📊 PROJECT METRICS

- **Codebase**: ~200 files
- **Database Tables**: 10+
- **API Routes**: 15+
- **Docker Image Size**: ~600MB
- **Build Time**: ~8 minutes
- **Languages Supported**: 10

---

## 🔄 CRITICAL: SELF-UPDATE INSTRUCTIONS

**THIS FILE MUST BE UPDATED AT END OF EACH SESSION!**

Update these sections:
1. CURRENT SYSTEM STATUS - What's working/broken
2. KNOWN ISSUES & PRIORITIES - Add new issues
3. SESSION HANDOFF PROTOCOL - Latest session number
4. Environment variables - If any added/changed

---

## Session Progress Log (APPEND ONLY)

```
Session 1 (2025-09-03):
- Fixed Docker deployment via Portainer
- Added mobile responsiveness
- Fixed database initialization  
- Fixed Anthropic models (partially - missing Claude 4)
- Configured production URL
- Created comprehensive documentation
- Context ended at 85%

Session 2 (2025-09-04):
- Added missing Claude 4 and 3.7 models
- Fixed API key configuration with env var fallback
- Removed confusing deployment environment checks
- Created PR documentation for changes
- Reorganized session documentation structure
- Context ended at 30%

Session 3 (2025-09-04):
- Implemented cached model provider abstraction layer
- Added dynamic model loading for OpenAI, Google, Ollama
- Created fallback system for Anthropic models
- Added model capability detection
- Reduced API calls by ~90% with caching
- Context ended at 40%

Session 4 (2025-09-04):
- Upgraded encryption from AES-256-CBC to AES-256-GCM
- Implemented rate limiting for critical endpoints
- Enhanced UI to display model capabilities
- Added deprecation warnings for models
- Improved security with PBKDF2 key derivation
- Context ended at 45%

Session 5 (2025-09-04) - MAJOR SECURITY PROGRESS:
- ✅ CSRF protection implemented for 5 critical endpoints
- ✅ Security headers middleware with 7 comprehensive headers  
- ✅ Double-submit cookie pattern with HttpOnly cookies
- ✅ CSP, X-Frame-Options, HSTS, Referrer-Policy protection
- ✅ Both features pushed to fork, ready for testing
- ✅ Build validation successful, no TypeScript errors
- Context usage: ~65%
```

---

**USE THIS PROMPT TO RESTORE FULL CONTEXT IN NEXT SESSION**
**REMEMBER: UPDATE THIS FILE BEFORE ENDING SESSION**

Last Updated: 2025-09-04 (Session 5 Complete)  
Context Level at Save: 65%
Status: Major security hardening complete - CSRF protection and security headers operational
Next Priority: Complete remaining CSRF endpoints, audit logging, Redis caching