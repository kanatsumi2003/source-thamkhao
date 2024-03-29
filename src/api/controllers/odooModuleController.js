const odooModuleService = require('../services/odooService/odooModuleService');
const {fetchAzureKMSToken} = require("mongodb/src/client-side-encryption/providers/azure");
async function activateOdooModule(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const {master_pwd, lang, password, moduleId} = req.body;
        const dbname = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooModuleService.activateModule(userId, master_pwd, dbname, lang, password, moduleId);
        if (isSuccess) {
            res.status(200).json({ message, data });
        } else {
            res.status(400).json({ message, data });
        }
    } catch (error) {
        res.status(500).json({ message: "Error activating Odoo Module", error });
    }
}

async function deactivateOdooModule(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const {master_pwd, lang, password, moduleId} = req.body;
        const dbname = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooModuleService.deactivateModule(userId, master_pwd, dbname, lang, password, moduleId);
        if (isSuccess) {
            res.status(200).json({ message, data });
        } else {
            res.status(400).json({ message, data });
        }
    } catch (error) {
        res.status(500).json({ message: "Error activating Odoo Module", error });
    }
}

async function upgradeOdooModule(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const {master_pwd, lang, password, moduleId} = req.body;
        const dbname = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooModuleService.upgradeModule(userId, master_pwd, dbname, lang, password, moduleId);
        if (isSuccess) {
            res.status(200).json({ message, data });
        } else {
            res.status(400).json({ message, data });
        }
    } catch (error) {
        res.status(500).json({ message: "Error activating Odoo Module", error });
    }
}

async function getAllOdooModules(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const {moduleId} = req.body;
        const dbname = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooModuleService.getAllModules(userId, dbname, moduleId);
        if (isSuccess) {
            res.status(200).json({ message, data });
        } else {
            res.status(400).json({ message, data });
        }
    } catch (error) {
        res.status(500).json({ message: "Error activating Odoo Module", error });
    }
}

async function getActivateOdooModules(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const dbname = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooModuleService.getActivatedModules(userId, dbname);
        if (isSuccess) {
            res.status(200).json({ message, data });
        } else {
            res.status(400).json({ message, data });
        }
    } catch (error) {
        res.status(500).json({ message: "Error getting activate Odoo Module", error });
    }
}

async function getUnactivatedOdooModules(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const dbname = req.user.dbname;
        const userId = req.user.userId;
        const {message, isSuccess, data} = await odooModuleService.getUnactivatedModules(userId, dbname);
        if (isSuccess) {
            res.status(200).json({ message, data });
        } else {
            res.status(400).json({ message, data });
        }
    } catch (error) {
        res.status(500).json({ message: "Error getting un-activate Odoo Module", error });
    }
}

module.exports = {
    activateOdooModule,
    deactivateOdooModule,
    upgradeOdooModule,
    getAllOdooModules,
    getActivateOdooModules,
    getUnactivatedOdooModules
}