const BaseModel = require('./baseModel');

class SessionLogin {
    constructor(userid, email, name, username, jwttoken,refreshToken,ExpireRefreshToken, expireDate, deviceId, ipAddress) {
        this.userId = userid;
        this.email = email.toLowerCase(); // Storing the email in lowercase
        this.name = name; // Storing the name
        this.username = username; // Storing the username
        this.jwttoken = jwttoken; // Storing the JWT token
        this.refreshToken = refreshToken; // Storing the JWT token
        this.ExpireRefreshToken = ExpireRefreshToken; // Storing the JWT token
        this.expireDate = expireDate; // Storing the expiration date
        this.deviceId = deviceId; // Storing the device ID
        this.ipAddress = ipAddress; // Storing the IP address
    }
}

class SessionWithBase extends BaseModel {
    constructor(session) {
        super();
        Object.assign(this, session);
    }
}

module.exports = { SessionLogin, SessionWithBase };   