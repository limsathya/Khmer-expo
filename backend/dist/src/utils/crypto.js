"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const crypto_js_1 = require("crypto-js");
const KEY = process.env.ENCRYPTION_KEY ?? '';
function encrypt(text) {
    if (!KEY)
        throw new Error('ENCRYPTION_KEY is not set');
    return crypto_js_1.default.AES.encrypt(text, KEY).toString();
}
function decrypt(cipher) {
    if (!KEY)
        throw new Error('ENCRYPTION_KEY is not set');
    const bytes = crypto_js_1.default.AES.decrypt(cipher, KEY);
    return bytes.toString(crypto_js_1.default.enc.Utf8);
}
//# sourceMappingURL=crypto.js.map