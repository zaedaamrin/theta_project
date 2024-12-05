const { Router } = require('express');
const { userController } = require("../controllers/users.js");

const router = new Router();

app.get('/api/testuser', (req, res) => {
    res.send('user route successful');
  });

router.post('/api/users/signin', userController.signInUser);
router.post('/api/users/signup', userController.signUpUser);
module.exports = { router }; 

