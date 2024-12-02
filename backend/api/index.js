// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const swaggerUI = require('swagger-ui-express');
// const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));
// const cors = require('cors');
// const { router: userRouter } = require('./routes/users');

// const dotenv = require('dotenv');
// const { client } = require('./models/completionModel');

// dotenv.config();

// const PORT = process.env.PORT || 8000;

// const app = express();

// // Use CORS middleware before any routes are registered
// app.use(cors({
//   origin: function (origin, callback) {
//     const allowedOrigins = [
//       'http://localhost:3000',  // Local development
//       'https://microsoft-smart-memory-80m8z9drd-zaedaamrins-projects.vercel.app',
//       'https://microsoft-smart-memory.vercel.app/' // Vercel frontend URL
    
//     ];

//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type'],
// }));


// app.use(express.json());   //create middleware 
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// // Register user routes
// app.use(userRouter);

// // Dynamically load additional routers
// const routersPath = './routes';

// async function loadRouters() {
//   try {
//     const files = fs.readdirSync(routersPath).filter(file => file.endsWith('.js'));

//     // Dynamically require each router file
//     files.forEach((file) => {
//       const routerModule = require(path.resolve(routersPath, file));
//       const router = routerModule.default || routerModule.router;
//       app.use(router);
//     });
//   } catch (err) {
//     console.error('Error loading routers:', err);
//   }
// }

// loadRouters().catch(err => console.error('Error loading routers:', err));

// // Test routes
// app.get('/api', (req, res) => {
//   res.send('Welcome to Smart Memory!');
// });

// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Test route works!' });
// });

// app.get('/api/client', async (req, res) => {
//   try {
//     const result = await client.chat.completions.create({
//           messages: [
//             { role: "system", content: "You are a helpful assistant. You will talk professionally." },
//             { role: "user", content: "What is a RAG pattern ?" },
//            ],
//           model: "",
//         });
      
//         const responseMessages = []

//         for (const choice of result.choices) {
//           responseMessages.push(choice.message)
//         }
//       res.json({response: responseMessages[0].content})
//     } catch (error) {
//       console.error("Error testing OpenAI client:", error);
//       res.json({message: error})
//     }

// })

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const path = require('path');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = JSON.parse(fs.readFileSync('./public/openapi.json', 'utf8'));
const cors = require('cors');
const dotenv = require('dotenv');
const { client } = require('../models/completionModel');
const { router: userRouter } = require('../routes/users');

// Load environment variables
dotenv.config();

const app = express();

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000', // Local development
      'https://microsoft-smart-memory.vercel.app', // Vercel frontend URL
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// JSON middleware
app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Register user routes
app.use(userRouter);

// Dynamically load additional routers from the "routes" directory
const routersPath = './routes';

async function loadRouters() {
  try {
    const files = fs.readdirSync(routersPath).filter(file => file.endsWith('.js'));

    // Dynamically require each router file
    files.forEach((file) => {
      const routerModule = require(path.resolve(routersPath, file));
      const router = routerModule.default || routerModule.router;
      app.use(router);
    });
  } catch (err) {
    console.error('Error loading routers:', err);
  }
}

// Call the asynchronous function to load additional routers
loadRouters().catch(err => console.error('Error loading routers:', err));

// Test routes
app.get('/api', (req, res) => {
  res.send('Welcome to Smart Memory!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

//
// Route to test OpenAI client integration
app.get('/api/client', async (req, res) => {
  try {
    const result = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant. You will talk professionally." },
        { role: "user", content: "What is a RAG pattern?" },
      ],
      model: "",
    });

    const responseMessages = result.choices.map(choice => choice.message.content);
    res.json({ response: responseMessages[0] });
  } catch (error) {
    console.error("Error testing OpenAI client:", error);
    res.status(500).json({ message: error.message });
  }
});

// Export the app as a serverless function
const serverless = require('serverless-http');
module.exports = serverless(app);
