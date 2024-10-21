<?php

include_once './vendor/autoload.php';
use phpseclib3\Crypt\AES;
use Ramsey\Uuid\Uuid;
use Sop\CryptoTypes\Asymmetric\OneAsymmetricKey;
use Sop\CryptoTypes\Asymmetric\PublicKeyInfo;

$dotenv = Dotenv\Dotenv::createImmutable(".");
$dotenv->safeLoad();

$bapBaseUrl = $_SERVER['BAP_BASE_URL'];
$bppBaseUrl = $_SERVER['BPP_BASE_URL'];
$registery_url = $_SERVER['REGISTERY_URL'];
$app_port = $_SERVER['APP_PORT'];
$static_file_port = $_SERVER['STATIC_FILE_PORT'];
$subscribers = [];
$subscribers_uniquekey_store = [];

$bapSubscriberBody = [
    "context" => ["operation" => ["ops_no" => 1]],
    "message" => [
        "request_id" => "",
        "timestamp" => "",
        "entity" => [
            "gst" => [
                "legal_entity_name" => "",
                "business_address" => "",
                "city_code" => ["std:080"],
                "gst_no" => "",
            ],
            "pan" => [
                "name_as_per_pan" => "",
                "pan_no" => "",
                "date_of_incorporation" => "",
            ],
            "name_of_authorised_signatory" => "",
            "email_id" => "email@domain.in",
            "mobile_no" => "",
            "country" => "IND",
            "subscriber_id" => "",
            "unique_key_id" => "",
            "callback_url" => "/",
            "key_pair" => [
                "signing_public_key" => "",
                "encryption_public_key" => "",
                "valid_from" => "",
                "valid_until" => "2030-06-19T11:57:54.101Z",
            ],
        ],
        "network_participant" => [
            [
                "subscriber_url" => "/",
                "domain" => "ONDC:TRV10",
                "type" => "buyerApp",
                "msn" => false,
                "city_code" => [],
            ],
        ],
    ],
];

$bppSubscriberBody = [
    "context" => ["operation" => ["ops_no" => 2]],
    "message" => [
        "request_id" => "",
        "timestamp" => "",
        "entity" => [
            "gst" => [
                "legal_entity_name" => "",
                "business_address" => "",
                "city_code" => ["std:080"],
                "gst_no" => "...",
            ],
            "pan" => [
                "name_as_per_pan" => "...",
                "pan_no" => "...",
                "date_of_incorporation" => "...",
            ],
            "name_of_authorised_signatory" => "...",
            "email_id" => "email@domain.in",
            "mobile_no" => "",
            "country" => "IND",
            "subscriber_id" => "",
            "unique_key_id" => "",
            "callback_url" => "/",
            "key_pair" => [
                "signing_public_key" => "",
                "encryption_public_key" => "",
                "valid_from" => "",
                "valid_until" => "2030-06-19T11:57:54.101Z",
            ],
        ],
        "network_participant" => [
            [
                "subscriber_url" => "/",
                "domain" => "ONDC:TRV10",
                "type" => "sellerApp",
                "msn" => false,
                "city_code" => [],
            ],
        ],
    ],
];

function sign(string $signing_key, string $private_key): string
{
    return base64_encode(sodium_crypto_sign_detached($signing_key, base64_decode($private_key)));
}

function decrypt(string $enc_public_key, string $enc_private_key, string $cipher_string): string
{
    $pkey = OneAsymmetricKey::fromDER(base64_decode($enc_private_key));
    $pubkey = PublicKeyInfo::fromDER(base64_decode($enc_public_key));
    $pkey = hex2bin(str_replace("0420", "", bin2hex($pkey->privateKeyData())));
    $shkey = sodium_crypto_box_keypair_from_secretkey_and_publickey($pkey, $pubkey->publicKeyData());
    $shpkey = sodium_crypto_box_secretkey($shkey);

    $cipher = new AES('ecb');
    $cipher->setKey($shpkey);
    return ($cipher->decrypt(base64_decode($cipher_string)));
}

function createHtml(array $subscriber, string $subscriber_id): void
{
    global $bapBaseUrl, $bppBaseUrl;
    $signature = sign($subscriber['requestId'], $subscriber['signingPrivateKey']);
    $htmlFile = "
    <html>\n
    \t<head>\n
    \t\t<meta name='ondc-site-verification' content=$signature />\n
    \t</head>\n
    \t<body>\n
    \t\tONDC Site Verification Page\n
    \t</body>\n
    </html>\n";

    if ($subscriber['type'] == "BAP") {
        $dir = "templates/" . substr($subscriber_id, strlen(
            $subscriber['type'] == "BAP"
            ? $bapBaseUrl
            : ($subscriber['type'] == "BPP"
                ? $bppBaseUrl
                : ""))
             + 1);
        if (!file_exists($dir)) {
            mkdir($dir);
        }
    }

    $siteVer = fopen("$dir/ondc-site-verfication.html", "w+");
    if ($siteVer) {
        fwrite($siteVer, $htmlFile);
        fclose($siteVer);
    }
}

