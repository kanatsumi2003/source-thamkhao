const { User, UserWithBase } = require('../../models/userModel');
// const { CompanyProfile, CompanyProfileWithBase} = require('../../models/profileCompanyModel.js');
const userService = require('../services/userService');
const companiesService = require('../services/companyService');
const { createSession, deleteSession, findSessionByToken, findSessionByEmailAndIP, findSessionByEmail } = require('../services/sessionService'); // Assuming this is the correct path to your session service
const roleService = require('../services/roleService'); // Assuming this is the correct path to your session service
const { hashPassword, comparePassword, md5Encrypt } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const { encodejwt, addDuration } = require('../../utils/jwtutils'); // Đảm bảo đường dẫn đúng
const { sendMail } = require('../../utils/emailUtil'); // Đảm bảo đường dẫn đúng
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { use } = require('../routes/userRoutes');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const collectionName = 'users';

async function createUser(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
    console.log("ba noicha");
    try {
        const role = await roleService.findByName("User");
        console.log(role);
        const user = new User(req.body.fullname, req.body.email, req.body.username, req.body.password, req.body.phoneNumber, role._id);

        if (!role) {
            return res.status(400).json({ message: "Cannot find Role" });
        }
        const existUser = await userService.getUserByEmailAndUsername(user.email, user.username);
        console.log(existUser);

        if (existUser !== null) {
            return res.status(401).json({ message: "Email/Username đã tồn tại" });
        }
        console.log(req.body);
        console.log(user);

        const result = await userService.createUser(user);
        if (result === null) {
            res.status(400).json({ message: 'Không thể tạo User mới' });
        }
        let userData = { ...result };
        console.log(userData);
        delete userData.password;
        delete userData._id;
        delete userData.role_id;
        delete userData.twoFASecret;

        //gửi mail confirm ?email=email&hash=hashcuaemailcode-timeout
        user.emailCode = await md5Encrypt(user.emailCode);
        await sendMail(user.email, "Welcome to EZCOUNT", user, "verifyEmailTemplate.ejs");

        res.status(201).json({ message: 'User created', data: userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
}

async function login(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
    try {
        console.log("login");
        const { email, password } = req.body;

        // Use userService to find user by email
        const user = await userService.getUserByEmail(email);
        console.log(!user);
        if (!user || user.emailConfirmed == false) {
            return res.status(401).json({ message: "Email not existed or not verify email" });
        }
        console.log(user);
        // Device ID and IP Address (this might require additional logic depending on your setup)
        const deviceId = req.headers['user-agent'] || 'Unknown Device'; // Placeholder, you should have a way to identify devices
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(deviceId);
        console.log(ipAddress);
        // Use passwordUtils to compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu không chính xác" });
        }
        // const user = {
        //     email:user.email,
        //     role_Id: user.role_id
        // }

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
        const dbName = null;
        //kiểm tra có company không
        const myCompany = await companiesService.getCompanyByUserId(user._id);
        console.log(myCompany);
        if (myCompany) {
            dbName = myCompany.dbName;
        }
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
            ipAddress: ipAddress,
            dbName: dbName
        });

        // Send token to client
        res.json({ token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
}
async function changePassword(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
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
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
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
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
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
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
    console.log("sendmaildemo");
    const { email } = req.body;

    // Use userService to find user by email
    const user = await userService.getUserByEmail(email);
    if (!user) {
        return res.status(401).json({ message: "Email không tồn tại" });
    }
    console.log(user);
    await sendMail(email, "hello  world", user, "verifyEmailTemplate.ejs");
    res.status(200).json({ message: "gửi mail thành công" });

}
async function verifyEmailRegister(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
    try {

        const { hash, email } = req.body;
        let user = await userService.getUserByEmailRegister(email);
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: "Cannot find email" });
        }
        const emailHash = await md5Encrypt(user.emailCode);
        console.log(emailHash);
        if (hash != emailHash) {
            return res.status(400).json({ message: "Cannot verify please try again" });
        }
        user.emailCode = Math.random().toString(36).substr(2, 5);
        user.emailConfirmed = true;
        console.log(user._id.toString());
        await userService.updateUser(user._id, user);
        //active
        return res.status(200).json({ message: "xác thực mail thành công" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error verify user', error });
    }

}
async function verifyForgotPasswordByEmailCode(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
    try {

        const { hash, email, t } = req.body;
        console.log(email);
        let user = await userService.getUserByEmail(email);
        console.log(user);

        if (user == null) {
            return res.status(400).json({ message: "Email not existed" });
        }
        // Lấy timestamp hiện tại
        const currentTimestamp = moment().valueOf();
        // Tính chênh lệch giữa timestamp hiện tại và timestamp truyền vào, đơn vị là phút
        const differenceInMinutes = (currentTimestamp - t) / (1000 * 60);

        // Kiểm tra xem chênh lệch có vượt quá 30 phút không
        if (differenceInMinutes > 30) {
            console.log('Email timeout!');
        } else {
            console.log('Timestamp truyền vào không vượt quá 30 phút so với hiện tại.');
            console.log(user.emailCode);
            const emailHash = await md5Encrypt(user.emailCode);
            console.log(emailHash);
            if (hash != emailHash) {
                return res.status(400).json({ message: "Cannot verify please try again" });
            }
            user.emailCode = Math.random().toString(36).substr(2, 5);
            await userService.updateUser(user._id, user);

            // Generate JWT token
            const token = await encodejwt(user); // Assuming encodeJwt generates a token and handles the setting of expiration

            const session = await findSessionByEmail(email); // kiểm tra có login nào  trong cùng device và ip ko

            if (session != null && session.length >= 0) {
                for (const sess of session) {
                    await deleteSession(sess._id); // Assuming each session document has an _id field
                }
            }
            // Assuming encodeJwt returns an object with the token and its expiry

            const tokenExpiryDate = addDuration(token.expiresIn);
            const refreshTokenExpiryDate = addDuration(process.env.REACT_APP_EXPIRE_REFRESH_TOKEN);
            const dbName = null;
            //kiểm tra có company không
            const myCompany = await companiesService.getCompanyByUserId(user._id);
            console.log(myCompany);
            if (myCompany) {
                dbName = myCompany.dbName;
            }
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
                dbName: dbName
            });

            res.status(200).json(token.token);
        }
    } catch (error) {
        res.status(400).json({ message: "Server error ", error });
    }

}
async function sendVerifyEmail(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
    res.status(200).json({ message: "xác thực mail thành công" });

}
async function updatePasswordForgot(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
    const userId = req.user.userId; // Giả sử 'req.user' đã được set bởi middleware xác thực JWT
    const { newpassword } = req.body;
    try {
        let user = await userService.getUserByEmail(req.user.email);
        if (!user) {
            return res.status(401).json({ message: "User not  found!" });
        }
        user.password = await hashPassword(newpassword);
        await userService.updateUser(user._id, user);
        //delete all session cu
        const session = await findSessionByEmail(user.email); // kiểm tra có login nào  trong cùng device và ip ko

        if (session != null && session.length >= 0) {
            for (const sess of session) {
                await deleteSession(sess._id); // Assuming each session document has an _id field
            }
        }
        //
        res.status(200).json({ message: "Change password  successfully! Please login again." });
    } catch (err) {
        console.log("Error : ", err);
        res.status(500).json({ message: "Internal server error!" });
    }
}
async function forgotPassword(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
    //lay email kiem tra ton tai user
    let user = await userService.getUserByEmail(req.body.email);
    if (!user) return res.status(400).json({ message: "Tài khoản với email này chưa đăng ký!" });

    //doi emailcode lai thanh 1 ma~
    user.emailCode = await md5Encrypt(user.emailCode);
    user.password = moment().valueOf();
    //send email ma code do
    await sendMail(user.email, "EZCOUNT - Forgot Password", user, "forgotPasswordEmailTemplate.ejs");
    res.status(200).json({ message: "Da gui Mail" });
}

