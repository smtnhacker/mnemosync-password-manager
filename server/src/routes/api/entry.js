const express = require('express')
const { v4: uuidv4 } = require('uuid')

const db = require('../../util/db')
const security = require('../../util/security')

const router = express.Router()

router.get('/list', async (req, res, next) => {
    try {
        const query = {
            text: 'SELECT * FROM entries WHERE user_id=$1',
            values: [req.session.userID]
        };
        const data = await db.query(query);
        return res.json(data);
    } catch(error) {
        return next(error);
    }
})

router.get("/count", async (req, res, next) => {
    try {
        const query = {
            text: 'SELECT COUNT(*) FROM entries WHERE user_id=$1',
            values: [req.session.userID]
        }
        const data = await db.query(query)
        return res.json(data[0].count)
    } catch(error) {
        return next(error)
    }
})

router.get('/:entryID', async (req, res, next) => {
    // validate that the entry exists

    try {
        const query = {
            text: 'SELECT * FROM entries WHERE entry_id = $1',
            values: [req.params.entryID]
        };
        const entry = (await db.query(query))[0];
        return res.json(entry);
    } catch(error) {
        return next(error);
    }
})


router.post('/new', async (req, res, next) => {
    // validate that the entry is valid

    try {
        const { salt, saltID } = await security.genSalt();
        // actually, the client side also performs an encryption
        // so this is just extra encryption
        // const password = encrypt(req.body.password, salt);
        const password = req.body.password;
        
        const newEntry = {
            entryID: uuidv4(),
            userID: req.session.userID,
            sitename: req.body.sitename,
            username: req.body.username,
            password: password,
            saltID: saltID,
            entryDetailID: ''
        };
    
        if(!newEntry.userID) {
            return res.status(400).json({ msg: 'Please login first' });
        }
        else if(!newEntry.username || !newEntry.sitename) {
            return res.status(400).json({ msg: 'Please supply all the needed information' });
        }
        else {
            const query = {
                text: `INSERT INTO entries (entry_id, user_id, sitename, username, passhash, salt_id)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                values: [newEntry.entryID, newEntry.userID, newEntry.sitename, newEntry.username, newEntry.password, newEntry.saltID]
            };
            await db.query(query);
            return res.json(newEntry);
        }
    } catch(error) {
        return next(error);        
    }
})

router.put('/add_detail', async (req, res, next) => {
    // validate that the entry_detail exists

    try {
        const { entry_detail_id, entry_id } = req.body;
        const query = {
            text: 'UPDATE entries SET entry_detail_id=$1 WHERE entry_id=$2',
            values: [entry_detail_id, entry_id]
        };
        await db.query(query);
        return res.json({ msg: `Successfully updated ${entry_id} with ${entry_detail_id}!` });
    } catch(error) {
        return next(error);
    }
})

router.put('/update_detail', async (req, res, next) => {
    try {
        const {
            entry_id, sitename, username, password
        } = req.body;
        // hash hash password
        const passhash = password;

        // get the entry_detail_id (if it exusts)
        let query = {
            text: 'SELECT * FROM entries WHERE entry_id=$1',
            values: [entry_id]
        };
        const curEntry = (await db.query(query))[0];
        
        // update the entry and erase the details (act as if new)
        const newSitename = sitename || curEntry.sitename;
        const newUsername = username || curEntry.username;
        const newPasshash = passhash || curEntry.passhash;
        
        query = {
            text: 'UPDATE entries SET sitename=$1, username=$2, passhash=$3, entry_detail_id=NULL WHERE entry_id=$4',
            values: [newSitename, newUsername, newPasshash, entry_id]
        };
        await db.query(query);
        
        // if detail already exist, delete it
        if(curEntry.entry_detail_id) {
            query = {
                text: 'DELETE FROM entry_detail WHERE entry_detail_id=$1',
                values: [curEntry.entry_detail_id]
            };
            await db.query(query);
        }

        return res.json({ msg: `Successfully updated ${entry_id}!` });

    } catch(error) {
        return next(error);
    }
})

router.delete('/:entryID', async (req, res, next) => {
    // validate that entryID exists
    const entry_id = req.params.entryID;

    try {
        // get the detail (for deletion too)
        let query = {
            text: 'SELECT entry_detail_id FROM entries WHERE entry_id=$1',
            values: [entry_id]
        };
        const { entry_detail_id } = await db.query(query);

        // delete the entry
        query = {
            text: 'DELETE FROM entries WHERE entry_id=$1',
            values: [entry_id]
        };
        await db.query(query);

        // delete the entry detail
        query = {
            text: 'DELETE FROM entry_detail WHERE entry_detail_id=$1',
            values: [entry_detail_id]
        };
        await db.query(query);
    } catch(error) {
        return next(error);
    }
})

module.exports = router