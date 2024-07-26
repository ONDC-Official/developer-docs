# Onboarding of Network Participants 

To join the ONDC network, Network Participants (NPs) need to be included in the ONDC registry. The prerequisites and steps for an NP to be onboarded onto the ONDC Registry (Staging, Pre Production, Production) are as follows:

## Prerequisites

1. Network Participant (NP) shall have a valid domain (FQDN/DNS) name. This becomes part of your subscriber ID (subscriber_id).

   ```
   eg: prod.ondcapp.com
   ```

2. NP shall have a valid SSL certificate for your domain. This will be used while performing Online Certificate Status Protocol (OCSP) validation.
3. Get your Staging, Preprod and Production subscriber_id whitelisted/approved by ONDC by raising the request on Network Participant Portal:

   1. Please sign up on Network Participant Portal [here](https://portal.ondc.org) and raise the request
   2. Please go through the self help guide [here](https://sites.google.com/ondc.org/portal-help)

4. Configure your system with domain name and SSL. All communication with ONDC Network should happen through this domain.

## Steps

> Steps 4 to 7 can be done using the utility [here](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service). Every Participant shall perform Steps 1 and 2 to generate keys as below.

1. Generate Signing Key Pair (ed25519 Algorithm) - signing_public_key and signing_private_key; (base64 encoded) 
> Refer utility below in step 2
2. Generate Encryption Key Pair (X25519 Algorithm) - encryption_public_key (ASN.1 Der format-> base64 encoded) and encryption_private_key (base64 encoded). Use the utilities provided below to generate signing and encryption key pairs:
   - [Java](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service/java)
   - [Python](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification)
   - [GoLang](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification/golang)
     Note:
     [Libsodium library](https://libsodium.gitbook.io/doc/bindings_for_other_languages) can be utilised to generate the key pairs.
     For NodeJS: Inbuilt Crypto library should be used instead of Libsodium library. The generated encryption public key is already encoded in the ASN.1 DER format.
   - You can refer to the documentation for information on the format and generation of keys [here](./key-format-generation.md).
3. Generate Unique Request ID (request_id). It should be unique for a network participant. It can be in any format. For example - it can be UUID or a simple number or alphanumeric format.
4. Generate SIGNED_UNIQUE_REQ_ID => Sign request_id using signing_private_key generated in step 1 (signed using ed25519 algorithm without hashing).

   The [on_subscribe utility](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service) has methods implemented to sign the message (request_id).

5. Create `ondc-site-verification.html` and place it at subscriber_id by adding SIGNED_UNIQUE_REQ_ID generated in step 4. Registry shall check existence of ondc-site-verification.html at
   `https://<subscriber_id>/ondc-site-verification.html`


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

6. Configure developed /on_subscribe implementation.
   Create encryption shared key using: encryption private key (generated in step 2) and ONDC public key to decrypt the challenge_string (received in the on_susbcribe call) using AES algorithm.

   ```
   ONDC public key (prod) = "MCowBQYDK2VuAyEAvVEyZY91O2yV8w8/CAwVDAnqIZDJJUPdLUUKwLo3K0M="
   ONDC public key (pre-prod) = "MCowBQYDK2VuAyEAa9Wbpvd9SsrpOZFcynyt/TO3x0Yrqyys4NUGIvyxX2Q="
   ONDC public key (staging) = "MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM="
   ```

7. Host /on_subscribe endpoint :

   1. `https://<subscriber_id>/<callback_url>/on_subscribe `
      The (Node.JS/Python) [utility](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service) can be used to implement the /on_subscribe endpoint.

8. Refer [swaggerhub document](https://app.swaggerhub.com/apis-docs/ONDC/ONDC-Registry-Onboarding/2.0.5#/ONDC%20Network%20Participant%20Onboarding/post_subscriber_url_on_subscribe) for request body and response of /subscribe API.

> ### Supported Registrations
>
> 1. ops_no : 1 - Buyer App Registration
> 2. ops_no : 2 - Seller App Registration
> 4. ops_no : 4 - Buyer & Seller App Registration
>
> Note: ops_no 3 & 5 is deprecated as feature of Seller On Record (SOR) in registry is obsolete. 

9. Create /subscribe request as follows:

```
1.subscriber_id= YOUR SUBSCRIBER ID (abc.ondcapp.com)
2.callback_url= Relative path to on_subscribe implementation
3.subscriber_url = Relative path to the subscriber_id
4.signing_public_key= <value of sign_public_key generated in step 1>
5.encryption_public_key= <value of enc_dec_public_key generated in step 2>
6.unique_key_id= <generate a unique number for tracking key pairs>
7.For other fields, please refer below swaggerhub link and examples mentioned under heading as ops_no_1, ops_no_2, ops_no_3, ops_no_4 and ops_no_5
https://app.swaggerhub.com/apis-docs/ONDC/ONDC-Registry-Onboarding/2.0.5
```

10. Send created request to URL for /subscribe as below

```
# For Staging Onboarding
https://staging.registry.ondc.org/subscribe

# For PreProd Onboarding
https://preprod.registry.ondc.org/ondc/subscribe

# For Prod Onboarding
https://prod.registry.ondc.org/subscribe

```

11. The call is received by the respective registry and following operations are performed:

> 1. /subscribe payload schema is verified
> 2. OCSP Check: SSL Certificate is verified
> 3. Domain Verification: ondc-site-verification.html is verified;
 > - should be hosted on `https://<subscriber_id>/ondc-site-verification.html`
 > - request_id should be signed using the signing private key (without hashing)  
> 4. /on_susbcribe is called by the registry with a challenge string hosted on the callback_url
>      `https://<subscriber_id>/<callback_url>/on_subscribe`
> ```json
> {
>   "subscriber_id": "abc.com",
>  "challenge": "encrypted_challenge_string"
> }
> ```
> 5. The challenge string should be decrypted using the shared key (generated in step 6) and answer should be provided as a sync response.
> ```json
> {
>   "answer": "decrypted_challange_string"
> }
> ```

12. Verify whether you have received a successful response. If a success response is not received, refer to the section listing possible errors. If the issue persists, kindly reach out to our support desk using the details provided in step 14 below.

```json
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

13. Check your record in registry lookup
    
> 1. /lookup

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
>2. /vlookup

```
# For Staging
https://staging.registry.ondc.org/vlookup

# For Pre-prod
https://preprod.registry.ondc.org/ondc/vlookup

# For PROD
https://prod.registry.ondc.org/vlookup
```

```
	curl --location 'https://preprod.registry.ondc.org/ondc/vlookup' \
		--header 'Content-Type: application/json' \
		--data '{
		    "sender_subscriber_id": "your_sub_id",
		    "request_id": "27baa06d-f90a-486c-85e5-cc621b787f04",
		    "timestamp": "2022-09-13T20:45:07.060Z",
		    "signature": "UNC7Wy8WZ5iQYNBUnHu1wsCtRhZ0P+I4NO5CpP03cNZ+jYuVtXyeMKQs1coU9Q9fpXIJupB8uRVJ5KPbl/x3Bg==",
		    "search_parameters": {
			"country": "IND",
			"domain": "ONDC:RET10",
			"type": "sellerApp",
			"city":"std:080",
			"subscriber_id": "counter_party_sub_id"
		    }
		}'

- sender_subscriber_id: subscriber id of request initiator
- request_id: unique identifier for request
- timestamp: current timestamp in RFC3339 format
- signature: search_parameters signed using private key of request initiator: sign(country|domain|type|city|subscriber_id) => - sign(IND|ONDC:RET10|sellerApp|std:080|ondc.org)
- type: enums are "buyerApp", "sellerApp", "gateway"

```
14. In case you are not able to find your record in lookup and vlookup, please report to techsupport@ondc.org

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

```json
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

Resolution:

Please connect with ONDC (techsupport@ondc.org) and get your subscriber ID whitelisted

### Timestamp is invalid

```json
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

Resolution:

Need to put timestamp within the stipulated timegap defined by ONDC.

### Domain Verification Failed

```json
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

Resolution:

The signature generated with signing private key and request id should be put into ondc-site-verification.html (signed using ed25519 algorithm without hashing)

### Subscriber ID already exists

```json
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

Resolution:

If the subscriber ID is already registered with ONDC, this error will be thrown.

### OCSP Failed

```json
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

Resolution:

Need to get a valid SSL certificate for the purchased domain.

#### Encryption Verification Failed

```json
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

Resolution:

Utilize the encrypted private key and ONDC public key, then process the challenge received in the on_subscribe callback. Respond synchronously by providing the decrypted value.

### Incorrect Network participant details provided

```json
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


Resolution:

Incorrect JSON Type Specification: For example, in Option 1, if the Network Participant is registering and the type is set to sellerApp, the aforementioned error will occur. The value should align with the specified options.
Option 3 Flag Misalignment: Instead of setting MSN to true, it has been incorrectly set as false, and vice versa for non-MSN cases where the flag is inaccurately set to true.

### Network participant's ondc-site-verification.html's encrypted signature verification failed

```json
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


Resolution:

Utilize Plain Request_ID: Network Participants are advised to use the request_id as is, without applying any hashing, when generating the signature.
Maintain Consistent Request_ID: Network Participants should ensure the request_id in the request body matches the one used during signature generation to guarantee successful validation.
Verify Signing Public Key: Network Participants should include the same signing public key in the request body that corresponds to the signing private key used during the signing process.
