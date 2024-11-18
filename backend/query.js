const {pool} = require('./database.js');

// Function to insert data into the table
async function getData() {
    try {
      const poolConnection = await pool;
  
      // Perform a query
      const result = await poolConnection.request().query('SELECT * FROM Users');
      // await poolConnection.request().query("INSERT INTO Users(username, password, email) VALUES ('Menghan', '12345', 'mx253@cornell.edu')");
      console.log('Data from your table:', result.recordset);
    } catch (err) {
      console.error('Error querying the database:', err);
    }
  }
  
  getData();