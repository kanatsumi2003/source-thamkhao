const express = require('express');
const odooUserController = require('../controllers/odooUserController');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware');

router.get('/get-odoo-users-in-company/:dbName', authenticateToken, odooUserController.getOdooUser); //Get all users on the company
router.get('/get-odoo-user-role/:dbName', authenticateToken, odooUserController.getOdooUserRole); //Get an user role on the company
module.exports = router;