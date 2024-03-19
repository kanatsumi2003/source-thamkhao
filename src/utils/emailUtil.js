const nodemailer = require('nodemailer');
const ejs = require('ejs');
// Cấu hình transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'truonglongkt2021@gmail.com', // Địa chỉ email của bạn
        pass: 'thanhTRUC!@#2021' // Mật khẩu ứng dụng (không phải mật khẩu Gmail của bạn, nếu bạn có bảo mật 2 lớp)
    }
});
// Hàm này render template EJS và trả về HTML
function renderTemplate(data, path) {
    return new Promise((resolve, reject) => {
        ejs.renderFile(path, data, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}
async function sendMail(Mailto,subject,user,templateName) {
    const path = "../views/email/" + templateName; // Thư mục chứa file .ejs
    const htmlContent = await renderTemplate(user , path);

    const mailOptions = {
        from: 'truonglongkt2021@gmail.com',
        to: Mailto,
        subject: subject,
        html: htmlContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = {
    sendMail
};