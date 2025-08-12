const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SportsPro API',
      version: '1.0.0',
      description: 'A simple API to perform CRUD functions for sports management software',
    },
    servers: [
      {
        url: 'http://localhost:3001/api/',
        description: 'Version 1',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

const fs = require('fs');
fs.writeFileSync('swagger-output.json', JSON.stringify(specs, null, 2));

module.exports = {
  swaggerUi,
  specs,
}; 