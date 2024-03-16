const { User, UserWithBase } = require('../../models/userModel');
const mongoService = require('../services/mongoService');

// Tạo người dùng mới
async function createUser(req, res) {
    const user = new User(req.body.email, req.body.username, req.body.password, req.body.phoneNumber);
    const userWithBase = new UserWithBase(user);
    try {
        const result = await mongoService.insertDocuments('users', [userWithBase]);
        res.status(201).json({ message: 'User created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
}

// Thêm các hàm khác như updateUser, deleteUser, getUser, getUsers tương tự

module.exports = { createUser };