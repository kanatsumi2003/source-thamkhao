const odooUserServices = require('../services/odooService/odooUserService');

async function getOdooUser(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooUser"]
    try {
        const {master_pwd, lang, password} = req.body;
        const userId = req.user.userId;
        const dbname = req.user.dbname;
        const {message, isSuccess, data} = await odooUserServices
            .getOdooUserList(userId, dbname, master_pwd, lang, password);
        if (isSuccess) {
            res.status(200).json({message, data});
        } else {
            res.status(400).json({message, data});
        }
    } catch (error) {
        res.status(500).json({message: "Error getting Odoo User", error});
    }
}

async function getOdooUserRole(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooUser"]
    try {
        const {master_pwd, lang, password} = req.body;
        const userId = req.user.userId;
        const dbname = req.user.dbname;

        const {message, isSuccess, data} = await odooUserServices
            .GetOdooRole(userId, dbname, master_pwd, lang, password);
        if (isSuccess) {
            res.status(200).json({message, data});
        } else {
            res.status(400).json({message, data});
        }
    } catch (error) {
        res.status(500).json({message: "Error getting Odoo Role", error});
    }
}

module.exports = {
    getOdooUser,
    getOdooUserRole
}