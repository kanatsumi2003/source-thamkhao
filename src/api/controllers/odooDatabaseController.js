const odooDatabaseService = require("../services/odooService/odooDatabaseServices");
const companyService = require("../services/companyService");
const queue = require("../../utils/sendQueue");
async function duplicateDatabases(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooDatabase"]
  try {
    const message = { 
      dbName: req.params.dbName,
      newDbName: req.body.newDbName,
    };
    const messageString = JSON.stringify(message);
    await queue.sendToQueue("duplicateDatabase", Buffer.from(messageString));
    res.status(200).json("Duplicating");
  } catch (error) {
    res.status(500).json({
      message: "Error duplicating Odoo Database",
      error,
    });
  }
}

async function stopOdooDatabase(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooDatabase"]
  try {
    const message = { 
      dbName: req.params.dbName,
    };
    const messageString = JSON.stringify(message);
    await queue.sendToQueue("stopDatabase", Buffer.from(messageString));
    res.status(200).json("Stopping");
  } catch (error) {
    res.status(500).json({ message: "Error stopping Odoo Database", error });
  }
}

async function changeOdooDBName(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooDatabase"]
  try {
    const data = {
      newDbName: req.body,
      userId: req.params.userId,
    };
    const { message, isSuccess } = await odooDatabaseService.changeDBName(data);
    if (isSuccess) {
      res.status(201).json({ message });
    } else {
      res.status(400).json({ message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing Odoo Database Name", error });
  }
}

async function changeOdooDBPassword(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooDatabase"]
  try {
    const { newPassword } = req.body;
    const dbName = req.params.dbName;
    const message = {
      newPassword: newPassword,
      dbName: dbName,
    };
    const messageString = JSON.stringify(message);
    await queue.sendToQueue("changeOdooPassDBPassword", Buffer.from(messageString));
    res.status(200).json("Changing!");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing Odoo Database Password", error });
  }
}

async function startOdooDatabaseAgain(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooDatabase"]
  try {
    const message = { 
      dbName: req.params.dbName,
    };
    const messageString = JSON.stringify(message);
    await queue.sendToQueue("startOdooDatabaseAgain", Buffer.from(messageString));
    res.status(200).json("Restoring");
  } catch (error) {
    res.status(500).json({ message: "Error change Odoo Database", error });
  }
}

//api create odoo by userid (truyền userid) => tạo queue gắn userid
//check xem userid này có company chưa => chưa thì ko có comp => returnm
//có tạo queue
async function reCreateOdooDatabase(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooDatabase"]
  try {
    const userId = req.params.userId;
    let company = await companyService.getCompanyInactiveByUserId(userId); //query công ty chưa được active để tạo lại db + dns record
    if (company == null) {
      return res
        .status(400)
        .json({ message: "This user has no inactive company" });
    }
    const message = {
      userId: userId,
      companyId: company._id,
    };
    let messageString = JSON.stringify(message);

    await queue.sendToQueue("createOdooAndDNS", Buffer.from(messageString));
    return res.status(200).json({ message: "Recreating" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
module.exports = {
  duplicateDatabases,
  stopOdooDatabase,
  changeOdooDBName,
  changeOdooDBPassword,
  reCreateOdooDatabase,
  startOdooDatabaseAgain,
};
