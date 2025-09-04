# SESSION 6 PLAN: Performance Optimization
## Date: TBD
## Priority: IMPORTANT - Production Performance

---

## 🎯 SESSION OBJECTIVES

Optimize application performance for production environments with caching, connection pooling, and image optimization.

---

## 📋 IMPLEMENTATION TASKS

### 1. Redis Caching Integration (PR #1)
**Branch**: `feat/redis-caching`
**Size**: ~180 lines, 4 files
**Status**: Not started

#### Implementation Plan:
- [ ] Add Redis Docker service to docker-compose.yml
- [ ] Create Redis client configuration
- [ ] Implement caching service
- [ ] Cache model provider lists
- [ ] Cache health data queries
- [ ] Add cache invalidation logic
- [ ] Test cache hit/miss rates

#### Files to Create:
- `/src/lib/redis/index.ts` - Redis client and utilities
- `/src/lib/cache/index.ts` - Caching service abstraction
- Update `/docker-compose.yml` - Add Redis service
- Update `.env.example` - Add Redis configuration

#### Configuration:
```typescript
// Redis connection
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600 // 1 hour default

// Cache keys pattern
cache:models:{providerId}
cache:health:{userId}:{dataId}
cache:session:{sessionId}
```

---

### 2. Database Connection Pooling (PR #2)
**Branch**: `feat/connection-pooling`
**Size**: ~60 lines, 2 files
**Status**: Not started

#### Implementation Plan:
- [ ] Configure Prisma connection pool settings
- [ ] Add connection pool monitoring
- [ ] Optimize query patterns
- [ ] Add connection retry logic
- [ ] Test under load
- [ ] Document optimal settings

#### Files to Update:
- `/src/lib/prisma.ts` - Connection pool configuration
- `/prisma/schema.prisma` - Database URL with pooling params

#### Configuration:
```typescript
// Prisma connection pooling
datasource db {
  url = env("DATABASE_URL") + "?connection_limit=20&pool_timeout=10"
}

// Client configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['warn', 'error'],
  connectionPool: {
    limit: 20,
    idleTimeout: 30,
    maxWait: 10
  }
})
```

---

### 3. Image Optimization with Next.js Image (PR #3)
**Branch**: `feat/image-optimization`
**Size**: ~100 lines, 5 files
**Status**: Not started

#### Implementation Plan:
- [ ] Replace img tags with Next.js Image component
- [ ] Configure image domains
- [ ] Add blur placeholders
- [ ] Implement lazy loading
- [ ] Add WebP format support
- [ ] Test performance improvements

#### Files to Update:
- `/next.config.ts` - Image configuration
- Components using images:
  - `/src/components/ui/avatar.tsx`
  - `/src/components/chat/chat-message.tsx`
  - Other components with images

#### Configuration:
```typescript
// next.config.ts
images: {
  domains: ['localhost', 'health.hoskins.fun'],
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
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

1. **Redis Caching**:
   - Set up Redis container
   - Implement caching layer
   - Add to critical endpoints
   - Test cache effectiveness
   - Create PR to fork

2. **Connection Pooling**:
   - Configure Prisma settings
   - Test connection limits
   - Monitor pool usage
   - Document settings
   - Create PR to fork

3. **Image Optimization**:
   - Audit image usage
   - Replace with Next Image
   - Configure optimization
   - Test loading performance
   - Create PR to fork

---

## ✅ SUCCESS CRITERIA

- [ ] Redis caching reduces API response times by 50%+
- [ ] Connection pool prevents database overload
- [ ] Images load progressively with placeholders
- [ ] Core Web Vitals improve
- [ ] No memory leaks introduced
- [ ] Three separate PRs tested on fork

---

## 🚨 TESTING CHECKLIST

### Redis Testing:
- [ ] Cache connects successfully
- [ ] Data cached correctly
- [ ] TTL expiration works
- [ ] Cache invalidation triggers
- [ ] Fallback when Redis down

### Connection Pool Testing:
- [ ] Pool size limits enforced
- [ ] Connections reused efficiently
- [ ] No connection leaks
- [ ] Handles spike traffic
- [ ] Graceful degradation

### Image Optimization Testing:
- [ ] Images load progressively
- [ ] Correct formats served
- [ ] Lazy loading works
- [ ] No layout shift
- [ ] Mobile performance improved

---

## 📊 ESTIMATED TIME

- Redis Caching: 45 minutes
- Connection Pooling: 20 minutes
- Image Optimization: 30 minutes
- Testing & PRs: 30 minutes
- **Total**: ~2 hours

---

## 🔗 DEPENDENCIES

- Docker setup (Session 1) ✅ Complete
- Database schema (existing) ✅
- No breaking dependencies

---

## 📈 PERFORMANCE TARGETS

### Current Baseline:
- API response: ~200-500ms
- Page load: ~2-3 seconds
- Database queries: ~50-100ms

### Target Metrics:
- API response: <100ms (cached)
- Page load: <1.5 seconds
- Database queries: <30ms (pooled)
- Cache hit rate: >80%

---

## 🐳 DOCKER CONFIGURATION

```yaml
# Redis service for docker-compose.yml
redis:
  image: redis:7-alpine
  restart: always
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: redis-server --appendonly yes
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5
```

---

## 📝 NOTES

- Redis is optional in development, required in production
- Connection pooling critical for multi-user scenarios
- Image optimization impacts mobile users most
- Monitor memory usage with Redis caching
- Consider Redis persistence strategy

---

*Generated for OpenHealth Session 6*
*Performance optimization for production deployment*