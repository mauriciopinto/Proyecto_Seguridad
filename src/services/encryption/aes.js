import aesjs from "aes-js";
import { Buffer } from "buffer";

export function aes_enc (m, key) {
    let c, bytes;
    let iv = "1234567890123456";

    key = Buffer.from(key, 'utf-8')
    iv = Buffer.from(iv, 'utf-8')
    let AES_CBC = new aesjs.ModeOfOperation.cbc(key,iv);

    bytes = aesjs.utils.utf8.toBytes(m)
    c = AES_CBC.encrypt(bytes)

    return c;
}

export function aes_dec (c, key) {
    let m, bytes;
    let iv = "1234567890123456";
    
    key = Buffer.from(key, 'utf-8')
    iv = Buffer.from(iv, 'utf-8')
    let AES_CBC = new aesjs.ModeOfOperation.cbc(key, iv);

    bytes = AES_CBC.decrypt(c);
    m = aesjs.utils.utf8.fromBytes(bytes);
    
    return m;
}

export function aes_pad_plaintext(m) {
    if (m.length % 16 > 0) {
        let pad = 16 - (m.length % 16)
        for (let i = 0; i < pad; i++) {
            m = m + " "
        }
    }

    return m
}

export function arr_to_bytes(c) {
    return aesjs.utils.utf8.fromBytes(c)
}