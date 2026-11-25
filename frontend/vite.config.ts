import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts:
      true,
  },
  resolve: {
  alias: {
    "@common": fileURLToPath(new URL("../common/src", import.meta.url)),
  },
},
})