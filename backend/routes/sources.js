import { Router } from 'express';
import { sourceController } from "../controllers/sources.js";

const router = new Router();

router.get('/api/:userId/sources', sourceController.getSources);
router.post('/api/:userId/sources', sourceController.postSource);

router.delete('/api/:userId/sources/:sourceId', sourceController.deleteSource);

export { router };