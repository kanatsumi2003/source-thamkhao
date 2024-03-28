//các apoi gọi tới odoo liên quan user;

const {getCompanyByDbName, isExistCompanyByDbName} = require("../companyService");
const axios = require("../../../utils/axiosUtil");

/**
 * Get users from Odoo
 * @param userId
 * @param dbName
 * @param master_pwd
 * @param lang
 * @param password
 * @returns {Promise<{data: *, message: string}>}
 */
async function getOdooUserList(userId, dbName, master_pwd,
                               lang, password) {

    const company = await isExistCompanyByDbName(userId, dbName);

    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/users`;

    try {
        const data = {
            master_pwd: master_pwd,
            dbname: dbName,
            lang: lang,
            password: password,
        };

        const result = await axios.axiosPost(url, data, {
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
 * @param master_pwd
 * @param lang
 * @param password
 * @returns {Promise<{data: *, message: string}>}
 * @constructor
 */
async function GetOdooRole(userId, dbName, master_pwd, lang, password) {

    const company = await isExistCompanyByDbName(userId, dbName);

    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/roles`;

    try {
        const data = {
            master_pwd: master_pwd,
            dbname: dbName,
            lang: lang,
            password: password,
        };

        const result = await axios.axiosPost(url, data, {
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