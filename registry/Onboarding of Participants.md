# Onboarding of Network Participants in Prod and PreProd

## Supported Registrations

![image](https://user-images.githubusercontent.com/107539333/190342634-ad4ff9a6-b1e6-4ba7-b55a-6d25d6b4b5f9.png)

## Prerequisites

1.	Purchase valid domain name. This becomes part of your subscriber ID. subscriber_id
2.	Purchase valid SSL certificate for the purchase domain. This will be used while performing Online Certificate Status Protocol check.
3.	Get your subscriber_id whitelist/approved by ONDC. To do that please reach out to tech@ondc.org.
4.	Configure your system with domain name and SSL. All communication with ONDC Network should happen through this domain.
5.	Develop and host /on_subscribe : ``    https://<YourDomain>/<YourCallBackURL>/on_subscribe``
6.	Refer for Request Body and Response ``https://app.swaggerhub.com/apis-docs/ONDC/ONDC-Registry-Onboarding/2.0.5#/ONDC%20Network%20Participant%20Onboarding/post_subscriber_url_on_subscribe ``
7.	Generate Signing Key Pair - signing_public_key and signing_private_key
8.	Generate Encryption Key Pair - encryption_public_key and encryption_private_key (Reference utilities here: https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/signing_and_verification)
9.	Generate Unique Request ID (request_id). It should be unique for a Network Participant. It can be in any format. For example - it can be UUID or a simple number or alphanumeric format.
10.	Generate SIGNED_UNIQUE_REQ_ID => ( Sign request_id using signing_private_key generated in step 6 )
11.	Create ``ondc-site-verification.html`` and place it at subscriber_id by adding SIGNED_UNIQUE_REQ_ID generated in step 9. Registry shall check existence of ondc-site-verification.html at 
``https://<subscriber_id>/ondc-site-verification.html``
```
<!--Contents of ondc-site-verification.html. -->
	<!--Please replace SIGNED_UNIQUE_REQ_ID with actual value-->
	<html>
	  <head>
	    <metaname='ondc-site-verification'
	     content='SIGNED_UNIQUE_REQ_ID' />
	   </head>
	      ondc-site-verification.html
	    <body>
	        ONDC Site Verification Page
	    </body>
	</html>
```
12.	Configure developed /on_subscribe implementation to use enc_dec_private_key (generated in step 8) and ONDC public key to decrypt the challenge_string
13.	Create /subscribe request as follows
```
1.	subscriber_id= YOUR SUBSCRIBER ID
2.	callback_url= Relative path to on_subscribe implementation
3.	signing_public_key= <value of sign_public_key generated in step 5>
4.	encryption_public_key= <value of enc_dec_public_key generated in step 6>
5.	ONDC public key (prod) = "MCowBQYDK2VuAyEAvVEyZY91O2yV8w8/CAwVDAnqIZDJJUPdLUUKwLo3K0M="
6.	ONDC public key (pre-prod) = "MCowBQYDK2VuAyEAa9Wbpvd9SsrpOZFcynyt/TO3x0Yrqyys4NUGIvyxX2Q="
7.	unique_key_id= <generate a unique number for tracking key pairs>
8.	For other fields, please refer below swaggerhub link and examples mentioned under heading as ops_no_1, ops_no_2, ops_no_3, ops_no_4 and ops_no_5 
https://app.swaggerhub.com/apis-docs/ONDC/ONDC-Registry-Onboarding/2.0.5

```
## Steps

1.	Send created request to URL for /subscribe is as below 
```
# For PreProd Onboarding
https://preprod.registry.ondc.org/ondc/subscribe
	
# For Prod Onboarding
https://prod.registry.ondc.org/subscribe
```
2.  Check if you have received success response . In case if you do not receive a success, then please go through section of listing of possible errors. And if still issue persists, please contact our support desk. Details are mentioned in step 4 below.
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
3.	Check your record in registry lookup <br>
	3.1	/vlookup For Pre-prod ``` https://preprod.registry.ondc.org/ondc/vlookup ``` and for PROD ``` https://prod.registry.ondc.org/vlookup ```
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
			"domain": "nic2004:52110",
			"subscriber_id": "pilot-gateway-1.beckn.nsdl.co.in/option8"

		    }
		}
```
<BR>
	3.2	/lookup for Pre-prod ```	https://preprod.registry.ondc.org/ondc/lookup ```, for PROD ``` https://prod.registry.ondc.org/lookup	```
		
```
	curl --location --request POST 'https://preprod.registry.ondc.org/ondc/lookup' \
	--header 'Content-Type: application/json' \
	--data-raw '{

	    "country": "IND",
	    "domain":"nic2004:52110"

	}'
```
 
4.	In case if you are not able to find your record in lookup and vlookup, please report to . 
      onboard.support@egov-protean.info
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
Please connect with ONDC officials - Supriyo and Neeraj and get your subscriber ID whitelisted
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
Need to register Encrypted private key and ondc public key and need to consume the challenge given by subscribe API and give the decrypted value back to subscribe API
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
a.Incorrect type mentioned in JSON. E.g. for Option 1 where NP is registering and type is set sellerApp then the above error will be shown.  The value should be according to option set here.
b.for option 3 instead of MSN set to true, it has been put as false and vice versa for non msn the flag is set true.



