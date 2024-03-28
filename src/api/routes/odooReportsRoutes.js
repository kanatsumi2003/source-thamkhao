const express = require('express');
const odooReportsController = require('../controllers/odooReportsController');
const router = express.Router();

router.post('/get-odoo-invoice', odooReportsController.getOdooInvoice); //Get an invoice
module.exports = router;