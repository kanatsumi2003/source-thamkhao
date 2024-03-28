const express = require('express');
const odooUserController = require('../controllers/odooUserController');
const router = express.Router();

router.post('/get-odoo-users-in-company', odooUserController.getOdooUser); //Get all users on the company
router.post('/get-odoo-user-role', odooUserController.getOdooUserRole); //Get an user role on the company
module.exports = router;