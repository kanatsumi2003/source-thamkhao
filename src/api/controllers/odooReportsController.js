const odooReportService = require("../services/odooService/odooReportService");

async function getOdooInvoice(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Invoices"]
  try {
    const dbName = req.params.dbName;
    const data = {
      dbName: dbName,
    };
    const { responseData, status } = await odooReportService.getOdooInvoice(
      data
    );
    res.status(status).json({ data: responseData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error get Odoo Invoice", error: error.message });
  }
}

module.exports = {
  getOdooInvoice,
};
