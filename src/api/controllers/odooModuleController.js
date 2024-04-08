const odooModuleService = require('../services/odooService/odooModuleService');
const queue = require('../../utils/sendQueue');
// const {fetchAzureKMSToken} = require("mongodb/src/client-side-encryption/providers/azure");
async function activateOdooModule(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const message = {
            dbName: req.params.dbName,
            moduleId: req.body.moduleId,
        };
        const messageString = JSON.stringify(message);
        await queue.sendToQueue("activeOdooModule", Buffer.from(messageString));

        // const {message, status} = await odooModuleService.activateModule(data);
        // res.status(status).json({ message })
        res.status(200).json("Activating")
    } catch (error) {
        res.status(500).json({ message: "Error activating Odoo Module", error: error.message });
    }
}

async function deactivateOdooModule(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const message = {
            dbName: req.params.dbName,
            moduleId: req.body.moduleId,
        };
        const messageString = JSON.stringify(message);
        await queue.sendToQueue("deactiveOdooModule", Buffer.from(messageString));
        res.status(200).json("Deactivating");
    } catch (error) {
        res.status(500).json({ message: "Error deactivating Odoo Module", error: error.message });
    }
}

async function upgradeOdooModule(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const message = {
            dbName: req.params.dbName,
            moduleId: req.body.moduleId,
        };
        const messageString = JSON.stringify(message);
        await queue.sendToQueue("upgradeOdooModule", Buffer.from(messageString));
        res.status(200).json("Upgrading");
    } catch (error) {
        res.status(500).json({ message: "Error upgrading Odoo Module", error: error.message });
    }
}

async function getAllOdooModules(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const data = { 
            dbName: req.params.dbName,
        };
        const {responseData, status} = await odooModuleService.getAllModules(data);
        res.status(status).json({ responseData });
    } catch (error) {
        res.status(500).json({ message: "Error activating Odoo Module", error: error.message });
    }
}

async function getActivateOdooModules(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const data = {
            dbName: req.params.dbName,
        }
        const {responseData, status} = await odooModuleService.getActivatedModules(data);
        res.status(status).json({ responseData });
    } catch (error) {
        res.status(500).json({ message: "Error getting activate Odoo Module", error: error.message });
    }
}

async function getUnactivatedOdooModules(req, res){
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["OdooModule"]
    try {
        const data = { 
            dbName: req.params.dbName,
        };
        const {responseData, status} = await odooModuleService.getUnactivatedModules(data);
        res.status(status).json({ responseData });
    } catch (error) {
        res.status(500).json({ message: "Error getting un-activate Odoo Module", error: error.message });
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