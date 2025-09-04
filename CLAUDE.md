# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Deploy Trigger.dev tasks
npm run deploy:trigger-prod
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

### Docker Development
```bash
# Start all services (PostgreSQL, application)
docker compose --env-file .env up

# Rebuild containers after .env changes
docker compose --env-file .env up --build
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5 with credentials provider
- **Styling**: Tailwind CSS with shadcn/ui components
- **Internationalization**: next-intl for multi-language support
- **Background Jobs**: Trigger.dev for async processing
- **AI Integration**: Multiple LLM providers (OpenAI, Anthropic, Google, Ollama)

### Project Structure

```
src/
├── app/                     # Next.js App Router pages and API routes
│   ├── api/                # API endpoints
│   │   ├── assistant-modes/ # Assistant configuration endpoints
│   │   ├── auth/           # Authentication endpoints
│   │   ├── chat-rooms/     # Chat functionality
│   │   ├── health-data/    # Health data management
│   │   ├── health-data-parser/ # Document/vision parsing
│   │   └── llm-providers/  # LLM provider management
│   ├── chat/               # Chat interface pages
│   ├── onboarding/         # User onboarding flow
│   └── source/             # Health data source management
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat UI components
│   ├── form/              # Form components including JSON editor
│   ├── onboarding/        # Onboarding flow components
│   └── ui/                # Reusable UI components (shadcn/ui)
├── lib/                   # Core business logic
│   ├── health-data/       # Health data processing
│   │   └── parser/        # Document and vision parsing logic
│   │       ├── document/  # Document parsers (Docling, Upstage)
│   │       └── vision/    # Vision parsers (OpenAI, Google, Ollama)
│   ├── encryption/        # Data encryption utilities (AES-256-GCM)
│   ├── csrf/              # CSRF protection middleware
│   ├── rate-limit/        # Rate limiting middleware
│   └── security-headers/  # Security headers middleware
└── trigger/               # Background job definitions
```

### Key Architectural Patterns

1. **Health Data Processing Pipeline**
   - Documents/images uploaded via `/api/static/uploads`
   - Parsed using configurable parsers (Docling for local, Upstage for cloud)
   - Vision processing through multiple providers (OpenAI, Google, Ollama)
   - Structured data stored encrypted in PostgreSQL

2. **Multi-Provider LLM Integration**
   - Abstracted provider interface in `/lib/health-data/parser/`
   - Support for OpenAI, Anthropic, Google Gemini, Ollama (local)
   - Provider configuration stored per user in database

3. **Assistant Modes System**
   - Customizable AI assistants with system prompts
   - Context injection from user's health data
   - Public/private visibility settings
   - Integration with Reddit bot functionality

4. **Authentication & Security**
   - NextAuth v5 with credentials provider
   - bcrypt password hashing
   - Data encryption using AES-256-GCM with PBKDF2 key derivation
   - Session-based authentication with JWT
   - CSRF protection using double-submit cookie pattern
   - Comprehensive security headers middleware
   - Rate limiting on critical endpoints

5. **Parallel Route Architecture**
   - Modal routes using `@modal` parallel route
   - Intercepting routes for seamless navigation

## Environment Configuration

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: NextAuth secret for JWT signing
- `ENCRYPTION_KEY`: Base64-encoded 32-byte key for data encryption
- `NEXT_PUBLIC_URL`: Application URL
- `DEPLOYMENT_ENV`: "local" or "cloud" - determines parser selection

Optional cloud deployment variables:
- LLM API keys: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `UPSTAGE_API_KEY`
- Storage: `BLOB_READ_WRITE_TOKEN` for Vercel Blob storage
- Background jobs: `TRIGGER_PROJECT_ID`, `TRIGGER_SECRET_KEY`

## Database Schema

Key models:
- `User`: Core user entity with authentication
- `HealthData`: Encrypted health information with metadata
- `ChatRoom`: Chat sessions with LLM configuration
- `ChatMessage`: Individual messages in conversations
- `AssistantMode`: AI assistant configurations with system prompts
- `LLMProvider`: User-configured LLM providers

## API Design Patterns

All API routes follow RESTful conventions:
- `GET /api/[resource]` - List resources
- `POST /api/[resource]` - Create resource
- `GET /api/[resource]/[id]` - Get specific resource
- `PATCH /api/[resource]/[id]` - Update resource
- `DELETE /api/[resource]/[id]` - Delete resource

Common response patterns:
- Success: `{ data: T }`
- Error: `{ error: string, code?: string }`
- Pagination: `{ data: T[], total: number, page: number }`

## Security Features

### Implemented Security Measures
- **Encryption**: AES-256-GCM with authenticated encryption (Session 4)
- **Rate Limiting**: Configurable limits on auth, API, and chat endpoints (Session 4)
- **CSRF Protection**: Double-submit cookie pattern on 5 critical endpoints (Session 5)
- **Security Headers**: 7 comprehensive headers via middleware (Session 5)
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security (production only)
  - Referrer-Policy
  - Permissions-Policy
  - X-XSS-Protection

### Security TODO (Session 6)
- Complete CSRF protection for remaining 4 endpoints
- Implement audit logging for sensitive operations
- Add security monitoring and alerting

## Testing Approach

Currently, the project does not have a formal test suite. When implementing tests:
- Use the existing test data in `/src/lib/health-data/parser/test-items.json`
- Focus on parser logic and data transformation
- Test encryption/decryption workflows
- Validate API endpoint security
- Test CSRF token generation and validation
- Verify security headers in responses

## Session Progress

### Session 5 (2025-09-04) Complete
- ✅ CSRF protection for 5 critical endpoints
- ✅ Security headers middleware implementation
- ✅ Both features pushed to fork branches for testing
- Context usage: ~65%

### Session 6 Priorities
1. Complete CSRF protection for remaining endpoints
2. Implement audit logging system
3. Add Redis caching for production
4. Test and merge security features from fork