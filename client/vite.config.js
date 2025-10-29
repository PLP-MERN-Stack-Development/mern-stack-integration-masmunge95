import path from "path"
import { fileURLToPath } from "url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
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
              "default-src 'self' http://localhost:5000",
              "connect-src 'self' http://localhost:5000 https://mern-stack-integration-masmunge95.onrender.com https://*.clerk.com https://*.clerk.accounts.dev wss://*.clerk.accounts.dev https://clerk.com https://clerk-telemetry.com https://*.clerk-telemetry.com",
              "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com",
              // allow script elements explicitly (some browsers treat script-src-elem separately)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com",
              "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com https://clerk-telemetry.com",
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
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
