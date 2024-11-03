import { Router } from 'express';
import { sourceController } from "../controllers/sources.js";

const router = new Router();

// /**
//  * @swagger
//  * /api/{userId}/sources:
//  *   get:
//  *     summary: Retrieve this user's sources (URLs)
//  *     description: This endpoint returns a json list of this individual user's sources.
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         description: ID of the user whose sources to retrieve
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved sources
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 sourceId:
//  *                   type: integer
//  *                   properties:
//  *                  sourceId:
//  *                   type: integer
//  *                 lastOpenedDate:
//  *                   type: string
//  *                   format: date-time
//  */
router.get('/api/:userId/sources', sourceController.getSources);

// /**
//  * @swagger
//  * /api/{userId}/sources:
//  *   post:
//  *     summary: Add a new source for this user.
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         description: ID of the user 
//  *         schema:
//  *           type: string
//  *      responses:
//  *       201:
//  *         description: Created source!
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
//  *                       description: The source ID.
//  *                       example: 0
//  *                     userId:
//  *                       type: integer
//  *                       description: The user ID foreign key.
//  *                       example: 0
//  *      
//  *                     lastOpenedDate:
//  *                       type: string
//  *                       format: date-time
// */
router.post('/api/:userId/sources', sourceController.postSource);

// /**
//  * @swagger
//  * /api/{userId}/sources/{sourceId}:
//  *   delete:
//  *     summary: Delete this source for this user
//  *     description: This endpoint deletes a source from this individual user's source library.
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         description: ID of the user whose chats to retrieve
//  *         schema:
//  *           type: string
//  *       - in: path
//  *         name: sourceId
//  *         required: true
//  *         description: ID of the source to delete
//  *         schema:
//  *           type: string
//  *     responses:
//  *       201:
//  *         description: Successfully deleted source
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 sourceId:
//  *                   type: integer
//  */
router.delete('/api/:userId/sources/:userId', sourceController.deleteSource);

export { router };