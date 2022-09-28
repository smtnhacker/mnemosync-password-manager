const { v4: uuidv4 } = require('uuid')
const { 
    createDiffieHellman,
    pbkdf2Sync,
    createDecipheriv,
    createCipheriv,
    randomBytes
} = require('node:crypto')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = require('./db')

// const serverDH = createDiffieHellman(2048)
// const ALGORITHM = 'aes-256-gcm'

// exports.serverDH = serverDH

// exports.genServerRandom = () => {
//     return uuidv4().split('-').reduce((total, cur) => total + cur)
// }

// exports.genKey = (serverRandom, clientRandom, premasterSecret, length = 32) => {
//     return pbkdf2Sync(
//         serverRandom+clientRandom+premasterSecret, 
//         'secretsalt',
//         100000,
//         length,
//         'sha512')
// }

// exports.encryptData = (data, key) => {
//     const iv = randomBytes(12).toString('hex')
//     const cipher = createCipheriv(ALGORITHM, key, iv)
//     let encryptData = cipher.update(data)
//     encryptData += cipher.final()
//     const authTag = cipher.getAuthTag()

//     return {
//         iv: iv,
//         authTag: authTag,
//         encryptedData: encryptData
//     }
// }

// exports.decryptData = (data, key, iv, authTag) => {
//     const decipher = createDecipheriv(ALGORITHM, key, iv)
//     decipher.setAuthTag(authTag)
//     let decryptedData = decipher.update(data)
//     decryptedData += decipher.final()

//     return {
//         decryptedData: decryptedData
//     }
// }

exports.genSalt = async () => {
    const salt = await bcrypt.genSalt(saltRounds);
    console.log("Salt:", salt);
    const newSalt = {
        saltID: uuidv4(),
        salt: salt
    };

    const query = {
        text: 'INSERT INTO salts (salt_id, salt) VALUES ($1, $2)',
        values: [newSalt.saltID, newSalt.salt]
    };

    await db.query(query);
    return newSalt;
}

exports.hash = (password, salt, cb) => {
    bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
            console.log("Hash Error:", err);
        } else {
            cb(hash);
        }
    })
}

exports.checkPassword = (password, hash, cb) => {
    bcrypt.compare(password, hash, function(err, res) {
        if (err) {
            console.log("Compare Error:", err);
            onErr();
        } else {
            cb(res);
        }
    })
}