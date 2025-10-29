import path from "path"
import { fileURLToPath } from "url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// Determine API origin (used for CSP and dev proxy). Prefer VITE_API_URL when provided.
const rawApi = process.env.VITE_API_URL || 'http://localhost:5000';
let apiOrigin;
try {
  apiOrigin = new URL(rawApi).origin;
} catch (e) {
  // fallback: strip trailing slash if it's not a full URL
  apiOrigin = rawApi.replace(/\/$/, '');
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables the Vite way so VITE_ variables match import.meta.env in the client
  const env = loadEnv(mode, process.cwd(), '');
  const rawApi = env.VITE_API_URL || 'http://localhost:5000';
  let apiOrigin;
  try {
    apiOrigin = new URL(rawApi).origin;
  } catch (e) {
    apiOrigin = rawApi.replace(/\/$/, '');
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'csp-headers',
        configureServer: (server) => {
          server.middlewares.use((_req, res, next) => {
            res.setHeader(
              'Content-Security-Policy',
              [
                `default-src 'self' ${apiOrigin}`,
                `connect-src 'self' ${apiOrigin} https://*.clerk.com https://*.clerk.accounts.dev wss://*.clerk.accounts.dev https://clerk.com https://clerk-telemetry.com https://*.clerk-telemetry.com`,
                "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com",
                // allow script elements explicitly (some browsers treat script-src-elem separately)
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com",
                "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com",
                "style-src 'self' 'unsafe-inline'",
                `img-src 'self' data: https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com https://clerk-telemetry.com ${apiOrigin}`,
                "font-src 'self' data:",
                "worker-src 'self' blob:"
              ].join('; ')
            );
            next();
          });
        },
      },
    ],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src') }],
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
