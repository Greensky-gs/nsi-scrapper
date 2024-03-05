declare global {
  namespace NodeJS {
    interface ProcessEnv {
      webhook: string;
    }
  }
}

export {};
