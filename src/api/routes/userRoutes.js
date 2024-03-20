const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../../middleware/authMiddleware'); // Đảm bảo đường dẫn đúng

// Tạo người dùng mới
router.post('/', userController.createUser);
router.post('/sendmaildemo', userController.sendmaildemo);
router.post('/login', userController.login);
router.post('/verifyEmail', userController.verifyEmailRegister);
router.post('/sendVerifyEmail', userController.sendVerifyEmail);
router.post('/change-password', authenticateToken, userController.changePassword);
router.post('/update-password', authenticateToken, userController.updatePasswordForgot);

// Thêm các route cho updateUser, deleteUser, getUser, getUsers

module.exports = router;