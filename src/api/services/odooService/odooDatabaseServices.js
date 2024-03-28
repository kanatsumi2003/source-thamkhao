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
 * @param master_pwd unknown need more information
 * @param dbName the database name
 * @param lang the language
 * @param password the database password
 * @param login user name
 * @param phone phone number
 * @returns {Promise<{data: *, message: string}>}
 */
// async function createOdooDatabase(userId, master_pwd, dbName, lang,
//                                   password, login, phone) {
//     try {

//         const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/create`;

//         const data = {
//             master_pwd: master_pwd,
//             name: dbName,
//             lang: lang,
//             password: password,
//             login: login,
//             phone: phone,
//         };

//         const result = await axios.axiosPost(url,
//             data, {});

//         return {
//             message: "Database created",
//             isSuccess: true,
//             data: result
//         };
//     } catch (error) {
//         throw new Error("Error creating odoo database: " + error.message);
//     }
// }
async function createOdooDatabase(data) {
    try {

        const url = `https://${data.name}.${process.env.ROOT_ODOO_DOMAIN}/web/database/create`;

        const postData = {
            name: data.name,
            lang: data.lang,
            password: data.password, 
            login: data.login,
            phone: data.phone,
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        const params = new URLSearchParams(postData).toString();

        const result = await axios.axiosPost(url, params, headers);

        return {
            message: "Database created",
            isSuccess: true,
            data: result
        };
    } catch (error) {
        return {
            error: error.message,
            statusCode: error.status
        }
    }
}

/**
 * Duplicate an Odoo database
 * @param userId the user id
 * @param master_pwd unknown need more information
 * @param dbName the database name
 * @param lang the language
 * @param password the database password
 * @param login user name
 * @param phone phone number
 * @param newDbName the new database name
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function duplicateOdooDatabase(userId, master_pwd, dbName, lang,
                                     password, login, phone, newDbName) {

    await isExistCompanyByDbName(userId, dbName);

    try {

        const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/duplicate`;

        const data = {
            master_pwd: master_pwd,
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
 * @param master_pwd unknown need more information
 * @param stringName unknown need more information
 * @param password the database password
 * @returns {Promise<{data: *, message: string}>}
 */
async function stopDatabase(userId, dbName, master_pwd,
                            stringName, password) {

    await isExistCompanyByDbName(userId, dbName);

    try {

        const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/stop`;

        const data = {
            master_pwd: master_pwd,
            name: dbName,
            stringName: stringName,
            password: password
        };

        const { success, message } = await axios.axiosPost(url,
            data, {});

        return {
            message: "Database duplicated",
            data: {
                success,
                message
            }
        };

    } catch (error) {
        throw new Error("Error duplicating odoo database: " + error.message);
    }
}

module.exports = {
    createOdooDatabase,
    duplicateOdooDatabase,
    stopDatabase,
};
