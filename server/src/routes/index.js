const { reqAuthenticate } = require('../middleware/auth')

module.exports = app => {
    app.use('/login', require('./login'))
    app.use('/logout', require('./logout'))
    app.use('/api/users', require('./api/users'))
    app.use('/api/entry', reqAuthenticate, require('./api/entry'))
    app.use('/api/entrydetail', reqAuthenticate, require('./api/entrydetail'))
    app.use('/api/practice', reqAuthenticate, require('./api/practice'))
    app.use('/api/security', require('./api/security'))
}