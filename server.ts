import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Body parser with generous payload size for school database
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const dataDir = path.resolve(__dirname, 'data');
  const dbFile = path.resolve(dataDir, 'school_database.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SIAKAD SDN Nambo 03 Centralized Backend',
      npsn: '20200352',
      time: new Date().toISOString()
    });
  });

  // Get full unified school database
  app.get('/api/school-data', (_req, res) => {
    try {
      if (fs.existsSync(dbFile)) {
        const raw = fs.readFileSync(dbFile, 'utf-8');
        const data = JSON.parse(raw);
        return res.json({ success: true, data });
      }
      return res.json({ success: true, data: null });
    } catch (err: any) {
      console.error('Error reading dbFile:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save / Sync full unified school database atomically
  app.post('/api/school-data/sync', (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid payload' });
      }

      const timestamp = new Date().toISOString();
      const updatedData = {
        ...payload,
        serverUpdatedAt: timestamp
      };

      const tempFile = `${dbFile}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(updatedData, null, 2), 'utf-8');
      fs.renameSync(tempFile, dbFile);

      return res.json({ success: true, serverUpdatedAt: timestamp });
    } catch (err: any) {
      console.error('Error writing dbFile:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Reset database endpoint
  app.post('/api/school-data/reset', (_req, res) => {
    try {
      if (fs.existsSync(dbFile)) {
        fs.unlinkSync(dbFile);
      }
      return res.json({ success: true, message: 'Database reset successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Direct download endpoint for full backup JSON
  app.get('/api/school-data/export-json', (_req, res) => {
    try {
      if (fs.existsSync(dbFile)) {
        const raw = fs.readFileSync(dbFile, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="Backup_Database_SIAKAD_SDN_Nambo_03_TA_2026_2027.json"'
        );
        return res.send(raw);
      }
      return res.status(404).json({ success: false, error: 'No data stored yet' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Restore database from uploaded JSON
  app.post('/api/school-data/restore', (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid restore payload' });
      }

      const timestamp = new Date().toISOString();
      const updatedData = {
        ...payload,
        serverUpdatedAt: timestamp
      };

      fs.writeFileSync(dbFile, JSON.stringify(updatedData, null, 2), 'utf-8');
      return res.json({ success: true, message: 'Data restored successfully', serverUpdatedAt: timestamp });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Environment mode: Dev mounts Vite middlewares; Prod serves static dist
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SIAKAD SDN Nambo 03 Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
