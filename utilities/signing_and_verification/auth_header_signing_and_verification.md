**Pre-requisites**

* Key pairs, for signing & encryption, can be generated using  using [libsodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages).

**Creating Key Pairs**

* Create key pairs, for signing (ed25519) & encryption (X25519);
* Update base64 encoded public keys in registry;

* Utility to generate signing key pairs and test signing & verification is [here](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification)

**Auth Header Signing**

* Generate UTF-8 byte array from json payload;
* Generate Blake2b hash from UTF-8 byte array;

* Create base64 encoding of Blake2b hash. This becomes the digest for signing;
* Sign the request, using your private signing key, and add the signature to the request authorization header, following steps documented [here](https://docs.google.com/document/d/1Iw_x-6mtfoMh0KJwL4sqQYM0kD17MLxiMCUOZDBerBo/edit#heading=h.zs1tt1ewtdt)

**Auth Header Verification**

* Extract the digest from the encoded signature in the request;
* Get the signing_public_key from registry using lookup (by using the ukId in the authorization header);

* Create (UTF-8) byte array from the raw payload and generate Blake2b hash;
* Compare generated Blake2b hash with the decoded digest from the signature in the request;

* In case of failure to verify, HTTP error 401 should be thrown;
