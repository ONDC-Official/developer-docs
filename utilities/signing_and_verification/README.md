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
export REQUEST_BODY_PATH=<request-body-jon-path>
```
  eg for json file provided, export REQUEST_BODY_PATH=request_body.json

3. Generate key-pairs
```
python cryptic_utils.py generate_key_pairs
```
  output will be like 
  ```
  private_key: G0Pme72u8Y1MwxHqvY4iBW+7VPtJ7dsX7SGs6zZ5yvVIzdRAyHR6YkwHG2ufOE+12lsbJRwBF4Hqd7dUEOZZkg==
  public_key:  SM3UQMh0emJMBxtrnzhPtdpbGyUcAReB6ne3VBDmWZI=
  ```

4. Export private and public keys
```
export PRIVATE_KEY=<private_key>
export PUBLIC_KEY=<public_key>
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
