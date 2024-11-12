// database.js
const sql = require('mssql');

// Define your database configuration here
const config = {
    user: 'zg339@cornell.edu', // Azure SQL username
    password: '946477#Azure', // Azure SQL password
    server: 'thetabest.database.windows.net', // Your server name
    database: 'Theta_memory', // Your database name
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false, // Set to false for Azure SQL to use proper encryption
  };

// Function to establish a database connection
async function connectToDatabase() {
  try {
    // Establish the connection using the config
    await sql.connect(config);
    console.log('Database connection successful');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

// Export the config and connection function
module.exports = { config, connectToDatabase, sql };
