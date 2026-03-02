# Useful commands

```bash
make checks # lint + build + test
npm run dev
npm run lint:fix
npm run test
```

# Architecture

- Next.js 16, Hexagonal Architecture / DDD.
- Bounded contexts in `src/contexts/`.
- Layers: Domain → Application (one use case per class) → Infrastructure.
- DI: DIOD with `@Service()`, container at `src/contexts/shared/infrastructure/dependency-injection/diod.config.ts`.

# DB
- PostgreSQL + pgvector.
- Embeddings `vector(1024)`.

# Testing

- Mother objects in `tests/contexts/*/domain/` (Faker)
- Mock objects in `tests/contexts/*/infrastructure/` (Jest spies implementing domain interfaces)
- Integration tests: `.ci.test.ts` suffix, real DI + DB
- API routes require `import "reflect-metadata"` at top

# Code Style

- `eslint-config-codely` preset, `explicit-function-return-type: error`
- TypeScript strict mode with decorators
