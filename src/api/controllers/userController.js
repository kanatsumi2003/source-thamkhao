const { User, UserWithBase } = require('../../models/userModel');
const userService = require('../services/userService');
const { createSession, deleteSession, findSessionByToken, findSessionByEmailAndIP } = require('../services/sessionService'); // Assuming this is the correct path to your session service
const { hashPassword, comparePassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const { encodejwt, addDuration } = require('../../utils/jwtutils'); // Đảm bảo đường dẫn đúng
const { sendMail } = require('../../utils/emailUtil'); // Đảm bảo đường dẫn đúng
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { use } = require('../routes/userRoutes');
const moment = require('moment');
const collectionName = 'users';

async function createUser(req, res) {
    try {
        let role_id = req.body.role_Id;
        if (!role_id) {
            return res.status(400).json({ message: "Vui lòng cung cấp role_id" });
        }
        console.log(req.body);
        const user = new User(req.body.fullname, req.body.email, req.body.username, req.body.password, req.body.phoneNumber, role_id);
        console.log(user);

        const existUser = await userService.getUserByEmailAndUsername(user.email, user.username);
        if (existUser !== null) {
            return res.status(401).json({ message: "Email/Username đã tồn tại" });
        }
        const result = await userService.createUser(user);
        if (result === null) {
            res.status(400).json({ message: 'Không thể tạo User mới' });
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
        console.log("login");
        const { email, password } = req.body;

        // Use userService to find user by email
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Email không tồn tại" });
        }
        console.log(user);
        // Device ID and IP Address (this might require additional logic depending on your setup)
        const deviceId = req.headers['user-agent'] || 'Unknown Device'; // Placeholder, you should have a way to identify devices
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // Use passwordUtils to compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu không chính xác" });
        }

        // Generate JWT token
        const token = await encodejwt(user); // Assuming encodeJwt generates a token and handles the setting of expiration

        const session = await findSessionByEmailAndIP(email, ipAddress, deviceId); // kiểm tra có login nào  trong cùng device và ip ko

        if (session != null && session.length >= 0) {
            for (const sess of session) {
                await deleteSession(sess._id); // Assuming each session document has an _id field
            }
        }
        // Assuming encodeJwt returns an object with the token and its expiry

        const tokenExpiryDate = addDuration(token.expiresIn);
        const refreshTokenExpiryDate = addDuration(process.env.REACT_APP_EXPIRE_REFRESH_TOKEN);

        // Save the session in sessionModel
        await createSession({
            userId: user._id,
            email: user.email,
            name: user.name || "unknown", // Assuming user object has a name field
            username: user.username.toLowerCase(), // Assuming user object has a username field
            jwttoken: token.token, // Assuming the token object has a token field
            refreshToken: token.refreshToken,
            ExpireRefreshToken: refreshTokenExpiryDate,
            expireDate: tokenExpiryDate,
            deviceId: deviceId,
            ipAddress: ipAddress
        });

        // Send token to client
        res.json({ token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
}
async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId; // Giả sử 'req.user' đã được set bởi middleware xác thực JWT
        const user = await userService.getUserById(userId);
        if (user == null) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }
        // So sánh mật k
        const isMatch = await comparePassword(oldPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Password cũ không đúng" });
        }
        // Băm mật khẩu mới
        // const hashedPassword = await hashPassword(newPassword);
        // Cập nhật mật khẩu trong cơ sở dữ liệu
        console.log("updateResult ");
        const updateResult = await userService.changePasswordUser(userId, oldPassword, newPassword);
        console.log("updateResult ", updateResult);
        if (!updateResult) {
            throw new Error("Không thể cập nhật mật khẩu");
        }
        // xóa session
        if (updateResult) {
            // Đăng xuất các session sau khi đổi mật khẩu thành công
            await logoutSessions(userId, req);
            res.status(200).json({ message: "Đổi mật khẩu và đăng xuất thành công!" });
        } else {
            throw new Error("Không thể cập nhật mật khẩu");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
}
async function logout(req, res) {
    const userId = req.user.userId; // Giả sử 'req.user' đã được set bởi middleware xác thực JWT
    const user = await userService.getUserById(userId);
    if (user == null) {
        return res.status(404).json({ message: "Không tìm thấy user" });
    }
    // Đăng xuất các session
    await logoutSessions(userId, req);
    res.status(200).json({ message: "Đăng xuất thành công" });
}

async function logoutSessions(userId, req) {
    const user = await userService.getUserById(userId);
    if (!user) {
        throw new Error("Không tìm thấy user");
    }

    // Lấy Device ID và IP Address từ request
    const deviceId = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Tìm và xóa các session liên quan
    const sessions = await findSessionByEmailAndIP(user.email, ipAddress, deviceId);
    if (sessions && sessions.length > 0) {
        for (const session of sessions) {
            await deleteSession(session._id); // Xóa từng session
        }
    }
}
async function sendmaildemo(req, res) {
    console.log("sendmaildemo");
    const { email } = req.body;

    // Use userService to find user by email
    const user = await userService.getUserByEmail(email);
    if (!user) {
        return res.status(401).json({ message: "Email không tồn tại" });
    }
    console.log(user);
    await sendMail("truonglongkt12@gmail.com", "hello  world", user, "verifyEmailTemplate.ejs");
    res.status(200).json({ message: "gửi mail thành công" });

}
async function verifyEmailRegister(req, res) {
    const { EmailCode,email } = req.body;
    //active
    res.status(200).json({ message: "xác thực mail thành công" });

}
async function verifyForgotPasswordByEmailCode(req, res) {
    const { EmailCode,email , newpassword} = req.body;
    res.status(200).json({ message: "xác thực mail thành công" });
}
async function sendVerifyEmail(req, res) {
    res.status(200).json({ message: "xác thực mail thành công" });

}
async function updatePasswordForgot(req, res) {
    const userId = req.user.userId; // Giả sử 'req.user' đã được set bởi middleware xác thực JWT
    const { newpassword} = req.body;
    res.status(200).json({ message: "xác thực mail thành công" });

}
async function forgotPassword(req, res) {
    //lay email kiem tra ton tai user
    //doi emailcode lai thanh 1 ma~
    //send email ma code do
    res.status(200).json({ message: "aaa" });
}
module.exports = {
    createUser,
    login,
    changePassword,
    logout,
    sendmaildemo,
    verifyEmailRegister,
    sendVerifyEmail,
    forgotPassword,
    verifyForgotPasswordByEmailCode,
    updatePasswordForgot
};