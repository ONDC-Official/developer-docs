# Onboarding of Network Participants in Prod and PreProd

## Supported Registrations

![image](https://user-images.githubusercontent.com/107539333/190342634-ad4ff9a6-b1e6-4ba7-b55a-6d25d6b4b5f9.png)

## Prerequisites

1. Purchase valid domain name. This becomes part of your subscriber ID (subscriber_id).
2. Purchase valid SSL certificate for the purchase domain. This will be used while performing Online Certificate Status Protocol check.
3. Get your subscriber_id whitelist/approved by ONDC. To do that

   1. For Staging: Fill out the [subscriber id whitelisting form](https://docs.google.com/forms/d/1k5k-N2JW4azLsdkJVbWjlsW549Nz5tUatYozSmJERQk/viewform?edit_requested=true).
   2. For Preprod/Prod: please reach out to tech@ondc.org.
4. Configure your system with domain name and SSL. All communication with ONDC Network should happen through this domain.
5. Develop and host /on_subscribe :

   1. `https://<subscriber_id>/<callback_url>/on_subscribe `
   2. The (Node.JS/Python) [utility](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service) can be used to implement the /on_subscribe endpoint
6. Refer for Request Body and Response
   `https://app.swaggerhub.com/apis-docs/ONDC/ONDC-Registry-Onboarding/2.0.5#/ONDC%20Network%20Participant%20Onboarding/post_subscriber_url_on_subscribe `
7. Generate Signing Key Pair (ed25519 Algorithm) - signing_public_key and signing_private_key; (base64 encoded)
8. Generate Encryption Key Pair (X25519 Algorithm) - encryption_public_key (ASN.1 Der format-> base64 encoded) and encryption_private_key (base64 encoded)

   Utilities to generate signing and encryption key pairs here:
   [Java](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/ondc-crypto-utility-master)
   [Python](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification)
   [GoLang](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification/golang)

   Note:
   [Libsodium library](https://libsodium.gitbook.io/doc/bindings_for_other_languages) can be utilised to generate the key pairs.
   For NodeJS: Inbuilt Crypto library should be used instead of Libsodium library. The generated encryption public key is already encoded in the ASN.1 DER format.
9. Generate Unique Request ID (request_id). It should be unique for a Network Participant. It can be in any format. For example - it can be UUID or a simple number or alphanumeric format.
10. Generate SIGNED_UNIQUE_REQ_ID => ( Sign request_id using signing_private_key generated in step 7 (signed using ed25519 algorithm without hashing) )

    The [on_subscribe utility](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service) has methods implemented to sign the message (request_id)
11. Create ``ondc-site-verification.html`` and place it at subscriber_id by adding SIGNED_UNIQUE_REQ_ID generated in step 10. Registry shall check existence of ondc-site-verification.html at
    ``https://<subscriber_id>/ondc-site-verification.html``

    > You may use the on_subscribe utility for the above implementation
    >

```
<!--Contents of ondc-site-verification.html. -->
<!--Please replace SIGNED_UNIQUE_REQ_ID with an actual value-->
<html>
    <head>
        <meta name='ondc-site-verification' content='SIGNED_UNIQUE_REQ_ID' />
    </head>
    <body>
        ONDC Site Verification Page
    </body>
</html>
```

12. Configure developed /on_subscribe implementation
    Create encryption shared key using: encryption private key (generated in step 8) and ONDC public key to decrypt the challenge_string (received in the on_susbcribe call) using AES algorithm.

    ```
    ONDC public key (prod) = "MCowBQYDK2VuAyEAvVEyZY91O2yV8w8/CAwVDAnqIZDJJUPdLUUKwLo3K0M="
    ONDC public key (pre-prod) = "MCowBQYDK2VuAyEAa9Wbpvd9SsrpOZFcynyt/TO3x0Yrqyys4NUGIvyxX2Q="
    ONDC public key (staging) = "MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM="
    ```
13. Create /subscribe request as follows

```
1.	subscriber_id= YOUR SUBSCRIBER ID (abc.ondcapp.com)
2.	callback_url= Relative path to on_subscribe implementation
3. subscriber_url = Relative path to the subscriber_id
4.	signing_public_key= <value of sign_public_key generated in step 7>
5.	encryption_public_key= <value of enc_dec_public_key generated in step 8>
6.	unique_key_id= <generate a unique number for tracking key pairs>
7.	For other fields, please refer below swaggerhub link and examples mentioned under heading as ops_no_1, ops_no_2, ops_no_3, ops_no_4 and ops_no_5 
https://app.swaggerhub.com/apis-docs/ONDC/ONDC-Registry-Onboarding/2.0.5

```

## Steps

1. Send created request to URL for /subscribe as below

```
# For Staging Onboarding
https://staging.registry.ondc.org/subscribe

# For PreProd Onboarding
https://preprod.registry.ondc.org/ondc/subscribe

# For Prod Onboarding
https://prod.registry.ondc.org/subscribe
```

2. The call is received by the respective registry and following operations are performed:

   1. /subscribe payload schema is verified
   2. OCSP Check: SSL Certificate is verified
   3. Domain Verification: ondc-site-verification.html is verified;
      1. should be hosted on `https://<subscriber_id>/ondc-site-verification.html`
      2. request_id should be signed using the signing private key (without hashing)
3. /on_susbcribe is called by the registry with a challenge string hosted on the callback_url
   `https://<subscriber_id>/<callback_url>/on_subscribe`

   ```json
   {
   "subscriber_id": "abc.com",
   "challenge": "encrypted_challenge_string"
   }
   ```
4. The challenge string should be decrypted using the shared key (generated in step 12 of prerequisites) and answer should be provided as a sync response.

```json
{
"answer": "decrypted_challange_string"
}
```

5. Check if you have received success response . In case if you do not receive a success, then please go through section of listing of possible errors. And if still issue persists, please contact our support desk. Details are mentioned in step 4 below.

```
{
    "message": {
        "ack": {
            "status": "ACK"
        }
    },
    "error": {
        "type": null,
        "code": null,
        "path": null,
        "message": null
    }
}
```

6. Check your record in registry lookup
   1. /vlookup

```
# For Staging 
https://staging.registry.ondc.org/vlookup

# For Pre-prod
https://preprod.registry.ondc.org/ondc/vlookup

# For PROD
https://prod.registry.ondc.org/vlookup
```

```
	curl --location --request GET 'https://preprod.registry.ondc.org/ondc/vlookup' \
		--header 'Content-Type: application/json' \
		--data-raw '{
		    "sender_subscriber_id": "pilot-gateway-1.beckn.nsdl.co.in/option8",
		    "request_id": "27baa06d-f90a-486c-85e5-cc621b787f04",
		    "timestamp": "2022-09-13T20:45:07.060Z",
		    "signature": "UNC7Wy8WZ5iQYNBUnHu1wsCtRhZ0P+I4NO5CpP03cNZ+jYuVtXyeMKQs1coU9Q9fpXIJupB8uRVJ5KPbl/x3Bg==",
		    "search_parameters": {
			"country": "IND",
			"domain": "ONDC:RET10",
			"type": "sellerApp",
			"city":"std:080",
			"subscriber_id": "ondc.org"
		    }
		}

- sender_subscriber_id: subscriber id of request initiator
- request_id: unique identifier for request
- timestamp: timestamp in RFC3339 format
- signature: search_parameters signed using private key of request initiator: sign(country|domain|type|city|subscriber_id) => - sign(IND|ONDC:RET10|sellerApp|std:080|ondc.org)
- type: enums are "buyerApp", "sellerApp", "gateway"



```

    2. /lookup

```
# For Staging
https://staging.registry.ondc.org/lookup

# For Pre-prod 
https://preprod.registry.ondc.org/ondc/lookup
# For PROD
https://prod.registry.ondc.org/lookup
```

```
	curl --location --request POST 'https://preprod.registry.ondc.org/ondc/lookup' \
	--header 'Content-Type: application/json' \
	--data-raw '{

	    "country": "IND",
	    "domain":"ONDC:RET10"

	}'
```

7. In case if you are not able to find your record in lookup and vlookup, please report to techsupport@ondc.org

```
	Please mention below details in email:
	   # Name : XXXXXXX
	   # Contact Number : XXXXXXXXXXX
	   # Subscriber ID : XXX.XX
	   # Error occurred : Error Code
	   # Error Description : Error Description received after calling subscriber id.
	   # Issue or clarification at which step # : Prerequisites or Steps ?
   	   # Issue / Clarification required : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Listing of possible errors

### Subscriber ID not whitelisted by ONDC

```
{
    "message": {
        "ack": {
            "status": "NACK"
        }
    },
    "error": {
        "type": "POLICY-ERROR",
        "code": "132",
        "path": null,
        "message": "Subscriber Id is not whitelisted"
    }
}
```

Resolution
Please connect with ONDC officials (tech@ondc.org)and get your subscriber ID whitelisted

### Timestamp is invalid

```
{
    "message": {
        "ack": {
            "status": "NACK"
        }
    },

    "error": {
        "type": "POLICY-ERROR",
        "code": "132",
        "path": null,
        "message": "Timestamp is invalid"
    }

}
```

Resolution
Need to put timestamp within stipulated timegap defined by ONDC.

### Domain Verification Failed

```
{
    "message": {
        "ack": {
            "status": "NACK"
        }
    },

    "error": {
        "type": "POLICY-ERROR",
        "code": "132",
        "path": null,
        "message": "Domain verification is failed"
    }

}
```

 Resolution
The signature generated with signed public and private key and request id should be put into ondc-site-verification.html

### Subscriber ID already exists

```
{
    "message": {
        "ack": {
            "status": "NACK"
        }
    },
    "error": {
        "type": "POLICY-ERROR",
        "code": "132",
        "path": null,
        "message": "Subscriber id already exists"
    }
}
```

Resolution
if subscriber id already registered with ONDC then this error will be thrown.

### OCSP Failed

```
{
    "message": {
        "ack": {
            "status": "NACK"
        }
    },
    "error": {
        "type": "POLICY-ERROR",
        "code": "132",
        "path": null,
        "message": "OCSP failed"
    }
}
```

Resolution
Need to get a valid SSL certificate for the domain purchased.

#### Encryption Verification Failed

```
{
    "message": {
        "ack": {
            "status": "NACK"
        }
    },
    "error": {
        "type": "POLICY-ERROR",
        "code": "132",
        "path": null,
        "message": "https://pilot-gateway-1.beckn.nsdl.co.in/option1/test/on_subscribe : Encryption verification is failed"
    }
}
```

Resolution
Need to register encrypted private key and ondc public key and need to consume the challenge received in the on_subscribe callback and give the decrypted value back as sync response

### Incorrect Network participant details provided

```
{
    "message": {
        "ack": {
            "status": "NACK"
        }
    },
    "error": {
        "type": "POLICY-ERROR",
        "code": "132",
        "path": null,
        "message": " Please provide valid Network Participant [0] Type "
    }
}
```

Resolution

- Incorrect type mentioned in JSON. E.g. for Option 1 where NP is registering and type is set sellerApp then the above error will be shown.  The value should be according to option set here.
- for option 3 instead of MSN set to true, it has been put as false and vice versa for non msn the flag is set true.

### Network participant's ondc-site-verification.html's encrypted signature verification failed

```
{
    "message": {
        "ack": {
            "status": "NACK"
        }
    },
    "error": {
        "type": "DOMAIN-ERROR",
        "code": "129",
        "path": null,
        "message": "https://{{netowrk_participant_subsctiber_id}} : Domain verification is failed "
    }
}
```

Resolution

- Use Plain Request_ID: Network Participant should use plain request_id while generating signature, without applying any hashing on the request_id
- Ensure Consistent Request_ID: Network Participant should use the same request_id in request body which they used while generating the signature. The request_id used during signature generation must match the one used during verification to ensure successful validation
- Ensure signing public key: Network Participant should send the same signing public key in the request body, who's corresnponding signing private key was used for signing.
