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
        String hashedReq = hashMassage(req.get("value").toString(),created,expires);
        String signature = sign(Base64.getDecoder().decode(req.get("private_key").asText()),hashedReq.getBytes());
        String subscriberId = "altiux.com";
        String uniqueKeyId = "c9aa1b41-04e9-43e2-bd89-9ddcdecbf4cf";

        return "Signature keyId=\"" + subscriberId + "|" + uniqueKeyId + "|" + "ed25519\"" + ",algorithm=\"ed25519\"," + "created=\"" + created + "\",expires=\"" + expires + "\",headers=\"(created) (expires)" + " digest\",signature=\"" + signature + "\"";
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
}