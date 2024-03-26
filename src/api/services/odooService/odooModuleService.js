const { getCompanyByDbName, isExistUserByDbName} = require('../companyService');
const axios = require('../../../utils/axiosUtil');
//các hàm liên quan module
//lay DB name -> get cai company -> sosanh userid == user hien tai

async function activeOdooModule(userId, master_pwd, dbname,
                                lang, password, moduleId) {

    const company = await isExistUserByDbName(dbname);

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

    const company = await isExistUserByDbName(userId, dbName);

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
            data: result
        };

    } catch (error) {
        throw new Error("Error at deactivate module: " + error.message);
    }
}

module.exports = {
    activeOdooModule,
    deactivateModule
}