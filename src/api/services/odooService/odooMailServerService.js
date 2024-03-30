const {isExistCompanyByDbName} = require('../companyService');
const axios = require('../../../utils/axiosUtil');

async function setUpOutGoingMail(userId, dbName, email, password, name, isDefault) {

    await isExistCompanyByDbName(userId, dbName);

    try {

        const url = `https://${process.env.ROOT_ODOO_DOMAIN}/web/mail_server/setup_outgoing_mail`;

        const data = {
            dbname : dbName,
            email : email,
            password : password,
            name : name,
            isDefault : isDefault
        };

        const { success, message } = await axios.axiosPost(url, data, {});

        return {
            message: message,
            isSuccess : success,
            data: null
        };

    } catch (error) {
        throw new Error("Error at set up out going email: " + error.message);
    }
}

module.exports = {
    setUpOutGoingMail
}