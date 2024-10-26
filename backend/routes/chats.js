const { Router } = require("express");
const { chatController } = require("../controllers/chats.js");

router.get('/api/:userId/chat', chatController.getChats);
router.post('/api/:userId/chat', chatController.postChat);

router.get('/api/:userId/chat/:chatId', chatController.getChat);
router.delete('/api/:userId/chat/:chatId', chatController.deleteChat);

router.post('/api/:userId/chat/:chatId/message', chatController.postMessage);

module.exports = { router };