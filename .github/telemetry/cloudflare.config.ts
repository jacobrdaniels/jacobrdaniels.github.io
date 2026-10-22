import { bindings, defineConfig, triggers } from "cf/config";
export default defineConfig({
  accountId: "28bdb6a8169ab16d884db85e829c2943",
  worker: {
    name: "jrdaniels-telemetry",
    entrypoint: "./src/index.js",
    compatibilityDate: "2026-10-22",
    workersDev: false,
    domains: ["stats.jrdaniels.net"],
    previewUrls: false,
    env: {
      DB: bindings.d1({ name: "jrdaniels-telemetry", id: "d9e5e5f4-54e5-465f-b9ba-ddeaf00345d5" }),
      PASSWORD_HASH: bindings.secret(),
      COLLECT_LIMIT: bindings.rateLimit({ namespace: "2026102201", simple: { limit: 30, period: 60 } }),
      GLOBAL_LIMIT: bindings.rateLimit({ namespace: "2026102202", simple: { limit: 300, period: 60 } }),
      LOGIN_LIMIT: bindings.rateLimit({ namespace: "2026102203", simple: { limit: 5, period: 60 } }),
      READ_LIMIT: bindings.rateLimit({ namespace: "2026102204", simple: { limit: 60, period: 60 } }),
    },
    triggers: [triggers.scheduled({ schedule: "17 * * * *" })],
    observability: {
      enabled: true,
      redactQueryString: true,
      logs: { enabled: true, invocationLogs: false },
      traces: { enabled: true, headSamplingRate: 0.01 },
    },
  },
});
