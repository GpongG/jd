import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/jd/",
  plugins: [react()],
  server: {
    port: 5174,
  },
});
