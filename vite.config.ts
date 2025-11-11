import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // 👨‍💻 Dev server
  server: {
    host: "::", // listen on all IPv4/IPv6 addresses
    port: 8080,
  },

  // 🔌 Plugins
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),

  // 🛠️ Path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ⚡ Build settings for Electron
  base: "./",            // important: relative paths for production
  build: {
    outDir: "dist",      // output folder for production files
    emptyOutDir: true,   // clean dist folder before build
    sourcemap: false,    // optional: set true if you want devtools for production
  },

  // ⚙️ Optimize dependencies (optional)
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
