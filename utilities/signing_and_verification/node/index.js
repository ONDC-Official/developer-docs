const nacl = require("tweetnacl");
const crypto = require("crypto");

function generateKeyPairs() {
  const signingKeyPair = nacl.sign.keyPair();
  const { privateKey, publicKey } = crypto.generateKeyPairSync('x25519', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return {
    Signing_private_key: Buffer.from(signingKeyPair.secretKey).toString(
      "base64"
    ),
    Signing_public_key: Buffer.from(signingKeyPair.publicKey).toString(
      "base64"
    ),
    Encryption_Privatekey: privateKey.toString('utf-8')
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s/g, ''),
    Encryption_Publickey: publicKey.toString('utf-8')
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s/g, ''),
  };
}

const keyPairs = generateKeyPairs();
console.log(keyPairs);
