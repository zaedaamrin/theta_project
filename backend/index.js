const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

// Testing our server:
app.get('/', (req, res) => {
  res.send('Welcome to Smart Memory!');
});

// Test url
app.get('/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Post a new url 
app.post('/urls', (req, res) => {
  data = req.body

  url = data.newUrl

  // call web scrape url page content function
  // call content chunking function
  // call content chunks vectorizing/embedding function
  // save embeddings and url in db

  res.json({ message: 'URL received successfully!' })
});

// Post a question
app.post('/questions', (req, res) => {
  question = req.body.question

  res.json({ message: 'Question received successfully!', generatedAnswer: "placeholder for model's answer" })
});

// Post user details
app.post('/users', (req, res) => {
  data = req.body

  res.json({ message: 'User details received successfully!' })
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
