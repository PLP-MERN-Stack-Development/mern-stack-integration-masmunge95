import path from "path"
import { fileURLToPath } from "url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables the Vite way so VITE_ variables match import.meta.env in the client
  const env = loadEnv(mode, process.cwd(), '');
  const rawApi = env.VITE_API_URL || 'http://localhost:5000';
  let apiOrigin;
  try {
    apiOrigin = new URL(rawApi).origin;
  } catch (e) {
    // fallback: strip trailing slash if it's not a full URL
    apiOrigin = rawApi.replace(/\/$/, '');
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: { '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src') },
    },
    server: {
      proxy: {
        '/api': {
          target: apiOrigin,
          changeOrigin: true,
        },
        '/uploads': {
          target: apiOrigin,
          changeOrigin: true,
        },
      },
    },
  };
});
