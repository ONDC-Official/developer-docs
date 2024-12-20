
from cryptography.hazmat.primitives import serialization
import base64
from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad,unpad

pkey = serialization.load_der_private_key(
    base64.b64decode("MC4CAQAwBQYDK2VuBCIEIKh1Dq7Fu82lqQdBQJTHTvBTxtD6hLconopqvVLVy81s"),
    password=None
)

ukey=pkey.public_key()
encstr = base64.b64decode("TaaRFx6fxSbFJO2Lp9Kbap1rZTjAAveAeASr19G7iXI8Meaz6Ok6B4C709pC3GpR".encode('utf-8'))

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

ondcpub = (base64.b64decode(
    "MCowBQYDK2VuAyEAa9Wbpvd9SsrpOZFcynyt/TO3x0Yrqyys4NUGIvyxX2Q="))
oenkey = serialization.load_der_public_key(ondcpub)

shared_key = pkey.exchange(oenkey)
print("Shared Secret: ", base64.b64encode(shared_key).decode('utf-8'))

# print("Derived Secret: ", base64.b64encode(key).decode('utf-8'))


cipher = AES.new(shared_key,AES.MODE_ECB)
dec = cipher.decrypt(encstr)
enc = cipher.encrypt(pad(b'ABCDEFGH', AES.block_size))
print(dec.decode('utf-8'))
print(base64.b64encode(enc).decode('utf-8'))
estr=cipher.encrypt(pad(b'ABCDEFGH', AES.block_size))
dstr=cipher.decrypt(estr)
print(unpad(dstr, AES.block_size).decode('utf-8'))