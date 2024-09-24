
import json
from cryptography.hazmat.primitives import serialization
import base64
from Cryptodome.Cipher import AES
from Cryptodome import Random

rand_gen = Random.new()

pkey = serialization.load_der_private_key(
    base64.b64decode("MC4CAQAwBQYDK2VuBCIEIFl3LqvTWbbT9ws+ZMseya8qdR4H7E4YmBLapKPiRGEc"),
    password=None
)

ukey=pkey.public_key()

uenkey = ukey.public_bytes(
    encoding=serialization.Encoding.DER,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

penkey = pkey.private_bytes(
    encoding=serialization.Encoding.DER,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

print("Local Private Key: ", base64.b64encode(penkey).decode('utf-8'))
print("Local Public Key: ", base64.b64encode(uenkey).decode('utf-8'))
print("ONDC Public Key: ", "MCowBQYDK2VuAyEAa9Wbpvd9SsrpOZFcynyt/TO3x0Yrqyys4NUGIvyxX2Q=")

myukey = base64.b64encode(uenkey).decode('utf-8')
#"MCowBQYDK2VuAyEAa9Wbpvd9SsrpOZFcynyt/TO3x0Yrqyys4NUGIvyxX2Q=")
ondcpub = (base64.b64decode(
    "MCowBQYDK2VuAyEAF2efvGvniY1X7mVwjK+9z17pcrM+hnEYNUKiiUVSuyY="
    )
)

oenkey = serialization.load_der_public_key(ondcpub)

shared_key = pkey.exchange(oenkey)
print("Shared Secret: ", base64.b64encode(shared_key).decode('utf-8'))

cipher = AES.new(shared_key,AES.MODE_GCM)

nonce = cipher.nonce

text = b'aef26da5-12f3-4e95-8bfb-e3398489c4c4'

cstr,authTag = cipher.encrypt_and_digest(text)


ciphdict = {
    "cipher": base64.b64encode(cstr).decode('utf-8'),
    "hmac": base64.b64encode(authTag).decode('utf-8'),
    "nonce": base64.b64encode(nonce).decode('utf-8')
}

ciphjson = json.dumps(ciphdict, sort_keys=True, indent=2)
print(ciphjson.encode('utf-8').decode('utf-8'))


encstr = base64.b64encode(ciphjson.encode('utf-8')).decode('utf-8')
print(encstr)

decstr = json.loads(base64.b64decode(encstr))

cipher1 = AES.new(shared_key,AES.MODE_GCM,nonce=base64.b64decode(decstr["nonce"]))

dec = cipher1.decrypt_and_verify(base64.b64decode(decstr["cipher"]),base64.b64decode(decstr["hmac"]))

print("Decrypted Text:", dec.decode('utf-8'))



