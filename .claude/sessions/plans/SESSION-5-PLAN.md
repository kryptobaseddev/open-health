# SESSION 5 PLAN: Security Hardening (Critical)
## Date: 2025-09-04
## Priority: CRITICAL - Security for Healthcare Data

---

## 🎯 SESSION OBJECTIVES

Implement critical security features to protect sensitive health data and prevent common web vulnerabilities.

---

## 📋 IMPLEMENTATION TASKS

### 1. CSRF Protection (PR #1) ✅ STARTED
**Branch**: `feat/csrf-protection`
**Size**: ~100 lines, 3 files
**Status**: Implementation complete, needs PR creation

#### Implementation:
- [x] Create `/src/lib/csrf/index.ts` with double-submit cookie pattern
- [x] Add `/src/hooks/use-csrf.ts` for client-side integration
- [x] Apply to registration endpoint
- [ ] Apply to all POST/PUT/DELETE endpoints
- [ ] Test CSRF token generation and validation
- [ ] Create PR to fork for testing

#### Files:
- `/src/lib/csrf/index.ts` - Core CSRF protection logic
- `/src/hooks/use-csrf.ts` - Client-side hook
- `/src/app/api/auth/register/route.ts` - Example integration

---

### 2. Security Headers (PR #2) ❌ NOT STARTED
**Branch**: `feat/security-headers`
**Size**: ~80 lines, 2 files
**Status**: Branch created, implementation pending

#### Implementation Plan:
- [ ] Create middleware for security headers
- [ ] Add Content-Security-Policy (CSP)
- [ ] Add X-Frame-Options (DENY)
- [ ] Add X-Content-Type-Options (nosniff)
- [ ] Add Strict-Transport-Security (HSTS)
- [ ] Add Referrer-Policy
- [ ] Test header application
- [ ] Create PR to fork

#### Files to Create:
- `/src/middleware/security-headers.ts`
- Update `/src/middleware.ts`

#### Headers Configuration:
```typescript
{
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}
```

---

### 3. Audit Logging (PR #3) ❌ NOT STARTED
**Branch**: `feat/audit-logging`
**Size**: ~150 lines, 3 files
**Status**: Not started

#### Implementation Plan:
- [ ] Create audit log schema in Prisma
- [ ] Create audit logging service
- [ ] Log sensitive operations:
  - User registration/login
  - Health data access
  - API key changes
  - Failed authentication attempts
- [ ] Add retention policy
- [ ] Test logging functionality
- [ ] Create PR to fork

#### Files to Create:
- Update `/prisma/schema.prisma` - Add AuditLog model
- `/src/lib/audit/index.ts` - Audit logging service
- Integration in sensitive endpoints

#### Schema:
```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  resource  String
  details   Json?
  ip        String?
  userAgent String?
  success   Boolean
  createdAt DateTime @default(now())
  
  user      User?    @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

---

## 📏 PR COMPLIANCE CHECK

All PRs must follow `.github/PR-BEST-PRACTICES.md`:
- ✅ Each PR under 200 lines
- ✅ Each PR single purpose
- ✅ Each PR independently deployable
- ✅ Test on fork before upstream

---

## 🔄 WORKFLOW

1. **CSRF Protection**:
   - Complete endpoint integration
   - Test locally
   - Create PR to fork
   - Merge after testing

2. **Security Headers**:
   - Implement middleware
   - Test header application
   - Verify CSP doesn't break app
   - Create PR to fork

3. **Audit Logging**:
   - Design schema
   - Implement service
   - Integrate with critical endpoints
   - Test log generation
   - Create PR to fork

---

## ✅ SUCCESS CRITERIA

- [ ] CSRF tokens validated on all state-changing requests
- [ ] Security headers present on all responses
- [ ] Audit logs generated for sensitive operations
- [ ] All tests passing
- [ ] No breaking changes
- [ ] Three separate PRs created and tested

---

## 🚨 TESTING CHECKLIST

### CSRF Testing:
- [ ] Token generated on GET requests
- [ ] POST without token fails with 403
- [ ] POST with valid token succeeds
- [ ] Token rotation works

### Security Headers Testing:
- [ ] Headers present in responses
- [ ] CSP doesn't block legitimate resources
- [ ] Frame blocking works
- [ ] HSTS header present in production

### Audit Logging Testing:
- [ ] Logs created for all sensitive operations
- [ ] Log retention works
- [ ] No performance degradation
- [ ] Logs contain necessary details

---

## 📊 ESTIMATED TIME

- CSRF Protection: 30 minutes (partially complete)
- Security Headers: 20 minutes
- Audit Logging: 30 minutes
- Testing & PRs: 30 minutes
- **Total**: ~2 hours

---

## 🔗 DEPENDENCIES

- Rate limiting (Session 4) ✅ Complete
- Encryption (Session 4) ✅ Complete
- No external dependencies

---

## 📝 NOTES

- CSRF protection using double-submit cookie pattern
- Security headers must not break existing functionality
- Audit logs should be async to not impact performance
- Consider GDPR compliance for audit log retention

---

*Generated for OpenHealth Session 5*
*Critical security hardening for healthcare data protection*