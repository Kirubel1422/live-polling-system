// Mock environment variables for testing

// Mock environment variables for testing
process.env.NODE_ENV = "test";
process.env.APP_PORT = "5001";
process.env.COOKIE_SECRET = "test-cookie-secret";
process.env.COOKIE_DOMAIN = "localhost";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "5432";
process.env.DB_USERNAME = "postgres";
process.env.DB_PASSWORD = "postgres";
process.env.DB_NAME = "live_polling_test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRES_IN = "7d";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.RATE_LIMIT_ENABLED = "false";
process.env.SOCKET_REDIS_ADAPTER_ENABLED = "false";
process.env.BULLMQ_ENABLED = "false";
process.env.API_DOCS_ENABLED = "false";
