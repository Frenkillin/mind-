import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ensureAiSettings } from './services/ai/aiProviderManager.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'MIND', version: '1.0.0' });
});

app.use('/api', routes);

app.use(errorHandler);

await connectDatabase();
await ensureAiSettings();
console.log('✓ AI Provider Manager inizializzato (default: Gemini)');

app.listen(env.port, () => {
  console.log(`✓ MIND API in ascolto su http://localhost:${env.port}`);
});
