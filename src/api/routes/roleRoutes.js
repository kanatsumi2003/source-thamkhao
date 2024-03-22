const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleControllers');
const { authenticateToken,authorizationMiddleware } = require('../../middleware/authMiddleware'); // Đảm bảo đường dẫn đúng
// Setting the Swagger tag and description for all routes in this file
const apienpoint = "/roles";
// Tạo role mới
// router.post('/', authenticateToken,authorizationMiddleware, roleController.createRole);

// #swagger.tags = ['Roles']
// #swagger.description = 'Endpoint to manage Roles.'
// #swagger.security = [{ "apiKeyAuth": [] }]
router.post(apienpoint,authenticateToken,authorizationMiddleware(["Admin"]),roleController.createRole);
// router.put('/', authenticateToken, roleController.updateRole);
// router.get('/', authenticateToken, roleController.getRoles);

// Thêm các route cho updateUser, deleteUser, getUser, getUsers

module.exports = router;