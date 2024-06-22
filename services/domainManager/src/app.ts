import express from 'express';
import { json } from 'body-parser';

// import { getDomainDataRouter } from './routes/getDomainData';
// import { addDomainRouter } from './routes/addDomain';
import domainRoutes from './routes/domainRoutes';
const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(domainRoutes);
// app.use(addDomainRouter);
app.all('*', async (req, res) => {
  throw new Error('route not found');
});

export { app };
