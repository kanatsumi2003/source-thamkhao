//các hàm liên quan report

const axios = require("../../../utils/axiosUtil");
const { isExistCompanyByDbName } = require("../companyService");
const stringUtil = require("../../../utils/stringUtil");
/**
 * Get invoices from Odoo
 * @param userId
 * @param dbName
 * @param lang
 * @param password
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function getOdooInvoice(data) {
  try {
    const dbName = data.dbName;
    const company = await isExistCompanyByDbName(dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/invoices`;

    let hashString = `${dbName}${company.apiKey}`;
    const privateKey = stringUtil.hmacSHA512Hash(hashString);
    
    const paramsData = {
      dbname: dbName,
      privatekey: privateKey,
      timestamp: stringUtil.generateTimeStamp(),
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const result = await axios
      .axiosGetWithData(url, paramsData, headers)
      .catch((error) => {
        throw new Error(error.response.data.error);
      });
    return {
      status: result.status,
      responseData: result.data,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getOdooInvoice,
};
