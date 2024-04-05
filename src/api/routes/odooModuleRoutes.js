const express = require('express');
const odooModuleController = require('../controllers/odooModuleController');
const router = express.Router();
const { authenticateToken, authorizationMiddleware } = require('../../middleware/authMiddleware');

// #swagger.security = [{ "apiKeyAuth": [] }]
router.post('/activate-odoo-module/:dbName', authenticateToken, authorizationMiddleware(["Admin"]), odooModuleController.activateOdooModule); //Activate an module on the company
router.delete('/deactivate-odoo-module/:dbName', authenticateToken, authorizationMiddleware(["Admin"]), odooModuleController.deactivateOdooModule); //Deactivate an module on the company
router.patch('/upgrade-odoo-module/:dbName', authenticateToken, authorizationMiddleware(["Admin"]), odooModuleController.upgradeOdooModule); //Upgrade an module on the company
router.get('/get-all-odoo-module/:dbName', authenticateToken, odooModuleController.getAllOdooModules); //Get all modules on the company
router.get('/get-activate-odoo-module/:dbName', authenticateToken, odooModuleController.getActivateOdooModules); //Get all activated modules on the company
router.get('/get-unactivated-odoo-module/:dbName', authenticateToken, odooModuleController.getUnactivatedOdooModules); //Get all unactivated modules on the company

module.exports = router;