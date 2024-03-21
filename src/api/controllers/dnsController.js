const dnsService = require('../services/dnsServices');
const collectionName = 'dns-record';

const CLOUD_FLARE_API = process.env.CLOUD_FLARE_API;
const CLOUD_FLARE_ZONE_ID = process.env.CLOUD_FLARE_ZONE_ID;
const TOKEN = process.env.TOKEN;

async function getListDnsRecord(req, res) {
    try {
        const record = await dnsService.getAllDnsRecords(CLOUD_FLARE_API, CLOUD_FLARE_ZONE_ID, TOKEN);
        res.status(201).json({ data: record });
    } catch (error) {
        res.status(500).json({ message: 'Error occurs, please try later', error })
    }

}

async function createDnsRecord(req, res) {
    try {
        const dnsData = req.body;
        const result = await dnsService.createDnsRecord(CLOUD_FLARE_API, CLOUD_FLARE_ZONE_ID, TOKEN, dnsData)
        res.status(201).json({data: result})
    } catch (error) {
        res.status(500).json({message: 'Failed to create DNS, please try again'})
    }
}

async function searchDnsRecord(req, res) {
    try {
        const searchValue = req.params.name;
        const result = await dnsService.findDnsRecordByName(CLOUD_FLARE_API, CLOUD_FLARE_ZONE_ID, TOKEN, searchValue);
        res.status(201).json({data: result})
    } catch (error) {
        
    }
}

async function deleteDnsRecord(req, res) {
    try {
        const dnsID = req.params.id;
        const result = await dnsService.deleteDnsRecord(CLOUD_FLARE_API, CLOUD_FLARE_ZONE_ID, TOKEN, dnsID);
        res.status(201).json({data: result})
    } catch (error) {
        
    }
}

async function updateDnsRecord(req, res) {
    try {
        const updateData = req.body
        const dnsID = req.params.id

        const result = await dnsService.updateDnsRecord(CLOUD_FLARE_API, CLOUD_FLARE_ZONE_ID, TOKEN, dnsID, updateData);
        res.status(201).json({data: result})
    } catch (error) {
        
    }
}

module.exports = {
    getListDnsRecord,
    createDnsRecord,
    searchDnsRecord,
    deleteDnsRecord,
    updateDnsRecord
}