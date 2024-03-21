const { default: axios } = require('axios');
const mongoService = require('./mongoService');
const { Dns, DnsWithBase } = require('../../models/dnsModel');
require('dotenv').config();
//token lay tu env
//them api de update token
//dnsModel la info ve dns
//dnsRecordModel la cac info ve subdomain
//tim hieu tags locked, meta

async function getAllDnsRecords(url, zone_id, authorization_token) {
    try {
        const response = await axios.get(`${url}/zones/${zone_id}/dns_records`, {
            headers: {
                'Authorization': `Bearer ${authorization_token}`,
                'Content-Type': 'application/json',
            }
        });
        const result = response.data.result
        console.log(result.map(data => new Dns(data)));
        return await result.map(data => new Dns(data));
    } catch (error) {
        console.log(error.message);
    }
}

async function createDnsRecord(url, zone_id, authorization_token, dnsData) {
    try {
        const postData = {
            type: dnsData.type,
            name: dnsData.name, //nho comment
            content: dnsData.content
        }
        const response = await axios.post(`${url}/zones/${zone_id}/dns_records`, postData, {
            headers: {
                'Authorization': `Bearer ${authorization_token}`,
                'Content-Type': 'application/json',
            }
        })
        const result = response.data.result;
        
        const dns = new Dns(result);
        console.log(dns)
        return dns;
    } catch (error) {
        throw new Error('Error: ' + error.message);
    }
}

async function findDnsRecordByName(url, zone_id, authorization_token, searchValue) {
    try {
        const response = await axios.get(`${url}/zones/${zone_id}/dns_records`, {
            headers: {
                'Authorization': `Bearer ${authorization_token}`,
                'Content-Type': 'application/json',
            },
            params: {
                name: searchValue
            }
        })

        const result = response.data.result;
        if (result == (0)) {
            throw new Error('Record not found')
        }

        console.log(result.map(data => new Dns(data)));
        return await result.map(data => new Dns(data));
    } catch (error) {
        console.log(error.message)
    }
}

async function deleteDnsRecord(url, zone_id, authorization_token, dnsID) {
    try {
        const response = await axios.delete(`${url}/zones/${zone_id}/dns_records/${dnsID}`, {
            headers: {
                'Authorization': `Bearer ${authorization_token}`,
                'Content-Type': 'application/json',
            }
        })
        const result = response.data.result;
        if(result == null) throw new Error("Record not found");
        const dns = new Dns(result);

        console.log(dns);
        return dns;
    } catch (error) {
        console.log(error.message)
    }
}

async function updateDnsRecord(url, zone_id, authorization_token, dnsID, updateData){
    try {
        const response = await axios.patch(`${url}/zones/${zone_id}/dns_records/${dnsID}`, updateData, {
            headers: {
                'Authorization': `Bearer ${authorization_token}`,
                'Content-Type': 'application.json',
            }
        })
        const result = response.data.result;
        if(result == null) throw new Error("Record not found");
        const dns = new Dns(result);

        console.log(dns);
        return dns;
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    getAllDnsRecords,
    createDnsRecord,
    findDnsRecordByName,
    deleteDnsRecord,
    updateDnsRecord,
}