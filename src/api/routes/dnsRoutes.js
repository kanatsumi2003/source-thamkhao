const express = require('express');
const dnsRecordController = require('../controllers/dnsController');
const router = express.Router();

router.get('/', dnsRecordController.getListDnsRecord);
router.get('/searchDns/:name', dnsRecordController.searchDnsRecord)
router.post('/createDns', dnsRecordController.createDnsRecord)
router.delete('/deleteDns/:id', dnsRecordController.deleteDnsRecord)
router.patch('/updateDns/:id', dnsRecordController.updateDnsRecord)
module.exports = router;