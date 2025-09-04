# OPENHEALTH SESSION RECOVERY PROMPT
## CRITICAL: READ THIS FIRST TO RESTORE FULL CONTEXT

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

#### HIGH PRIORITY FIXES
1. **Remaining Security Issues** ⚠️
   - Missing CSRF protection
   - No security headers (CSP, X-Frame-Options, HSTS)
   - Need audit logging for sensitive operations

2. **Performance Issues** ⚠️
   - No Redis caching for production
   - No database connection pooling
   - Missing image optimization

### 🛠️ CRITICAL RULES - NO EXCEPTIONS

1. **NO BREAKING PRODUCTION**:
   - Test all changes locally first
   - Keep backup of working configurations
   - Document all environment variable changes

2. **MAINTAIN COMPATIBILITY**:
   - Don't break existing user data
   - Preserve database schema migrations
   - Keep API endpoints backward compatible

3. **DOCKER DEPLOYMENT FLOW**:
   ```bash
   # Changes flow:
   Code Change → Git Push → GitHub Actions → Docker Hub → Portainer Update
   ```

### 📋 VALIDATION CHECKLIST

Before claiming ANY fix is complete:

1. **Test Locally**:
   ```bash
   npm run dev
   # Test the specific feature
   ```

2. **Build Docker Image**:
   ```bash
   docker build -f Dockerfile.production -t openhealth:test .
   ```

3. **Verify No Breaking Changes**:
   ```bash
   # Check TypeScript
   npm run build
   
   # Check database schema
   npx prisma validate
   ```

### 🔄 WORKFLOW PATTERN

For EACH task:
1. **Review** - Understand current implementation
2. **Plan** - Document what changes are needed
3. **Implement** - Make the changes
4. **Test** - Verify locally
5. **Document** - Update relevant docs
6. **Commit** - Use conventional commit format

### 🚀 SESSION START COMMANDS

```bash
# 1. Navigate to project
cd /mnt/projects/open-health

# 2. Check git status
git status

# 3. Check current Docker image
docker images | grep openhealth

# 4. Verify environment
cat .env.example

# 5. Test local development
npm run dev
```

### 📊 SUCCESS METRICS

A session is successful when:
- ✅ All changes tested locally
- ✅ Docker build succeeds
- ✅ No breaking changes introduced
- ✅ Documentation updated
- ✅ Conventional commits used
- ✅ Session summary created

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

1. **Create Session Summary**:
   ```bash
   # Save as SESSION-[N]-SUMMARY.md
   # Include: achievements, issues fixed, files changed, next priorities
   ```

2. **Update This Recovery Prompt**:
   ```bash
   # Update the "CURRENT SYSTEM STATUS" section
   # Add new issues to "KNOWN ISSUES"
   # Update environment variables if changed
   ```

3. **Commit Checkpoint**:
   ```bash
   git add -A
   git commit -m "chore: Session [N] checkpoint - [brief description]"
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
```

---

**USE THIS PROMPT TO RESTORE FULL CONTEXT IN NEXT SESSION**
**REMEMBER: UPDATE THIS FILE BEFORE ENDING SESSION**

Last Updated: 2025-09-04 (Session 4 Complete)
Context Level at Save: 45%
Status: Security hardening partially complete, GCM encryption and rate limiting operational
Next Priority: CSRF protection, Redis caching, connection pooling, security headers