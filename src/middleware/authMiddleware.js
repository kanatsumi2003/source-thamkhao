const jwt = require('jsonwebtoken');
const { findSessionByToken, deleteSession } = require('../api/services/sessionService');
const { findById } = require('../api/services/roleService');
const moment = require('moment-timezone');
const mongoose = require('mongoose'); // Import module mongoose

function authenticateToken(req, res, next) {
    console.log("authenticateToken");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.sendStatus(401); // No token provided
    }

    // Find the session associated with the token
    findSessionByToken(token).then(session => {

        if (!session) {
            return res.sendStatus(401); // No session found for this token
        }

        // Check if the token is expired
        // const now = new Date();
        const now = moment();
        console.log(now);
        console.log(session.expireDate);
        console.log("aaaaaaaaaaaaaaaaaaa");
        if (session.expireDate < now) {
            // Token has expired, delete the session
            deleteSession(session._id).then(() => {
                return res.sendStatus(401); // Unauthorized due to expired token
            });
        } else {
            // Verify the token is valid and not tampered with
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, user) => {
                if (err) {
                    return res.sendStatus(403); // Token is invalid
                }
                req.user = user; // Attach the user to the request object
                req.session = session; // Attach the session to the request object
                next(); // Proceed to the next middleware or request handler
            });
        }
    }).catch(err => {
        console.error(err);
        return res.sendStatus(500); // Internal server error
    });
}
function authorizationMiddleware(requiredRoles) {
    return (req, res, next) => {
        const jwtuser = req.user;
        console.log("requiredRoles",requiredRoles);
        console.log("jwtuser ",jwtuser.roleId);
        findById(new mongoose.Types.ObjectId(jwtuser.roleId)).then(userRole => {
            // Kiểm tra vai trò của người dùng
        console.log("findById(jwtuser.roleId).then(userRole ",userRole);

            if (!userRole || !requiredRoles.includes(userRole.name)) {
                return res.status(403).json({ message: "Không có quyền thực hiện hành động này" });
            }
            next();
        }).catch(error => {
            console.error(error);
            return res.status(500).json({ message: "Lỗi máy chủ" });
        });
    };
}

module.exports = { authenticateToken, authorizationMiddleware };