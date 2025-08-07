import * as Joi from "joi";

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default("0.0.0.0"),

  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  TYPEORM_SYNC: Joi.boolean().default(false),

  CORS_ORIGIN: Joi.string().uri().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("900s"),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),

  RATE_LIMITER_POINTS: Joi.number().default(20).description("Max number of requests in window"),
  RATE_LIMITER_DURATION: Joi.number().default(60).description("Window duration in seconds"),
  RATE_LIMITER_KEY_PREFIX: Joi.string().default("global"),
  RATE_LIMITER_ERROR_MESSAGE: Joi.string().default("Too many requests. Please try again later."),
}).unknown(true);
