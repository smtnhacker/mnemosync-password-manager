const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')

const db = require('../../util/db')
const { toStandardDateFormat, adjustDate } = require('../../util/formatter')

dotenv.config();
const router = express.Router()
const API_ENDPOINT = process.env.API_ENDPOINT

router.get('/start-practice', async (req, res, next) => {
    const curDate = toStandardDateFormat(new Date());

    try {
        // include the salt in the query
        const query = {
            text: `
                SELECT * 
                FROM entries 
                LEFT OUTER JOIN entry_detail 
                ON entries.entry_detail_id = entry_detail.entry_detail_id
                JOIN salts
                ON salts.salt_id = entries.salt_id
                WHERE user_id = $1 AND (entries.entry_detail_id IS NULL OR due <= $2)`,
            values: [req.session.userID, curDate]
        };
        const entries = await db.query(query);
        return res.json(entries);
    } catch(error) {
        return next(error);
    }
})

router.get('/start-practice/:date', async (req, res, next) => {
    // validate that user is logged in

    try {
        // include the salt in the query
        const query = {
            text: `
                SELECT * 
                FROM entries 
                LEFT OUTER JOIN entry_detail 
                ON entries.entry_detail_id = entry_detail.entry_detail_id
                JOIN salts
                ON salts.salt_id = entries.salt_id
                WHERE user_id = $1 AND (entries.entry_detail_id IS NULL OR due <= $2)`,
            values: [req.session.userID, req.params.date]
        };
        const entries = await db.query(query);
        return res.json(entries);
    } catch(error) {
        return next(error);
    }
})

router.put('/finish-card', async (req, res, next) => {
    try {
        const { entry_id, entry_detail_id, ease, interval } = req.body;
        if(entry_detail_id) {
            const newDue = toStandardDateFormat(adjustDate(new Date(), interval));
            const newInterval = Math.ceil(interval * 1.5);

            const query = {
                text: 'UPDATE entry_detail SET interval=$1, due=$2 WHERE entry_detail_id=$3',
                values: [newInterval, newDue, entry_detail_id]
            };
            await db.query(query);
        }
        else {
            console.log("Cookie:", req.headers.cookie)
            const newEntryDetail = await axios.post(`${API_ENDPOINT}/api/entrydetail/new`);
            console.log('new detail', newEntryDetail.data);
            await axios.put(`${API_ENDPOINT}/api/entry_open/add_detail`, {
                entry_detail_id: newEntryDetail.data.entryDetailID,
                entry_id: entry_id
            });
        }
        return res.json({ msg: `success!` });
    } catch (error) {
        return next(error);
    }
})

module.exports = router