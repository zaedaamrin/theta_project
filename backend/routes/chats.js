const { Router } = require('express');
const { chatController } = require('../controllers/chats.js');

const router = new Router();

router.get('/api/:userId/chats', chatController.getChats); //获取chats列表
router.post('/api/:userId/chats', chatController.postChat); //创建一个新的chat

// router.get('/api/:userId/chats/:chatId', chatController.getChat);
router.delete('/api/:userId/chats/:chatId', chatController.deleteChat);

router.post('/api/:userId/chats/:chatId/message', chatController.postMessage); //发送一条消息
router.get('/api/:chatId/chathistory', chatController.getChatHistory);//获取一个chat的所有历史
module.exports = { router };