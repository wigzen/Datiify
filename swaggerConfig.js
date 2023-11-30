// swaggerConfig.js

const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for your Node.js and Express application",
    },
    servers: [
      {
        url: "http://localhost:3000", // Update with your server's URL
        description: "Development Server",
      },
    ],
  },
  apis: ["**/*.js"], // Path to the API routes in your project
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
