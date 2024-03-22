const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../../middleware/authMiddleware'); // Đảm bảo đường dẫn đúng
const apienpoint = "/users";
// #swagger.description = 'Use to request all posts'
// #swagger.tags = ["Users"]
router.post(apienpoint, userController.createUser);
router.post(apienpoint+'/sendmaildemo', userController.sendmaildemo);
router.post(apienpoint+'/login', userController.login);
router.post(apienpoint+'/verifyEmail', userController.verifyEmailRegister);
router.post(apienpoint+'/sendVerifyEmail', userController.sendVerifyEmail);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint+'/change-password', authenticateToken, userController.changePassword);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint+'/update-password', authenticateToken, userController.updatePasswordForgot);

module.exports = router;