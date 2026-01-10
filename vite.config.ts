import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Plugin para logs en terminal
function terminalLogsPlugin() {
  return {
    name: 'terminal-logs',
    configureServer(server: any) {
      // Verificar backend al iniciar el servidor
      setTimeout(async () => {
        const backendUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
        try {
          const response = await fetch(`${backendUrl}/`, {
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

      // Endpoint para recibir logs del cliente
      server.middlewares.use('/__logs', async (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const log = JSON.parse(body);
              const timestamp = new Date(log.timestamp).toLocaleTimeString('es-CL');
              const level = log.level.toUpperCase();
              
              // Colores para diferentes niveles
              const colors: Record<string, string> = {
                DEBUG: '\x1b[90m',    // gris
                INFO: '\x1b[36m',      // cyan
                WARN: '\x1b[33m',      // amarillo
                ERROR: '\x1b[31m',     // rojo
                CRITICAL: '\x1b[41m\x1b[37m'  // fondo rojo, texto blanco
              };
              
              const color = colors[level] || '\x1b[0m';
              const reset = '\x1b[0m';
              
              console.log(`${color}[${level}] [${timestamp}]${reset} ${log.message}`);
              if (log.context && Object.keys(log.context).length > 0) {
                console.log('  Context:', log.context);
              }
              if (log.stack) {
                console.log('  Stack:', log.stack);
              }
            } catch (e) {
              console.error('Error parsing log:', e);
            }
          });
          res.statusCode = 200;
          res.end();
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), terminalLogsPlugin()],
  test: {
    environment: 'jsdom'
  }
});
