package com.ondc.onboarding;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static com.ondc.onboarding.Utils.*;

@Configuration
public class AppConfig {
    @Bean
    public Map<String,byte[]> keys() throws NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeyException, NoSuchProviderException, JSONException {
        CryptoKeyPair signingKeyPair = generateSigningKeyPair();
        CryptoKeyPair encKeyPair = generateEncDecKey();

        Map<String,byte[]> keys = new HashMap<>();
        keys.put("sign_public_key",signingKeyPair.getPublickKey());
                keys.put("sign_private_key",signingKeyPair.getPrivateKey());
                keys.put("enc_public_key", encKeyPair.getPublickKey());
                keys.put("enc_private_key", encKeyPair.getPrivateKey());
        return keys;
    }

    @Bean
    public String requestId(){
        return "";
    }

    @Bean
    public String ondcPublicKey(){
        return "MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM=";
    }

    @Bean
    public String gatewayUrl(){
        return "https://staging.registry.ondc.org/subscribe";
    }
}