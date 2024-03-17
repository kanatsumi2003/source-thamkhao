const mongoose = require('mongoose'); // Import module mongoose
const BaseModel = require('./baseModel');

class User {
    constructor(email, username, password, phoneNumber,role_id) {
        this.email = email;
        this.role_id = new mongoose.Types.ObjectId(role_id); // Chuyển đổi role_Id thành ObjectId
        this.username = username;
        this.password = password; // Nhớ băm mật khẩu trước khi lưu
        this.phoneNumber = phoneNumber;
        this.emailConfirmed = false;
        this.phoneConfirmed = false;

        // Kiểm tra nếu role_id không phải là ObjectId hợp lệ
        // if (!mongoose.Types.ObjectId.isValid(role_Id)) {
        //     throw new Error('role_id phải là ObjectId hợp lệ của MongoDB');
        // }
    }
}

class UserWithBase extends BaseModel {
    constructor(user) {
        super();
        Object.assign(this, user);
    }
}

module.exports = { User, UserWithBase };   