### Java Util for Subscribing and Key Generation

- Clone the repo
- You are required to have Java 17 and Maven.
- Go to the ```main.java.ondc.onboarding.utility.AppConfig``` requestId(java file) should match with message.request_id(subscribe payload) that you will be sending in the subscribe payload. 
- Run ```./mvnw spring-boot:run```
- Hit ```https://subscriber_id/get-keys``` to generate the keys.
  ```
    "enc_private_key": "MFECAQEwBQYDK2VuBCIEIPjSJTWFXeb0AH5L5d36q5yknfKGAthnOlsmREO/vBVAgSEAHjjX+uHubKwSOINetLeSedFoWXIaWybDQYON8pXewGQ=",
    "sign_private_key": "zeiPflZ2GHCX1bkzm4C4HfOoWclVKdZi9qYXgEnv89g=",
    "sign_public_key": "3fdeC79Oqcsb26JLPA8aZSyjWytVR+CdRVtkaneijPk=",
    "enc_public_key": "MCowBQYDK2VuAyEAHjjX+uHubKwSOINetLeSedFoWXIaWybDQYON8pXewGQ="
  ```
- Kindly change the ```message.key_pair.encryption_public_key and signing_public_key``` with the above values.
- Hit ```https://subscriber_id/subscribe``` to subscribe.
  ```
  curl --location 'localhost:8080/subscribe' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "context": {
    "operation": {
      "ops_no": 2
    }
  },
  "message": {
    "request_id": "ccfce272-13c3-4ca4-a070-64769f5df2a66",
    "timestamp": "2024-02-21T13:02:09.814Z",
    "entity": {
      "gst": {
        "legal_entity_name": "ABC Incorporates",
        "business_address": "Trade World, Mansarpur, Coorg, Karnataka 333333",
        "city_code": [
          "std:080"
        ],
        "gst_no": "07AAACN2082N4Z7"
      },
      "pan": {
        "name_as_per_pan": "ABC Incorporates",
        "pan_no": "ASDFP7657Q",
        "date_of_incorporation": "23/06/1982"
      },
      "name_of_authorised_signatory": "Anand Sharma",
      "address_of_authorised_signatory": "405, Pinnacle House, Kandiwali, Mumbai 400001",
      "email_id": "anand.sharma@abc.com",
      "mobile_no": 9912332199,
      "country": "IND",
      "subscriber_id": "your.app.com",
      "unique_key_id": "ccfce174-17c1-4ca4-a070-7419f5df2a66",
      "callback_url": "/",
      "key_pair": {
        "signing_public_key":"Od5jWsddCTo2bG04iT8jWirXBll5hTgt5v9WJVAyZWM=",
        "encryption_public_key": "MCowBQYDK2VuAyEAtixcps5Wt84F4sq90IPFr5ZjuUqPE93nGui7ROr2zzk=",
        "valid_from": "2024-02-21T13:02:09.814Z",
        "valid_until": "2024-10-20T18:00:15.071Z"
      }
    },
    "network_participant": [
      {
        "subscriber_url": "/",
        "domain": "ONDC:RET10",
        "type": "sellerApp",
        "msn": false,
        "city_code": [
          "std:080"
        ]
      }
    ]
  }
  }'
  ```

### Create Auth Header 
To generate the auth header kindly use the following curl request:
```
curl --location 'localhost:8080/create-header' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3AASiu2zTqhIjkxj8OGpBcEk9MUjWPKWhy.i%2FMc29ueVdeXM96cLCESAVB5ul2yfVrZviJDEKHKVA0' \
--data-raw '{"value":{"test":"test"}},
"subscriber_id" : "abc.com",
"unique_key_id" : "ukid",
"private_key":"private_key"}'
```

To Verify Auth Header
```
curl --location 'localhost:8080/verify-header' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3AASiu2zTqhIjkxj8OGpBcEk9MUjWPKWhy.i%2FMc29ueVdeXM96cLCESAVB5ul2yfVrZviJDEKHKVA0' \
--data-raw '{"value":{"test":"test"}},"public_key":"public_key","header":"Signature keyId=\"abc.com|ukid|ed25519\",algorithm=\"ed25519\",created=\"1712239689\",expires=\"1712539689\",headers=\"(created) (expires) digest\",signature=\"Gy5wiiJYGeNOBsiXJKo4OF7fSKR65zkxa/FJjgBgenmRplhq9vNewz/ivXDFegSnrdQK9U9T19Ta55J7Aa6RBw==\""
}'
```

### How to generate vlookup signature
To generate sigature for vlookup kindly use the following curl request:
```
curl --location 'localhost:8080/sign' \
--header 'Content-Type: application/json' \
--data '{
    "privatekey": "private_key",
    "search_parameters": {
        "country": "IND",
        "domain": "ONDC:RET11",
        "type": "sellerApp",
        "city": "std:079",
        "subscriber_id": "subscriber_id"
    }
}'
```

To Use vlookup
```
curl --location 'localhost:8080/vlookup' \
--header 'Content-Type: application/json' \
--data '{
    "sender_subscriber_id": "sender_sigature_id",
    "request_id": "LUmqWztvAH/S9UBqiYUMN/iwvYcYRz5mC/vVSTfxaYzafs8NCd94UcK2UQSa4lvw4y8WWjacJfxvDzEQGnmgAQ==",
    "timestamp": "2024-06-26T16:45:46.745Z",
    "signature": "BJkw0KsxSBTD4gJ0TwJpyOgM+seqbn9CdvOYQ/HUHvod38qazTYZBZ3gUsvYvQFlrKKU/vitUUXCDKlAgwoDCQ==",
    "search_parameters": {
        "country": "IND",
        "domain": "ONDC:RET11",
        "type": "sellerApp",
        "city": "std:079",
        "subscriber_id": "subscriber_id"
    }
}'
```
