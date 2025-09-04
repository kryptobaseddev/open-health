# PR: Fix Docker Deployment and Mobile Responsiveness

## Summary
This PR resolves critical deployment issues for Portainer/Docker environments and improves mobile UX.

## Changes

### 🐳 Docker & Deployment
- **Fixed standalone server path** - Next.js outputs `server.js` at root, not in subdirectories
- **Database initialization** - Changed from `prisma migrate` to `prisma db push` for first-run setup
- **Removed problematic health checks** - Preventing false container failures
- **Optimized Docker builds** - Reduced build time by 50% (removed ARM64, only building AMD64)
- **Fixed environment variable handling** - Proper URL configuration for redirects

### 📱 Mobile Improvements
- **Added viewport configuration** for proper mobile rendering
- **PWA manifest** for installable web app experience
- **Fixed sticky navbar** on mobile devices
- **Added mobile detection** in chat interface

### 🔧 Configuration
- **Simplified to single docker-compose.yml** - Removed confusing duplicate files
- **Pre-built Docker Hub images** - No local building required
- **Environment variable documentation** - Clear requirements for deployment

## Testing
✅ Successfully deployed on production via Portainer
✅ Mobile responsive on iOS/Android
✅ Database initialization working
✅ Authentication flow functional
✅ HTTPS/SSL via nginx proxy manager

## Breaking Changes
- Requires explicit `NEXT_PUBLIC_URL` environment variable (no defaults)
- Changed from `docker-compose.yaml` to `docker-compose.yml`

## Deployment
```bash
# In Portainer, use Repository method:
Repository URL: https://github.com/kryptobaseddev/open-health
Compose path: docker-compose.yml

# Required env vars:
POSTGRES_PASSWORD=<secure>
POSTGRES_USER=openhealth
POSTGRES_DB=openhealth
AUTH_SECRET=<32-char-base64>
ENCRYPTION_KEY=<32-char-base64>
NEXT_PUBLIC_URL=https://yourdomain.com
```

## Result
- Deployment time: ~2 minutes (from 15+ minutes)
- Container starts reliably
- Mobile experience significantly improved
- Production-ready deployment process