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
 * @returns {Promise<{data: *, message: string, isSuccess: boolean}>}
 */
async function getOdooInvoice(userId, dbName,
                               lang, password) {

    const company = await isExistCompanyByDbName(userId, dbName);
    const params = `?dbname=${dbName}&lang=${lang}&password=${password}`;
    const url = `https://${dbName}.${process.env.ROOT_ODOO_DOMAIN}/web/database/invoices${params}`;
    try {
        const result = await axios.axiosPost(url, data, {
            'API_KEY': company.apiKey
        });

        return {
            message: "Successfully get invoices",
            isSuccess: true,
            data: result
        };

    } catch (error) {
        throw new Error("Error at getting invoices: " + error.message);
    }

}


module.exports = {
    getOdooInvoice
}