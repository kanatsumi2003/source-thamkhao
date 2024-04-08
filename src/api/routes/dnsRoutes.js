const express = require('express');
const dnsRecordController = require('../controllers/dnsController');
const router = express.Router();
const { authenticateToken, authorizationMiddleware } = require('../../middleware/authMiddleware')
const apienpoint = "/record";
// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apienpoint + "/:zone_id", authenticateToken, authorizationMiddleware(["Admin"]), dnsRecordController.getListDnsRecord); //get all dns records
// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apienpoint + '/:zone_id/:name', authenticateToken, authorizationMiddleware(["Admin"]), dnsRecordController.searchDnsRecord); //search record by name
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint + '/:zone_id', authenticateToken, authorizationMiddleware(["Admin"]), dnsRecordController.createDnsRecord); //create new record
// #swagger.security = [{ "apiKeyAuth": [] }]
router.delete(apienpoint + '/:zone_id/:id', authenticateToken, authorizationMiddleware(["Admin"]), dnsRecordController.deleteDnsRecord); //delete a record by recordID
// #swagger.security = [{ "apiKeyAuth": [] }]
router.patch(apienpoint + '/:zone_id/:id', authenticateToken, authorizationMiddleware(["Admin"]), dnsRecordController.updateDnsRecord); //update a record by recordID
module.exports = router;