const {transaction} = require("../../models/transactionModel");
const transactionServices = require("../services/transactionService")

async function getTransactionById(req, res){
    //  #swagger.description = 'Use to get transaction by id'
    //  #swagger.tags = ["Transactions"]

    try {
        const transactionId = req.id;
        const transaction = await transactionServices.getTransactionById(transactionId);
        if(transaction){
            res.status(200).json({message: 'Get Transaction success', data: transaction});
        } else {
            res.status(404).json({message: 'Transaction not found'});
        }
    } catch (error) {
        res.status(500).json({message: "Error at getting transaction", error})
    }
}

async function getTransactionByUserId(req, res){
    //  #swagger.description = 'Use to get transaction by user id'
    //  #swagger.tags = ["Transactions"]

    try {
        const userId = req.id;
        const transactions = await transactionServices.getTransactionByUserId(userId);
        if(transactions){
            res.status(200).json({message: 'Get Transaction success', data: transactions});
        } else {
            res.status(404).json({message: 'Transaction not found'});
        }
    } catch (error) {
        res.status(500).json({message: "Error at getting transaction", error})
    }
}

module.exports = {
    getTransactionById,
    getTransactionByUserId
}

