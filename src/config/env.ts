export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "AssessFlow",
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
} as const;

/**
 * Without a client id Google's widget throws while mounting, so every consumer
 * has to be able to check this before rendering it.
 */
export const isGoogleAuthConfigured = env.googleClientId.length > 0;