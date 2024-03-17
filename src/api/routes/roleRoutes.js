const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleControllers');
const { authenticateToken,authorizationMiddleware } = require('../../middleware/authMiddleware'); // Đảm bảo đường dẫn đúng

// Tạo role mới
// router.post('/', authenticateToken,authorizationMiddleware, roleController.createRole);
router.post('/',authenticateToken,authorizationMiddleware(["Admin"]),roleController.createRole);
// router.put('/', authenticateToken, roleController.updateRole);
// router.get('/', authenticateToken, roleController.getRoles);

// Thêm các route cho updateUser, deleteUser, getUser, getUsers

module.exports = router;