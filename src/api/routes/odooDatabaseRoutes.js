const express = require('express');
const odooDatabaseController = require('../controllers/odooDatabaseController');
const router = express.Router();
const { authenticateToken, authorizationMiddleware } = require('../../middleware/authMiddleware')

// #swagger.security = [{ "apiKeyAuth": [] }]
router.post('/duplicate-odoo-database/:dbName', authenticateToken, authorizationMiddleware(["Admin"]) ,odooDatabaseController.duplicateDatabases); //Duplicate an database on Odoo
router.post('/stop-odoo-database/:dbName', authenticateToken, authorizationMiddleware(["Admin"]), odooDatabaseController.stopOdooDatabase); //Stop the database on Odoo
//router.post('/change-odoo-db-name', odooDatabaseController.changeOdooDBName); //Change the database name on Odoo
//router.post('/change-odoo-db-password', odooDatabaseController.changeOdooDBPassword); //Change the database password on Odoo
router.post('/start-odoo-database-again/:dbName', authenticateToken, authorizationMiddleware(["Admin"]), odooDatabaseController.startOdooDatabaseAgain); //Start the database on Odoo
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post('/recreate-database/:userId', authenticateToken, odooDatabaseController.reCreateOdooDatabase);
module.exports = router;