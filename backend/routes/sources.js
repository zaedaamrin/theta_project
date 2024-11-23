const { Router } = require('express');
const { sourceController } = require("../controllers/sources.js");

const router = new Router();

router.get('/api/:userId/sources', sourceController.getSources);
router.post('/api/:userId/sources', sourceController.postSource);
router.delete('/api/:userId/sources/:sourceId', sourceController.deleteSource);

//confirm with team if this function should be in sources or chats
router.post('/api/sources/searchSimilar', sourceController.searchSimilar);

module.exports = { router };