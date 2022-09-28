const { reqAuthenticate } = require('../middleware/auth')
const { reqCSRFToken } = require('../middleware/csrf')

module.exports = app => {
    app.use('/api/login', require('./login'))
    app.use('/api/logout', require('./logout'))
    app.use('/api/users', require('./api/users'))
    app.use('/api/entry', reqAuthenticate, reqCSRFToken, require('./api/entry'))
    app.use('/api/entry_open', require('./api/entry_open'))
    app.use('/api/entrydetail', require('./api/entrydetail'))
    app.use('/api/practice', reqAuthenticate, reqCSRFToken, require('./api/practice'))
    app.use('/api/security', require('./api/security'))
}