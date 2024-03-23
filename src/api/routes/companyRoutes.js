const express = require("express");
const router = express.Router();
const companyControllers = require("../controllers/companyControllers");
const { authenticateToken } = require("../../middleware/authMiddleware");

const apienpoint = "/companies";
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint, authenticateToken, companyControllers.createCompany);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apienpoint, authenticateToken, companyControllers.getAllCompanies);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apienpoint+"/:id", authenticateToken, companyControllers.getCompanyById);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.put(apienpoint, authenticateToken, companyControllers.updateCompany);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.delete(apienpoint+"/:id", authenticateToken, companyControllers.deleteCompany);

module.exports = router;
