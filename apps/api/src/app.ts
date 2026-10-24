import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

app.get('/api/health', (_request, response) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  response.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'unavailable',
    database: databaseConnected ? 'connected' : 'disconnected',
  });
});

export default app;
