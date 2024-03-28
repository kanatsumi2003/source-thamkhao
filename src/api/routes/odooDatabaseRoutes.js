const express = require('express');
const odooDatabaseController = require('../controllers/odooDatabaseController');
const router = express.Router();

router.post('/duplicate-odoo-database', odooDatabaseController.duplicateDatabases); //Duplicate an database on Odoo
router.post('/stop-odoo-database', odooDatabaseController.stopOdooDatabase); //Stop the database on Odoo
router.post('/change-odoo-db-name', odooDatabaseController.changeOdooDBName); //Change the database name on Odoo
router.post('/change-odoo-db-password', odooDatabaseController.changeOdooDBPassword); //Change the database password on Odoo
router.post('/start-odoo-database-again', odooDatabaseController.startOdooDatabaseAgain); //Start the database on Odoo
module.exports = router;