async function myProfile(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Users"]
    //lay email kiem tra ton tai user
    let user = await userService.getUserByEmail(req.user.email);
    if (!user) return res.status(400).json({ message: "Unauthorize" });

    let userData = { ...user };
    console.log(userData);
    delete userData.password;
    delete userData._id;
    delete userData.role_id;
    delete userData.twoFASecret;
    delete userData.emailCode;
    //tra moel
    res.status(200).json(userData);
}
/**
 * @swagger
 * /users/upload-image-profile:
 *   post:
 *     security:
 *       - apiKeyAuth: []
 *     description: Upload user profile image
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: header
 *         name: authorization
 *         type: string
 *         required: true
 *         description: User's authorization token
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: Profile image to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
async function uploadImageProfile(req, res) {
    console.log(req.user);
    // Kiểm tra xem có file được upload không
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.' });
    }

    // Lấy thông tin file
    const file = req.file;
    const timeFolder = Date.now();
    const dirPath = '/public/uploads/' + req.user.userId + '/avatar/';
    console.log("dirPath ", '../../../' + dirPath);
    const baseDir = path.join(__dirname, '../../../' + dirPath);
    console.log(baseDir);
    try {
        fs.mkdirSync(baseDir, { recursive: true });
    } catch (err) {
        console.error(err);
        // Thêm logic xử lý lỗi tại đây, ví dụ: trả về phản hồi lỗi cho client
    }

    // Tạo tên file mới với ID người dùng và timestamp để đảm bảo tên file là duy nhất
    const newFileName = req.user.userId + '-' + timeFolder + path.extname(file.originalname);
    const targetPath = path.join(baseDir, newFileName);
    console.log('targetPath', targetPath);

    // Di chuyển file từ thư mục tạm thời vào thư mục đích
    fs.rename(file.path, targetPath, async (err) => {
        if (err) {
            fs.unlink(file.path, () => { });
            return res.status(500).send({ message: 'Could not process the file.' });
        }

        const email = req.user.email;
        let user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Lưu đường dẫn của file mới vào cơ sở dữ liệu, lưu ý rằng bạn nên lưu đường dẫn tương đối thay vì đường dẫn tuyệt đối
        const imagePath = `${dirPath}${newFileName}`;
        // await userService.updateUserProfileImage(user._id, imagePath);
        user.imagePath = imagePath;
        await userService.updateUser(user._id
            , user);
        res.status(200).json({ message: 'Image uploaded successfully.', imagePath: imagePath });
    });
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
    updatePasswordForgot,
    myProfile,
    uploadImageProfile
};