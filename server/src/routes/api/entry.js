const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { pool } = require('../../util/db')

const db = require('../../util/db')

const router = express.Router()

router.get('/list', async (req, res, next) => {
    try {
        const query = {
            text: `
                SELECT * 
                FROM entries
                JOIN salts ON salts.salt_id=entries.salt_id 
                WHERE user_id=$1`,
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

router.get("/count_due", async (req, res, next) => {
    try {
        const data = await db.query(`
            SELECT COUNT(*)
            FROM entries
            LEFT OUTER JOIN entry_detail
            ON entries.entry_detail_id=entry_detail.entry_detail_id
            WHERE user_id=$1 AND (entries.entry_detail_id IS NULL OR due <= NOW())
        `, [req.session.userID])
        return res.json(data[0].count)
    } catch (err) {
        return next(err)
    }
})

router.get('/:entryID', async (req, res, next) => {
    // validate that the entry exists

    try {
        const query = {
            text: `
                SELECT * 
                FROM entries 
                JOIN salts ON entries.salt_id = salts.salt_id
                WHERE entry_id = $1`,
            values: [req.params.entryID]
        };

        const data = await db.query(query);
        if (data.length === 0) {
            return res.status(400).json({ msg: "Invalid entryID" });
        } else {
            return res.json(data[0]);
        }

    } catch(error) {
        return next(error);
    }
})


router.post('/new', async (req, res, next) => {
    // validate that the entry is valid
    // const { salt, saltID } = await security.genSalt();
    const { salt, iv, authTag } = req.body;
    const saltID = uuidv4();
    
    const newEntry = {
        entryID: uuidv4(),
        userID: req.session.userID,
        sitename: req.body.sitename,
        username: req.body.username,
        password: req.body.password,
        saltID: saltID,
        entryDetailID: ''
    };
    
    if (!newEntry.userID) {
        return res.status(400).json({ msg: 'Please login first' });
    } else if (!newEntry.username || !newEntry.sitename) {
        return res.status(400).json({ msg: 'Please supply all the needed information' });
    } else if (!iv || !authTag || !salt) {
        return res.status(400).json({ msg: "Please provide a randonly generated IV and salt and AES-GCM authTag"})
    } else {
        // Create a transaction to ensure that either the
        // salt and newEntry are added, or none are added

        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            await client.query(`
                INSERT INTO salts (salt_id, salt, iv, authTag)
                VALUES ($1, $2, $3, $4)`,
                [saltID, salt, iv, authTag]);
            await client.query(`
                INSERT INTO entries(entry_id, user_id, sitename, username, passhash, salt_id)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [   newEntry.entryID,
                    newEntry.userID,
                    newEntry.sitename,
                    newEntry.username,
                    newEntry.password,
                    newEntry.saltID
                ]);
            await client.query('COMMIT');
            client.release();
            return res.json({
                ...newEntry,
                saltID: saltID
            })
        } catch (err) {
            await client.query('ROLLBACK');
            client.release();
            return next(err);
        } 
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
        const { entry_id, sitename, username, password, authTag, saltID } = req.body;

        if (!entry_id) {
            return res.status(400).json({ msg: "Please provide complete information" });
        }

        // get the entry_detail_id (if it exists)
        let query = {
            text: 'SELECT * FROM entries WHERE entry_id=$1',
            values: [entry_id]
        };
        const curEntry = (await db.query(query))[0];
        
        // update the entry and erase the details (act as if new)
        const newSitename = sitename || curEntry.sitename;
        const newUsername = username || curEntry.username;
        const newPasshash = password || curEntry.passhash;
        
        // create a transaction to make changes atomic
        const client = await pool.connect();

        try {

            await client.query('BEGIN');

            // update salts authTag
            // if passhash is changed
            if (authTag) {
                await client.query(`
                    UPDATE salts
                    SET authtag=$1
                    WHERE salt_id=$2
                `, [authTag, saltID]);
            }

            // update actual passhash if changed
            await client.query(`
                UPDATE entries
                SET sitename=$1, username=$2, passhash=$3, entry_detail_id=NULL
                WHERE entry_id=$4
            `, [newSitename, newUsername, newPasshash, entry_id])

            // delete previous details
            if (curEntry.entry_detail_id) {
                await client.query(`
                    DELETE FROM entry_detail
                    WHERE entry_detail_id=$1
                `, [curEntry.entry_detail_id])
            }

            await client.query('COMMIT')
            client.release();
            return res.json({ msg: `Successfully updated entry with id ${entry_id}` });

        } catch (err) {
            await client.query('ROLLBACK');
            client.release();
            return next(err);
        }

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
        res.send("Deleted")
    } catch(error) {
        return next(error);
    }
})

module.exports = router