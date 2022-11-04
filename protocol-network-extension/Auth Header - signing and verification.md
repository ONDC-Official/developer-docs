<p align="center" width="100%">
 <img src=https://user-images.githubusercontent.com/104499654/198875324-f38840ea-7938-4568-bd1a-3f252f7c1171.png>
</p>

# Revision History

|Version |Date |Changes
| :---: | :---: |  :---: |
| 0.1 |14th Oct 2022 |Initial draft

# 1. Pre-requisites
Key pairs, for signing & encryption, can be generated using [libsodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages).
# 2.Creating Key Pairs
- Create key pairs, for signing (ed25519) & encryption (X25519);
- Update base64 encoded public keys in registry;
- Utility to generate signing key pairs and test signing & verification is [here](https://github.com/ONDC-Official/developer-docs/tree/main/utilities/signing_and_verification);

# 3.Auth Header Signing
- Generate UTF-8 byte array from json payload;
- Generate Blake2b hash from UTF-8 byte array;
- Create base64 encoding of Blake2b hash. This becomes the digest for signing;
- Sign the request, using your private signing key, and add the signature to the request authorization header, following steps documented [here](https://docs.google.com/document/d/1Iw_x-6mtfoMh0KJwL4sqQYM0kD17MLxiMCUOZDBerBo/edit#);

# 4. Auth Header Verification
- Extract the digest from the encoded signature in the request;
- Get the signing_public_key from registry using lookup (by using the ukId in the authorization header);
- Create (UTF-8) byte array from the **raw payload** and generate Blake2b hash;
- Compare generated Blake2b hash with the decoded digest from the signature in the request;
- In case of failure to verify, HTTP error 401 should be thrown;



