const jwt = require('jsonwebtoken');
const Register = require('../models/registers');

// function verifyToken(req, res, next) {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ error: 'Access denied' });
//     try {
//         const decoded = jwt.verify(token, 'your-secret-key');
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid token' });
//     }
// };

const auth = async (req, res, next) => {
   try {
    const token = req.cookies.jwt;
    const verifyUser = await jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);

    const user =await Registers.findOne({_id:verifyUser._id})
    console.log(user);
    next();
   } catch (error) {
    res.status(401).send(error);
   }
}

module.exports = auth;