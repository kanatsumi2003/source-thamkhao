const express = require('express');
const dnsRecordController = require('../controllers/dnsController');
const router = express.Router();

router.get('/listDns/:zone_id', dnsRecordController.getListDnsRecord); //get all dns records
router.get('/searchDns/:zone_id/:name', dnsRecordController.searchDnsRecord) //search record by name
router.post('/createDns/:zone_id', dnsRecordController.createDnsRecord) //create new record
router.delete('/deleteDns/:zone_id/:id', dnsRecordController.deleteDnsRecord) //delete a record by recordID
router.patch('/updateDns/:zone_id/:id', dnsRecordController.updateDnsRecord) //update a record by recordID
module.exports = router;