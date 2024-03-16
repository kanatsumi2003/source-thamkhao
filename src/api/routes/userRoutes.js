const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../../middleware/authMiddleware'); // Đảm bảo đường dẫn đúng

// Tạo người dùng mới
router.post('/', userController.createUser);
router.post('/login', userController.login);
router.post('/change-password', authenticateToken, userController.changePassword);

// Thêm các route cho updateUser, deleteUser, getUser, getUsers

module.exports = router;