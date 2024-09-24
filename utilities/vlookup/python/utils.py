import base64
from datetime import datetime, timezone
import uuid
import requests
import nacl.encoding;
import nacl.hash
from nacl.bindings import crypto_sign_ed25519_sk_to_seed
from nacl.signing import SigningKey
import json

def create_signing_string(data):
    country = data.get('country')
    domain = data.get('domain')
    type_ = data.get('type_')  # 'type' is a reserved keyword in Python, using 'type_' instead
    city = data.get('city')
    subscriber_id = data.get('subscriberId')
    return "|".join([country, domain, type_, city, subscriber_id])


def get_env_details(env):
    env_link = ""
    if env == "preprod":
        env_link = "https://preprod.registry.ondc.org/ondc/vlookup"
    elif env == "prod":
        env_link = "https://prod.registry.ondc.org/vlookup"
    elif env == "staging":
        env_link = "https://staging.registry.ondc.org/vlookup"
    else:
        raise ValueError("Unsupported environment")
    return env_link

def fetchRegistryResponse(request_id,timestamp,signature,search_parameters,sender_subscriber_id,envLink):
    try:
        payload = {
        'sender_subscriber_id': sender_subscriber_id,
        'request_id': str(request_id),
        'timestamp': timestamp,
        'search_parameters': search_parameters,
        'signature': signature
        }

    # Make the HTTP POST request
        json_data = json.loads(json.dumps(payload))
        response = requests.post(envLink,json=json_data)
        return response

    except Exception as e:
        raise e

def getVLookUpData(signature,data):
    requestId = uuid.uuid4()
    timestamp = datetime.now(timezone.utc)
    formatted_timestamp = timestamp.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
    country = data.get('country')
    domain = data.get('domain')
    type_ = data.get('type_')  # 'type' is a reserved keyword in Python, so using 'type_' instead
    city = data.get('city')
    subscriber_id = data.get('subscriberId')

    search_parameters = {
    'country': country,
    'domain': domain,
    'type': type_,
    'city': city,
    'subscriber_id': subscriber_id,
    }

    sender_subscriber_id = data['senderSubscriberId']
    env_link = get_env_details(data['env'])

    try:
        res = fetchRegistryResponse(requestId,
            formatted_timestamp,
            signature,
            search_parameters,
            sender_subscriber_id,
            env_link
        )
        return res
    except Exception as e:
        raise e



def sign_response(signing_key, private_key):
    private_key64 = base64.b64decode(private_key)
    seed = crypto_sign_ed25519_sk_to_seed(private_key64)
    signer = SigningKey(seed)
    signed = signer.sign(bytes(signing_key, encoding='utf8'))
    signature = base64.b64encode(signed.signature).decode()
    return signature


def vlookup(data):
    try:
        private_key = data.get('privateKey')
        signingString = create_signing_string(data)
        signature = sign_response(signingString,private_key)
        result = getVLookUpData(signature, data)
        result = result.content
        return result
    
    except Exception as e:
        raise(e)
    



