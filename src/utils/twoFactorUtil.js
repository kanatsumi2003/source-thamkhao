const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

async function generateQRCode(secretCode,email,serviceName){
   // Giả sử `savedSecret` là secret.base32 bạn đã lưu trữ trước đó
const savedSecret = secretCode;

// Tên người dùng và tên miền dịch vụ của bạn để hiển thị trong ứng dụng Authenticator
const userName = email;
const serviceName = serviceName||"authenticate";

const otpauthUrl = speakeasy.otpauthURL({
    secret: savedSecret,
    label: encodeURIComponent(`${serviceName}:${userName}`),
    issuer: serviceName,
    encoding: 'base32',
});

QRCode.toDataURL(otpauthUrl, function(err, data_url) {
    if (err) {
        console.error('Lỗi khi tạo QR Code:', err);
        return;
    }

    console.log(data_url);
    return data_url;
    // Bạn có thể hiển thị `data_url` này trên giao diện người dùng để người dùng có thể quét lại
});
}

async function verifyQRCode(secretCode,inputToken){
// Giả sử `userEnteredToken` là mã mà người dùng nhập vào từ ứng dụng xác thực của họ
const userEnteredToken = inputToken;

// `savedSecret` là secret key của người dùng bạn đã lưu trước đó
const savedSecret = secretCode;

// Kiểm tra mã 2FA
const tokenValidates = speakeasy.totp.verify({
    secret: savedSecret,
    encoding: 'base32',
    token: userEnteredToken,
    window: 1 // Đây là khoảng thời gian mà mã được chấp nhận. Một giá trị là 1 thì nó sẽ chấp nhận mã hiện tại, mã trước đó và mã tiếp theo.
});

if (tokenValidates) {
    return true;
    console.log('Mã 2FA hợp lệ.');
} else {
    return false;
    console.log('Mã 2FA không hợp lệ.');
}
}

module.exports = {
    generateQRCode,verifyQRCode
};