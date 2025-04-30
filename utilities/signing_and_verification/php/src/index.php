<?php

include_once "vendor/autoload.php";

use phpseclib3\Crypt\AES;
use Sop\ASN1\Type\Primitive\BitString;
use Custom\AlgorithmIdentifier\Asymmetric\X25519AlgorithmIdentifier;
use Sop\CryptoTypes\Asymmetric\OneAsymmetricKey;
use Sop\CryptoTypes\Asymmetric\PublicKeyInfo;

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 1));
$dotenv->safeload();

function hash_msg(string $msg): string
{
    return base64_encode(sodium_crypto_generichash($msg, "", 64));
}

function create_signing_string(string $digest_base64, string $created = null, string $expires = null): string
{
    $now = new DateTime();
    $one_hour = new DateInterval("PT1H");

    if ($created == null) {
        $created = $now->getTimestamp();
    }

    if ($expires == null) {
        $expires = $now->add($one_hour)->getTimestamp();
    }

    $signing_string = "(created): $created\n(expires): $expires\ndigest: BLAKE-512=$digest_base64";
    return $signing_string;
}

function sign_response(string $signing_key, string $private_key): string
{
    return base64_encode(sodium_crypto_sign_detached($signing_key, base64_decode($private_key)));
}

function verify_response(string $signature, string $signing_key, string $public_key): bool
{
    $decoded_public_key = base64_decode($public_key);

    if ($decoded_public_key === false) {
        throw new Exception('Failed to decode public key from base64.');
    }
    
    // Check if the public key has the correct length
    if (strlen($decoded_public_key) !== SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES) {
        throw new Exception('The public key is not the correct length.');
    }

    // Verify the signature
    $verification_result = sodium_crypto_sign_verify_detached(base64_decode($signature), $signing_key, $decoded_public_key);
    echo "Verification Result: ", $verification_result ? 'True' : 'False', PHP_EOL;

    return $verification_result;
}


function create_authorisation_header(string $request_body, string $created = null, string $expires = null)
{
    $now = new DateTime();
    $one_hour = new DateInterval("PT1H");

    if ($created == null) {
        $created = $now->getTimestamp();
    }

    if ($expires == null) {
        $expires = $now->add($one_hour)->getTimeStamp();
    }

    $signing_key = create_signing_string(hash_msg($request_body), $created, $expires);
    $signature = sign_response($signing_key, $_ENV['SIGNING_PRIV_KEY']);

    $subscriber_id = $_ENV['SUBSCRIBER_ID'];
    $unique_key_id = $_ENV['UNIQUE_KEY_ID'];

    $header = "Signature keyId=\"$subscriber_id|$unique_key_id|ed25519\",algorithm=\"ed25519\",created=\"$created\",expires=\"$expires\",headers=\"(created) (expires) digest\",signature=\"$signature\"";
    return $header;
}

// util
function get_filter_dict(string $filter_string)
{
    $filter_string_list = preg_split("/,/", $filter_string);
    $filter_string_list = array_map(function ($item) {return trim($item, " \n\r\t\v\0\"");}, $filter_string_list);
    $filter_string_dict = [];
    foreach ($filter_string_list as $item) {
        $split_item = preg_split("/=/", $item, 2);
        $filter_string_dict[$split_item[0]] = trim($split_item[1], " \n\r\t\v\0\"");
    }
    return $filter_string_dict;
}

function verify_authorisation_header(string $auth_header, string $request_body_str, string $public_key): bool
{
    $auth_header = str_replace("Signature ", "", $_ENV['AUTH_HEADER']);
    $header_parts = get_filter_dict($auth_header);
    $created = (int) $header_parts["created"];
    $expires = (int) $header_parts["expires"];

    $now = new DateTime();
    if ($created <= $now->getTimestamp() && $expires >= $now->getTimestamp()) {
        $signing_key = create_signing_string(hash_msg($_ENV['REQUEST_BODY']), $created, $expires);
        return verify_response($header_parts['signature'], $signing_key, $public_key);
    }else{
        throw new Exception('The signature has expired.');
    }
    return false;
}

