const path = require('path')
const express = require('express')
const sessions = require('express-session')
const cors = require('cors')

const dotenv = require('dotenv')
dotenv.config()

const app = express()

// Set-up request parsing
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'HEAD'],
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Set-up Cross-Origin access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'XSRF-TOKEN, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
})

// Set-up persistent sessions
app.use(sessions({
    store: new (require('connect-pg-simple')(sessions))({
        pool: require('./src/util/db').pool
    }),
    secret: process.env.sessionSecret || "secret",
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * (process.env.COOKIE_MAX_AGE || 1), // 24 hours for DEV only, must be 1 hr in PROD
        path: '/',
        sameSite: 'none',
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    }, 
    resave: false
}))

// Set-up routers
const mountRoutes = require('./src/routes')
mountRoutes(app);

app.get('/api/up', (req, res) => {
    res.status(200).end();
})

// Serve static files
app.use(express.static(path.join(__dirname + '/src/public')))

// Set-up homepage
// app.get('*', async (req, res) => {
//     console.log("Session:", req.session);
//     res.sendFile("index.html", { root: __dirname + '/src/public' })
// })

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`))