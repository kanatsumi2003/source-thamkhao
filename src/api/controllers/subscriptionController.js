const { Subscription } = require("../../models/subcriptionModel");
const subscriptionServices = require("../services/subcriptionService");
const transactionServices = require("../services/transactionService");
const companyService = require("../services/companyService");
const userService = require("../services/userService");
async function registerSubscription(req, res) {
  //  #swagger.description = 'Use to create subscription'
  //  #swagger.tags = ["Subscriptions"]
  try {
    const userId = req.user.userId;
    const subscriptionId = req.params.subscriptionId;
    const searchData = {
      userId: userId,
    };
    const company = await companyService.getCompanyByUserId(searchData);
    if (company == 0 || company == null)
      throw new Error("This user has no company");

    const user = await userService.getUserById(userId);
    if (user == 0 || user == null) throw new Error("User not found");

    const subscription = await subscriptionServices.getSubscriptionById(
      subscriptionId
    );
    if (subscription == 0 || subscription == null)
      throw new Error("There is no subcription matches");

    const startDate = new Date();
    let endDate = new Date();
    const isMonthly = req.body.isMonthly;
    let amount;
    if (isMonthly === "true") {
      endDate = new Date(endDate.setMonth(endDate.getMonth() + 1));
      amount = subscription.monthly_prices;
    } else {
      endDate = new Date(endDate.setFullYear(endDate.getFullYear() + 1));
      amount = subscription.yearly_prices;
    }

    const transaction = await transactionServices.createTransaction({
      userId: userId,
      subcriptionId: subscriptionId,
      companyId: company.companyId,
      amount: amount,
      startDate: startDate,
      endDate: endDate,
      isMonthly: isMonthly,
      response_data: {},
      gateway: "",
      status: "",
      note: "",
      phone: user.phoneNumber,
      username: user.username,
      companyName: company.companyName,
    });

    company.startDateSubs = startDate;
    company.totalInvoices = subscription.total_invoices;
    company.endDateSubs = endDate;
    company.invoiceUsage = 0;
    company.subscriptionId = subscriptionId;
    await companyService.updateCompany(company._id, company);

    const transactionData = { ...transaction };
    delete transactionData.userId;
    delete transactionData.subcriptionId;
    delete transactionData.companyId;

    res.status(201).json(transactionData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function createTemplateSubscription(req, res) {
  //  #swagger.description = 'Use to create subscription'
  //  #swagger.tags = ["Subscriptions"]
  try {
    const {
      name,
      total_invoices,
      total_storage,
      image,
      description,
      monthly_prices,
      yearly_prices,
    } = req.body;

    const check = subscriptionServices.validateSubscriptionName(name); //check company names ko được chứa ký tự đặc biệt
    if (!check) throw new Error("Name must not contain special characters");
    const validatedName = name.replace(/\s/g, "").toLowerCase();

    const subscription = new Subscription(
      validatedName,
      total_invoices,
      total_storage,
      image,
      description,
      monthly_prices,
      yearly_prices
    );

    const addedSubs = await subscriptionServices.createSubscription(
      subscription
    );

    console.log(addedSubs);
    //TODO
    // Create Transaction

    res
      .status(201)
      .json({ message: "Create Subscription success", data: addedSubs });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error at creating subscription",
        error: error.message,
      });
  }
}

async function updateSubscription(req, res) {
  //  #swagger.description = 'Use to update subscription'
  //  #swagger.tags = ["Subscriptions"]

  try {
    const {
      name,
      total_invoices,
      total_storage,
      image,
      description,
      monthly_prices,
      yearly_prices,
    } = req.body;

    const check = subscriptionServices.validateSubscriptionName(name); //check company names ko được chứa ký tự đặc biệt
    if (!check) throw new Error("Name must not contain special characters");
    const validatedName = name.replace(/\s/g, "").toLowerCase();

    const subscription = new Subscription(
      validatedName,
      total_invoices,
      total_storage,
      image,
      description,
      monthly_prices,
      yearly_prices
    );

    const isSuccess = await subscriptionServices.updateSubscription(
      subscription
    );

    if (isSuccess) {
      return res
        .status(200)
        .json({ message: "Update Subscription success", data: isSuccess });
    }

    return res.status(404).json({
      message: "Update Subscription fail, Subscription does not exist",
      data: isSuccess,
    });
  } catch (error) {
    res.status(500).json({ message: "Error at update subscription", error });
  }
}

async function deleteSubscription(req, res) {
  //  #swagger.description = 'Use to delete subscription'
  //  #swagger.tags = ["Subscriptions"]

  try {
    const subscriptionId = req.id;

    const isSuccess = await subscriptionServices.deleteSubscription(
      subscriptionId
    );

    if (isSuccess) {
      return res
        .status(200)
        .json({ message: "delete Subscription success", data: isSuccess });
    }

    return res.status(404).json({
      message: "delete Subscription fail, Subscription does not exist",
      data: isSuccess,
    });
  } catch (error) {
    res.status(500).json({ message: "Error at delete subscription", error });
  }
}

async function validateIsSubscriptionExpire(req, res) {
  // #swagger.description = 'Use to validate user subscription'
  // #swagger.tags = ["Subscriptions"]
  try {
    const userId = req.user.userId;
    const searchData = {
      userId: userId,
    };
    const company = await companyService.getCompanyByUserId(searchData);
    const totalInvoices = company.totalInvoices;
    const invoiceUsage = company.invoiceUsage;
    let time_expire = false;
    let invoice_exceed = false;
    const today = new Date();
    const endDate = company.endDateSubs;
    let timeDiff = endDate.getTime() - today.getTime();

    let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    let date = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    if (today > endDate) time_expire = true;
    else time_expire = false;
    if (invoiceUsage > totalInvoices) invoice_exceed = true;
    else invoice_exceed = false;
    res
      .status(200)
      .json({
        endDate: endDate,
        expire_in: date,
        totalInvoices: totalInvoices,
        invoiceUsage: invoiceUsage,
        invoice_exceed: invoice_exceed,
        time_expire: time_expire,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function updateInvoiceUsage(req, res) {
    //  #swagger.description = 'Use to update invoice usage'
  //  #swagger.tags = ["Subscriptions"]
  try {
    const userId = req.user.userId;
    const invoice_usage = req.body.invoice_usage;
    const searchData = {
      userId: userId,
    };
    const company = await companyService.getCompanyByUserId(searchData);
    company.invoiceUsage += parseInt(invoice_usage);
    if(company.invoiceUsage > company.totalInvoices) throw new Error("This user invoice usage has exceeded total invoices");
    await companyService.updateCompany(company._id, company);
    res.status(200).json({totalInvoices: company.totalInvoices, invoice_usage: company.invoiceUsage})
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}
// const getSubscriptionFromRequest = (req) => {
//   const dbName = req.User.dbName;

//   const {
//     name,
//     domainName,
//     total_invoices,
//     total_storage,
//     image,
//     description,
//     monthly_prices,
//     yearly_prices,
//     total,
//   } = req.body;

//   return new Subscription(
//     name,
//     dbName,
//     domainName,
//     total_invoices,
//     total_storage,
//     image,
//     description,
//     monthly_prices,
//     yearly_prices,
//     total
//   );
// };

module.exports = {
  updateInvoiceUsage,
  validateIsSubscriptionExpire,
  createTemplateSubscription,
  updateSubscription,
  registerSubscription,
  deleteSubscription,
};
