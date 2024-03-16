const jwt = require('jsonwebtoken');

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
module.exports = { authenticateToken};