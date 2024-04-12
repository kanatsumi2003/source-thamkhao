const express = require('express');
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const { authenticateToken, authorizationMiddleware } = require('../../middleware/authMiddleware'); // Đảm bảo đường dẫn đúng

const apiEndpoint = '/subscriptions';

// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apiEndpoint, authenticateToken, authorizationMiddleware(["Admin"]), subscriptionController.createTemplateSubscription);

// #swagger.security = [{ "apiKeyAuth": [] }]
router.put(apiEndpoint, authenticateToken, authorizationMiddleware(["Admin"]), subscriptionController.updateSubscription);

// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apiEndpoint + '/register/:subscriptionId', authenticateToken, subscriptionController.registerSubscription);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.delete(apiEndpoint + '/:id', authenticateToken, authorizationMiddleware(["Admin"]), subscriptionController.deleteSubscription);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apiEndpoint + '/check-expiration', authenticateToken, subscriptionController.validateIsSubscriptionExpire);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.put(apiEndpoint + '/update-invoiceusage', authenticateToken, subscriptionController.updateInvoiceUsage);
module.exports = router;
