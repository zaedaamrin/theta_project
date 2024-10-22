//This is only for database connection testing!!!
const express = require('express');
const { join } = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

const router = express.Router();
router.use(express.json());

const pathToSpec = join(__dirname, './openApiSchema.yml');
const openApiSpec = yaml.load(pathToSpec);

router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

module.exports = router;

