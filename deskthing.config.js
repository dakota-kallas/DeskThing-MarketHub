// @ts-check
// version 0.11.9
import { defineConfig } from "@deskthing/cli";
import DotEnv from 'dotenv'

DotEnv.config()
export default defineConfig({
  development: {
    logging: {
      level: "info",
      prefix: "[DeskThing Server]",
    },
    client: {
      logging: {
        level: "info",
        prefix: "[DeskThing Client]",
        enableRemoteLogging: true,
      },
      clientPort: 3000,
      viteLocation: "http://localhost",
      vitePort: 5173,
      linkPort: 8080,
    },
    server: {
      editCooldownMs: 8000,
      mockData: {
        settings: {
          refreshInterval: 5,
          apiKey: process.env.API_KEY,
          stockCode1: "AAPL",
          stockCode2: "MSFT",
          stockCode3: "GOOGL",
          stockCode4: "AMZN",
          stockCode5: "TSLA",
          stockCode6: "NVDA",
          stockCode7: "SPOT",
          stockCode8: "",
          stockCode9: "",
          stockCode10: "",
          stockCode11: "",
          stockCode12: "",
        },
      },
    },
  },
});
