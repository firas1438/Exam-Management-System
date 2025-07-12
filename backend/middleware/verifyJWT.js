const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Vous n\'êtes pas autorisé à accéder à cette ressource' });
    }
    const token=authHeader.split(' ')[1]
    console.log("vérification de l'envoi de token",token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Votre session a expiré' });
        }
        console.log(user.userInfo)
        req.user = user.userInfo.id;
        req.role = user.userInfo.role
        console.log(req.role)
        next();
    });
}

module.exports = verifyJWT