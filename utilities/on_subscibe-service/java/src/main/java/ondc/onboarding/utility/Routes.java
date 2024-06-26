package ondc.onboarding.utility;


import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.TimeZone;

import com.fasterxml.jackson.databind.JsonNode;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;


@RestController
public class Routes extends  Utils{
    private String signMessage;

    @Autowired
    private Map<String,byte[]> keys;

    @Autowired
    private String ondcPublicKey;

    @Autowired
    private String vlookupUrl;

    @Autowired
    private String requestId;

    @Autowired
    private String gatewayUrl;
    private final Logger logger =  LoggerFactory.getLogger(Routes.class);;

    @GetMapping("/get-keys")
    public ResponseEntity<Map<String,byte[]>> getKeys (){
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(keys);
    }

    @PostMapping("/create-header")
    public
    String createHeader(@RequestBody JsonNode req) throws Exception {
        long created = System.currentTimeMillis() / 1000L;
        long expires = created + 300000;
        logger.info(toBase64(generateBlakeHash(req.get("value").toString())));
        logger.info(req.get("value").toString());
        String hashedReq = hashMassage(req.get("value").toString(),created,expires);
        String signature = sign(Base64.getDecoder().decode(req.get("private_key").asText()),hashedReq.getBytes());
        String subscriberId = req.get("subscriber_id").asText();
        String uniqueKeyId = req.get("unique_key_id").asText();

        return "Signature keyId=\"" + subscriberId + "|" + uniqueKeyId + "|" + "ed25519\"" + ",algorithm=\"ed25519\"," + "created=\"" + created + "\",expires=\"" + expires + "\",headers=\"(created) (expires)" + " digest\",signature=\"" + signature + "\"";
    }

    @PostMapping("/verify-header")
    public boolean isValidHeader(@RequestBody JsonNode req) throws Exception {
        long currentTimestamp = System.currentTimeMillis() / 1000L;
        String authHeader = req.get("header").asText();
        String signature = authHeader.split(",")[5].split("=")[1].replaceAll("\"","");
        long expires = Long.parseLong(authHeader.split(",")[3].split("=")[1].replaceAll("\"",""));
        long created = Long.parseLong(authHeader.split(",")[2].split("=")[1].replaceAll("\"",""));
        if ((created > currentTimestamp) || currentTimestamp > expires){
            logger.info("Timestamp should be Created < CurrentTimestamp < Expires");
            return false;
        }
        String hashedReq = hashMassage(req.get("value").toString(),created,expires);
        logger.info(hashedReq);
        return verify(
                fromBase64(signature),
                hashedReq.getBytes(),
                fromBase64(req.get("public_key").asText())
        );
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody JsonNode subscribeBody) throws NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeyException, NoSuchProviderException, JSONException, IOException, InterruptedException {

        this.requestId = subscribeBody.get("message").get("request_id").asText();
        this.signMessage = sign(
                this.keys.get("sign_private_key"),
                this.requestId.getBytes());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(gatewayUrl))
                .POST(HttpRequest.BodyPublishers.ofString(subscribeBody.toString()))
                .build();
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> httpResponse = client.send(request, HttpResponse.BodyHandlers.ofString());
        JSONObject responseJson = new JSONObject(httpResponse.body());

        if (responseJson.has("error")){
            this.logger.info(responseJson.getJSONObject("error").toString());
            return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(httpResponse.body());
        }

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(httpResponse.body());
    }

    @GetMapping("/ondc-site-verification.html")
    public ResponseEntity<String> htmlVerify() throws JSONException {

        if (this.requestId.isEmpty()){
            return ResponseEntity.internalServerError().body("Please Set Request ID");
        }

        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(
        """ 
        <!--Contents of ondc-site-verification.html. -->
        <!--Please replace SIGNED_UNIQUE_REQ_ID with an actual value-->
        <html>
          <head>
            <meta
              name="ondc-site-verification"
              content="%s"
            />
          </head>
          <body>
            ONDC Site Verification Page
          </body>
        </html>
        """.formatted(this.signMessage));
    }

    @PostMapping("/on_subscribe")
    public ResponseEntity<String> onSubscribe(@RequestBody JsonNode request) throws JSONException, NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, InvalidKeySpecException, BadPaddingException, NoSuchProviderException, InvalidKeyException, IOException {
        logger.info(request.toString());
        byte[] decryptedData = encryptDecrypt(
                Cipher.DECRYPT_MODE,
                Base64.getDecoder().decode(request.get("challenge").asText()),
                keys.get("enc_private_key"),
                Base64.getDecoder().decode(this.ondcPublicKey)
        );
        JSONObject response = new JSONObject();
        response.put("answer", new String(decryptedData));
        logger.info(response.toString());
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(response.toString());
    }

    @PostMapping("/sign")
    public ResponseEntity<String> sign(@RequestBody JsonNode request) {

        JsonNode searchParamsNode = request.get("search_parameters");
        if (searchParamsNode == null) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\": \"search_parameters not found in request\"}");
        }

        String country = searchParamsNode.get("country").asText();
        String domain = searchParamsNode.get("domain").asText();
        String type = searchParamsNode.get("type").asText();
        String city = searchParamsNode.get("city").asText();
        String subscriberId = searchParamsNode.get("subscriber_id").asText();

        String formattedString = String.format("%s|%s|%s|%s|%s", country, domain, type, city, subscriberId);

        String privateKeyBase64 = request.get("privatekey").asText();
        byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyBase64);

        String signature = sign(privateKeyBytes, formattedString.getBytes());

        String jsonResponse = String.format("{\"signature\": \"%s\"}", signature);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonResponse);
    }

    @PostMapping("/vlookup")
    public ResponseEntity<String> vLookup(@RequestBody JsonNode request) throws IOException, InterruptedException {
        String requestString = request.toString();
        System.out.println("Received request: " + requestString);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(vlookupUrl))
                .POST(HttpRequest.BodyPublishers.ofString(requestString))
                .build();

        HttpClient httpClient = HttpClient.newHttpClient();
        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(httpResponse.body());
    }
}