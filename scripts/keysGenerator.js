const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

//save the keys in the certs folder
fs.writeFileSync(path.join(__dirname, "../certs/publicKey.pem"), publicKey);
fs.writeFileSync(path.join(__dirname, "../certs/privateKey.pem"), privateKey);
