import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';
import { notFound, errorHandler } from './middleware/error.middleware';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use('/api/v1', router);

app.use(notFound);
app.use(errorHandler);