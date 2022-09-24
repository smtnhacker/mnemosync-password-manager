module.exports = {
    reqAuthenticate: (req, res, next) => {
        if (!req.session.userID) {
            return res.status(401).end();
        } else {
            next();
        }
    }
}