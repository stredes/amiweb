import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Plugin para verificar conexión al backend
function checkBackendPlugin() {
  return {
    name: 'check-backend',
    configureServer() {
      // Verificar backend al iniciar el servidor
      setTimeout(async () => {
        const backendUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
        try {
          const response = await fetch(`${backendUrl}/health`, {
            signal: AbortSignal.timeout(5000)
          });
          
          if (response.ok) {
            console.log('\x1b[32m%s\x1b[0m', '✓ BACKEND CONECTADO');
            console.log(`  URL: ${backendUrl}`);
            console.log(`  Status: ${response.status} ${response.statusText}\n`);
          } else {
            console.log('\x1b[33m%s\x1b[0m', '⚠ BACKEND RESPONDE CON ERROR');
            console.log(`  URL: ${backendUrl}`);
            console.log(`  Status: ${response.status} ${response.statusText}\n`);
          }
        } catch (error) {
          console.log('\x1b[31m%s\x1b[0m', '✗ BACKEND NO DISPONIBLE');
          console.log(`  URL: ${backendUrl}`);
          console.log(`  Error: ${error instanceof Error ? error.message : 'Connection failed'}\n`);
        }
      }, 500);
    }
  };
}

export default defineConfig({
  plugins: [react(), checkBackendPlugin()],
  test: {
    environment: 'jsdom'
  }
});
