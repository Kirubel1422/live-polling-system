const getEnv = (key: string): string => {
  const value = (import.meta as any).env[key];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  API_URL: getEnv("VITE_API_URL"),
  SOCKET_URL: getEnv("VITE_API_URL").replace(/\/api$/, ''),
  IS_DEV: (import.meta as any).env.MODE === "development",
};
