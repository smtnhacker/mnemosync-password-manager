module.exports = {
    reqAuthenticate: (req, res, next) => {
        if (!req.session.userID) {
            console.log("reqAuthenticate Error:", req.originalUrl, req.session)
            return res.status(401).end();
        } else {
            next();
        }
    }
}