//các apoi gọi tới odoo liên quan user;

const {getCompanyByDbName, isExistCompanyByDbName} = require("../companyService");
const axios = require("../../../utils/axiosUtil");

/**
 * Get users from Odoo
 * @param userId
 * @param dbName
 * @returns {Promise<{data: *, message: string}>}
 */
async function getOdooUserList(userId, dbName) {

    const company = await isExistCompanyByDbName(userId, dbName);

    const params = `?dbname=${dbName}`;
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/users${params}`;

    try {
        const result = await axios.axiosGet(url, {
            'API_KEY': company.apiKey
        });
        return {
            message: "Successfully get users",
            data: result
        };

    } catch (error) {
        throw new Error("Error at getting users: " + error.message);
    }
}

/**
 * Get roles from Odoo
 * @param userId
 * @param dbName
 * @returns {Promise<{data: *, message: string}>}
 */
async function GetOdooRole(userId, dbName) {
    const company = await isExistCompanyByDbName(userId, dbName);
    const params = `?dbname=${dbName}`;
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/roles${params}`;
    try {
        const result = await axios.axiosGet(url, {
            'API_KEY': company.apiKey
        });

        return {
            message: "Successfully get roles",
            data: result
        };

    } catch (error) {
        throw new Error("Error at getting role: " + error.message);
    }
}

module.exports = {
    getOdooUserList,
    GetOdooRole
}