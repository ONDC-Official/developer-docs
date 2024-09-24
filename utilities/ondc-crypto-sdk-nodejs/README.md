A signing and verification utility that is necessary for creation and verification of authentication signature between network participants of ONDC.

## Signing Authorisation Header

For signing the verification header, you can use the `createAuthorizationHeader` method.

```javascript
import { createAuthorizationHeader } from "ondc-crypto-sdk-nodejs"

const header = await createAuthorizationHeader({
      body: { context: {...}, message: {...} },
      privateKey: privateKey,
      subscriberId: "abcd.com/ondc", // Subscriber ID that you get after registering to ONDC Network
      subscriberUniqueKeyId: "584", // Unique Key Id or uKid that you get after registering to ONDC Network
    });
```

The method returns a set a unique signature that is ONDC-compliant and can be verified across NPs by looking up your public key from the registry.

## Verifying Authorisation Header

For verifying the verification header, you can use the `isHeaderValid` method.

```javascript
import { isHeaderValid } from "ondc-crypto-sdk-nodejs"

const isValid = await isHeaderValid({
      header: header, // The Authorisation header sent by other network participants
      body: { context: {...}, message: {...} },
      publicKey: publicKey,
});
```

The method returns a boolean value whether the signature is valid or not.

## Create vLookup signature

For creating a signature for the vLookup request, you can use the `createVLookupSignature` method.

```javascript
import { createVLookupSignature } from 'ondc-crypto-sdk-nodejs';

const isValid = await createVLookupSignature({
  country: 'IND',
  domain: 'ONDC:RET10',
  type: 'sellerApp',
  city: 'std:080',
  subscriber_id: 'subscriberId',
  privateKey: 'privateKey',
});
```

The method returns a signature that can be used in the /vlookup call on the registry.
