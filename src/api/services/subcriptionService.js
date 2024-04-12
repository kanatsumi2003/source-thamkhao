const mongoService = require("../services/mongoService");
const mongoose = require("mongoose");
const { SubCriptionWithBase } = require("../../models/subcriptionModel");
const collectionName = "subscriptions";

/**
 *
 * @param {string} name
 * @param {string} total_invoices
 * @param {string} total_storage
 * @param {string} image
 * @param {string} description
 * @param {string} monthly_prices
 * @param {string} yearly_prices
 * @returns {Promise<SubCriptionWithBase>}
 */
async function createSubscription(subscription) {
  try {
    console.log("createSubscription(subscription)", subscription);

    let fullSubscription = new SubCriptionWithBase(subscription);
    console.log(fullSubscription);

    await mongoService.insertDocuments(collectionName, [fullSubscription]);

    return fullSubscription;
  } catch (error) {
    throw new Error("Error creating subscription: " + error.message);
  }
}

async function getSubscriptionById(subscriptionId) {
  try {
    const query = {
      _id: new mongoose.Types.ObjectId(subscriptionId),
      isActive: true,
      isDelete: false,
    };

    const subscriptions = await mongoService.findDocuments(
      collectionName,
      query
    );

    if (subscriptions !== null && subscriptions.length > 0) {
      return subscriptions[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error getting subscription: " + error.message);
  }
}

// async function getSubscriptionTemplateById(subscriptionId) {
//   try {
//     const query = {
//       _id: new mongoose.Types.ObjectId(subscriptionId),
//       isActive: true,
//       isDelete: false,
//       isTemplate: true,
//     };

//     const subscriptions = await mongoService.findDocuments(
//       collectionName,
//       query
//     );

//     if (subscriptions !== null && subscriptions.length > 0) {
//       return subscriptions[0];
//     } else {
//       return null;
//     }
//   } catch (error) {
//     throw new Error("Error getting subscription: " + error.message);
//   }
// }

async function updateSubscription(subscription) {
  try {
    // get old subscription in db
    let oldSubscription = await getSubscriptionById(subscription._id);
    if (oldSubscription === null) {
      return false;
    }

    oldSubscription.updateTime = new Date(); // update time

    oldSubscription.name = subscription.name;
    oldSubscription.dbname = subscription.dbname;
    oldSubscription.domainname = subscription.domainname;
    oldSubscription.total_invoices = subscription.total_invoices;
    oldSubscription.total_storage = subscription.total_storage;
    oldSubscription.image = subscription.image;
    oldSubscription.description = subscription.description;
    oldSubscription.monthly_prices = subscription.monthly_prices;
    oldSubscription.yearly_prices = subscription.yearly_prices;
    oldSubscription.total = subscription.total;
    oldSubscription.isDelete = subscription.isDelete;

    await mongoService.updateDocument(
      collectionName,
      { _id: oldSubscription._id },
      oldSubscription
    );

    return true;
  } catch (error) {
    throw new Error("Error updating subscription: " + error.message);
  }
}

async function deleteSubscription(subscriptionId) {
  try {
    let subscription = await getSubscriptionById(subscriptionId);
    if (subscription === null) {
      return false;
    }
    subscription.isDelete = true;

    return await updateSubscription(subscription);
  } catch (error) {
    throw new Error("Error deleting subscription: " + error.message);
  }
}

function validateSubscriptionName(subscriptionName) {
    try {
        const allowCharacters = /^[a-zA-Z0-9\s]+$/;
        return allowCharacters.test(subscriptionName);
    } catch (error) {
        throw new Error(error.message);
    }
}
module.exports = {
  validateSubscriptionName,
  // getSubscriptionTemplateById,
  createSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};
