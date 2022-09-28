const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.PGUser,
    host: process.env.PGHost,
    database: process.env.PGDatabase,
    password: process.env.PGPassword,
    port: process.env.PGPort
});

module.exports = {
    pool: pool,
    query: async (query) => {
        console.log('Queried:\n', query)
        const res = await pool.query(query)
        console.log(res.rows)
        return res.rows
    },
    query: async (text, params) => {
        console.log('Queried:\n', text, params)
        const res = await pool.query(text, params)
        console.log(res.rows);
        return res.rows;
    },
    getSalt: async (saltID) => {
        const query = {
            text: 'SELECT salt FROM salts WHERE salt_id = $1',
            values: [saltID]
        };
        return (await pool.query(query))[0];
    } 
}