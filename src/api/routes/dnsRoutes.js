const express = require('express');
const dnsRecordController = require('../controllers/dnsController');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware')
const apienpoint = "/record";
// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apienpoint + "/:zone_id", authenticateToken, dnsRecordController.getListDnsRecord); //get all dns records
// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apienpoint + '/:zone_id/:name', authenticateToken, dnsRecordController.searchDnsRecord); //search record by name
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint + '/:zone_id', authenticateToken, dnsRecordController.createDnsRecord); //create new record
// #swagger.security = [{ "apiKeyAuth": [] }]
router.delete(apienpoint + '/:zone_id/:id', authenticateToken, dnsRecordController.deleteDnsRecord); //delete a record by recordID
// #swagger.security = [{ "apiKeyAuth": [] }]
router.patch(apienpoint + '/:zone_id/:id', authenticateToken, dnsRecordController.updateDnsRecord); //update a record by recordID
module.exports = router;