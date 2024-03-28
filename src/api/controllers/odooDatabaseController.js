const odooDatabaseService = require("../services/odooService/odooDatabaseServices");
const companyService = require("../services/companyService");
const queue = require("../../utils/sendQueue");

async function duplicateDatabases(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooDatabase"]
  try {
    const { master_pwd, lang, password, login, phone, newDbName } = req.body;
    const userId = req.user.userId;
    const dbName = req.user.dbname;
    const { message, isSuccess, data } =
      await odooDatabaseService.duplicateOdooDatabase(
        userId,
        master_pwd,
        dbName,
        lang,
        password,
        login,
        phone,
        newDbName
      );
    if (isSuccess) {
      res.status(201).json({ message, data });
    } else {
      res.status(400).json({ message, data });
    }
  } catch (error) {
    res.status(500).json({ message: "Error duplicating Odoo Database", error });
  }
}

async function stopOdooDatabase(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooDatabase"]
  try {
    const { master_pwd, stringName, password } = req.body;
    const dbName = req.user.dbname;
    const userId = req.user.userId;
    const { message, isSuccess, data } = await odooDatabaseService.stopDatabase(
      userId,
      dbName,
      master_pwd,
      stringName,
      password
    );
    if (isSuccess) {
      res.status(201).json({ message, data });
    } else {
      res.status(400).json({ message, data });
    }
  } catch (error) {
    res.status(500).json({ message: "Error stopping Odoo Database", error });
  }
}

//api create odoo by userid (truyền userid) => tạo queue gắn userid
//check xem userid này có company chưa => chưa thì ko có comp => returnm
//có tạo queue
async function reCreateOdooDatabase(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooDatabase"]
  try {
    const userId = req.user.userId;
    let company = await companyService.getCompanyInactiveByUserId(userId);
    if (company == null) {
      return res.status(400).json({ message: "This user own no company" });
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
  reCreateOdooDatabase,
  duplicateDatabases,
  stopOdooDatabase,
};
