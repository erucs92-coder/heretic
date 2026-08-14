export {};

declare global {
  interface Window {
    electronAPI?: {
      runHeretic: (model: string, options?: string[]) => Promise<{ success: boolean; output: string }>;
      checkHeretic: () => Promise<boolean>;
      installHeretic: () => Promise<{ success: boolean }>;
      openExternal: (url: string) => Promise<void>;
      onHereticOutput: (
        callback: (data: { type: "stdout" | "stderr"; text: string }) => void
      ) => (() => void) | undefined;
    };
  }
}
