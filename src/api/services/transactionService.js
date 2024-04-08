const mongoService = require("../services/mongoService");
const mongoose= require("mongoose");
const {transactionWithBase} = require("../../models/transactionModel");
const collectionName = "transactions";

async function createTransaction(transaction) {
    try {
        console.log("createTransaction(transaction)", transaction);

        let fullTransaction = new transactionWithBase(transaction);

        await mongoService.insertDocuments(collectionName, [fullTransaction]);

        return transaction;
    } catch (error) {
        throw new Error("Error creating transaction: " + error.message);
    }
}

async function getTransactionById(transactionId){
    try {
        const query = {
            _id: new mongoose.Types.ObjectId(transactionId),
            isActive: true,
            isDelete: false
        };

        const transactions = await mongoService.findDocuments(collectionName, query);

        if (transactions !== null && transactions.length > 0) {
            return transactions[0];
        } else {
            return null;
        }

    } catch (error) {
        throw new Error("Error getting transaction: " + error.message);
    }

}

async function getTransactionByUserId(userId){
    try {
        const query = {
            userId: userId,
            isActive: true,
            isDelete: false
        };

        const transactions = await mongoService.findDocuments(collectionName, query);

        if (transactions !== null && transactions.length > 0) {
            return transactions;
        } else {
            return null;
        }

    } catch (error) {
        throw new Error("Error getting transaction: " + error.message);
    }

}

module.exports = {
    createTransaction,
    getTransactionById,
    getTransactionByUserId
}
