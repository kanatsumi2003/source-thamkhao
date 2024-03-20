const express = require('express');
const router = express.Router();
const companyControllers = require('../controllers/companyControllers');
const {authenticateToken} = require("../../middleware/authMiddleware");

router.post('/', authenticateToken, companyControllers.createCompany);

module.exports = router;