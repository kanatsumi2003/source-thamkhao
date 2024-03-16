const express = require('express');
const userRoutes = require('./src/api/routes/userRoutes.js');
const swaggerUi = require('swagger-ui-express');
// Định nghĩa swaggerDocument dựa trên comment của bạn hoặc file YAML
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});