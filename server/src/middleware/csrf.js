const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// ENV must contain the JWT key
// and JWT expiration interval
dotenv.config()

module.exports = {
    reqCSRFToken: async (req, res, next) => {
        const token = req.header('XSRF-TOKEN')
        if (!token) {
            return res.status(401).json({ msg: "Missing Token" })
        }

        jwt.verify(token, process.env.JWTSECRET, (err, payload) => {
            if (err) {
                console.log("JWT: verification failed", token)
                return next(err)
            }

            const userID = payload.userID
            if (!userID || userID !== req.session.userID) {
                return res.status(400).json({ msg: "Invalid Token" })
            } else {
                console.log(`Request from ${userID} verified`)
                next()
            }
        })
    }
}