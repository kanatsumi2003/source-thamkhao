const odooDatabaseService = require('../services/odooService/odooDatabaseServices');

async function duplicateDatabases(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooDatabase"]
    try {
        const {lang, password, login, phone, newDbName} = req.body;
        const userId = req.user.userId;
        const dbName = req.user.dbname;
        const {message, isSuccess, data} = await odooDatabaseService
            .duplicateOdooDatabase(userId, dbName, lang, password, login, phone, newDbName);
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
        const {stringName, password} = req.body;
        const dbName = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooDatabaseService
            .stopDatabase(userId, dbName, stringName, password);
        if (isSuccess) {
            res.status(201).json({message, data});
        } else {
            res.status(400).json({message, data});
        }
    } catch (error) {
        res.status(500).json({message: "Error stopping Odoo Database", error});
    }
}

async function changeOdooDBName(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooDatabase"]
    try {
        const {newDbName} = req.body;
        const dbName = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooDatabaseService
            .changeDBName(userId, dbName, newDbName);
        if (isSuccess) {
            res.status(201).json({message, data});
        } else {
            res.status(400).json({message, data});
        }
    } catch (error) {
        res.status(500).json({message: "Error changing Odoo Database Name", error});
    }
}

async function changeOdooDBPassword(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooDatabase"]
    try {
        const {newPassword} = req.body;
        const dbName = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooDatabaseService
            .changeDBPassword(userId, dbName, newPassword);
        if (isSuccess) {
            res.status(201).json({message, data});
        } else {
            res.status(400).json({message, data});
        }
    } catch (error) {
        res.status(500).json({message: "Error changing Odoo Database Password", error});
    }
}

module.exports = {
    duplicateDatabases,
    stopOdooDatabase,
    changeOdooDBName,
    changeOdooDBPassword
}