const { getCompanyByDbName } = require('../companyService');
const axios = require('../../../utils/axiosUtil');
//các hàm liên quan module
//lay DB name -> get cai company -> sosanh userid == user hien tai

async function activeOdooModule(userId, master_pwd, dbname,
                                lang, password, moduleId) {

    const company = await getCompanyByDbName(dbname);
    if (!company) {
        throw new Error("Company not found");
    }

    if (company.userId !== userId) {
        throw new Error("You are not authorized to perform this action.");
    }

    const url = `https://${dbname}.${process.env.ROOT_ODOO_DOMAIN}/web/database/modules`;

    try {
        const data = {
            master_pwd: master_pwd,
            name: dbname,
            lang: lang,
            password: password,
            modules: moduleId
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