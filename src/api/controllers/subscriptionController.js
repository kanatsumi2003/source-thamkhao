const {Subcription} = require("../../models/subcriptionModel");
const subscriptionServices = require("../services/subcriptionService")

async function createSubscription(req, res) {
    //  #swagger.description = 'Use to create subscription'
    //  #swagger.tags = ["Subscriptions"]

    try {
        const subscription= getSubscriptionFromRequest(req);

        const addedSubs = await subscriptionServices.createSubscription(subscription);

        console.log(addedSubs);
        //TODO
        // Create Transaction

        res.status(201).json({message: 'Create Subscription success', data: addedSubs});

    } catch (error) {
        res.status(500).json({message: "Error at creating subscription", error})
    }
}

async function updateSubscription(req, res) {
    //  #swagger.description = 'Use to update subscription'
    //  #swagger.tags = ["Subscriptions"]

    try {
        const subscription = getSubscriptionFromRequest(req);

        const isSuccess = await subscriptionServices.updateSubscription(subscription);

        if (isSuccess) {
            return res.status(200).json({message: 'Update Subscription success', data: isSuccess});
        }

        return res.status(404).json({message: 'Update Subscription fail, Subscription does not exist', data: isSuccess});

    } catch (error) {
        res.status(500).json({message: "Error at update subscription", error})
    }
}

async function deleteSubscription(req, res) {
    //  #swagger.description = 'Use to delete subscription'
    //  #swagger.tags = ["Subscriptions"]

    try {
        const subscriptionId = req.id;

        const isSuccess = await subscriptionServices.deleteSubscription(subscriptionId);

        if (isSuccess) {
            return res.status(200).json({message: 'delete Subscription success', data: isSuccess});
        }

        return res.status(404).json({message: 'delete Subscription fail, Subscription does not exist', data: isSuccess});

    } catch (error) {
        res.status(500).json({message: "Error at delete subscription", error})
    }
}

const getSubscriptionFromRequest = (req) => {
    const dbName = req.User.dbName;

    const  {
        name,
        domainName,
        total_invoices,
        total_storage,
        image,
        description,
        monthly_prices,
        yearly_prices,
        total
    } = req.body;

    return new Subcription(
        name,
        dbName,
        domainName,
        total_invoices,
        total_storage,
        image,
        description,
        monthly_prices,
        yearly_prices,
        total
    );
}

module.exports = {
    createSubscription,
    updateSubscription,
    deleteSubscription
}

