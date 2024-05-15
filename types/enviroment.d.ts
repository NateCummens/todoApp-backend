export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      URI: string;
      JWT_SECRECT: string;
      PORT: string;
    }
  }
}
