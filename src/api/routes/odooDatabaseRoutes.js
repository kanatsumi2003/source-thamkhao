const express = require('express');
const odooDatabaseController = require('../controllers/odooDatabaseController');
const router = express.Router();

router.post('/duplicate-odoo-database', odooDatabaseController.duplicateDatabases); //Duplicate an database on Odoo
router.post('/stop-odoo-database', odooDatabaseController.stopOdooDatabase); //Stop the database on Odoo
module.exports = router;