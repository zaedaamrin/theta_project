const express = require('express');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));
const cors = require('cors');
const { router: userRouter } = require('./routes/users.js');
const { router: sourcesRouter } = require('./routes/sources.js');
const { router: chatsRouter } = require('./routes/chats.js');

const dotenv = require('dotenv');
const { client } = require('./models/completionModel');

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

// Use CORS middleware before any routes are registered
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',  
      'https://microsoft-smart-memory-80m8z9drd-zaedaamrins-projects.vercel.app',
      'https://microsoft-smart-memory.vercel.app' // Vercel frontend URL
    
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


app.use(express.json());   //create middleware 
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(userRouter);
app.use(sourcesRouter);
app.use(chatsRouter);


// Test routes
app.get('/api', (req, res) => {
  res.send('Welcome to Smart Memory!');
});

app.get('/api/client', async (req, res) => {
  try {
    const result = await client.chat.completions.create({
          messages: [
            { role: "system", content: "You are a helpful assistant. You will talk professionally." },
            { role: "user", content: "What is a RAG pattern ?" },
           ],
          model: "",
        });
      
        const responseMessages = []

        for (const choice of result.choices) {
          responseMessages.push(choice.message)
        }
      res.json({response: responseMessages[0].content})
    } catch (error) {
      console.error("Error testing OpenAI client:", error);
      res.json({message: error})
    }

})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
