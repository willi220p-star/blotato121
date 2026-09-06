import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/blotato121/" : "/",
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
}));
