const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const expiration = process.env.NODE_ENV === "production" ? 
                    process.env.JWTEXPIRATIONPROD : 
                    process.env.JWTEXPIRATIONDEV

exports.createCSRFToken = async (userID) => {
    if (!userID) {
        throw "UserID missing in creating CSRF Token!" 
    }
    return new Promise((res, rej) => {
        jwt.sign({ userID: userID }, process.env.jwtSecret ?? "jwtsecret", { expiresIn: expiration * 3600 }, (err, token) => {
            if (err) {
                rej(err)
            }
            console.log(`Produced ${token} for ${userID}`)
            return res(token);
        })
    })
}