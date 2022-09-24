const express = require('express')
const { v4: uuidv4 } = require('uuid')

const db = require('../../util/db')
const security = require('../../util/security')
const { reqAuthenticate } = require('../../middleware/auth')

const router = express.Router()

router.get('/', (req, res) => {
    if(req.session.userID) {
        return res.send(req.session.userID);
    }
    else {
        return res.send('No User')
    }
})

router.post('/', async (req, res, next) => {
    // validate that the userID exists

    try {
        const query = {
            text: 'SELECT username FROM users WHERE user_id = $1',
            values: [req.body.userID]
        };
        const { username } = (await db.query(query))[0];
        return res.send(username);
    } catch(error) {
        return next(error);
    }
})

router.post('/new', async (req, res, next) => {

    // validate for username and password first!!!
    // validate that the username is unique

    // assume that the parameters are valid

    try {
        
        const {salt, saltID} = await security.genSalt(); 
        security.hash(req.body.password, salt, async (password) => {
            // const password = req.body.password;
            const newUser = {
                userID: uuidv4(),
                username: req.body.username,
                password: password,
                saltID: saltID
            };
            
            // Create an empty user info
            await db.query('INSERT INTO user_info (user_id) VALUES ($1)', [newUser.userID]);
        
            const query = {
                text: 'INSERT INTO users (user_id, username, passhash, salt_id) VALUES ($1, $2, $3, $4)',
                values: [newUser.userID, newUser.username, newUser.password, newUser.saltID]
            };
            await db.query(query);
            return res.json(newUser);
        });

    } catch (error) {
        return next(error);
    }

})

router.put('/update', reqAuthenticate, async (req, res, next) => {

    // validate if user exists
    // validate if the data is valid

    // assume data is valid

    try {
        const query = {
            text: 'SELECT salt_id FROM users WHERE user_id = $1',
            values: [req.body.userID]
        };
        const { salt_id: saltID } = (await db.query(query))[0];
        const salt = await db.getSalt(saltID);
        security.hash(req.body.password, salt, async (newPassword) => {
            // const newPassword = req.body.password ;
            const queryUpdate = {
                text: 'UPDATE users SET passhash=$1 WHERE user_id=$2',
                values: [newPassword, req.body.userID]
            };
            await db.query(queryUpdate);
            return res.json({ msg: 'Successfully updated user!'});
        }); 
    } catch(error) {
        return next(error);
    }

})

router.delete('/delete', reqAuthenticate, async (req, res, next) => {

    // validate if user exists

    // assume data is valid

    try {
        const query = {
            text: 'DELETE FROM users WHERE user_id=$1',
            values: [req.body.userID]
        };
        await db.query(query);
        return res.json({ msg: 'Successfully deleted user!'});
    } catch(error) {
        return next(error);
    }
})

module.exports = router