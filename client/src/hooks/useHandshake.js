import { useState, useEffect } from 'react'
import {
    pbkdf2Sync,
    createDiffieHellman,
    createCipheriv,
    createDecipheriv,
    createHash,
    randomBytes
} from 'crypto'

const genKey = (serverRandom, clientRandom, premasterSecret, length = 32) => {
    return pbkdf2Sync(
        serverRandom+clientRandom+premasterSecret, 
        'secretsalt',
        100000,
        length,
        'sha512')
}

const useHandshake = (dependencyArray = []) => {
    const [channelKey, setChannelKey] = useState()

    useEffect(() => {
        const performHandshake = async () => {

            const deleteData = await fetch('http://localhost:8000/api/security/handshake', { 
                method: "DELETE",
                mode: "cors",
                credentials: "include"
            })
            console.log(await deleteData.text())

            const clientRandom = randomBytes(32).toString('hex')
            var res = await fetch('http://localhost:8000/api/security/handshake', {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    clientRandom: clientRandom
                })
            })
            var data = await res.json()

            if (!res.ok) {
                console.log("Handshake failed:\n", data)
                throw new Error(data)
            }

            const {
                serverRandom,
                prime,
                generator,
                serverPublicKey
            } = data

            const clientDH = createDiffieHellman(Buffer.from(prime.data), Buffer.from(generator.data))
            const clientPublicKey = clientDH.generateKeys()

            res = await fetch('http://localhost:8000/api/security/handshake', {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    clientPublicKey: clientPublicKey
                })
            })
            data = await res.json()

            if (!res.ok) {
                console.log("Handshake Failed:\n", data)
                throw new Error(data)
            }

            const sharedSecretRaw = clientDH.computeSecret(Buffer.from(serverPublicKey.data))
            const sharedSecret = createHash('md5').update(sharedSecretRaw).digest('hex')
            var iv = randomBytes(12).toString('hex')
            const cipher = createCipheriv('aes-256-gcm', sharedSecret, iv)
            const premasterSecret = randomBytes(32).toString('hex')
            let encryptedPremasterSecret = cipher.update(premasterSecret, 'hex', 'hex')
            encryptedPremasterSecret += cipher.final('hex')
            var authTag = cipher.getAuthTag()

            res = await fetch('http://localhost:8000/api/security/handshake', {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    premasterSecret: encryptedPremasterSecret,
                    iv: iv,
                    authTag: authTag
                })
            })
            data = await res.json()

            if (!res.ok && res.status !== 300) {
                console.log("Handshake Failed:\n", data)
                throw new Error(data)
            }

            const _channelKey = genKey(serverRandom, clientRandom, premasterSecret, 16).toString('hex')
            setChannelKey(_channelKey)

            iv = randomBytes(12).toString('hex')
            const pingCipher = createCipheriv('aes-256-gcm', _channelKey, iv)
            var encrypted = pingCipher.update('ping', 'utf8', 'hex')
            encrypted += pingCipher.final('hex')
            authTag = pingCipher.getAuthTag()

            res = await fetch('http://localhost:8000/api/security/ping-pong', {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    payload: encrypted,
                    iv: iv,
                    authTag: authTag
                })
            })
            data = await res.json()

            if (!res.ok) {
                console.log("Ping-Pong failed:\n", data)
                throw new Error(data)
            }

            const pongDecipher = createDecipheriv('aes-256-gcm', _channelKey, data.iv)
            pongDecipher.setAuthTag(Buffer.from(data.authTag))
            let plaintext = pongDecipher.update(data.payload, 'hex', 'utf8')
            plaintext += pongDecipher.final('utf8')

            if (plaintext === "pong") {
                console.log("Channel encrypted!")
            } else {
                console.log("Channel encryption failed")
            }
        }
        performHandshake()
    }, dependencyArray)

    return channelKey
}

export default useHandshake