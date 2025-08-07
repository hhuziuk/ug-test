import * as dotenv from "dotenv";
import { validationSchema } from "./validation";

dotenv.config();

const { error, value: envVars } = validationSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
});

if (error) {
  throw new Error(`Config validation error:\n${error.message}`);
}

export default () => ({
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || "0.0.0.0",

  db: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: process.env.TYPEORM_SYNC,
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || "900s",
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  },

  rateLimiter: {
    points: Number(process.env.RATE_LIMITER_POINTS) || 20,
    duration: Number(process.env.RATE_LIMITER_DURATION) || 60,
    keyPrefix: process.env.RATE_LIMITER_KEY_PREFIX || "global",
    errorMessage:
      process.env.RATE_LIMITER_ERROR_MESSAGE || "Too many requests. Please try again later.",
  },
});
