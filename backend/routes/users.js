const { Router } = require("express");
const { userController } = require("../controllers/users.js");


const router = new Router();

router.get('/api/users', userController.getUsers);
router.post('/api/users', userController.postUser);

router.get('/api/users/:userId', userController.getUser);

module.exports = { router };