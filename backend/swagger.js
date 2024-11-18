const swaggerJsDoc = require('swagger-jsdoc');

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
    apis: ["./routes/*.js"], // Path to the API routes in your Node.js application
    };
    
    const swaggerSpec = swaggerJsDoc(options);
    // module.exports = swaggerSpec;
    module.exports = { swaggerSpec };
