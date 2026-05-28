const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const getEnvOptional = (key: string): string | undefined => {
  return process.env[key];
};

const getEnvArray = (key: string): string[] => {
  return getEnv(key).split(",");
};

export const ENV = {
  APP_PORT: getEnv("APP_PORT"),
  NODE_ENV: getEnv("NODE_ENV"),

  // Cookie
  APP_COOKIE_SECRET: getEnv("COOKIE_SECRET"),
  APP_COOKIE_DOMAIN: getEnv("COOKIE_DOMAIN"),

  // Frontend
  CLIENT_URL: getEnvArray("CLIENT_URL"),

  // PostgreSQL
  DB_HOST: getEnv("DB_HOST"),
  DB_PORT: parseInt(getEnv("DB_PORT"), 10),
  DB_USERNAME: getEnv("DB_USERNAME"),
  DB_PASSWORD: getEnv("DB_PASSWORD"),
  DB_NAME: getEnv("DB_NAME"),

  // JWT
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),

  // Email
  APP_EMAIL: getEnvOptional("EMAIL"),
  APP_PASSWORD: getEnvOptional("APP_PASSWORD"),

  // AI
  AI_API_KEY: getEnvOptional("AI_API_KEY"),

  // Model
  AI_MODEL_NAME: getEnvOptional("AI_MODEL_NAME")
};
