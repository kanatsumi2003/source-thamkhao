const { User, UserWithBase } = require('../../models/userModel');
const mongoService = require('../services/mongoService');
const { hashPassword, comparePassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
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
        if (existUser.length >= 0 || existUser != null) {
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
        if (!users || users.length <= 0) {
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
async function changePassword(req, res) {
    try {
        const { oldPassword,newPassword } = req.body;
        const userId = req.user.userId; // Giả sử 'req.user' đã được set bởi middleware xác thực JWT
        console.log(userId);
        const users = await mongoService.findDocuments(collectionName, { _id: new ObjectId(userId) });
        const user = users[0] || null; // Lấy phần tử đầu tiên hoặc null nếu mảng rỗng
        if(user==null){
            return res.status(404).json({ message: "Không tìm thấy user" });
        }
        // So sánh mật k
        const hashedOldPassword = await hashPassword(oldPassword);
        if(!user.password===hashedOldPassword)
        {
            return res.status(401).json({ message: "Password cũ không đúng" });
        }
        // Băm mật khẩu mới
        const hashedPassword = await hashPassword(newPassword);
        // Cập nhật mật khẩu trong cơ sở dữ liệu
        const updateResult = await mongoService.updateDocument(collectionName, { _id: new ObjectId(userId)  }, { password: hashedPassword });

        if (updateResult.modifiedCount === 0) {
            throw new Error("Không thể cập nhật mật khẩu");
        }

        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
}
module.exports = { createUser, login, changePassword };