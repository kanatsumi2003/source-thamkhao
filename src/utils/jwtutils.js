const jwt = require('jsonwebtoken');
const moment = require('moment');

async function encodejwt(user) {
    // Tạo token JWT
    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            roleId: user.role_id,
            isAdmin:user.isAdmin
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
            isAdmin:user.isAdmin
        },
        process.env.REACT_APP_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REACT_APP_EXPIRE_REFRESH_TOKEN }
    );
    // Log tokens for debugging
    console.log('Access Token:', token);
    console.log('Access Token:', token);
    console.log('process.env.REACT_APP_JWT_SECRET:', process.env.REACT_APP_JWT_SECRET);
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
module.exports = {
    encodejwt,
    decodejwt,
    addDuration
};