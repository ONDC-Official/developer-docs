
# Subscribing to ONDC Registry

1. Add following constants like below.

- ENCRYPTION_PRIVATE_KEY = "NP's encryption private key"
- ONDC_PUBLIC_KEY = "Registry's encryption public key as per your environment which is available in NP On-Boarding on [document](https://github.com/ONDC-Official/developer-docs/blob/main/registry/Onboarding%20of%20Participants.md) (staging key: MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM=)" 
- REQUEST_ID = "request_id which is sent in /subscribe"
- SIGNING_PRIVATE_KEY = "NP's signing private key"


2. Place the index.js file code into your main file, and this utility will host the on_subscribe endpoint as well as html file.