function gen_keys()
{
    $signkeypair = sodium_crypto_sign_keypair();
    $signprivkey = sodium_crypto_sign_secretkey($signkeypair);
    $signpubkey = sodium_crypto_sign_publickey($signkeypair);

    // using libsodium
    $enckeypair = sodium_crypto_box_keypair();
    $encprivkey = sodium_crypto_box_secretkey($enckeypair);
    $encpubkey = sodium_crypto_box_publickey($enckeypair);

    // $openssl = openssl_pkey_get_private($encprivkey);

    // echo "Encryption priv key: ", base64_encode($encprivkey), "\n";
    $encprivkey = new OneAsymmetricKey(new X25519AlgorithmIdentifier(), "\x04\x20" . $encprivkey);
    $encpubkey = new PublicKeyInfo(new X25519AlgorithmIdentifier(), new BitString($encpubkey));

    echo "Signing priv key: ", base64_encode($signprivkey), "\n";
    echo "Signing pub key: ", base64_encode($signpubkey), "\n";
    echo "Encryption priv key: ", base64_encode($encprivkey->toDER()), "\n";
    echo "Encryption pub key: ", base64_encode($encpubkey->toDER()), "\n";
}

function encrypt(string $crypto_private_key, string $crypto_public_key, ?string $message = null): string
{
    $pkey = OneAsymmetricKey::fromDER(base64_decode($crypto_private_key));
    $pubkey = PublicKeyInfo::fromDER(base64_decode($crypto_public_key));
    $pkey = hex2bin(str_replace("0420", "", bin2hex($pkey->privateKeyData())));
    $shkey = sodium_crypto_box_keypair_from_secretkey_and_publickey($pkey, $pubkey->publicKeyData());
    $shpkey = sodium_crypto_box_secretkey($shkey);

    $cipher = new AES('ecb');
    $cipher->setKey($shpkey);
    return base64_encode($cipher->encrypt($message == null ? 'ONDC is a great initiative!' : $message));
}

function decrypt(string $crypto_private_key, string $crypto_public_key, string $cipher_text): string
{
    $pkey = OneAsymmetricKey::fromDER(base64_decode($crypto_private_key));
    $pubkey = PublicKeyInfo::fromDER(base64_decode($crypto_public_key));
    $pkey = hex2bin(str_replace("0420", "", bin2hex($pkey->privateKeyData())));
    $shkey = sodium_crypto_box_keypair_from_secretkey_and_publickey($pkey, $pubkey->publicKeyData());
    $shpkey = sodium_crypto_box_secretkey($shkey);

    $cipher = new AES('ecb');
    $cipher->setKey($shpkey);
    return ($cipher->decrypt(base64_decode($cipher_text)));
}

function main(array $args)
{
    switch ($args[1]) {
        case "-g":
            gen_keys();
            break;
        case "-e":
            echo encrypt($_ENV['ENC_PRIV_KEY'], $_ENV['ENC_PUB_KEY'], $args[2]);
            break;
        case "-d":
            echo decrypt($_ENV['ENC_PRIV_KEY'], $_ENV['COUNTERPARTY_PUB_KEY'], $args[2]);
            break;
        case "-s":
            echo create_authorisation_header($_ENV['REQUEST_BODY']);
            break;
        case "-v":
            echo verify_authorisation_header($_ENV['AUTH_HEADER'] || '', $_ENV['REQUEST_BODY'] || '', $_ENV["SIGNING_PUB_KEY"]);
            break;
        default:
            echo "$args[1] is not a valid argument: please check" . "\n";
            echo "signing and verification helper: " . "\n";
            echo "-g: generate signing and enc key pairs" . "\n";
            echo "-e: encrypt with enc keys" . "\n";
            echo "-d: decrypt with enc keys" . "\n";
            echo "-s: create signed header" . "\n";
            echo "-v: verify signed header" . "\n";
    }
}

main($argv);
