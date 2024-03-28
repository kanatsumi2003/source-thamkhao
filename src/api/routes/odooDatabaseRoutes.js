const express = require('express');
const odooDatabaseController = require('../controllers/odooDatabaseController');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware')


router.post('/duplicate-odoo-database', odooDatabaseController.duplicateDatabases); //Duplicate an database on Odoo
router.post('/stop-odoo-database', odooDatabaseController.stopOdooDatabase); //Stop the database on Odoo
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post('/recreate-database', authenticateToken, odooDatabaseController.reCreateOdooDatabase);
module.exports = router;