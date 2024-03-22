const nodemailer = require('nodemailer');
require('dotenv').config();

const ejs = require('ejs');
// Cấu hình transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.REACT_APP_EMAIL, // Địa chỉ email của bạn
        pass: process.env.REACT_APP_PASSWORD// Mật khẩu ứng dụng (không phải mật khẩu Gmail của bạn, nếu bạn có bảo mật 2 lớp)
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
async function sendMail(Mailto, subject, user, templateName) {
    console.log(process.env.REACT_APP_EMAIL);
    const path = "./src/view/emailTemplate/" + templateName; // Thư mục chứa file .ejs
    const htmlContent = await renderTemplate(user, path);
    console.log("htmlContent");
    console.log(htmlContent);
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