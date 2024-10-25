const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

// Testing our server:
app.get('/', (req, res) => {
  res.send('Welcome to Smart Memory!');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
