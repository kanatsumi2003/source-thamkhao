const {
  isExistCompanyByDbName,
  getCompanyByDbName,
} = require("../companyService");
const axios = require("../../../utils/axiosUtil");
const stringUtil = require("../../../utils/stringUtil");
//các hàm liên quan module
//lay DB name -> get cai company -> sosanh userid == user hien tai

/**
 * Activate Module
 * @param dbname
 * @param moduleId
 * @returns {Promise<{data: axios.AxiosResponse<any>, message: string, isSuccess: boolean}>}
 */
async function activateModule(data) {
  try {
    const { dbName, moduleId } = data;
    const company = await isExistCompanyByDbName(dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/modules`;

    const hashString = `${dbName}${company.apiKey}`;
    const privateKey = stringUtil.hmacSHA512Hash(hashString);

    const paramsData = {
      dbname: dbName,
      privatekey: privateKey,
      timestamp: stringUtil.generateTimeStamp(),
      moduleId: moduleId,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const result = await axios
      .axiosPost(url, paramsData, headers)
      .catch((error) => {
        throw new Error(error.response.data.error);
      });

    return {
      message: result.data.message,
      status: result.status,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Deactivate module
 * @param dbName
 * @param moduleId
 * @returns {Promise<{data: *, message: string}>}
 */
async function deactivateModule(data) {
  try {
    const { dbName, moduleId } = data;
    const company = await isExistCompanyByDbName(dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/modules`;

    let hashString = `${dbName}${company.apiKey}`;
    const privateKey = stringUtil.hmacSHA512Hash(hashString);

    const paramsData = {
      dbname: dbName,
      privatekey: privateKey,
      timestamp: stringUtil.generateTimeStamp(),
      moduleId: moduleId,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const result = await axios
      .axiosDeleteWithData(url, paramsData, headers)
      .catch((error) => {
        throw new Error(error.response.data.error);
      });

    return {
      message: result.data.message,
      status: result.status,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Upgrade module data
 * @param dbName
 * @param moduleId
 * @returns {Promise<{data: axios.AxiosResponse<any>, message: string}>}
 */
async function upgradeModule(data) {
  try {
    const { dbName, moduleId } = data;
    const company = await isExistCompanyByDbName(dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/modules`;

    let hashString = `${dbName}${company.apiKey}`;
    const privateKey = stringUtil.hmacSHA512Hash(hashString);

    const paramsData = {
      dbname: dbName,
      privatekey: privateKey,
      timestamp: stringUtil.generateTimeStamp(),
      moduleId: moduleId,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const result = await axios
      .axiosPatch(url, {}, headers, paramsData)
      .catch((error) => {
        throw new Error(error.response.data.error);
      });

    return {
      message: result.data.message,
      status: result.status,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get all modules via DBName
 * @param userId
 * @param dbName
 * @returns {Promise<{data: axios.AxiosResponse<any>, message: string}>}
 */
async function getAllModules(data) {
  try {
    const { dbName } = data;
    const company = await isExistCompanyByDbName(dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/modules`;

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
 * Get activated modules
 * @param dbName
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function getActivatedModules(data) {
  try {
    const { dbName } = data;
    const company = await isExistCompanyByDbName(dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/activated_modules/`;

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
    // const filterData = result.data.map(item => ({
    //     id: item.id,
    //     name: item.name
    // }))
    return {
      responseData: result.data,
      status: result.status,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get unactivated modules
 * @param userId
 * @param dbName
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function getUnactivatedModules(data) {
  try {
    const { dbName } = data;
    const company = await isExistCompanyByDbName(dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/databases/unactivated_modules`;

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
  activateModule,
  deactivateModule,
  upgradeModule,
  getAllModules,
  getActivatedModules,
  getUnactivatedModules,
};
