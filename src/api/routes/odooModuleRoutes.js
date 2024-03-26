const express = require('express');
const odooModuleController = require('../controllers/odooModuleController');
const router = express.Router();

router.post('/activate-odoo-module', odooModuleController.activateOdooModule); //Activate an module on the company
router.delete('/deactivate-odoo-module', odooModuleController.deactivateOdooModule); //Deactivate an module on the company
router.patch('/upgrade-odoo-module', odooModuleController.upgradeOdooModule); //Upgrade an module on the company
router.post('/get-all-odoo-module', odooModuleController.getAllOdooModules); //Get all modules on the company
module.exports = router;