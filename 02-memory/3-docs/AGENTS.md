# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all checks (lint + build + test)
make checks

# Development server
npm run dev

# Lint and auto-fix
npm run lint:fix

# Run unit/integration tests (excludes CI-only tests)
npm run test

# Run a single test file
npx jest tests/contexts/dishes/cooked-dishes/application/CookedDishCreator.test.ts

# Run CI-only tests (require Docker services like Ollama)
npm run test:ci

# Start database
docker compose up -d
```

## Architecture

Next.js 16 app ("Neveraly | What to Cook Today") following **Hexagonal Architecture / DDD** with two bounded contexts under `src/contexts/dishes/`:

- **cooked-dishes** — Aggregate `CookedDish` (id, name, description, ingredients, embedding). Repository pattern with `PostgresCookedDishRepository`. Application services: `CookedDishCreator`, `AllCookedDishesSearcher`, `CookedDishByIdSearcher`, `CookedDishesBySimilarIngredientsSearcher` (pgvector similarity search).
- **dishes** — Lightweight `Dish` model. Gateway pattern with `AiSdkMinistral3DishByIngredientsSuggesterGateway` (Ollama ministral-3:3b via Vercel AI SDK). Application service: `DishByIngredientsSuggester`.
- **shared** (`src/contexts/shared/`) — Cross-cutting: `AggregateRoot`, `Identifier`, `Ingredient` value object (types: `main` | `household_staple`), `EmbeddingsGenerator`, `UuidGenerator`, `EventBus`, `PostgresConnection`, `PostgresRepository<T>`, `CodelyError`, HTTP utilities.

### Layers (inner to outer)

1. **Domain** (`domain/`) — Entities, value objects, repository/gateway interfaces, domain events
2. **Application** (`application/`) — Use case services, one class per use case
3. **Infrastructure** (`infrastructure/`) — Postgres repos, AI SDK gateways, DIOD container config

### Dependency Injection

Uses **DIOD** (`diod` package) with `@Service()` decorators. Container configured in `src/contexts/shared/infrastructure/dependency-injection/diod.config.ts`. Services resolved at module level in API routes.

### API Routes (Next.js App Router)

- `GET /api/cooked-dishes` — List all cooked dishes
- `GET|PUT /api/cooked-dishes/[uuid]` — Get or create a cooked dish
- `GET /api/dishes/suggest?ingredients=...` — AI-powered dish suggestion

### Frontend

React 19 client components. Home page (`src/app/page.tsx`) handles ingredient input, dish suggestion, and "mark as cooked". Detail page at `/cooked-dishes/[id]`.

### Database

PostgreSQL (Supabase Postgres 17.6) with **pgvector** extension. Schema `dishes.cooked_dishes` stores ingredients as JSONB and embeddings as `vector(1024)` (Qwen3 via Ollama). Init scripts in `databases/`.

## Testing Conventions

- **Mother objects** in `tests/contexts/*/domain/` — `CookedDishMother`, `DishMother`, `IngredientMother` using Faker
- **Mock objects** in `tests/contexts/*/infrastructure/` — implement domain interfaces with Jest spy expectations (e.g., `MockCookedDishRepository.shouldSave()`)
- **Integration tests** (`.ci.test.ts` suffix) use real DI container and database; call `connection.truncateAll()` in `beforeEach`
- Tests run sequentially (`maxWorkers: 1`) with SWC transform and decorator support
- All API routes import `reflect-metadata` at top

## Code Style

- ESLint with `eslint-config-codely` (course preset) + Next.js plugin
- `@typescript-eslint/explicit-function-return-type: error` — all `.ts` functions require explicit return types
- TypeScript strict mode with decorators enabled
