const {isExistCompanyByDbName} = require('../companyService');
const axios = require('../../../utils/axiosUtil');
//các hàm liên quan module
//lay DB name -> get cai company -> sosanh userid == user hien tai

/**
 * Activate Module
 * @param userId
 * @param master_pwd
 * @param dbname
 * @param lang
 * @param password
 * @param moduleId
 * @returns {Promise<{data: axios.AxiosResponse<any>, message: string, isSuccess: boolean}>}
 */
async function activateModule(userId, master_pwd, dbname,
                                lang, password, moduleId) {

    // Check the company is existed and the user is authorized to perform this action
    const company = await isExistCompanyByDbName(dbname);

    const url = `https://${dbname}.${process.env.ROOT_ODOO_DOMAIN}/web/database/modules`;

    try {
        const data = {
            master_pwd: master_pwd,
            name: dbname,
            lang: lang,
            password: password,
            moduleId: moduleId
        };

        const result = await axios.axiosPost(url, data, {
                'API_KEY': company.apiKey
            });

        return {
            message: "Module activated",
            isSuccess: true,
            data: result
        };

    } catch (error) {
        throw new Error("Error activating odoo module: " + error.message);
    }
}

/**
 * Deactivate module
 * @param userId
 * @param master_pwd
 * @param dbName
 * @param lang
 * @param password
 * @param moduleId
 * @returns {Promise<{data: *, message: string}>}
 */
async function deactivateModule(userId, master_pwd, dbName,
                                lang, password, moduleId) {

    const company = await isExistCompanyByDbName(userId, dbName);

    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/modules`;

    try {
        const data = {
            master_pwd: master_pwd,
            dbname: dbName,
            lang: lang,
            password: password,
            moduleId: moduleId
        };

        const result = await axios.axiosDelete(url, data, {
            'API_KEY': company.apiKey
        });

        return {
            message: "Successfully deactivate module",
            isSuccess: true,
            data: result
        };

    } catch (error) {
        throw new Error("Error at deactivate module: " + error.message);
    }
}

/**
 * Upgrade module data
 * @param userId
 * @param master_pwd
 * @param dbName
 * @param lang
 * @param password
 * @param moduleId
 * @returns {Promise<{data: axios.AxiosResponse<any>, message: string}>}
 */
async function upgradeModule(userId, master_pwd, dbName, lang, password, moduleId) {
    const company = await isExistCompanyByDbName(userId, dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/modules`;
    try {
        const data = {
            master_pwd: master_pwd,
            dbname: dbName,
            lang: lang,
            password: password,
            moduleId: moduleId
        };

        const result = await axios.axiosPatch(url, data, {
            'API_KEY': company.apiKey
        });

        return {
            message: "Successfully upgrade module",
            isSuccess: true,
            data: result
        };

    } catch (error) {
        throw new Error("Error at deactivate module: " + error.message);
    }
}

/**
 * Get all modules via DBName
 * @param userId
 * @param dbName
 * @param moduleId
 * @returns {Promise<{data: axios.AxiosResponse<any>, message: string}>}
 */
async function getAllModules(userId, dbName, moduleId) {
    const company = await isExistCompanyByDbName(userId, dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/modules`;

    const data = {
        dbname: dbName,
        moduleId: moduleId
    }
    try {
        const result = await axios.axiosPost(url, data, {
            'API_KEY': company.apiKey
        });

        return {
            message: "Successfully get all modules",
            isSuccess: true,
            data: result
        };

    } catch (error) {
        throw new Error("Error at deactivate module: " + error.message);
    }
}

/**
 * Get activated modules
 * @param userId
 * @param dbName
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function getActivatedModules(userId, dbName) {

    const company = await isExistCompanyByDbName(userId, dbName);
    const url = `https://${process.env.ROOT_ODOO_DOMAIN}/web/database/activated_modules?dbname=${dbName}`;

    const data = {
        dbname: dbName
    }
    try {
        const result = await axios.axiosGet(url, data, {});

        return {
            message: "Successfully get activated modules",
            isSuccess: true,
            data: result
        };

    } catch (error) {
        throw new Error("Error at get activated modules: " + error.message);
    }
}

/**
 * Get unactivated modules
 * @param userId
 * @param dbName
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function getUnactivatedModules(userId, dbName) {

    const company = await isExistCompanyByDbName(userId, dbName);
    const url = `https://${process.env.ROOT_ODOO_DOMAIN}/web/database/unactivated_modules?dbname=${dbName}`;

    const data = {
        dbname: dbName
    }
    try {
        const result = await axios.axiosGet(url, data, {});

        return {
            message: "Successfully get unactivated modules",
            isSuccess: true,
            data: result
        };

    } catch (error) {
        throw new Error("Error at get unactivated modules: " + error.message);
    }
}

module.exports = {
    activateModule,
    deactivateModule,
    upgradeModule,
    getAllModules,
    getActivatedModules,
    getUnactivatedModules
}