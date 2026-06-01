export interface FrontendEnv {
  VITE_API_URL: string;
}

const requiredEnvKeys = ["VITE_API_URL"] as const;

type RequiredEnvKey = (typeof requiredEnvKeys)[number];

function getEnvVar(key: RequiredEnvKey): string {
  const value = import.meta.env[key];
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

export const env: FrontendEnv = {
  VITE_API_URL: getEnvVar("VITE_API_URL"),
};

export const config = {
  apiUrl: env.VITE_API_URL,
};
