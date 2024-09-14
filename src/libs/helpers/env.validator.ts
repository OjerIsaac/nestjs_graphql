import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  PORT: Joi.optional().default(3000),

  NODE_ENV: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),
});
