const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { pool } = require('../../util/db')

const db = require('../../util/db')

const router = express.Router()


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

module.exports = router