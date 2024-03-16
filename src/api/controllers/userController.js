const { User, UserWithBase } = require('../../models/userModel');
const mongoService = require('../services/mongoService');
const { hashPassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng

async function createUser(req, res) {
    try {
        const user = new User(req.body.email, req.body.username, req.body.password, req.body.phoneNumber);

        // Băm mật khẩu sử dụng utility
        user.password = await hashPassword(user.password);

        const userWithBase = new UserWithBase(user);
        const result = await mongoService.insertDocuments('users', [userWithBase]);

        // Loại bỏ trường mật khẩu trước khi gửi phản hồi
        const userData = { ...userWithBase };
        delete userData.password;

        res.status(201).json({ message: 'User created', data: userData });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
}

module.exports = { createUser };