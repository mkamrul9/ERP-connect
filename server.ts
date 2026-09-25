/**
 * server.ts
 * 
 * Core hybrid server for ERP-connect ERP.
 * This server runs Express for the backend (API) and
 * Next.js for the frontend. This architecture is designed to be highly 
 * scalable and acts as a headless CMS/API for the upcoming Mobile App.
 */
import 'dotenv/config';
import express from 'express';
import next from 'next';
import { fileURLToPath } from 'url';
import path from 'path';
import { createBackendApp } from './src/backend.js';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  // 1. Prepare Next.js
  await nextApp.prepare();

  // 2. Initialize the Backend Express App
  const app = await createBackendApp();

  const port = parseInt(process.env.PORT || '3000', 10);

  // Let Next.js handle all other routes (like /, /dashboard, /hr)
  app.use((req, res, next) => {
    handle(req, res).catch(next);
  });

  // Auto-seed dummy data if empty (for Render deployments)
  try {
    const { dbGet } = await import('./src/db.js');
    const taskCount = await dbGet('SELECT COUNT(*) as c FROM tasks');
    if (taskCount && Number(taskCount.c) === 0) {
      console.log('============================================================');
      console.log('FIRST RUN DETECTED: Seeding dummy data automatically...');
      console.log('============================================================');
      const { execSync } = await import('child_process');
      execSync('node scripts/seed_dummy_data.cjs', { stdio: 'inherit' });
    }
  } catch (e) {
    console.error('Auto-seed check failed:', e);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log('============================================================');
    console.log('ERP-CONNECT ERP SYSTEM READY (Next.js + Express)');
    console.log(`Running on http://0.0.0.0:${port}`);
    console.log('============================================================');
  });
}

start().catch(console.error);
