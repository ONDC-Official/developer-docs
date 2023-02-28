# Signing and Verification
Steps for signing and verification

1. Install pip3 and dependencies
```
sudo apt update
sudo apt install python3-pip
pip3 install -r requirements.txt
```

2. Export request body json path:
this file should be a valid json file
```
export REQUEST_BODY_PATH=<request-body-text-path>
```
  eg for json file provided, export REQUEST_BODY_PATH=request_body.json

3. Generate key-pairs
```
python cryptic_utils.py generate_key_pairs
```
  output will be like 
  ```
  Signing_private_key: G0Pme72u8Y1MwxHqvY4iBW+7VPtJ7dsX7SGs6zZ5yvVIzdRAyHR6YkwHG2ufOE+12lsbJRwBF4Hqd7dUEOZZkg==
  Signing_public_key:  SM3UQMh0emJMBxtrnzhPtdpbGyUcAReB6ne3VBDmWZI=
  Crypto_Privatekey:   MC4CAQAwBQYDK2VuBCIEIKi7NbXeN8QzXjN48XkjOiS/UaR6rumXep8VslMy4fRU
  Crypto_Publickey:    MCowBQYDK2VuAyEA9CEWxnLJkmwW/67QR739BEam7bbd3NsffjDa5HANf0Q=
  ```

4. Export private and public keys
```
export PRIVATE_KEY=<private_key>
export PUBLIC_KEY=<public_key>
export CRYPTO_PRIVATE_KEY=<Crypto_Privatekey>
export CRYPTO_PUBLIC_KEY=<Crypto_Publickey>
```

5. Create authorisation header
```
python cryptic_utils.py create_authorisation_header
```
output will be like 
```shell
Signature keyId="buyer-app.ondc.org|207|ed25519",algorithm="ed25519",created="1641287875",expires="1641291475",headers="(created) (expires) digest",signature="fKQWvXhln4UdyZdL87ViXQObdBme0dHnsclD2LvvnHoNxIgcvAwUZOmwAnH5QKi9Upg5tRaxpoGhCFGHD+d+Bw=="
```

6. Verify authorisation header
```
python cryptic_utils.py verify_authorisation_header '<auth_header>'
```
eg usage from output of point 5
```
python cryptic_utils.py verify_authorisation_header 'Signature keyId="buyer-app.ondc.org|207|ed25519",algorithm="ed25519",created="1641287875",expires="1641291475",headers="(created) (expires) digest",signature="fKQWvXhln4UdyZdL87ViXQObdBme0dHnsclD2LvvnHoNxIgcvAwUZOmwAnH5QKi9Upg5tRaxpoGhCFGHD+d+Bw=="'
```
output will be true

7. Encrypt Payload
```
python cryptic_utils.py encrypt "PrivateKey" "PublicKey"
```

eg usage
```
python cryptic_utils.py encrypt "MC4CAQAwBQYDK2VuBCIEIOgl3rf3arbk1PvIe0C9TZp7ImR71NSQdvuSu+zzY6xo" "MCowBQYDK2VuAyEAi801MjVpgFOXHjliyT6Nb14HkS5dj1p41qbeyU6/SC8="
```

Output will be base64 encoded string like "MCowBQYDK2VuAyEAi801MjVpgFOXHjliyT6Nb14HkS5dj1p41qbeyU6/SC8="

8. Decrypt Payload
```
python cryptic_utils.py decrypt "PrivateKey" "PublicKey" "Encrypted String"
```
eg usage
```
python cryptic_utils.py decrypt "MC4CAQAwBQYDK2VuBCIEIOgl3rf3arbk1PvIe0C9TZp7ImR71NSQdvuSu+zzY6xo" "MCowBQYDK2VuAyEAi801MjVpgFOXHjliyT6Nb14HkS5dj1p41qbeyU6/SC8=" "CrwN248HS4CIYsUvxtrK0pWCBaoyZh4LnWtGqeH7Mpc="
```

Output will be a Plain Text decoded string "ONDC is a Great Initiative!"