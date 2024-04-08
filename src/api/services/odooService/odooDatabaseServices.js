const axios = require("../../../utils/axiosUtil");
const { getUserById } = require("../userService");
const {
  getCompanyByDbName,
  isExistCompanyByDbName,
  updateCompany,
  getCompanyByUserId,
} = require("../companyService");
require('dotenv').config();

const stringUtil = require("../../../utils/stringUtil");

//các hàm liên quan database
//tokenInfo.dbname => company => apikey
//dbname.domain.com/duodwngf dan api (apikey trong header)

//input [dbname, userid( nguoi dang login cua web nay, ko phair odoo, dua tren authenticate), option params addon]=> verify=> apikey cua company => goi api odoo

/**
 * Create a new Odoo database
 * @param userId the user id
 * @param dbName the database name
 * @param lang the language
 * @param password the database password
 * @param login user name
 * @param phone phone number
 * @returns {Promise<{data: *, message: string}>}
 */
async function createOdooDatabase(data) {
  try {
    const url = `https://${data.name}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/create`;
    const hashString = `${data.name}${data.login}` 
    const privateKey = stringUtil.hmacSHA512Hash(hashString); 
    const postData = {
      privatekey: privateKey,
      timestamp: stringUtil.generateTimeStamp(),
      name: data.name,
      lang: data.lang,
      password: data.password,
      login: data.login,
      phone: data.phone,
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const result = await axios.axiosPost(url, postData, headers);

    return {
      message: "Database created",
      isSuccess: true,
      data: result,
    };
  } catch (error) {
    return {
      error: error.message,
      statusCode: error.status,
    };
  }
}

/**
 * Duplicate an Odoo database
 * @param dbName the database name
 * @param newDbName the new database name
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function duplicateOdooDatabase(data) {
  try {
    const {dbName, newDbName} = data;
    const company = await getCompanyByDbName(dbName);
    if(company == null) throw new Error("There is no company");
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/duplicate`;
    let hashString = `${dbName}${company.apiKey}`
    const privateKey = stringUtil.hmacSHA512Hash(hashString);
    const postData = {
      dbname: dbName,
      new_name: newDbName,
      timestamp: stringUtil.generateTimeStamp(),
      privatekey: privateKey,
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const result = await axios.axiosPost(url, postData, headers);

    return {
      message: "Duplicate database successfully",
      isSuccess: true,
    };
  } catch (error) {
    throw new Error("Error duplicating odoo database: " + error.message);
  }
}

/**
 * Stop an Odoo database
 * @param dbName the database name
 * @returns {Promise<{data: *, message: string}>}
 */
async function stopDatabase(data) {
  try {
    const dbName = data.dbName;
    const company = await getCompanyByDbName(dbName);
    
    if (company == null) throw new Error("There is no company");

    const hashString = `${dbName}${company.apiKey}`;
    let privateKey = stringUtil.hmacSHA512Hash(hashString);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/stop`;
    
    let { newDbName, deActivateDbCode } =
      stringUtil.generateDbNameWhenInactivateDb(dbName);

    const postData = {
      privatekey: privateKey,
      timestamp: stringUtil.generateTimeStamp(),
      dbname: dbName,
      stringName: deActivateDbCode,
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const result = await axios.axiosPost(url, postData, headers);
    if (!result.error) {
      company.dbName = newDbName;
      await updateCompany(company._id, company);
    }
    return {
      message: result.data.message,
      isSuccess: result.data.success,
    };
  } catch (error) {
    throw new Error("Error duplicating odoo database: " + error.message);
  }
}

/**
 * Change the name of an Odoo database
 * @param {string} userId the user id
 * @param {string} dbName the database name
 * @param {string} newDbName the new database name
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function changeDBName(data) {
  try {
    const {userId, newDbName} = data;
    const company = getCompanyByUserId(userId)
    const url = `https://${company.dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/change_name`;
    const data = {
      name: dbName,
      new_name: newDbName,
    };
    const { success, message } = await axios.axiosPost(url, data, {
      API_KEY: company.apiKey,
    });
    return {
      message: message,
      isSuccess: success,
      data: null,
    };
  } catch (e) {
    throw new Error("Error changing odoo database name: " + e.message);
  }
}

async function changeDBPassword(userId, dbName, password, newPassword) {
  ///const company = await isExistCompanyByDbName(userId, dbName);
  const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/change_password`;
  try {
    const data = {
      password: password,
      new_password: newPassword,
    };
    const { success, message } = await axios.axiosPost(url, data, {});
    return {
      message: message,
      isSuccess: success,
      data: null,
    };
  } catch (e) {
    throw new Error("Error changing odoo database password: " + e.message);
  }
}
/**
 * Start the database again
 * @param dbName
 * @returns {Promise<{data: {success: string, message: string}, message: string}>}
 */
async function startDatabaseAgain(data) {
  try {
    
    const deActivatedDbName = data.dbName;
    const company = await getCompanyByDbName(deActivatedDbName);
    const originalName = stringUtil.splitDbNameIntoOriginal(deActivatedDbName);
    
    const url = `https://${originalName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/start`;
    const postData = {
      original_name: originalName,
      new_name: deActivatedDbName,
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const result = await axios.axiosPost(url, postData, headers);
    if(!result.error) {
      company.dbName = originalName;
      await updateCompany(company._id, company);
    }

    return {
      message: result.data.message,
      isSuccess: result.data.success,
    };
  } catch (error) {
    throw new Error("Error at start database again: " + error.message);
  }
}

module.exports = {
  createOdooDatabase,
  duplicateOdooDatabase,
  stopDatabase,
  changeDBName,
  changeDBPassword,
  startDatabaseAgain,
};
