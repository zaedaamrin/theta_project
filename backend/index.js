// import express from 'express';
// import path from 'path';
// import fs from 'fs';
// import swaggerUI from 'swagger-ui-express';
// import cors from 'cors';
// // import swaggerSpec from './swagger';
// // import swaggerDocument from './openapi.json' assert { type: 'json' };
// const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));
// // import './database';
// import { router as userRouter } from './routes/users.js';

// const PORT = process.env.PORT || 8000;

// const app = express();
// app.use(express.json());   //create middleware 
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// app.use(userRouter);

// // const routersPath = path.join(__dirname, "routes");

// // fs.readdirSync(routersPath).forEach((file) => {
// //   if (file.endsWith(".js")) {
// //     const routerModule = require(path.join(routersPath, file));

// //     const router = routerModule.router;

// //     app.use(router);
// //   }
// // });
// const routersPath = './routes';

// // fs.readdirSync(routersPath).forEach(async (file) => {
// //   if (file.endsWith('.js')) {
// //     const routerModule = await import(path.join(routersPath, file));
// //     const router = routerModule.default || routerModule.router;
    
// //     app.use(router);
// //   }
// // });
// // async function loadRouters() {
// //   const files = fs.readdirSync(routersPath).filter(file => file.endsWith('.js'));

// //   await Promise.all(files.map(async (file) => {
// //     const routerModule = await import(path.resolve(routersPath, file));
// //     const router = routerModule.default || routerModule.router;
// //     app.use(router);
// //   }));
// // }


// async function loadRouters() {
//   const files = fs.readdirSync(routersPath).filter(file => file.endsWith('.js') && file !== 'chats.js');

//   await Promise.all(files.map(async (file) => {
//     try {
//       const routerModule = await import(path.resolve(routersPath, file));
//       const router = routerModule.default || routerModule.router;
//       app.use(router);
//       console.log(`Loaded router from ${file}`);
//     } catch (err) {
//       console.error(`Error loading router from ${file}:`, err.message);
//     }
//   }));
// }

// loadRouters()
//   .then(() => {
//     console.log('All routers loaded successfully!');
//   })
//   .catch(err => console.error('Error loading routers:', err));


// // loadRouters().catch(err => console.error('Error loading routers:', err));

// // const router = new Router();

// app.use(cors({ origin: 'http://localhost:3000' }));

// // // Testing our server:
// app.get('/api', (req, res) => {
//   res.send('Welcome to Smart Memory!');
// });

// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Test route works!' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require('express');
const path = require('path');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));
const cors = require('cors');
const { router: userRouter } = require('./routes/users');

const PORT = process.env.PORT || 8000;

const app = express();

// Use CORS middleware before any routes are registered
app.use(cors({
  origin: 'http://localhost:3000', // 允许来自前端的请求
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的方法
  allowedHeaders: ['Content-Type'], // 允许的请求头
}));

app.use(express.json());   //create middleware 
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Register user routes
app.use(userRouter);

// Dynamically load additional routers
const routersPath = './routes';
async function loadRouters() {
  // Read all files in the routes directory
  const files = fs.readdirSync(routersPath).filter(file => file.endsWith('.js') && file !== 'chats.js');

  // Load each router dynamically using `require`
  await Promise.all(files.map(async (file) => {
    try {
      const routerModule = require(path.resolve(routersPath, file));
      const router = routerModule.router || routerModule.default || routerModule;
      app.use(router);
      console.log(`Loaded router from ${file}`);
    } catch (err) {
      console.error(`Error loading router from ${file}:`, err.message);
    }
  }));
}

// Call the function to load routers
loadRouters()
  .then(() => {
    console.log('All routers loaded successfully!');
  })
  .catch(err => console.error('Error loading routers:', err));

// Test routes
app.get('/api', (req, res) => {
  res.send('Welcome to Smart Memory!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
