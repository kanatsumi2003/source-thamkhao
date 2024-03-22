const { default: axios } = require("axios");
const mongoService = require("./mongoService");
const { DnsRecord, DnsRecordWithBase } = require("../../models/dnsRecordModel");
const axiosUtil = require("../../utils/axiosUtil");

require("dotenv").config();

const CLOUD_FLARE_API = process.env.CLOUD_FLARE_API;
const DNS_RECORD_URL = `${CLOUD_FLARE_API}/zones`;
const CLOUD_FLARE_AUTH_TOKEN = process.env.TOKEN; //Token header

async function getAllDnsRecords(zone_id) {
  const url = `${DNS_RECORD_URL}/${zone_id}/dns_records`; //URL dns records
  const headers = {
    Authorization: `Bearer ${CLOUD_FLARE_AUTH_TOKEN}`,
    "Content-Type": "application/json",
  };
  const data = await axiosUtil
    .axiosGet(url, headers)
    .then((response) => {
      const result = response.data.result;
      console.log(result.map((data) => new DnsRecord(data))); //Return ra giá trị dựa theo dnsRecordModel
      return result.map((data) => new DnsRecord(data));
    })
    .catch((error) => {
      return {
        error: error.response.data.errors, //có lỗi sẽ return ra message + statusCode
        statusCode: error.response.status,
      };
    });
  return data;
}

async function createDnsRecord(zone_id, postData) {
  const url = `${DNS_RECORD_URL}/${zone_id}/dns_records`; //URL dns records
  const headers = {
    Authorization: `Bearer ${CLOUD_FLARE_AUTH_TOKEN}`,
    "Content-Type": "application/json",
  };
  const _postData = {
    type: postData.type, //A, Cname, TXT
    name: postData.name, //subdomain.domainname.com
    content: postData.content, //ipv4 address (A), domainname (Cname)
  };
  const data = await axiosUtil
    .axiosPost(url, _postData, headers)
    .then((response) => {
      const result = response.data.result;
      const dns = new DnsRecord(result); //Return ra giá trị dựa theo dnsRecordModel
      console.log(dns);
      return dns;
    })
    .catch((error) => {
      return {
        error: error.response.data.errors, //có lỗi sẽ return ra message + statusCode
        statusCode: error.response.status,
      };
    });
  return data;
}

async function findDnsRecordByName(zone_id, searchValue) {
  const url = `${DNS_RECORD_URL}/${zone_id}/dns_records`; //URL dns records
  const headers = {
    Authorization: `Bearer ${CLOUD_FLARE_AUTH_TOKEN}`,
    "Content-Type": "application/json",
  };
  const params = {
    name: searchValue,
  };
  const data = await axiosUtil
    .axiosSearch(url, params, headers)
    .then((response) => {
      const result = response.data.result;
      console.log(result.map((data) => new DnsRecord(data))); //Return ra giá trị dựa theo dnsRecordModel
      return result.map((data) => new DnsRecord(data));
    })
    .catch((error) => {
      return {
        error: error.response.data.errors, //có lỗi sẽ return ra message + statusCode
        statusCode: error.response.status,
      };
    });
  return data;
}

async function deleteDnsRecord(zone_id, recordID) {
  const url = `${DNS_RECORD_URL}/${zone_id}/dns_records/${recordID}`; //cần đưa vào zone_id và recordID
  const headers = {
    Authorization: `Bearer ${CLOUD_FLARE_AUTH_TOKEN}`,
    "Content-Type": "application/json",
  };
  const data = await axiosUtil
    .axiosDelete(url, headers)
    .then((response) => {
      const result = response.data.result;
      const dnsRecord = new DnsRecord(result); //Return ra giá trị dựa theo dnsRecordModel
      console.log(dnsRecord);
      return dnsRecord; //sau đó return về những giá trị != undefined
    })
    .catch((error) => {
      return {
        error: error.response.data.errors, //có lỗi sẽ return ra message + statusCode
        statusCode: error.response.status,
      };
    });
  return data;
}

async function updateDnsRecord(zone_id, recordID, updateData) {
    const url = `${DNS_RECORD_URL}/${zone_id}/dns_records/${recordID}` //cần đưa vào zone_id và recordID
    const headers = {
        'Authorization': `Bearer ${CLOUD_FLARE_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
    }
    const data = await axiosUtil.axiosPatch(url, updateData, headers)
    .then(response => {
        const result = response.data.result;
        const dns = new DnsRecord(result); //Return ra giá trị dựa theo dnsRecordModel
        console.log(dns);
        return dns;
    }).catch(error => {
        return {
            error: error.response.data.errors,
            statusCode: error.response.status
        }
    })
    return data;
}

module.exports = {
  getAllDnsRecords,
  createDnsRecord,
  findDnsRecordByName,
  deleteDnsRecord,
  updateDnsRecord,
};
