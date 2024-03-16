const { User, UserWithBase } = require('../../models/userModel');
const mongoService = require('../services/mongoService');
const { hashPassword,comparePassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const jwt = require('jsonwebtoken');
const collectionName = 'users';

async function createUser(req, res) {
    try {
        const user = new User(req.body.email, req.body.username, req.body.password, req.body.phoneNumber);
        const existUser = await mongoService.findDocuments(collectionName, {
            $or: [
                { email: email },
                { username: username }
            ]
        });
        if(existUser.length>=0 || existUser!=null)
        {
            return res.status(401).json({ message: "Email/Username đã tồn tại" });
        }
        // Băm mật khẩu sử dụng utility
        user.password = await hashPassword(user.password);

        const userWithBase = new UserWithBase(user);
        const result = await mongoService.insertDocuments(collectionName, [userWithBase]);

        // Loại bỏ trường mật khẩu trước khi gửi phản hồi
        const userData = { ...userWithBase };
        delete userData.password;

        res.status(201).json({ message: 'User created', data: userData });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        console.log(email);
        // Sử dụng mongoService để tìm kiếm người dùng bằng email
        const users = await mongoService.findDocuments(collectionName, { email: email });
        console.log(users);
        if (!users || users.length<=0) {
            return res.status(401).json({ message: "Email không tồn tại" });
        }
        const user = users[0];
        // Sử dụng passwordUtils để so sánh mật khẩu
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu không chính xác" });
        }
        console.log(user);
        // Tạo token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.REACT_APP_JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Gửi token cho client
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
};
module.exports = { createUser,login };