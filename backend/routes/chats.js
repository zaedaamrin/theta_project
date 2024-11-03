import { Router } from 'express';
import { chatController } from '../controllers/chats.js';

const router = new Router();

router.get('/api/:userId/chats', chatController.getChats);

// /**
//  * @swagger
//  * /api/{userId}/chats:
//  *   post:
//  *     summary: Create a new chat for this user.
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         description: ID of the user 
//  *         schema:
//  *           type: string
//  *      responses:
//  *       201:
//  *         description: Created chat!
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: integer
//  *                       description: The chat ID.
//  *                       example: 0
//  *                     userId:
//  *                       type: integer
//  *                       description: The user ID foreign key.
//  *                       example: 0
//  *                     lastOpenedDate:
//  *                       type: string
//  *                       format: date-time
// */
router.post('/api/:userId/chats', chatController.postChat);

// /**
//  * @swagger
//  * /api/{userId}/chats/{chatId}:
//  *   get:
//  *     summary: Retrieve the chat history of this chat for this user
//  *     description: This endpoint returns a json list of this individual user's chat histories.
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         description: ID of the user whose chats to retrieve
//  *         schema:
//  *           type: string
//  *       - in: path
//  *         name: chatId
//  *         required: true
//  *         description: ID of the chat to retrieve
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved chat
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 chatId:
//  *                   type: integer
//  *                 lastOpenedDate:
//  *                   type: date-time
//  *                 messages:
//  *                   type: object
//  *                   properties:
//  *                      messageId:
//  *                          type: integer
//  *                      messageContent:
//  *                          type: string
//  *                      sender:
//  *                          type: string
//  *                      timestamp:
//  *                          type: string
//  *                          format: date-time
//  */
router.get('/api/:userId/chats/:chatId', chatController.getChat);

// /**
//  * @swagger
//  * /api/{userId}/chats/{chatId}:
//  *   delete:
//  *     summary: Delete the chat for this user
//  *     description: This endpoint deletes a chat from this individual user's chat history.
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         description: ID of the user whose chats to delete
//  *         schema:
//  *           type: string
//  *       - in: path
//  *         name: chatId
//  *         required: true
//  *         description: ID of the chat to delete
//  *         schema:
//  *           type: string
//  *     responses:
//  *       201:
//  *         description: Successfully deleted chat
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 chatId:
//  *                   type: integer
//  */
router.delete('/api/:userId/chats/:chatId', chatController.deleteChat);

// /**
//  * @swagger
//  * /api/{userId}/chats/{chatId}/message:
//  *   post:
//  *     summary: Send a new message to this chat and receive model-generated answer.
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         description: ID of the user 
//  *         schema:
//  *           type: string
//  *       - in: path
//  *         name: chatId
//  *         required: true
//  *         description: ID of the chat to retrieve
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       201:
//  *         description: Sent message!
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: integer
//  *                       description: The message ID.
//  *                       example: 0
//  *                     userId:
//  *                       type: integer
//  *                       description: The user ID foreign key.
//  *                       example: 0
//  *                     chatId:
//  *                       type: integer
//  *                       description: The chat ID foreign key.
//  *                     messageContent:
//  *                       type: string
//  *                     sender:
//  *                       type: string
//  *                     timestamp:
//  *                       type: string
//  *                       format: date-time
//  *                     assistantAnswer:
//  *                       type: string
//  *                       description: The answer to the user's message from the model.
// */
router.post('/api/:userId/chats/:chatId/message', chatController.postMessage);

export { router };