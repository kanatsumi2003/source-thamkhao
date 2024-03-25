//các hàm liên quan report

const axios = require("../../../utils/axiosUtil");
const {getCompanyByDbName} = require("../companyService");

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

    const company = await checkUserExist(userId, dbName);

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

/**
 * Check if the user exists
 * @param userId
 * @param dbName
 * @returns {Promise<*>}
 * @throws Error if the user does not exist
 */
checkUserExist = async (userId, dbName) => {
    const company = await getCompanyByDbName(dbName);
    if (!company) {
        throw new Error("Company not found");
    }

    if (company.userId !== userId) {
        throw new Error("You are not authorized to perform this action.");
    }

    return company;
};

module.exports = {
    getOdooInvoice
}