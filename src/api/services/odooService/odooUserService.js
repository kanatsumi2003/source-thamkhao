//các apoi gọi tới odoo liên quan user;

const {
  getCompanyByDbName,
  isExistCompanyByDbName,
} = require("../companyService");
const axios = require("../../../utils/axiosUtil");
const stringUtil = require("../../../utils/stringUtil");
/**
 * Get users from Odoo
 * @param dbName
 * @returns {Promise<{data: *, message: string}>}
 */
async function getOdooUserList(data) {
  try {
    const { dbName } = data;
    const company = await isExistCompanyByDbName(dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/users`;

    const hashString = `${dbName}${company.apiKey}`;
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
      responseData: result.data,
      status: result.status,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get roles from Odoo
 * @param userId
 * @param dbName
 * @returns {Promise<{data: *, message: string}>}
 */
async function GetOdooRole(data) {
  try {
    const { dbName } = data;
    const company = await isExistCompanyByDbName(dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/roles`;

    const hashString = `${dbName}${company.apiKey}`;
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
      responseData: result.data,
      status: result.status,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getOdooUserList,
  GetOdooRole,
};
