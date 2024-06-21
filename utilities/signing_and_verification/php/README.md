# Signing and Verification
Steps for signing and verification

1. Install php and dependencies

```sh
# linux setup
# download php
sudo apt install php php-curl
# Download Composer
curl -sS https://getcomposer.org/installer -o composer-setup.php
# install composer
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
# change to cloned directory
cd <clone_dir>/reference-implementations/utilities/signing_and_verification/php
composer install

# brew setup
# install php
brew install php # latest version is 8.0.0, this will work for versions >= 7.4
# install composer
brew install composer
# change to cloned directory
cd <clone_dir>/reference-implementations/utilities/signing_and_verification/php
composer install
```
2. ENV variables
```sh
SIGNING_PRIV_KEY="your signing private key"
SIGNING_PUB_KEY="your signing public key"
ENC_PUB_KEY="your encryption/crypto public key"
ENC_PRIV_KEY="your encryption/crypto private key"
COUNTERPARTY_PUB_KEY="the other party's signing public key"
SUBSCRIBER_ID="your subscriber id"
UNIQUE_KEY_ID="your ukid"
AUTH_HEADER="the auth header that is to be verified"
REQUEST_BODY="json stringified payload"
```
3. Generate keys
```sh
composer run start -- -g

# OUTPUT
Signing priv key: VfwASYHVjMAC63LClJKVTvjHcvuUZ4oQKhXmpY6+pwsu7b5xNQzhD/drIPer5m3kasjjicaj/+lblZsNnlQMCw==
Signing pub key: Lu2+cTUM4Q/3ayD3q+Zt5GrI44nGo//pW5WbDZ5UDAs=
Encryption priv key: MC4CAQEwBQYDK2VuBCIEINaTmxwcMRLGuxX1lrwo0Lxd2FHqn84YqQoDzVQXe46+
Encryption pub key: MCowBQYDK2VuAyEAFT6F4dxn1waTvLUbY5tdKh/IezuOp+tlHkAwQw82qXU=
```
4. Create authorisation header
```sh
# REQUEST_BODY, SIGNING_PRIV_KEY, SUBSCRIBER_ID, UNIQUE_KEY_ID should be set
composer run start -- -s

# OUTPUT
Signature keyId="buyer-app.ondc.org|207|ed25519",algorithm="ed25519",created="1641287875",expires="1641291475",headers="(created) (expires) digest",signature="fKQWvXhln4UdyZdL87ViXQObdBme0dHnsclD2LvvnHoNxIgcvAwUZOmwAnH5QKi9Upg5tRaxpoGhCFGHD+d+Bw=="
```

5. Verify authorisation header
```sh
# AUTH_HEADER, REQUEST_BODY, COUNTERPARTY_SIGNING_PUB_KEY should be set
composer run start -- -v

#OUTPUT
0 | 1  # depending upon truth value (true = 1) 
```

6. Encrypt Payload
```sh
# ENC_PRIV_KEY, COUNTERPARTY_PUB_KEY should be set
composer run start -- -e 'message to encrypt'

#OUTPUT
dq6j2KZp61G6PMM9IhHW2fbOnquy7gkwJN/tVXkKAI4=
```

8. Decrypt Payload
```sh
# ENC_PRIV_KEY, ENC_PUB_KEY should be set
composer run start -d 'dq6j2KZp61G6PMM9IhHW2fbOnquy7gkwJN/tVXkKAI4='

#OUTPUT
message to encrypt
```
