const express = require("express");
const router = express.Router();
const companyControllers = require("../controllers/companyControllers");
const { authenticateToken,authorizationMiddleware } = require("../../middleware/authMiddleware");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const apienpoint = "/companies";

// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint, authenticateToken, companyControllers.createCompany);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apienpoint, authenticateToken, authorizationMiddleware(["Admin"]), companyControllers.getAllCompanies);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.get(apienpoint + "/:id", authenticateToken, authorizationMiddleware(["Admin"]), companyControllers.getCompanyById);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.put(apienpoint, authenticateToken, companyControllers.updateCompany);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(`${apienpoint}/get-company-by-user`, authenticateToken, companyControllers.getCompanyByUserId);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint + '/upload-image-company', authenticateToken, upload.single('file'), companyControllers.uploadImageCompany);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.delete(apienpoint + "/:id", authenticateToken, authorizationMiddleware(["Admin"]), companyControllers.deleteCompany);

module.exports = router;
