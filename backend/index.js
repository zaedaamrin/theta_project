//const express = require('express');
const dotenv = require('dotenv').config();  

const { createDatabaseConnection } = require('./database');
const dbConfig = require('./config'); 

const app = express();
const PORT = process.env.PORT || 8000;

// enabling JSON parsing for incoming requests
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send("Hi smart memory!");
})
app.use("/signIn", require('./routes/signIn'));

app.get('/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// init database connection 
async function initializeDatabase() {
  try {
    const database = await createDatabaseConnection(dbConfig.passwordConfig); 
    console.log('Database initialized successfully.');

    // confirming the db instance is accessible throughout app
    app.locals.database = database;
  } catch (error) {
    console.error('Failed to initialize the database:', error);
  }
}

// starting server after db init
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// //the code below is only for testing database connection!
// // Import App routes
// import person from 'person.js';
// import openapi from 'openapi.js';

// // Connect App routes
// app.use('/api-docs', require('./routes/openai'));
app.use('/persons', require('./routes/person'));
// app.use('*', (_, res) => {
//   res.redirect('/api-docs');
// });
