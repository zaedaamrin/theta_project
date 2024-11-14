const { Router } = require('express');
const { sourceController } = require('../controllers/sources.js');

const router = new Router();

router.get('/api/:userId/sources', sourceController.getSources);

router.post('/api/:userId/sources', sourceController.postSource);

router.delete('/api/:userId/sources/:userId', sourceController.deleteSource);

module.exports = { router };