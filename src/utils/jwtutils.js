const jwt = require('jsonwebtoken');
const moment = require('moment');
const {createSession, deleteSession, findSessionByEmailAndIP} = require("../api/services/sessionService");

async function encodejwt(user) {
    // Tạo token JWT
    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            roleId: user.role_id,
            isAdmin: user.isAdmin
        },
        process.env.REACT_APP_JWT_SECRET,
        { expiresIn: process.env.REACT_APP_EXPIRE_TOKEN }
    );
    // Tạo refresh token
    const refreshToken = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            roleId: user.role_id,
            isAdmin: user.isAdmin
        },
        process.env.REACT_APP_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REACT_APP_EXPIRE_REFRESH_TOKEN }
    );
    // Log tokens for debugging
    console.log('Access Token:', token);
    console.log('Refresh Token:', refreshToken);
    return {
        token,
        refreshToken,
        expiresIn: process.env.REACT_APP_EXPIRE_TOKEN // Thời gian hết hạn của access token
    };
}
async function decodejwt(jwtToken) {
    jwt.verify(jwtToken, process.env.REACT_APP_JWT_SECRET, (err, user) => {
        if (err) return null;
        console.log(user);
        return user;
    });
}
/**
 * Hàm tính ngày giờ sau khi cộng thêm khoảng thời gian.
 * @param {string} duration Khoảng thời gian cần thêm vào, ví dụ: '10h' hoặc '10d'.
 * @returns {string} Ngày giờ sau khi đã cộng thêm khoảng thời gian, dưới dạng chuỗi.
 */
function addDuration(duration) {
    console.log(duration);
    const unit = duration.slice(-1); // Lấy đơn vị thời gian (giờ 'h', ngày 'd', v.v.)
    const amount = parseInt(duration.slice(0, -1)); // Lấy số lượng thời gian từ chuỗi

    // Kiểm tra và xử lý các đơn vị thời gian phổ biến
    let momentUnit;
    switch (unit) {
        case 'h':
            momentUnit = 'hours';
            break;
        case 'd':
            momentUnit = 'days';
            break;
        // Thêm các trường hợp cho các đơn vị thời gian khác nếu cần
        default:
            throw new Error('Đơn vị thời gian không được hỗ trợ.');
    }

    // Tạo ngày giờ mới sau khi cộng thêm khoảng thời gian
    const newDateTime = moment().add(amount, momentUnit);

    // Định dạng và trả về ngày giờ mới dưới dạng chuỗi
    return newDateTime.format('YYYY-MM-DD HH:mm:ss');
}

async function createJwtAndSession(user, email, ipAddress, deviceId) {
    const {token, refreshToken, expiresIn} = await encodejwt(user); // Assuming encodeJwt generates a token and handles the setting of expiration

    const sessionExist = await findSessionByEmailAndIP(email, ipAddress, deviceId); // kiểm tra có login nào  trong cùng device và ip ko

    if (sessionExist != null && sessionExist.length >= 0) {
        for (const sess of sessionExist) {
            await deleteSession(sess._id); // Assuming each session document has an _id field
        }
    }
    // Assuming encodeJwt returns an object with the token and its expiry

    const tokenExpiryDate = addDuration(token.expiresIn);
    const refreshTokenExpiryDate = addDuration(process.env.REACT_APP_EXPIRE_REFRESH_TOKEN);

    // Save the session in sessionModel
    const session = await createSession({
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

    return {
        token,
        refreshToken,
        expiresIn, // Thời gian hết hạn của access token
        session // session mới được tạo
    };
}
module.exports = {
    encodejwt,
    decodejwt,
    addDuration,
    createJwtAndSession
};