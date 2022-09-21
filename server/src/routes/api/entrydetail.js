const express = require('express')
const { v4: uuidv4 } = require('uuid')

const db = require('../../util/db')
const { getTomorrow, toStandardDateFormat } = require('../../util/formatter')

const router = express.Router()

router.post('/new', async (req, res, next) => {
    // validate that entryID exists

    const newEntryDetail = {
        entryDetailID: uuidv4(),
        ease: 2.0,
        interval: 1,
        due: toStandardDateFormat(getTomorrow())
    };

    try {
        const query = {
            text: 'INSERT INTO entry_detail (entry_detail_id, ease, interval, due) VALUES ($1, $2, $3, $4)',
            values: [newEntryDetail.entryDetailID, newEntryDetail.ease, newEntryDetail.interval, newEntryDetail.due]
        };
        await db.query(query);
        return res.json(newEntryDetail);
    } catch(error) {
        return next(error);
    }
})

router.put('/update', async (req, res, next) => {
    //validate that entryDetailID exists

    try {
        throw "Unimplemented";
        return res.json(newBody);
    } catch(error) {
        return next(error);
    }
})

module.exports = router