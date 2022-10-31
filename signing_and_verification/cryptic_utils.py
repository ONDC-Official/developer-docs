import base64
import datetime
import os
import re
import json

import fire as fire
import nacl.encoding
import nacl.hash
from nacl.bindings import crypto_sign_ed25519_sk_to_seed
from nacl.signing import SigningKey, VerifyKey

f = open(os.getenv("REQUEST_BODY_PATH", "signing_and_verification/request_body.json"))
request_body_json = json.load(f)


def hash_message(msg: str):
    HASHER = nacl.hash.blake2b
    digest = HASHER(bytes(msg, 'utf-8'), digest_size=64, encoder=nacl.encoding.Base64Encoder)
    digest_str = digest.decode("utf-8")
    return digest_str


def create_signing_string(digest_base64, created=None, expires=None):
    if created is None:
        created = int(datetime.datetime.now().timestamp())
    if expires is None:
        expires = int((datetime.datetime.now() + datetime.timedelta(hours=1)).timestamp())
    signing_string = f"""(created): {created}
(expires): {expires}
digest: BLAKE-512={digest_base64}"""
    return signing_string


def sign_response(signing_key, private_key):
    private_key64 = base64.b64decode(private_key)
    seed = crypto_sign_ed25519_sk_to_seed(private_key64)
    signer = SigningKey(seed)
    signed = signer.sign(bytes(signing_key, encoding='utf8'))
    signature = base64.b64encode(signed.signature).decode()
    return signature


def verify_response(signature, signing_key, public_key):
    try:
        public_key64 = base64.b64decode(public_key)
        VerifyKey(public_key64).verify(bytes(signing_key, 'utf8'), base64.b64decode(signature))
        return True
    except Exception:
        return False


def get_filter_dictionary_or_operation(filter_string):
    filter_string_list = re.split(',', filter_string)
    filter_string_list = [x.strip(' ') for x in filter_string_list]  # to remove white spaces from list
    filter_dictionary_or_operation = dict()
    for fs in filter_string_list:
        splits = fs.split('=', maxsplit=1)
        key = splits[0].strip()
        value = splits[1].strip()
        filter_dictionary_or_operation[key] = value.replace("\"", "")
    return filter_dictionary_or_operation


def create_authorisation_header(request_body=request_body_json,
                                created=os.getenv("CREATED",  "1641287875"),
                                expires=os.getenv("EXPIRES",  "1641291475")):
    signing_key = create_signing_string(hash_message(json.dumps(request_body, separators=(',', ':'))),
                                        created=created, expires=expires)
    signature = sign_response(signing_key, private_key=os.getenv("PRIVATE_KEY"))

    subscriber_id = os.getenv("SUBSCRIBER_ID", "buyer-app.ondc.org")
    unique_key_id = os.getenv("UNIQUE_KEY_ID", "207")
    header = f'Signature keyId="{subscriber_id}|{unique_key_id}|ed25519",algorithm="ed25519",created=' \
             f'"{created}",expires="{expires}",headers="(created) (expires) digest",signature="{signature}"'
    return header


def verify_authorisation_header(auth_header, request_body_str, public_key=os.getenv("PUBLIC_KEY")):
    # `request_body_str` should request.data i.e. raw data string

    # `public_key` is sender's public key
    # i.e. if Seller is verifying Buyer's request, then seller will first do lookup for buyer-app
    # and will verify the request using buyer-app's public-key
    header_parts = get_filter_dictionary_or_operation(auth_header.replace("Signature ", ""))
    created = int(header_parts['created'])
    expires = int(header_parts['expires'])
    current_timestamp = int(datetime.datetime.now().timestamp())
    if created <= current_timestamp <= expires:
        signing_key = create_signing_string(hash_message(request_body_str), created=created, expires=expires)
        return verify_response(header_parts['signature'], signing_key, public_key=public_key)
    else:
        return False


def generate_key_pairs():
    signing_key = SigningKey.generate()
    private_key = base64.b64encode(signing_key._signing_key).decode()
    public_key = base64.b64encode(bytes(signing_key.verify_key)).decode()
    return {"private_key": private_key, "public_key": public_key}


if __name__ == '__main__':
    fire.Fire()
