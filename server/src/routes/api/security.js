const express = require('express')
const { createDecipheriv, createCipheriv, randomBytes, createHash } = require('node:crypto')

const { 
    serverDH, 
    genServerRandom,
    genKey
} = require('../../util/security')

const router = express.Router()

router.post('/handshake', (req, res) => {
    if(req.session.channelKey && req.session.isSecure) {
        return res.status(300).json({ 
            msg: "Channel already secure. To remove handshake, please post a delete request instead", 
        })
    }

    if (!req.session.clientRandom) {
        const clientRandom = req.body.clientRandom
        if (!clientRandom) {
            res.status(400).json({ msg: "Please send a client random" })
        } else {
            const serverRandom = genServerRandom()
            req.session.clientRandom = clientRandom
            req.session.serverRandom = serverRandom
            req.session.save()
            res.json({ 
                serverRandom: serverRandom, 
                prime: serverDH.getPrime(),
                generator: serverDH.getGenerator(),
                serverPublicKey: serverDH.generateKeys()
             })
        }
    } else if (!req.session.sharedSecret) {
        const clientPublicKey = req.body.clientPublicKey
        if (!clientPublicKey) {
            res.status(400).json({ msg: "Please send a DH public key" })
        } else {
            const sharedSecretRaw = serverDH.computeSecret(Buffer.from(clientPublicKey.data))
            const sharedSecret = createHash('md5').update(sharedSecretRaw).digest('hex')
            req.session.sharedSecret = sharedSecret
            res.json({ msg: "Shared secret computed. Please send an encrypted premaster secret" })
        }
    } else if (!req.session.channelKey) {
        const encryptedPremasterSecret = req.body.premasterSecret
        const iv = req.body.iv
        if (!encryptedPremasterSecret) {
            res.status(400).json({ msg: "Please send a premaster secret" })
        } else {
            const authTag = Buffer.from(req.body.authTag)
            const decipher = createDecipheriv('aes-256-gcm', req.session.sharedSecret, iv)
            decipher.setAuthTag(authTag)
            let premasterSecret = decipher.update(encryptedPremasterSecret, 'hex', 'hex')
            premasterSecret += decipher.final('hex')

            const serverRand = req.session.serverRandom
            const clientRand = req.session.clientRandom
            const channelKey = genKey(serverRand, clientRand, premasterSecret, 16).toString('hex')

            req.session.channelKey = channelKey
            req.session.save()
            res.status(300).json({ msg: "Please send an encrypted \"ping\" once ready", url: "/ping-pong" })
        }
    } else {
        res.status(400).json({ msg: "Something went wrong" })
    }
})

router.delete("/handshake", (req, res) => {
    req.session.clientRandom = null
    req.session.serverRandom = null
    req.session.sharedSecret = null
    req.session.channelKey = null
    req.session.isSecure = false
    res.send('Deleted handshake')
})

router.post("/ping-pong", (req, res) => {
    const { payload } = req.body
    if (!req.session.channelKey) {
        res.status(401).json({ msg: "Please perform a handshake first", url: "/handshake", method: "POST"})
    } else if (!payload) {
        res.status(400).json({ msg: "Put the ping in the payload" })
    } else {
        var iv = req.body.iv
        var authTag = Buffer.from(req.body.authTag)
        const decipher = createDecipheriv('aes-256-gcm', req.session.channelKey, iv)
        decipher.setAuthTag(authTag) 

        let plaintext = decipher.update(payload, 'hex', 'utf8')
        plaintext += decipher.final('utf8')

        if (plaintext === 'ping') {
            req.session.isSecure = true
            req.session.save()
            randomBytes(12, (err, buf) => {
                if (err) {
                    console.log(err)
                    res.status(500).send("Something went wrong in encryption :(")
                    throw err
                }
                iv = buf.toString('hex')
                const cipher = createCipheriv('aes-256-gcm', req.session.channelKey, iv)
                let encrypted = cipher.update('pong', 'utf8', 'hex')
                encrypted += cipher.final('hex')
                
                res.json({ payload: encrypted, iv: iv, authTag: cipher.getAuthTag() })
            })
        } else {
            res.status(400).json({ msg: "Please send \"ping\" for verification"})
        }
    }
})

module.exports = router