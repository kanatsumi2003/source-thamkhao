const bcrypt = require('bcryptjs');

// Hàm băm mật khẩu
async function hashPassword(password) {
    const saltRounds = 10; // Số vòng salt, có thể điều chỉnh để tăng độ bảo mật
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// Hàm kiểm tra mật khẩu
async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

module.exports = {
    hashPassword,
    comparePassword
};