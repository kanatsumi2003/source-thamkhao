//các hàm liên quan report

const axios = require("../../../utils/axiosUtil");
const {isExistCompanyByDbName} = require("../companyService");

/**
 * Get invoices from Odoo
 * @param userId
 * @param dbName
 * @param master_pwd
 * @param lang
 * @param password
 * @returns {Promise<{data: *, message: string}>}
 */
async function getOdooInvoice(userId, dbName, master_pwd,
                               lang, password) {

    const company = await isExistCompanyByDbName(userId, dbName);

    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/invoices`;

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
            message: "Successfully get invoices",
            data: result
        };

    } catch (error) {
        throw new Error("Error at getting invoices: " + error.message);
    }

}


module.exports = {
    getOdooInvoice
}