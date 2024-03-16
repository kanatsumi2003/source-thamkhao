const BaseModel = require('./baseModel');

class User {
    constructor(email, username, password, phoneNumber) {
        this.email = email;
        this.username = username;
        this.password = password; // Nhớ băm mật khẩu trước khi lưu
        this.phoneNumber = phoneNumber;
        this.emailConfirmed = false;
        this.phoneConfirmed = false;
    }
}

class UserWithBase extends BaseModel {
    constructor(user) {
        super();
        Object.assign(this, user);
    }
}

module.exports = { User, UserWithBase };   