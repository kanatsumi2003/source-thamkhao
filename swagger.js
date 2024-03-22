const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/api/routes/*.js'];

const doc = {
  info: {
    title: 'My API',
    description: 'API Documentation',
  },
  host: 'localhost:3000/api',
  schemes: ['http'],
//   tags: [  // Sửa lại phần này
//     {
//       "name": "Users",
//       "description": "Endpoints related to user operations"
//     }
//   ],
  securityDefinitions: {
    apiKeyAuth: { // This name should match the key in your route comment
      type: 'apiKey',
      in: 'header', // The location of the API key (header is a common location)
      name: 'Authorization', // The name of the header to be used
      description: "Please enter JWT with Bearer into field"
    }
  }
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully.');
});
