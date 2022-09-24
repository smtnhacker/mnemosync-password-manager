module.exports = {
    requireEncryptedChannel: (req, res, next) => {
        if (!req.isSecure) {
            res.status(400).json({ 
                msg: "Please perform handshake first", 
                url: "/api/security/handshake",
                method: "POST"
            })
        } else {
            next()
        }
    },
    encryptData: (req, res, next) => {
        if (!req.channelKey) {
            res.status(400).json({ msg: "Missing channel key. Please perform handshake again" })
        } else {
            var end = res.end
            res.end = (data, encoding) => {
                // TO-DO: override the automated encryption and decryption of data
            }
        }
    }
}