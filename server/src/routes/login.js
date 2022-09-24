const express = require('express');
const db = require('../util/db')
const security = require('../util/security')

const router = express.Router()

router.get('/', (req, res) => {
    res.send("No login page yet");
})

router.post('/', async (req, res, next) => {
    try {
        const queryUser = {
            text: 'SELECT user_id, passhash, salt_id FROM users WHERE username = $1',
            values: [req.body.username]
        }
        const rows = await db.query(queryUser)
        if (rows.length === 0) {
            return res.status(400).json({ msg: "Invalid username or password" })
        }
        const {user_id: userID, passhash: password, salt_id: saltID} = (await db.query(queryUser))[0];
        const inputPass = req.body.password;
        const realPass = password;
        security.checkPassword(inputPass, realPass, (result) => {
            if (result) {
                req.session.userID = userID;
                req.session.save();
                console.log("userID:", req.session.userID)
                return res.json({ 
                    msg: `Successfully login as user ${userID}`,
                    userID: userID
                });
            }  else {
                return res.status(400).json({ msg: "Invalid username or password" });
            }
        })
    } catch(error) {
        return next(error);
    }

})

module.exports = router