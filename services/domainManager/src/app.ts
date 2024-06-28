import express from 'express';
import { json } from 'body-parser';

import domainRoutes from './routes/domainRoutes';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(domainRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not Found' });
});

app.use((err: any, req: any, res: any, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export { app };
