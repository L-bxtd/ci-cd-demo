import express from 'express';

const app = express();
const VERSION = process.env.APP_VERSION ?? '1.0.0';
const port = Number(process.env.PORT ?? 3000);

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from ECS backend' });
});

app.get('/health', (_req, res) => res.status(200).send('ok'));

app.get('/api/version', (_req, res) => res.send(VERSION));

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '127.0.0.1', () => {
    console.log(`Backend listening on 127.0.0.1:${port} (version ${VERSION})`);
  });
}
