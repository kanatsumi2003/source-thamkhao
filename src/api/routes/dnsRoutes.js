const express = require('express');
const dnsRecordController = require('../controllers/dnsController');
const router = express.Router();

router.get('/listRecords/:zone_id', dnsRecordController.getListDnsRecord); //get all dns records
router.get('/searchRecord/:zone_id/:name', dnsRecordController.searchDnsRecord) //search record by name
router.post('/createRecord/:zone_id', dnsRecordController.createDnsRecord) //create new record
router.delete('/deleteRecord/:zone_id/:id', dnsRecordController.deleteDnsRecord) //delete a record by recordID
router.patch('/updateRecord/:zone_id/:id', dnsRecordController.updateDnsRecord) //update a record by recordID
module.exports = router;