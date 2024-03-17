const jwt = require('jsonwebtoken');
const mongoService = require('../api/services/mongoService');
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    console.log(authHeader);
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        console.log(user);
        next();
    });
}
async function authorizationMiddleware(req, res, next) {
    const jwtuser = req.user;
    try {
        const roles = await mongoService.findDocuments(collectionName, { _id: new ObjectId(jwtuser.role_id) });
        const role = roles[0] || null;

        if (role == null || !role.isAdmin) {
            return res.status(403).json({ message: "Không có quyền thực hiện hành động này" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
    }
}
module.exports = { authenticateToken,authorizationMiddleware};