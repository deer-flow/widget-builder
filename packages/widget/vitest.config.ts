// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    pool: "forks",
    maxWorkers: 2,
    reporters: ["verbose"], // shows full worker errors
    // Optional: catch unhandled errors
    onConsoleLog(log) {
      console.log("[Vitest Log]:", log);
    },
  },
});
