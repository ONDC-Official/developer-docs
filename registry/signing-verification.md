# ONDC Network Signing & Verifying
​
When communicating over HTTP using Beckn APIs, the subscribers need to authenticate themselves to perform transactions with other subscribers on the network. Due to the commercial nature of the transactions, every request/callback pair is considered to be a "contract" between two parties. Therefore, it is imperative that all requests and callbacks are digitally signed by the sender and subsequently verified by the receiver.
​
Furthermore, it is also desirable to ensure that the message was not altered or tampered with during transit.
​
The protocol has provided 2 header values based from where the request originated or forwarded by.
​
* `Authorization`:  When the request is originated from a NP the request sends a header with “Authorization” key and value as explained below.
* `X-Gateway-Authorization`: When the request is forwarded from BG the request sends a header with “X-Gateway-Authorization” key and value as explained below.
​
   ```mermaid
    sequenceDiagram
    participant NP1 as NP1 (Originator of the request)
    participant BG as BG (Gateway)
    participant NP2 as NP2 (Receiver of the request)

    NP1 ->> BG: Create request body & Authorization Header value
    BG -->> BG: Verify Authorization header
    BG -->> NP2: Create X-Gateway-Authorization Header value
    BG -->> NP2: Make requests to all corresponding NPs (e.g., NP2)
    NP2 -->> NP2: Verify X-Gateway-Authorization & Authorization headers

    participant NP1 as NP1 (Originator of the request)
    participant NP2 as NP2 (Receiver of the request)

   

  ```
​
​
​
### Authorization Header
  Let the below be the request body in this example :
  ```json
  {"context":{"domain":"nic2004:60212","country":"IND","city":"Kochi","action":"search","core_version":"0.9.1","bap_id":"bap.stayhalo.in","bap_uri":"https://8f9f-49-207-209-131.ngrok.io/protocol/","transaction_id":"e6d9f908-1d26-4ff3-a6d1-3af3d3721054","message_id":"a2fe6d52-9fe4-4d1a-9d0b-dccb8b48522d","timestamp":"2022-01-04T09:17:55.971Z","ttl":"P1M"},"message":{"intent":{"fulfillment":{"start":{"location":{"gps":"10.108768, 76.347517"}},"end":{"location":{"gps":"10.102997, 76.353480"}}}}}}
  ``` 
Let NP’s keys be :
```
signing_public_key   =  awGPjRK6i/Vg/lWr+0xObclVxlwZXvTjWYtlu6NeOHk=
signing_private_key  =  lP3sHA+9gileOkXYJXh4Jg8tK0gEEMbf9yCPnFpbldhrAY+NErqL9WD+Vav7TE5tyVXGXBle9ONZi2W7o144eQ==
​
```
The NP performs the following steps to create the Authorization header
1. Generate the `digest` of the request body using the `BLAKE-512` hashing function
    ```
    b6lf6lRgOweajukcvcLsagQ2T60+85kRh/Rd2bdS+TG/5ALebOEgDJfyCrre/1+BMu5nA94o4DT3pTFXuUg7sw==
    ```
2. Generate the created field. The `created` field expresses when the signature was created. The value MUST be a Unix timestamp integer value. A signature with a `created` timestamp value that is in the past MUST be processed.
    ```
    (created): 1641287875
    ```  
3. Generate the expires field. The `expires` field expresses when the signature ceases to be valid. The value MUST be a Unix timestamp integer value. A signature with an `expires` timestamp value that is in the future MUST be processed.
    ```
      (expires): 1641291475
    ```
4. Concatenate the three values, i.e the `created`, `expires` and `digest` in the format as shown below. The below string is the signing string which the BAP is going to use to sign the request
    ```
      (created): 1641287875\n(expires):1641291475\ndigest:BLAKE-512=b6lf6lRgOweajukcvcLsagQ2T60+85kRh/Rd2bdS+TG/5ALebOEgDJfyCrre/1+BMu5nA94o4DT3pTFXuUg7sw==
    ``` 
5. The NP will then sign this string using its registered signing private key via the Ed25519 Signature Scheme
6. Finally the NP will generate a base64 encoded string of the signature and insert it into the signature parameter of the Authorization header
    ```
    cjbhP0PFyrlSCNszJM1F/YmHDVAWsZqJUPzojnE/7TJU3fJ/rmIlgaUHEr5E0/2PIyf0tpSnWtT6cyNNlpmoAQ==
    ```
7. Finally the Authorization header will look like this. (Let's assume subscriber_id = example-bap.com, unique_key_id = bap1234)
    ```
      keyId="example-bap.com|bap1234|ed25519",algorithm="ed25519",created="1641287875",expires="1641291475",headers=" (created)(expires)digest",signature="cjbhP0PFyrlSCNszJM1F/YmHDVAWsZqJUPzojnE/7TJU3fJ/rmIlgaUHEr5E0/2PIyf0tpSnWtT6cyNNlpmoAQ=="
    ```  
 8. Finally the NP includes the authorization header in the request and calls the receiver's API
​
### X-Gateway-Authorization Header:
  This works similarly to the authorization process, but with a Gateway as the Network Participant (NP). Here, the Gateway uses its private key for signing, along with the corresponding subscriber_id and unique key id.
​
### Verify Signature
  `NP1 → Originator of the request 
   NP2 → Receiver of the request`
​
  1. NP2 gets keyId from the Authorization or X-Gateway-Authorization header
    ```
      example-bap.com|bap1234|ed25519
    ```
  2. NP splits the keyId string into subscriber ID, Unique Key ID and algorithm using the delimiter "|".
  3. The keyId uses the format {subscriber id}|{unique_key_id}|{signing algorithm} . If the signing algorithm extracted from the keyId does not match the value of the algorithm parameter in the Authorization header, then the NP should return an unauthorised error via NACK.
  4. The keyId also contains a unique_key_id which is used when the NP1 has uploaded multiple public keys to a registry OR when the same domain is being used for implementing multiple types of subscribers
  5. The NP2 will now look up the registry for the public key of the subscriber by sending the subscriber_id and the unique_key_id via the lookup API or by retrieving a cached copy of the subscriber's public key matching the subscriber_id and unique_key_id. It will receive the public key of the NP1 :

    ```
    awGPjRK6i/Vg/lWr+0xObclVxlwZXvTjWYtlu6NeOHk=
    ```
    
      

  6. If no valid key is found, the NP2 must return a NACK response with Unauthorised response code.
​
### Request Journeys Patterns:
 #### Request via gateway:   
 
​
    ```
      NP1 → Originator of the request to Gateway
      BG  → Gateway
      NP2 → Receiver of the request
    ```      
    1. NP1 would create the request body and creates a Authorization Header value
    2. NP1 would make request to the BG
    3. BG on receiving the request verifies the Authorization header
    4. BG creates a X-Gateway-Authorization Header value
    5. BG will make multiple requests to all corresponding NP’s lets say NP2 is one
    6. NP2 on receiving the request form the BG verifies the X-Gateway-Authorization & Authorization headers on receiving the request
​
​
 #### Peer to Peer Request
      NP1 → Originator of the request
      NP2 → Receiver of the request
      
      1. NP1 would create the request body and creates a Authorization Header value
      2. NP1 would make request to the NP2
      3. NP2 on receiving the request form the NP1 verifies the Authorization headers on receiving the request
​
​
​