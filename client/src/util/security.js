import {
    pbkdf2Sync,
    createCipheriv,
    createDecipheriv,
    createHash,
    randomBytes
} from 'crypto'

const ALGORITHM = 'aes-256-gcm'

// still not sure if these are optimal IV and salt values
const genIV = () => {
    return randomBytes(12).toString('hex');
}

const genSalt = () => {
    return randomBytes(12).toString('hex');
}

const encrypt = (plainText, password, _salt, _iv) => {
    const salt = _salt ?? genSalt();
    const key = pbkdf2Sync(password, salt, 100000, 16, 'sha512').toString("hex");
    const iv = _iv ?? genIV();
    const cipher = createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex'); 

    console.dir({
        operation: "Encryption",
        plainText: plainText,
        key: key,
        salt: salt,
        iv: iv,
        authTag: authTag,
        result: encrypted
    });

    return { 
        encrypted: encrypted, 
        authTag: authTag, 
        iv: iv,
        salt: salt 
    };
}

const decrypt = (encryptedText, password, salt, iv, authTag) => {
    const key = pbkdf2Sync(password, salt, 100000, 16, 'sha512').toString("hex");
    const decipher = createDecipheriv(ALGORITHM, key, iv);

    console.dir({
        operation: "Decryption",
        encryptedText: encryptedText,
        key: key,
        authTag: authTag,
        iv: iv,
        salt: salt
    });

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let plainText = decipher.update(encryptedText, 'hex', 'utf-8');
    plainText += decipher.final('utf-8');

    console.dir({
        operation: "Decryption",
        result: plainText
    });

    return plainText;
}

export { encrypt, decrypt }