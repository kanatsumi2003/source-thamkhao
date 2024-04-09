const odooUserServices = require("../services/odooService/odooUserService");

async function getOdooUser(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooUser"]
  try {
    const data = {
      dbName: req.params.dbName,
    };
    const { responseData, status } = await odooUserServices.getOdooUserList(
      data
    );
    res.status(status).json({ responseData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting Odoo User", error: error.message });
  }
}

async function getOdooUserRole(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["OdooUser"]
  try {
    const data = {
      dbName: req.params.dbName,
    };
    const { responseData, status } = await odooUserServices.GetOdooRole(data);
    res.status(status).json({ responseData });
  } catch (error) {
    res.status(500).json({ message: "Error getting Odoo Role", error: error.message });
  }
}

module.exports = {
  getOdooUser,
  getOdooUserRole,
};
