import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './db.js';
import { apiRouter } from './routes.js';

export async function startServer() {
  // Initialize SQLite database
  await initDatabase();
  console.log('📦 SQLite database initialized successfully.');

  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Body parser for JSON
  app.use(express.json());

  // Mount API endpoints
  app.use('/api', apiRouter);

  if (!isProd) {
    // Development mode: attach Vite dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite dev middleware attached.');
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

// Auto-run if executed directly
startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
