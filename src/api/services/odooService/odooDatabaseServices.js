const axios = require('../../../utils/axiosUtil');
const {getUserById} = require("../userService");
const {getCompanyByDbName, isExistCompanyByDbName} = require("../companyService");

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
async function createOdooDatabase(userId, dbName, lang,
                                  password, login, phone) {
    try {
        const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/create`;
        const data = {
            name: dbName,
            lang: lang,
            password: password,
            login: login,
            phone: phone,
        };

        const result = await axios.axiosPost(url,
            data, {});

        return {
            message: "Database created",
            isSuccess: true,
            data: result
        };
    } catch (error) {
        throw new Error("Error creating odoo database: " + error.message);
    }
}

/**
 * Duplicate an Odoo database
 * @param userId the user id
 * @param dbName the database name
 * @param lang the language
 * @param password the database password
 * @param login user name
 * @param phone phone number
 * @param newDbName the new database name
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function duplicateOdooDatabase(userId, dbName, lang,
                                     password, login, phone, newDbName) {

    await isExistCompanyByDbName(userId, dbName);

    try {

        const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/duplicate`;

        const data = {
            name: dbName,
            lang: lang,
            password: password,
            login: login,
            phone: phone,
            new_name: newDbName
        };

        const result = await axios.axiosPost(url,
            data, {});

        return {
            message: "Database duplicate successfully",
            isSuccess: true,
            data: result
        };

    } catch (error) {
        throw new Error("Error duplicating odoo database: " + error.message);
    }
}

/**
 * Stop an Odoo database
 * @param userId the user id
 * @param dbName the database name
 * @param stringName unknown need more information
 * @param password the database password
 * @returns {Promise<{data: *, message: string}>}
 */
async function stopDatabase(userId, dbName,
                            stringName, password) {

    await isExistCompanyByDbName(userId, dbName);

    try {

        const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/stop`;

        const data = {
            name: dbName,
            stringName: stringName,
            password: password
        };

        const { success, message } = await axios.axiosPost(url,
            data, {});

        return {
            message: message,
            isSuccess: success,
            data: null
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
async function changeDBName(userId, dbName, newDbName) {
    const company = await isExistCompanyByDbName(userId, dbName);
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/change_name`;
    try {
        const data = {
            name: dbName,
            new_name: newDbName
        };
        const {success, message} = await axios.axiosPost(url, data, {
            'API_KEY': company.apiKey
        });
        return {
            message: message,
            isSuccess: success,
            data: null
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
            new_password: newPassword
        };
        const {success, message} = await axios.axiosPost(url, data, {});
        return {
            message: message,
            isSuccess: success,
            data: null
        };
    } catch (e) {
        throw new Error("Error changing odoo database password: " + e.message);
    }
}
/**
 * Start the database again
 * @param originalName
 * @param newName
 * @param password
 * @returns {Promise<{data: {success: string, message: string}, message: string}>}
 */
async function startDatabaseAgain(originalName, newName, password) {

    try {

        const url = `https://${originalName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/start`;

        const data = {
            original_name: originalName,
            new_name: newName,
            password: password
        };

        const { success, message } = await axios.axiosPost(url,
            data, {});

        return {
           message: message,
           isSuccess: success,
           data: null
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
