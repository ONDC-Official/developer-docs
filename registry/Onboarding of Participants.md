# Onboarding Network Participants

To join the ONDC network, Network Participants (NPs) must be registered in the ONDC registry. Follow these prerequisites and steps to complete your onboarding for Staging, Pre-Production, and Production environments:

## Prerequisites

1. **Domain Name**: Ensure your Network Participant (NP) has a valid Fully Qualified Domain Name (FQDN/DNS) that will be included in your subscriber ID (subscriber_id).  
   ```
   e.g., prod.ondcapp.com
   ```

2. **SSL Certificate**: Obtain a valid SSL certificate for your domain. This certificate is used for Online Certificate Status Protocol (OCSP) validation.

3. **Whitelisting**: Get approval for your Staging, Pre-Production, and Production subscriber_id by submitting a request on the Network Participant Portal:
   1. Sign up on the Network Participant Portal [here](https://portal.ondc.org) and submit your request.
   2. Complete your profile 100% after signing up.
   3. From the home menu, find and raise a request for whitelisting under "environment access request." Approval may take 6 to 48 hours.

4. **System Configuration**: Configure your system with the domain name and SSL certificate. All communications with the ONDC Network must occur through this domain.

## Steps

### Steps 1 and 2: Key Generation

You can use the utility [here](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification) to perform these steps. Choose from the following technologies for generating key pairs:

   - [Java](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service/java)
   - [Python](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification/python)
   - [GoLang](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification/golang)
   - [NodeJS](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification/node)
   - [PHP](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification/php)

1. **Generate Signing Key Pair**: Create a Signing Key Pair using the Ed25519 Algorithm. This will include a `signing_public_key` and a `signing_private_key` (both base64 encoded).

2. **Generate Encryption Key Pair**: Create an Encryption Key Pair using the X25519 Algorithm. This includes an `encryption_public_key` (in ASN.1 DER format -> base64 encoded) and an `encryption_private_key` (base64 encoded).
   - **Note**: Use the [Libsodium library](https://libsodium.gitbook.io/doc/bindings_for_other_languages) for key pair generation. For NodeJS, use the inbuilt Crypto library instead of Libsodium. Ensure the encryption public key is in ASN.1 DER format. Refer to the key format and generation documentation [here](./key-format-generation.md).

### Steps 3 to 7: Endpoint Setup

You can perform these steps using the utility [here](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service). If a utility is not available for your tech stack, you may create one following the outlined steps.

3. **Generate Unique Request ID**: Create a unique Request ID (`request_id`). This ID must be unique for each network participant and can be any format (e.g., UUID, number, or alphanumeric).

4. **Generate SIGNED_UNIQUE_REQ_ID**: Sign the `request_id` using the `signing_private_key` from Step 1. The signature should be created using the Ed25519 algorithm without hashing. The [on_subscribe utility](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service) can help with this.

5. **Create `ondc-site-verification.html`**: Place this file at the subscriber_id path and include the `SIGNED_UNIQUE_REQ_ID` generated in Step 4. The registry will check for this file at:
   `https://<subscriber_id>/ondc-site-verification.html`
   ```
   <!-- Contents of ondc-site-verification.html -->
   <!-- Replace SIGNED_UNIQUE_REQ_ID with the actual value -->
   <html>
       <head>
           <meta name='ondc-site-verification' content='SIGNED_UNIQUE_REQ_ID' />
       </head>
       <body>
           ONDC Site Verification Page
       </body>
   </html>
   ```

6. **Configure `/on_subscribe` Endpoint**: Create the encryption shared key using the `encryption_private_key` (from Step 2) and the ONDC public key to decrypt the `challenge_string` received in the `/on_subscribe` call using the AES algorithm.

   ```
   ONDC public key (prod) = "MCowBQYDK2VuAyEAvVEyZY91O2yV8w8/CAwVDAnqIZDJJUPdLUUKwLo3K0M="
   ONDC public key (pre-prod) = "MCowBQYDK2VuAyEAa9Wbpvd9SsrpOZFcynyt/TO3x0Yrqyys4NUGIvyxX2Q="
   ONDC public key (staging) = "MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM="
   ```

7. **Host `/on_subscribe` Post Endpoint**: Deploy the `/on_subscribe` endpoint at:
   `https://<subscriber_id>/<callback_url>/on_subscribe`
   
   Use the (Node.JS, JAVA, Node, PHP) [utility](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/on_subscibe-service) to implement this endpoint.

**8. Refer to the SwaggerHub document and FAQs for `/subscribe` API**

> - **SwaggerHub Documentation**: [Request Body and Response](https://app.swaggerhub.com/apis-docs/ONDC/ONDC-Registry-Onboarding/2.0.5#/ONDC%20Network%20Participant%20Onboarding/post_subscriber_url_on_subscribe)
> - **FAQs for Subscribe Payload**: [FAQs Document](https://docs.google.com/document/d/15Dpy02lqtcU9tslyMqaI4UtnD2rtwnjAbn1narO0364/edit#heading=h.69ojsi3hg052)

---

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

> 1. **/v2.0/lookup** (Recommended)

```
# For Staging
https://staging.registry.ondc.org/v2.0/lookup

# For Pre-Prod
https://preprod.registry.ondc.org/v2.0/lookup

# For PROD
https://prod.registry.ondc.org/v2.0/lookup
```

The new version supports secure access using Authorization headers.

```
curl --location 'https://prod.registry.ondc.org/v2.0/lookup' \
--header 'Content-Type: application/json' \
--header 'Authorization: Signature keyId="example-bap.com|bap1234|ed25519", algorithm="ed25519", created="<timestamp>", expires="<timestamp>", headers="(created)(expires)digest", signature="<signature>"' \
--data '{
  "country": "IND",
  "domain": "ONDC:RET10"
}'
```

### Useful References

- [Signing & Verification Process](https://github.com/ONDC-Official/developer-docs/blob/main/registry/signing-verification.md)
- [Reference Utility - Signing & Lookup](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification)
- [SwaggerHub - Registry Lookup API](https://app.swaggerhub.com/apis/ONDC/ONDC-Registry-Onboarding/2.1.0#/ONDC%20Network%20Participant%20Onboarding/post_v2_lookup)

> 2. **/lookup** (Deprecated)

```
# For Staging
https://staging.registry.ondc.org/lookup

# For Pre-prod
https://preprod.registry.ondc.org/ondc/lookup

# For PROD
https://prod.registry.ondc.org/lookup
```

> 3. **/vlookup** (Deprecated)

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

Note: If the API rate limit is exceeded, you may receive HTTP 429 responses. Recommended registry limits:

| Endpoint                | Limit     |
|-------------------------|-----------|
| `/subscribe`            | 10 RPM    |
| `/lookup`               | 7600 RPM  |
| `/vlookup`              | 2100 RPM  |
| `/search`               | 2100 RPM  |
| `/v2.0/lookup`          | TBD       |

Ensure that your systems are rate-limit aware and gracefully handle retries.

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
