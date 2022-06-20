declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID: string;
      NEXT_PUBLIC_GOOGLE_OAUTH2_SECRET: string;
      NEXT_PUBLIC_GOOGLE_API_KEY: string;
      MAINTENANCE_MODE: string;
    }
  }
}

export {}
