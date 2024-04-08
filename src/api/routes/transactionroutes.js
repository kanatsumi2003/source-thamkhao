const express = require('express');
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { authenticateToken } = require('../../middleware/authMiddleware');

const apiEndpoint = 'transactions';

// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apiEndpoint + "/:id", authenticateToken, transactionController.getTransactionById);

// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apiEndpoint + "user/:id", authenticateToken, transactionController.getTransactionByUserId);

module.exports = router;
