const { config, connectToDatabase, sql } = require('./database');

// Function to insert data into the table
async function getData() {
    try {
      const pool = await connectToDatabase();
  
      // Perform a query
      const result = await pool.request().query('SELECT * FROM User');
      
      console.log('Data from your table:', result.recordset);
    } catch (err) {
      console.error('Error querying the database:', err);
    }
  }
  
  getData();