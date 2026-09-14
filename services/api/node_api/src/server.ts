import { app } from './app';
import { env } from './config/env';
import { testConnection } from './config/database';

async function bootstrap() {
  try {
    await testConnection();
  } catch (err) {
    console.warn('MySQL not ready yet, retrying in 5s...', err);
  }

  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

bootstrap();