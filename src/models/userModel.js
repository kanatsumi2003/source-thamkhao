const mongoose = require('mongoose'); // Import module mongoose
const BaseModel = require('./baseModel');
const { hashPassword, comparePassword } = require('../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const bcrypt = require('bcryptjs');

class User {
    constructor(email, username, password, phoneNumber,role_id) {
        this.email = email;
        
        this.username = username.toLowerCase();
        this.password = password; // Nhớ băm mật khẩu trước khi lưu
        this.phoneNumber = phoneNumber;
        this.emailConfirmed = false;
        this.phoneConfirmed = false;
        console.log("UserModel ");
        console.log(role_id);
        // Kiểm tra nếu role_id không phải là ObjectId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(role_id)) {
            this.role_id = new mongoose.Types.ObjectId(role_id); // Chuyển đổi role_Id thành ObjectId
            console.log("this.role_id = new mongoose.Types.ObjectId(role_id);");

        }else{
            this.role_id = role_id; 
            console.log("this.role_id");
        }

    }
    async isCorrectPassword(plainPassword) {
        try {
            console.log("isCorrectPassword");
            console.log(plainPassword)
            console.log(this.password)
            // So sánh mật khẩu đã băm trong cơ sở dữ liệu với mật khẩu dạng văn bản rõ ràng đã được nhập
            return await bcrypt.compare(plainPassword, this.password);
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return false;
        }
    }
}

class UserWithBase extends BaseModel {
    constructor(user) {
        super();
        Object.assign(this, user);
    }
}

module.exports = { User, UserWithBase };   