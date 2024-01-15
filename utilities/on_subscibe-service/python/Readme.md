# Subscribing to ONDC Registry

### Start Server

``` flask --app server run  ```

1. Add following environment variables like below.
```
- name: BAP_BASE_URL
    value: "<Domain_Host_Url>"
- name: BPP_BASE_URL
    value: "<Domain_Host_Url>"
- name: APP_PORT
    value: "5000"
- name: STATIC_FILE_PORT
    value: "9000"
- name: REGISTRY_URL
    value: https://prod.registry.ondc.org/subscribe
```
2. In **server.py** code and the below request_body please replace the `...` with the required details reffering from [ONDC Onboarding Guide](https://github.com/ONDC-Official/developer-docs/blob/main/registry/Onboarding%20of%20Participants.md) to get the server up and running properly.
3. To subscribe the BAP and BPP to ONDC registry after whitelisting of subscriber_id. You need to call your server with the below request body.
```
curl --location 'https://<Domain_Host_Url>/subscribe' \
--header 'Content-Type: application/json' \
--data '{
    "<subscriber_id> | <ukId>": {
        "signingPublicKey": "...",
        "signingPrivateKey": "...",
        "ondcPublicKey": "MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM=", # Change it for pre-prod and prod
        "encPublicKey": "...",
        "encPrivateKey": "...",
        "type": "BAP",
        "city": "std:080"
    },
    "<Domain_Host_Url>/dobpp/beckn/7f7896dd-787e-4a0b-8675-e9e6fe93bb8f | 50": {
        "signingPublicKey": "HUVYp98+DBp/LIbs7LoeSec3NwQcojLZhsa/tQdqbP4=",
        "signingPrivateKey": "...",
        "ondcPublicKey": "MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM=",
        "encPublicKey": "...",
        "encPrivateKey": "...",
        "type": "BPP",
        "city": "std:080"
    }
}'
```