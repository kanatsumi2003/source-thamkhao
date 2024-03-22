const express = require('express');
const userRoutes = require('./src/api/routes/userRoutes.js');
const roleRoutes = require('./src/api/routes/roleRoutes.js');
const dnsRoutes = require('./src/api/routes/dnsRoutes.js');
const companyRoutes = require('./src/api/routes/companyRoutes.js');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const YAML = require('yamljs');
require('dotenv').config();

// Load the Swagger document
// const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use(express.json());

app.use('/api/dns', dnsRoutes);
// Set up your API routes
// #swagger.tags = ['Users']
app.use('/api',userRoutes);
app.use('/api', roleRoutes);
app.use('/api', companyRoutes);

// Set up Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
const PORT = process.env.REACT_APP_PORT || 3001;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Swagger is already set up and doesn't need to be initialized here
});
