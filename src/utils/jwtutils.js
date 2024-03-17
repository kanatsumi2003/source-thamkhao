const jwt = require('jsonwebtoken');

async function encodejwt(user){
    // Tạo token JWT
    const token = jwt.sign(
        { userId: user._id,
        roleId: user.role_id },
        process.env.REACT_APP_JWT_SECRET,
        { expiresIn: process.env.REACT_APP_EXPIRE_TOKEN }
    );
    console.log(token);
    return  token;
}
async function decodejwt(jwtToken){
    jwt.verify(jwtToken, process.env.REACT_APP_JWT_SECRET, (err, user) => {
        if (err) return null;
        console.log(user);
        return user;
    });
}
module.exports = {
    encodejwt,
    decodejwt
};