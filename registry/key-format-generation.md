# Ed25519 and X25519 Key Format and Generation

## Introduction

  Cryptographic keys are essential for securing data and communications. In this document, we will explore the generation and format of Ed25519 signing keys and X25519 encryption keys. These keys are critical for data integrity verification, authentication, and secure communication

### Ed25519 Signing Keys

  Ed25519 is an elliptic curve digital signature algorithm. It uses EdDSA (Edwards-curve Digital Signature Algorithm) for secure signing. The key format for Ed25519 signing keys consists of a raw 32 byte private key and a public  key pair.

#### Public Key Format

  The `public key` in `Ed25519` is a 32-byte value. It is represented as a sequence of bytes and can be encoded using base64 or other encoding schemes. The code should handle the public key as a binary raw key base64 encoded.

#### Private Key Format

  The `private key` in `Ed25519` is also a 32-byte binary raw key. It must be kept secret and should never be shared with others. The private key is used for signing data.

#### Ed25519 Key Generation

  The key generation process for Ed25519 signing keys typically involves the following steps:

  `Random Key Pair Generation`:
  A cryptographically secure random number generator is used to generate a random key pair consisting of a public key and a private key.

  `Export Keys`: The generated keys are often kept in their raw binary format for storage or sharing. The public key can be shared, while the private key must be securely stored.

  Refer [rfc8032](https://datatracker.ietf.org/doc/html/rfc8032)

  ```mermaid
    
    sequenceDiagram
    participant RandomGen as Random Number Generator
    participant KeyPairGen as Key Pair Generator
    participant ExportKeys as Export Keys

    RandomGen->>KeyPairGen: Generate random key pair
    KeyPairGen-->>ExportKeys: Receive generated keys
    ExportKeys-->>ExportKeys: Store keys in raw binary format
  ```

#### Key Usage:
  The public key is used by others to verify digital signatures.
  The private key is used to sign data.
  In ONDC use case each request sent and received needs to be signed and verified respectively.
  For signing the private key stored at NPs end shall be used, whereas for verifying NPs signature the NPs keys are fetched from the registry using lookup & vlookup APIs
  The public key is verified before storing in the registry during the subscription process.

### X25519 Encryption Keys
  X25519 is an elliptic curve Diffie-Hellman key exchange algorithm used for secure key exchange. The key format for X25519 encryption keys includes a public key and a private key.
#### Public Key Format
  The public key in X25519 is a 32-byte value. It is typically encoded in ASN.1 DER format, which is a standardized encoding format. The code should handle the public key as an ASN.1 DER-encoded key.
#### Private Key Format
  The private key in X25519 is also a 32-byte binary value, represented as a binary raw key. It should be kept confidential and not shared with others.
#### X25519 Key Generation
  The key generation process for X25519 encryption keys typically involves the following steps:

  `Random Key Pair Generation`: A cryptographically secure random number generator is used to generate a random key pair consisting of a public key and a private key.

  `Export Keys`: The generated private key is typically kept in its raw binary format, while the public key is encoded in ASN.1 DER format for storage or sharing

  Refer [rfc7748](https://datatracker.ietf.org/doc/html/rfc7748)
  ```mermaid
    sequenceDiagram
    participant RandomGen as Random Number Generator
    participant KeyPairGen as Key Pair Generator
    participant ExportKeys as Export Keys

    RandomGen->>KeyPairGen: Generate random key pair
    KeyPairGen-->>ExportKeys: Receive generated keys
    ExportKeys-->>ExportKeys: Keep private key as raw binary
    ExportKeys-->>ExportKeys: Encode public key in ASN.1 DER format

  ```
#### Key Usage:

  The public key is used in key exchange protocols to derive a shared secret. In ONDC use cases the public key is stored in the registry post the subscription process, Counter NP can query the registry and get your public key and use it to create a shared secret.
  The private key is used in key exchange protocols to derive a shared secret. In ONDC use cases the private key is to be kept secure by each NP at their end, Counter NPs public key can be queried by the registry and used to create a shared secret.

  In ONDC use case these shared keys shall be utilised for symmetric encryption of field/payload in specific use case during P2P communication between 2 NPs. 

  The public encryption key for any NP can be fetched from the registry using lookup & vlookup APIs. NPs can use counter NPs public key and their private key to form the shared key.

  The public key is verified before storing in the registry during the subscription process.
### Best Practices
To ensure the security of Ed25519 and X25519 keys:

Keep private keys secure and protect them from unauthorized access.
Use strong random number generators during key pair generation.
### Conclusion
Ed25519 and X25519 keys are fundamental for data security, authentication, and secure communication. The key generation processes are similar, involving random key pair generation and key encoding. It is important to use the appropriate encoding format in your application for each key type as specified.

For specific code in your chosen programming language, please refer to the documentation of relevant cryptographic libraries and frameworks that support Ed25519 and X25519.



  
    
  
