import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is missing. Copy apps/api/.env.example to apps/api/.env.');
}

async function startServer(connectionString: string) {
  await mongoose.connect(connectionString);

  app.listen(port, '127.0.0.1', () => {
    console.log(`API listening on http://localhost:${port}`);
    console.log('MongoDB connected');
  });
}

startServer(mongoUri).catch((error: unknown) => {
  console.error('Could not start the API:', error);
  process.exit(1);
});
