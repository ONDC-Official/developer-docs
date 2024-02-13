const nacl = require("tweetnacl");
const { randomBytes } = require("crypto");

function generateKeyPairs() {
  // Generate signing key pair
  const signingKeyPair = nacl.sign.keyPair();

  // Generate X25519 key pair for encryption
  const encryptionKeyPair = nacl.box.keyPair.fromSecretKey(
    randomBytes(nacl.box.secretKeyLength)
  );

  return {
    Signing_private_key: Buffer.from(signingKeyPair.secretKey).toString(
      "base64"
    ),
    Signing_public_key: Buffer.from(signingKeyPair.publicKey).toString(
      "base64"
    ),
    Encryption_Privatekey: Buffer.from(encryptionKeyPair.secretKey).toString(
      "base64"
    ),
    Encryption_Publickey: Buffer.from(encryptionKeyPair.publicKey).toString(
      "base64"
    ),
  };
}

// Example usage:
const keyPairs = generateKeyPairs();
console.log(keyPairs);
