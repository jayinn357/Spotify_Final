declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly MODE?: string;
    readonly BASE_URL?: string;
    readonly PROD?: boolean;
    readonly DEV?: boolean;
    // add additional env vars you use here, for example:
    // readonly VITE_API_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
