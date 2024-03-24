const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../../middleware/authMiddleware'); // Đảm bảo đường dẫn đúng
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const apienpoint = "/users";
router.post(apienpoint+'/register', userController.createUser);
router.post(apienpoint + '/login', userController.login);
router.post(apienpoint + '/verifyEmail', userController.verifyEmailRegister);
router.post(apienpoint + '/forgot-password', userController.forgotPassword);
router.post(apienpoint + '/verify-Forgot-Password', userController.verifyForgotPasswordByEmailCode);
router.post(apienpoint + '/sendVerifyEmail', userController.sendVerifyEmail);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint + '/change-password', authenticateToken, userController.changePassword);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint + '/update-password-forgot', authenticateToken, userController.updatePasswordForgot);
router.post(apienpoint + '/my-profile', authenticateToken, userController.myProfile);
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint+'/upload-image-profile', authenticateToken, upload.single('file'), userController.uploadImageProfile);
module.exports = router;