const express = require('express');
const odooReportsController = require('../controllers/odooReportsController');
const {authenticateToken} = require("../../middleware/authMiddleware");
const router = express.Router();

// #swagger.security = [{ "apiKeyAuth": [] }]
router.get('/get-odoo-invoice/:dbName', authenticateToken, odooReportsController.getOdooInvoice); //Get an invoice
module.exports = router;