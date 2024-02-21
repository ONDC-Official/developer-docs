package org.ondc.crypto.util;

import org.bouncycastle.math.ec.rfc8032.Ed25519;

import java.security.SecureRandom;
import java.util.Base64;

public class Test {


    public static void main(String[] args) {
        CryptoKeyPair signingKeyPair=CryptoFunctions.generateSigningKeyPair();
        byte[] privateKey = signingKeyPair.getPrivateKey();
        System.out.printf("Private Key: %s \n",Base64.getEncoder().encodeToString(privateKey));
        System.out.printf("Public Key: %s \n",Base64.getEncoder().encodeToString(signingKeyPair.getPublickKey()));

        byte[] signMessage = Test.sign(privateKey,"IND|ONDC:RET10|sellerApp|std:080|ref-app-seller-staging-v2.ondc.org".getBytes());
        System.out.println(Base64.getEncoder().encodeToString(signMessage));
    }

//    public static void vLookUp(HashMap<String,String> payload){
//        String message = String.format("%s|%s|%s|%s",)
//        payload.get("domain")
//    }
    public static CryptoKeyPair generateSigningKeyPair() {
        SecureRandom RANDOM = new SecureRandom();
        byte[] privateKey = new byte[Ed25519.SECRET_KEY_SIZE];
        byte[] publicKey = new byte[Ed25519.PUBLIC_KEY_SIZE];
        RANDOM.nextBytes(privateKey);
        Ed25519.generatePublicKey(privateKey, 0, publicKey, 0);
        return new CryptoKeyPair(publicKey,privateKey) ;
    }

    public static byte[] sign(byte[] privateKey,byte[] message) {
        // initialise signature variable
        byte[] signature = new byte[Ed25519.SIGNATURE_SIZE];

        // sign the received message with given private key
        Ed25519.sign(privateKey, 0, message, 0, message.length, signature, 0);
        return signature;
    }
}
