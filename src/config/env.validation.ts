import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().integer().min(1).max(65535).default(3000),

  API_PREFIX: Joi.string().trim().regex(/^\S+$/).required().messages({
    'string.pattern.base': 'API_PREFIX no debe contener espacios.',
  }),

  DATABASE_URL: Joi.string()
    .uri()
    .pattern(/^postgresql:\/\//)
    .required()
    .messages({
      'string.pattern.base': 'DATABASE_URL debe comenzar con postgresql://',
    }),

  JWT_SECRET: Joi.string().min(32).required(),

  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .required()
    .messages({
      'string.pattern.base':
        'JWT_EXPIRES_IN debe tener un formato válido (ej. 15m, 2h, 7d).',
    }),

  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(8).max(14).default(10),

  SHOP_NAME: Joi.string().min(3).max(50).required(),

  CURRENCY: Joi.string().valid('BOB', 'USD').required(),

  MAX_DISCOUNT_PERCENT: Joi.number().integer().min(0).max(50).default(0),
});