function serve_file()
{
    global $static_file_port;
    shell_exec("php -S localhost:$static_file_port ondc-verification");
}
function subscribe_helper(mixed $subscribers)
{
    global $subscribers_uniquekey_store, $registery_url;
    if ($subscribers != null) {
        foreach ($subscribers as $subscriber_uk_id => $subscriber) {
            list($subscriber_id, $unique_key_id) = explode(" | ", $subscriber_uk_id);
            $subscribers_uniquekey_store[$subscriber_id] = $unique_key_id;
            $request_id = (Uuid::uuid4())->toString();
            $subscribers[$subscriber_uk_id]["requestId"] = $request_id;
            createHtml($subscriber, $subscriber_id);
        }

        if (pcntl_fork() == -1) {
            die('could not fork the process');
        } else {
            if (function_exists('serve_file')) {
                die('function subscribe helper does not exist');
            }
            serve_file();
        }
        sleep(5);

        foreach ($subscribers as $subscriber_uk_id => $subscriber) {
            [$subscriber_id, $unique_key_id] = explode(" | ", $subscriber_uk_id);
            $request_id = $subscriber["requestId"];
            $current_datetime = new DateTime("now", new DateTimeZone("Asia/Kolkata"));
            $current_datetime_iso8601 = $current_datetime->format("Y-m-d\TH:i:s.u\Z");

            if ($subscriber["type"] == "BAP") {
                $bapSubscribeBody["message"]["request_id"] = $request_id;
                $bapSubscribeBody["message"]["timestamp"] = $current_datetime_iso8601;
                $bapSubscribeBody["message"]["entity"]["subscriber_id"] = $subscriber_id;
                $bapSubscribeBody["message"]["entity"]["unique_key_id"] = $unique_key_id;
                $bapSubscribeBody["message"]["entity"]["key_pair"]["signing_public_key"] = $subscriber["signingPublicKey"];
                $bapSubscribeBody["message"]["entity"]["key_pair"]["encryption_public_key"] = $subscriber["encPublicKey"];
                $bapSubscribeBody["message"]["entity"]["key_pair"]["valid_from"] = $current_datetime_iso8601;
                $bapSubscribeBody["message"]["network_participant"][0]["city_code"] = [$subscriber["city"]];

                echo json_encode($bapSubscribeBody) . "\n";

                $curl = curl_init($registery_url);
                curl_setopt_array($curl, [
                    CURLOPT_POST => true,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_POSTFIELDS => json_encode($bapSubscribeBody),
                ]);
                $response = curl_exec($curl);
                if ($response != false) {
                    echo "/subscribe for $subscriber_uk_id request successful :: " . json_encode($response) . "\n";
                } else {
                    echo "/subscribe for $subscriber_uk_id request failed :: " . json_encode($response) . "\n";
                }
                curl_close($curl);
            } elseif ($subscriber["type"] == "BPP") {
                $bppSubscribeBody["message"]["request_id"] = $request_id;
                $bppSubscribeBody["message"]["timestamp"] = $current_datetime_iso8601;
                $bppSubscribeBody["message"]["entity"]["subscriber_id"] = $subscriber_id;
                $bppSubscribeBody["message"]["entity"]["unique_key_id"] = $unique_key_id;
                $bppSubscribeBody["message"]["entity"]["key_pair"]["signing_public_key"] = $subscriber["signingPublicKey"];
                $bppSubscribeBody["message"]["entity"]["key_pair"]["encryption_public_key"] = $subscriber["encPublicKey"];
                $bppSubscribeBody["message"]["entity"]["key_pair"]["valid_from"] = $current_datetime_iso8601;
                $bppSubscribeBody["message"]["network_participant"][0]["city_code"] = [$subscriber["city"]];

                echo json_encode($bppSubscribeBody) . "\n";

                $curl = curl_init($registery_url);
                curl_setopt_array($curl, [
                    CURLOPT_POST => true,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_POSTFIELDS => json_encode($bppSubscribeBody),
                ]);
                $response = curl_exec($curl);
                if ($response != false) {
                    echo "/subscribe for $subscriber_uk_id request successful :: " . json_encode($response) . "\n";
                } else {
                    echo "/subscribe for $subscriber_uk_id request failed :: " . json_encode($response) . "\n";
                }
            }
        }
        sleep(300);
    }
}

function subscribe()
{
    $subscribers = json_decode(
        file_get_contents("php://input"),
        null, 512, JSON_OBJECT_AS_ARRAY
    );

    if (pcntl_fork() == -1) {
        die('could not fork the process');
    } else {
        if (!function_exists('subscribe_helper')) {
            die('function subscribe helper does not exist');
        }
        subscribe_helper($subscribers);
    }

    print_r("/subscribe called :: Request ->");
    print_r($subscribers);

    return json_encode(["success" => "ACK"]);
}
function on_subscribe()
{
    global $subscribers_uniquekey_store, $subscribers;
    $data = json_decode(
        file_get_contents("php://input"),
        null, 512, JSON_OBJECT_AS_ARRAY
    );
    print("/on_subscribe called :: Request -> ");
    print_r($data, true);

    $subscriber_id = $data["subscriber_id"];
    $unique_key_id = $subscribers_uniquekey_store[$subscriber_id];
    $subscriber = $subscribers[$subscriber_id . " | " . $unique_key_id];
    print($subscriber);

    return json_encode([
        "answer" => decrypt(
            $subscriber["ondcPublicKey"], $subscriber["encPrivateKey"], $data["challenge"]
        ),
    ]);
}

function verify_html(): string
{
    return "501: verify_html not implemented";
}

if (preg_match('/\.(?:png|jpeg|jpg|gif)$/',
    $_SERVER['REQUEST_URI'])) {
    return false;
} else {
    $path = pathinfo($_SERVER['SCRIPT_NAME'])['basename'];
    switch ($path) {
        case 'subscribe':
            header('Content-Type: application/json; charset=utf-8');
            echo subscribe();
            break;
        case 'on_subscribe':
            header('Content-Type: application/json; charset=utf-8');
            echo on_subscribe();
            break;
        case 'ondc-site-verification.html':
            echo file_get_contents("./templates/ondc-site-verification.html");
            break;
        default:
            echo '<p>You just hit a non-existant path: 404';
            break;
    }
}
