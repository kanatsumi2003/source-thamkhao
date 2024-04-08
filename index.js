const express = require('express');
const userRoutes = require('./src/api/routes/userRoutes.js');
const roleRoutes = require('./src/api/routes/roleRoutes.js');
const dnsRoutes = require('./src/api/routes/dnsRoutes.js');
const companyRoutes = require('./src/api/routes/companyRoutes.js');
const odooDatabaseRoutes = require('./src/api/routes/odooDatabaseRoutes.js');
const odooModuleRoutes = require('./src/api/routes/odooModuleRoutes.js');
const odooUserRoutes = require('./src/api/routes/odooUserRoutes');
const odooReportsRoutes = require('./src/api/routes/odooReportsRoutes');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const cors = require('./src/middleware/corsMiddleware')
const YAML = require('yamljs');
require('dotenv').config();

// Load the Swagger document
// const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use(express.json());
app.use(cors);

app.use('/api', dnsRoutes);
app.use('/api', odooModuleRoutes);
// Set up your API routes
app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', companyRoutes);
app.use('/api', odooDatabaseRoutes);
app.use('/api', odooUserRoutes);
app.use('/api', odooReportsRoutes);
app.use('/public', express.static('public'));
// Set up Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
const PORT = process.env.REACT_APP_PORT || 3001;

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Swagger is already set up and doesn't need to be initialized here
});
