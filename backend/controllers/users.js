// const { connectToDatabase } = require('./database');

async function getData() {
    try {
      const pool = await connectToDatabase();
  
      // Perform a query
      const result = await pool.request().query('SELECT * FROM Users');
      
      console.log('Data from your table:', result.recordset);
    } catch (err) {
      console.error('Error querying the database:', err);
    }
  }

const userController = {
    getUsers: (req, res) => {
        // TODO: implement when connected with db
        getData();
        res.json({ users: "placeholder for users data"});
    },

    postUser: (req, res) => {
        const data = req.body;
        // TODO: implement when connected with db

        res.status(201).json({message: "Chat created!"});
    },

    getUser: (req, res) => {
        const user = parseInt(req.params.userId);

        // TODO: implement when connected with db

        res.json({ users: "placeholder for user data"});
    }
}

export { userController };
