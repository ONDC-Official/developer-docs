### Encryption & Decryption

This document outlines a secure communication protocol between Network Participant 1 (NP1) and Network Participant 2 (NP2) utilising the AES-GCM encryption algorithm.
The communication process involves NP1 fetching the public keys of NP2 from a registry which are already exchanged during the subscription process, creating a shared key with its private key, and using this shared key to encrypt data for transmission to NP2.

The same cryptographic constructs and key exchange mechanism described below are applicable for **field-level encryption**, **payload encryption**, and **opaque blob encryption**.

---

#### Communication Steps

* **Public Key Retrieval from Registry:**

  * NP1 initiates the communication process by fetching the public keys of NP2, a step facilitated during the subscription process.

* **Shared Key Generation:**

  * NP1 utilizes its private key & the fetched public key to generate a shared key, this process employs the Diffie-Hellman key exchange algorithm.

```
// Calculate the shared secret key using Diffie-Hellman
const sharedKey = crypto.diffieHellman({
  privateKey: MC4CAQEwBQYDK2VuBCIEIMCU0uKQ36pRs4d9Jm0aUD9Pn6qq+747AY2Kv4UhE/94,
  publicKey: MCowBQYDK2VuAyEA2qqMXULrFHhJCJEI38WnTtwojAtf9cZ3BsUid5Goah4=,
});
```

* **Data Encryption Using AES-GCM:**

  * With the shared key in place, NP1 uses the AES-GCM encryption algorithm to secure the data intended for NP2.

```
// Encrypt data using the shared key
encryptedString = Encrypt(data, sharedKey)
```

* **Shared Key Derivation by NP2:**

  * NP2 derives the same shared key using its private key and the public key of NP1.

```
// Calculate the shared secret key using Diffie-Hellman
const sharedKey = crypto.diffieHellman({
  privateKey: MC4CAQEwBQYDK2VuBCIEICDWXCT+/VoLE8TJ5nYbtGv5vI+sqXBtdYgrBMjD73Vz,
  publicKey: MCowBQYDK2VuAyEAmb/MUSKXvtgsPJuEQUM/imlDJ7oe9uPL/m4ta9e8Z1o=,
});
```

* **Data Decryption by NP2:**

  * NP2 uses the derived shared key to decrypt the received data.

```
decryptedString = Decrypt(data, sharedKey)
```

---

### Field-Level Encryption

Field-level encryption applies when only specific attributes within a payload are considered sensitive and require confidentiality.

* Only identified fields are encrypted.
* The rest of the payload remains in plaintext and can be processed without decryption.
* Suitable when partial inspection, routing, or validation is required by intermediaries.

#### Example

* **ENCRYPTED SENSITIVE FIELD:**

  * NP1 includes the encrypted string as part of the authorization object token field which is sensitive. NP2 decrypts the value to access the token.

```
"authorization": {
  ...
  "token": "U2FsdGVkX1/gV/2wQx83uKkQdDpNPTq8+75IUZziK17qxdmBvsVT+KfQ==",
  "valid_to": "2024-03-23T23:59:59.999Z",
  "status": "UNCLAIMED"
}
```

---

### Payload Encryption

Payload encryption applies when the **entire message of the request** is considered sensitive.

* The complete message JSON is serialized and encrypted as a single unit.
* No individual fields are readable without decryption.
* Suitable for end-to-end confidentiality where intermediaries require minimal(`context`) payload visibility.

#### Example

```
{
    "context": {
        "domain": "ONDC:FIS13",
        "country": "IND",
        "city": "std:080",
        "action": "confirm",
        "core_version": "2.1.0",
        "bap_id": "buyer-app.ondc.org",
        "bap_uri": "https://buyer-app.ondc.org/protocol/v1",
        "bpp_id": "seller-app.ondc.org",
        "bpp_uri": "https://seller-app.ondc.org/protocol/v1
        "transaction_id": "123e4567-e89b-12d3-a456-426614174000",
        "message_id": "123e4567-e89b-12d3-a456-426614174001",
        "timestamp": "2024-03-23T18:25:43.511Z"
    },
    "message" : "U2FsdGVkX19KkzY1Fz+q2nZ4wXyQ3cVJ0mKkH9b+3l0=....."
}

```

On receipt, NP2 decrypts the `message` using the derived shared key to reconstruct the original message JSON body.

---

### Blob / Opaque Object Encryption

Blob encryption applies when large or opaque data objects (documents, images, credentials, or composite payloads) must be transmitted securely without structural interpretation by the network.

* The blob is treated as an opaque byte stream.
* Encryption and decryption follow the same shared key mechanism.
* The encrypted blob may be embedded inline or referenced via a secure URI.

#### Example

```
{
    "content_type": "multipart/octet-stream",
    "encrypted_data": "U2FsdGVkX18R4Z6u7nKx3rDq8yP4KpW1zZkZ+M4=",
}
```

NP2 decrypts the `encrypted_data` field using the derived shared key to obtain the original binary content.

---

### Summary

* **Field-level encryption** secures specific attributes within a payload.
* **Payload encryption** secures the entire message body.
* **Blob encryption** secures opaque or binary data objects.

All three approaches reuse the same registry-based key exchange, shared secret derivation, and AES-GCM encryption primitives, differing only in the scope of data encrypted.
