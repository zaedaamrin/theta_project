// Import the database connection pool from db.js
import poolConnect from './db.js';
import bcrypt from 'bcrypt';   //
const userController = {
    // getUsers: (req, res) => {
    //     // TODO: implement when connected with db

    //     res.json({ users: "placeholder for users data"});
    // },
    // TODO:email confirmation
    // Method to add a new user to the database
    signUpUser: async (req, res) => {
        // Extract the username and password from the request body
        const { username, password, email } = req.body;
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // Wait for the database connection to be established
            const pool = await poolConnect;
            // Insert a new record into the "Users" table with the provided username and password
            await pool.request()
                .input('username', sql.NVarChar, username) // Set the username as a parameter
                .input('password', sql.NVarChar, hashedPassword) // Set the password as a parameter
                .input('email', sql.NVarChar, email)
                .query('INSERT INTO Users (username, password, email, createDate) VALUES (@username, @password, @email,  GETDATE())');
            // Send a 201 Created response indicating that the user was successfully created
            res.status(201).json({ message: "User created!" });
        } catch (err) {
            // Log any SQL errors that occur during the insert query
            console.error('SQL error', err);
            // Send a 500 Internal Server Error response if the insert fails
            res.status(500).json({ error: 'Error creating user' });
        }
    },
    signInUser: async (req, res) =>{
        const { email, password } = req.body;
        try {
            const pool = await poolConnect;
            const result = await pool.request()
                .input('email', sql.NVarChar, email)
                .query('SELECT * FROM Users WHERE email = @email');
            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                const match = await bcrypt.compare(password, user.password);
                if(match){
                    res.status(200).json({ message: 'Login successful', user: result.recordset[0] });
                }else{
                    res.status(401).json({error: 'Invalid email or password' });
                }
            } else {
                // Invalid credentials
                res.status(401).json({ error: 'User not found' });
            }
        } catch (err) {
            console.error('SQL error', err);
            res.status(500).json({ error: 'Error logging in' });
        }
    }




    // // Method to get a specific user by email from the database
    // getUser: async (req, res) => {
    //     // Parse the user ID from the request parameters as an integer
    //     const email = parseInt(req.params.email);
    //     try {
    //         // Wait for the database connection to be established
    //         const pool = await poolConnect;
    //         // Execute a SQL query to select the user with the specified ID from the "Users" table
    //         const result = await pool.request()
    //             .input('email', sql.NVarChart, email) // Set the userId as a parameter
    //             .query('SELECT * FROM Users WHERE email = @email');
    //         // Send the result as a JSON response with the user data
    //         res.json({ user: result.recordset[0] });
    //     } catch (err) {
    //         // Log any SQL errors that occur during the query
    //         console.error('SQL error', err);
    //         // Send a 500 Internal Server Error response if the query fails
    //         res.status(500).json({ error: 'Error fetching user' });
    //     }
    // }


};

export { userController };
