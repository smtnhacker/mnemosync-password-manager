import {
    pbkdf2Sync,
    createDiffieHellman,
    createCipheriv,
    createDecipheriv,
    createHash,
    randomBytes
} from 'crypto'

const encrypt = (plainPassword, master="") => {
    console.log("To be implemented")
    return plainPassword;
}

const decrypt = (hashedPassword, master="") => {
    console.log("To be implemented")
    return hashedPassword;
}

export { encrypt, decrypt }