const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]
    if (!token) return res.status(401).json({ msg: 'No token provided!' })
    // if (!token) return res.status(401).json({msg: 'Unauthorized or Invalid token!'})

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await User.findById(decoded.id)
        if (user) {
            req.user = user
            console.log(user, 'decoded');

            next()
        }
        else {
            return res.status(403).json({ msg: 'Login required' })
        }
    } catch (error) {
        res.status(403).json({ msg: 'Login required' })
    }
}

module.exports = verifyToken  