const express = require('express');
const path = require('path');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const dotenv = require('dotenv');
const { client } = require('./openaiClient');

const swaggerDocument = require('./openapi.json');

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

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

loadRouters().catch(err => console.error('Error loading routers:', err));

app.get('/api', (req, res) => {
  res.send('Welcome to Smart Memory!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
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
      
        for (const choice of result.choices) {
          console.log(choice.message);
        }
      res.json({message: result})
    } catch (error) {
      console.error("Error testing OpenAI client:", error);
      res.json({message: error})
    }

})
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
