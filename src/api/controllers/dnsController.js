const dnsService = require('../services/dnsServices');
const collectionName = 'dns-record';

const CLOUD_FLARE_API = process.env.CLOUD_FLARE_API;
const CLOUD_FLARE_ZONE_ID = process.env.CLOUD_FLARE_ZONE_ID;
const TOKEN = process.env.TOKEN;

//liệt kê tất cả record dựa theo zone_id
async function getListDnsRecord(req, res) {
    try {
        const zone_id = req.params.zone_id //zone_id cloudflare lấy từ params
        const result = await dnsService.getAllDnsRecords(zone_id);
        if(result.error) {
            const error = result;
            return res.status(error.statusCode).json({ error: error.error, statusCode: error.statusCode }) //có error => statusCode = statusCode cloudflare && error message = message cloudflare trả về
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Can not get record information' })
    }

}

//Tạo 1 record mới
async function createDnsRecord(req, res) {
    try {
        const zone_id = req.params.zone_id
        const recordData = req.body;
        const result = await dnsService.createDnsRecord(zone_id, recordData)
        if(result.error){
            const error = result;
            return res.status(error.statusCode).json({ error: error.error, statusCode: error.statusCode }) //có error => statusCode = statusCode cloudflare && error message = message cloudflare trả về
        }
        res.status(201).json({data: result})
    } catch (error) {
        res.status(500).json({message: 'Can not create new record'})
    }
}

//Tìm kiếm record  theo name
async function searchDnsRecord(req, res) {
    try {
        const searchValue = req.params.name;
        const zone_id = req.params.zone_id
        const result = await dnsService.findDnsRecordByName(zone_id, searchValue);
        if(result.error){
            const error = result;
            return res.status(error.statusCode).json({ error: error.error, statusCode: error.statusCode }) //có error => statusCode = statusCode cloudflare && error message = message cloudflare trả về
        }
        if(result == (0)){
            return res.status(200).json({ message: 'Empty'}) //check nếu search ra giá trị null thì return message Empty
        }
        res.status(200).json({data: result})
    } catch (error) {
        res.status(500).json({message: 'Can not search a record'})
    }
}

//Xóa record theo recordID
async function deleteDnsRecord(req, res) {
    try {
        const recordID = req.params.id;
        const zone_id = req.params.zone_id;
        const result = await dnsService.deleteDnsRecord(zone_id, recordID);
        if(result.error){
            const error = result;
            return res.status(error.statusCode).json({ error: error.error, statusCode: error.statusCode }) //có error => statusCode = statusCode cloudflare && error message = message cloudflare trả về
        }
        res.status(201).json({data: result})
    } catch (error) {
        res.status(500).json({message: 'Can not delete a record'})
    }
}

//Update thông tin record theo recordID
async function updateDnsRecord(req, res) {
    try {
        const updateData = req.body
        const recordID = req.params.id
        const zone_id = req.params.zone_id
        const result = await dnsService.updateDnsRecord(zone_id, recordID, updateData);
        if(result.error){
            const error = result;
            return res.status(error.statusCode).json({ error: error.error, statusCode: error.statusCode }) //có error => statusCode = statusCode cloudflare && error message = message cloudflare trả về
        }
        res.status(201).json({data: result})
    } catch (error) {
        res.status(500).json({message: 'Can not update a record'})
    }
}

module.exports = {
    getListDnsRecord,
    createDnsRecord,
    searchDnsRecord,
    deleteDnsRecord,
    updateDnsRecord
}