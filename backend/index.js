import express from 'express';
import path from 'path';
import fs from 'fs';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
// import swaggerSpec from './swagger';
import swaggerDocument from './openapi.json' assert { type: 'json' };

const { connectToDatabase } = require('./database');

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// const routersPath = path.join(__dirname, "routes");

// fs.readdirSync(routersPath).forEach((file) => {
//   if (file.endsWith(".js")) {
//     const routerModule = require(path.join(routersPath, file));

//     const router = routerModule.router;

//     app.use(router);
//   }
// });
const routersPath = './routes';

// fs.readdirSync(routersPath).forEach(async (file) => {
//   if (file.endsWith('.js')) {
//     const routerModule = await import(path.join(routersPath, file));
//     const router = routerModule.default || routerModule.router;
    
//     app.use(router);
//   }
// });
async function loadRouters() {
  const files = fs.readdirSync(routersPath).filter(file => file.endsWith('.js'));

  await Promise.all(files.map(async (file) => {
    const routerModule = await import(path.resolve(routersPath, file));
    const router = routerModule.default || routerModule.router;
    app.use(router);
  }));
}

loadRouters().catch(err => console.error('Error loading routers:', err));

// const router = new Router();

app.use(cors({ origin: 'http://localhost:3000' }));

// // Testing our server:
app.get('/api', (req, res) => {
  res.send('Welcome to Smart Memory!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
