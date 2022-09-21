module.exports = app => {
    app.use('/login', require('./login'))
    app.use('/logout', require('./logout'))
    app.use('/api/users', require('./api/users'))
    app.use('/api/entry', require('./api/entry'))
    app.use('/api/entrydetail', require('./api/entrydetail'))
    app.use('/api/practice', require('./api/practice'))
    app.use('/api/security', require('./api/security'))
}