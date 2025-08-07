## Запуск проєкту в Docker

1. **Скопіюйте `.env`** з наведеним вмістом (приклад нижче)
2. **Запустіть Docker:**

```bash
docker-compose up --build
```

---

### Приклад `.env`

```env
# Server
PORT=3000
HOST=0.0.0.0

# DB
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
TYPEORM_SYNC=true

# JWT
JWT_SECRET=monti
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=burns
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiter
RATE_LIMITER_POINTS=10
RATE_LIMITER_DURATION=60
RATE_LIMITER_KEY_PREFIX=rl
RATE_LIMITER_ERROR_MESSAGE=Too many requests, please try again later.

# CORS
CORS_ORIGIN=http://localhost:8080
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_CREDENTIALS=false
CORS_OPTIONS_SUCCESS_STATUS=204
CORS_ALLOWED_HEADERS=Content-Type,Authorization

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
```