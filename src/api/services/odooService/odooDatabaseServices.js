const axios = require('../../../utils/axiosUtil');
const {getUserById} = require("../userService");

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
async function createOdooDatabase(userId, master_pwd, dbName, lang,
                                  password, login, phone) {
    try {

        const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/create`;

        const data = {
            master_pwd: master_pwd,
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
            data: result
        };
    } catch (error) {
        throw new Error("Error creating odoo database: " + error.message);
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
 * @returns {Promise<{data: *, message: string}>}
 */
async function duplicateOdooDatabase(userId, master_pwd, dbName, lang,
                                     password, login, phone, newDbName) {

    await checkUserExist(userId);

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
            message: "Database duplicated",
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
     await checkUserExist(userId);

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

/**
 * Check if the user exists
 * @param userId
 * @returns {Promise<void>}
 * @throws Error if the user does not exist
 */
checkUserExist = async (userId) => {
    const isUserExist = !!(await getUserById(userId));

    if (!isUserExist) {
        throw new Error("User does not exist");
    }
};

module.exports = {
    createOdooDatabase,
    duplicateOdooDatabase,
    stopDatabase,
};
