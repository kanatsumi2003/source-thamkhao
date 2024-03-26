const odooDatabaseService = require('../services/odooService/odooDatabaseServices');

async function duplicateDatabases(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooDatabase"]
    try {
        const {master_pwd, lang, password, login, phone, newDbName} = req.body;
        const userId = req.user.userId;
        const dbName = req.user.dbname;
        const {message, isSuccess, data} = await odooDatabaseService
            .duplicateOdooDatabase(userId, master_pwd, dbName, lang, password, login, phone, newDbName);
        if (isSuccess) {
            res.status(201).json({message, data});
        } else {
            res.status(400).json({message, data});
        }
    } catch (error) {
        res.status(500).json({message: "Error duplicating Odoo Database", error});
    }
}

async function stopOdooDatabase(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooDatabase"]
    try {
        const {master_pwd, stringName, password} = req.body;
        const dbName = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooDatabaseService
            .stopDatabase(userId, dbName, master_pwd, stringName, password);
        if (isSuccess) {
            res.status(201).json({message, data});
        } else {
            res.status(400).json({message, data});
        }
    } catch (error) {
        res.status(500).json({message: "Error stopping Odoo Database", error});
    }
}

module.exports = {
    duplicateDatabases,
    stopOdooDatabase,
}