const { User, UserWithBase } = require('../../models/userModel');
const userService = require('../services/userService');
const { hashPassword, comparePassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const { encodejwt, decodejwt } = require('../../utils/jwtutils'); // Đảm bảo đường dẫn đúng
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { use } = require('../routes/userRoutes');
const collectionName = 'users';

async function createUser(req, res) {
    try {
        let role_id = req.body.role_Id;
        if (!role_id) {
            return res.status(400).json({ message: "Vui lòng cung cấp role_id" });
        }
        console.log(req.body);
        const user = new User(req.body.email, req.body.username, req.body.password, req.body.phoneNumber, role_id);
        console.log(user);

        const existUser = await userService.getUserByEmailAndUsername(user.email,user.username);
        if (existUser!==null) {
            return res.status(401).json({ message: "Email/Username đã tồn tại" });
        }
        const result = await userService.createUser(user);
        if(result===null)
        {
            res.status(400).json({ message: 'Không thể tạo User mới'});
        }
        const userData = { ...result };
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
        const user = await userService.getUserByEmail(email);
        console.log(user);
        if (!user) {
            return res.status(401).json({ message: "Email không tồn tại" });
        }
        // Sử dụng passwordUtils để so sánh mật khẩu
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu không chính xác" });
        }
        console.log(user);
        // Tạo token JWT
        // const token = jwt.sign(
        //     { userId: user._id,
        //     roleId: user.role_id },
        //     process.env.REACT_APP_JWT_SECRET,
        //     { expiresIn: '1h' }
        // );
        const token = await encodejwt(user);

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
        const user = await userService.getUserById(userId);
        if(user==null){
            return res.status(404).json({ message: "Không tìm thấy user" });
        }
        // So sánh mật k
        const isMatch = await comparePassword(oldPassword, user.password);

        if(!isMatch)
        {
            return res.status(401).json({ message: "Password cũ không đúng" });
        }
        // Băm mật khẩu mới
        // const hashedPassword = await hashPassword(newPassword);
        // Cập nhật mật khẩu trong cơ sở dữ liệu
        const updateResult = await userService.changePasswordUser(userId,oldPassword,newPassword);

        if (!updateResult) {
            throw new Error("Không thể cập nhật mật khẩu");
        }

        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
}
module.exports = { createUser, login, changePassword };