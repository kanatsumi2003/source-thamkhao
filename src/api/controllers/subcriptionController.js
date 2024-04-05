const subcriptionService = require("../services/subcriptionService");
const subcriptionModel = require("../../models/subcriptionModel");

async function createSubcription(req, res){
    // #swagger.description = "Use to request all posts"
    // #swagger.tags = ["Subcriptions"]
    try {
        const subcription = new subcriptionModel.Subcription(
            // req.body.name,
            // req.body.dbName,
            // req.body.domainName,
            // req.body.startDate,
            // req.body.endDate,
            // req.body.total_invoices,
            // req.body.total_storage,
            // req.body.image,
            // req.body.description,
            // req.body.month_prices,
            // req.body.yearly_prices,
            // req.body.total,
        )
        let fullSubcription = new subcriptionModel.SubCriptionWithBase(subcription);

        const result = await subcriptionService.createSubcription(fullSubcription);
    } catch (error) {
        
    }
}
async function getAllSubCription(req, res) {
    // #swagger.description = "Use to request all posts"
    // #swagger.tags = ["Subcriptions"]
    try {
        
    } catch (error) {
        
    }
}