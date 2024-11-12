import { Router } from 'express';
import { userController } from "../controllers/users.js";
const { connectToDatabase } = require('../database.js');

const router = new Router();

router.get('/api/users', userController.getUsers);
router.post('/api/users', userController.postUser);

router.get('/api/users/:userId', userController.getUser);

export { router };