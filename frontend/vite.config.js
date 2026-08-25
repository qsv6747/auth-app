import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages serves project sites at /<repo-name>/, not the domain root.
  // Set BASE_PATH=/your-repo-name/ when building for Pages (the workflow
  // does this for you if you set it as a repo variable — see README).
  base: process.env.BASE_PATH || "/",
  server: { port: 5173 },
});
