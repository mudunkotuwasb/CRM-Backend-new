const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
openapi: '3.0.0',
info: {
title: 'Octick CRM API',
version: '1.0.0',
description: 'API documentation for Octick CRM',
},
servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
};

const options = {
swaggerDefinition,
apis: ['./src/routes/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;