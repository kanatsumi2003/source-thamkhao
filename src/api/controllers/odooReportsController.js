const odooReportService = require('../services/odooService/odooReportService');

async function getOdooInvoice(req, res) {
    try {
        const {master_pwd, lang, password} = req.body;
        const userId = req.user.userId;
        const dbName = req.user.dbName;
        const {message, data, isSuccess} = await odooReportService.getOdooInvoice(userId, dbName, master_pwd, lang, password);

        if (isSuccess) {
            res.status(200).json({message, data});
        } else {
            res.status(400).json({message});
        }
    } catch (error) {
        res.status(500).json({message: "Error get Odoo Invoice", error});
    }
}

module.exports = {
    getOdooInvoice
}