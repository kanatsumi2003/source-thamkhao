const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Tạo người dùng mới
router.post('/users', userController.createUser);

// Thêm các route cho updateUser, deleteUser, getUser, getUsers

module.exports = router;