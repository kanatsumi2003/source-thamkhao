const express = require("express");
const router = express.Router();
const companyControllers = require("../controllers/companyControllers");
const { authenticateToken } = require("../../middleware/authMiddleware");

router.post("/", authenticateToken, companyControllers.createCompany);
router.get("/", authenticateToken, companyControllers.getAllCompanies);
router.get("/:id", authenticateToken, companyControllers.getCompanyById);
router.put("/", authenticateToken, companyControllers.updateCompany);
router.delete("/:id", authenticateToken, companyControllers.deleteCompany);

module.exports = router;
