const express = require('express');
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const { authenticateToken } = require('../../middleware/authMiddleware'); // Đảm bảo đường dẫn đúng

const apiEndpoint = 'subscriptions';

// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apiEndpoint, authenticateToken, subscriptionController.createSubscription);

// #swagger.security = [{ "apiKeyAuth": [] }]
router.put(apiEndpoint, authenticateToken, subscriptionController.updateSubscription);

// #swagger.security = [{ "apiKeyAuth": [] }]
router.delete(apiEndpoint + '/:id', authenticateToken, subscriptionController.deleteSubscription);

module.exports = router;
