const { Subcription, SubCriptionWithBase } = require("../../models/subcriptionModel");
const mongoService = require("../services/mongoService");

const collectionName = "subcription";

/**
 * Create a subcription
 * @param {Subcription} subcription 
 * @returns {Promise <SubCriptionWithBase>} 
 * @exception Error at establishing db connection
 */
async function createSubcription(subcription){
    try {
        let fullSubcription = new SubCriptionWithBase(subcription);
        console.log(fullSubcription);
        await mongoService.insertDocuments(collectionName, [fullSubcription]);
        return fullSubcription;
    } catch (error) {
        return {
            error: error.message,
        }
    }
}
/**
 * 
 * @returns {Promise<Subcription[]> || undefined} Get all subcription 
 * @exception Error at establishing db connection
 */
async function getAllSubCription(){
    try {
        return await mongoService.findDocuments(collectionName)
    } catch (error) {
        return {
            message: error.message
        }
    }
}

module.exports = {
    createSubcription,
    getAllSubCription,
}
