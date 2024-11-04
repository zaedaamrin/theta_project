import { Router } from 'express';
import { chatController } from '../controllers/chats.js';

const router = new Router();

router.get('/api/:userId/chats', chatController.getChats);
router.post('/api/:userId/chats', chatController.postChat);

router.get('/api/:userId/chats/:chatId', chatController.getChat);
router.delete('/api/:userId/chats/:chatId', chatController.deleteChat);

router.post('/api/:userId/chats/:chatId/message', chatController.postMessage);

export { router };