const express = require('express');
const odooModuleController = require('../controllers/odooModuleController');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware');

// #swagger.security = [{ "apiKeyAuth": [] }]
router.post('/activate-odoo-module', authenticateToken, odooModuleController.activateOdooModule); //Activate an module on the company
router.delete('/deactivate-odoo-module', odooModuleController.deactivateOdooModule); //Deactivate an module on the company
router.patch('/upgrade-odoo-module', odooModuleController.upgradeOdooModule); //Upgrade an module on the company
router.get('/get-all-odoo-module', odooModuleController.getAllOdooModules); //Get all modules on the company
router.post('/get-all-odoo-module', odooModuleController.getAllOdooModules); //Get all modules on the company
router.get('/get-activate-odoo-module', odooModuleController.getActivateOdooModules); //Get all activated modules on the company
router.get('/get-unactivated-odoo-module', odooModuleController.getUnactivatedOdooModules); //Get all unactivated modules on the company

module.exports = router;