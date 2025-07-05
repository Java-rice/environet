import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
//Here  Update to add the tailwindcss to project
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
