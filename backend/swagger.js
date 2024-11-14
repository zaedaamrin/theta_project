const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
    title: "Microsoft Smart Memory API",
    version: "1.0.0",
    description: "",
    },
    };
    
    const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"], 
    };
    
    const swaggerSpec = swaggerJsDoc(options);
    module.exports = { swaggerSpec };

