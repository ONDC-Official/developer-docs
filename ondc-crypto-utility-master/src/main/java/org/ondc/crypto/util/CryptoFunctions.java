/*
 * 
 */
	package org.ondc.crypto.util;
	
	import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
	import java.security.KeyFactory;
	import java.security.KeyPair;
	import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
	import java.security.NoSuchProviderException;
	import java.security.PrivateKey;
	import java.security.PublicKey;
	import java.security.SecureRandom;
	import java.security.Security;
	import java.security.spec.InvalidKeySpecException;
	import java.security.spec.PKCS8EncodedKeySpec;
	import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import javax.crypto.BadPaddingException;
	import javax.crypto.Cipher;
	import javax.crypto.IllegalBlockSizeException;
	import javax.crypto.KeyAgreement;
	import javax.crypto.NoSuchPaddingException;
	import javax.crypto.SecretKey;
	import javax.crypto.spec.SecretKeySpec;
	import org.bouncycastle.jce.provider.BouncyCastleProvider;
	import org.bouncycastle.math.ec.rfc8032.Ed25519;



// TODO: Auto-generated Javadoc
/**
 * The Class CryptoFunctions provides generation of key pairs for signing and encryption along with signing, verification, encryption and decryption.
 */
public class CryptoFunctions {


	/** The Constant X25519. */
	private static final String X25519="X25519";
	
	/** The Constant AES. */
	private static final String AES="AES";
	
	/** The Constant BLAKE2B_512. */
	private static final String BLAKE2B_512="BLAKE2B-512";

		/**
		 * <p>This method generates ED25519 32 byte/256 bits key pair (Private and Public) for Signing
		 * </p>.
 		 * <pre style="background-color:black;color:white;font-family: Lucida Console, Courier New, monospace">
		 * 
		 * System.out.println("Testing whether Signing Keys are generated::");
		 * CryptoKeyPair signingKeyPair=CryptoFunctions.generateSigningKeyPair();
		 * 
		 * String message="message to be signed";
		 * 
		 * byte[] signature= CryptoFunctions.sign(signingKeyPair.getPrivateKey(), message.getBytes());
		 * 
		 * boolean verificationResult=CryptoFunctions.verify(signature, message.getBytes(), signingKeyPair.getPublickKey());
		 * </pre>

		 * @author SujeetS
		 * @return the crypto key pair
		 * @see CryptoFunctions#sign(byte[], byte[])
		 * @see CryptoFunctions#verify(byte[], byte[], byte[])
		 * @since 0.1
		 */
		
		
		public static CryptoKeyPair generateSigningKeyPair() {

			// generate ed25519 keys
			SecureRandom RANDOM = new SecureRandom();
			
		 	byte[] privateKey = new byte[Ed25519.SECRET_KEY_SIZE]; //32 Byte or 256 bits
	        byte[] publicKey = new byte[Ed25519.PUBLIC_KEY_SIZE];  //32 Byte or 256 bits
	        
	        // generate private key using secure random
	        RANDOM.nextBytes(privateKey);
	        
	        // generate public key 
	        Ed25519.generatePublicKey(privateKey, 0, publicKey, 0);
	        
	        // store generated key pair and return the same
	        CryptoKeyPair signingKeyPair=new CryptoKeyPair(publicKey,privateKey) ;
	    	return signingKeyPair;
		}
		
	
		/**
		 * <p>This method generates signature using given ED25519 32 byte/ 256 bits Private key 
		 * </p>.
		 * <pre style="background-color:black;color:white;font-family: Lucida Console, Courier New, monospace">
		 * 
		 * System.out.println("Testing whether Signing Keys are generated::");
		 * CryptoKeyPair signingKeyPair=CryptoFunctions.generateSigningKeyPair();
		 * 	
		 * 
		 * String message="message to be signed";
		 * byte[] signature= CryptoFunctions.sign(signingKeyPair.getPrivateKey(), message.getBytes());
		 * boolean verificationResult=CryptoFunctions.verify(signature, message.getBytes(), signingKeyPair.getPublickKey());
		 * </pre>

		 * @author SujeetS
		 * @param privateKey the private key that should be used to sign the message
		 * @param message the message that should be signed using given private key
		 * @return the byte[] signature of given message generated using given private key
		 * @see CryptoFunctions#generateSigningKeyPair()
		 * @see CryptoFunctions#verify(byte[], byte[], byte[])
		 * @since 0.1
		 */
		public static byte[] sign(byte[] privateKey,byte[] message) {
			// initialise signature variable
			byte[] signature = new byte[Ed25519.SIGNATURE_SIZE];
			
			// sign the received message with given private key
			Ed25519.sign(privateKey, 0, message, 0, message.length, signature, 0);
            return signature; 
		}
		
		/**
		 * Verify given signature using ED25519 Public Key
		 *<pre style="background-color:black;color:white;font-family: Lucida Console, Courier New, monospace">
		 * 
		 * System.out.println("Testing whether Signing Keys are generated::");
		 * CryptoKeyPair signingKeyPair=CryptoFunctions.generateSigningKeyPair();
		 * 	
		 * 
		 * String message="message to be signed";
		 * byte[] signature= CryptoFunctions.sign(signingKeyPair.getPrivateKey(), message.getBytes());
		 * boolean verificationResult=CryptoFunctions.verify(signature, message.getBytes(), signingKeyPair.getPublickKey());
		 * </pre>
		 * @author SujeetS
		 * @param signature the signature that needs to be verified
		 * @param message the message that needs to verified along with signature
		 * @param publicKey the public key to be used for verifying the signature
		 * @return true, if successful
		 * @see CryptoFunctions#generateSigningKeyPair()
		 * @see CryptoFunctions#sign(byte[], byte[])		 * 
		 */
		public static boolean verify(byte[] signature,byte[] message, byte[] publicKey) {
			//verify the given signature with 
			return Ed25519.verify(signature, 0, publicKey, 0, message, 0, message.length);
		}
		
		
		/**
		 * Generate encryption decryption key pair using x25519 key exchange algorithm.
		 * 
		 * @author SujeetS
		 * @return the crypto key pair
		 * @throws InvalidKeyException the invalid key exception
		 * @throws NoSuchPaddingException the no such padding exception
		 * @throws IllegalBlockSizeException the illegal block size exception
		 * @throws BadPaddingException the bad padding exception
		 * @throws NoSuchAlgorithmException the no such algorithm exception
		 * @throws NoSuchProviderException the no such provider exception
		 * @see CryptoFunctions#encryptDecrypt(int, byte[], byte[], byte[])
		 */
		
		public static CryptoKeyPair generateEncDecKey() throws InvalidKeyException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchProviderException {
			if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
				Security.addProvider(new BouncyCastleProvider());
			}
				KeyPairGenerator kpg= KeyPairGenerator.getInstance(X25519, BouncyCastleProvider.PROVIDER_NAME);
				kpg.initialize(256); // 32 Byte or 256 Bits
				KeyPair kp = kpg.generateKeyPair();
		    	CryptoKeyPair encryptionDecryptionKeyPair=new CryptoKeyPair(kp.getPublic().getEncoded(),kp.getPrivate().getEncoded());
		        return encryptionDecryptionKeyPair;
		}
		
		

		/**
		 * This method can be used to do AES encryption and decryption using X25519 Key exchange algorithm
		 * 
		 * 
		 *<pre style="background-color:black;color:white;font-family: Lucida Console, Courier New, monospace">
		 * 		CryptoKeyPair senderEncDecKeyPair=null;
		 * 		CryptoKeyPair receiverEncDecKeyPair=null;
		 * 		
		 * 		try {
		 * 			senderEncDecKeyPair= CryptoFunctions.generateEncDecKey();
		 * 			receiverEncDecKeyPair= CryptoFunctions.generateEncDecKey();
		 * 		} catch (Exception e) {
		 * 			// TODO Auto-generated catch block
		 * 			e.printStackTrace();
		 * 		} 
		 * 		String message="message to be encrypted";
		 * 		
		 * 		byte[] encrypted= CryptoFunctions.encryptDecrypt(Cipher.ENCRYPT_MODE,message.getBytes(),senderEncDecKeyPair.getPrivateKey(),receiverEncDecKeyPair.getPublickKey());
		 * 		
		 * 		System.out.println("\n\n/* Sender Side /");
		 * 		System.out.println("{");
		 * 		System.out.println("\t\"plainChallengeString \":\""+message +"\",");
		 * 		System.out.println("\t\"EncryptedChallengeString \":\""+Base64.getEncoder().encodeToString(encrypted)+"\",");
		 * 		System.out.println("\t\"senderPrivateKey \":\""+Base64.getEncoder().encodeToString(senderEncDecKeyPair.getPrivateKey()) +"\",");
		 * 		System.out.println("\t\"receiverPublicKey \":\""+Base64.getEncoder().encodeToString(receiverEncDecKeyPair.getPublickKey()) +"\"");
		 * 		System.out.println("}\n\n");
		 * 		byte[] decrypted= CryptoFunctions.encryptDecrypt(Cipher.DECRYPT_MODE,encrypted,receiverEncDecKeyPair.getPrivateKey(),senderEncDecKeyPair.getPublickKey());
		 * 		String decryptedMessage=new String(decrypted);
		 * 		System.out.println("\n\n/** Receiver Side ");
		 * 		System.out.println("{");
		 * 		System.out.println("\t\"DecryptedChallengeString \":\""+decryptedMessage+"\",");
		 * 		System.out.println("\t\"receiverPrivateKey \":\""+Base64.getEncoder().encodeToString(receiverEncDecKeyPair.getPrivateKey()) +"\",");
		 * 		System.out.println("\t\"senderPublicKey \":\""+Base64.getEncoder().encodeToString(senderEncDecKeyPair.getPublickKey()) +"\"");
		 * 		System.out.println("}");
		 * </pre>
		 * @author SujeetS
		 * @param mode the mode to set either encrypt (<a href="https://docs.oracle.com/en/java/javase/11/docs/api/constant-values.html#javax.crypto.Cipher.ENCRYPT_MODE">Cipher.ENCRYPT_MODE</a>)  or decrypt (<a href="https://docs.oracle.com/en/java/javase/11/docs/api/constant-values.html#javax.crypto.Cipher.DECRYPT_MODE">Cipher.DECRYPT_MODE </a>) 
		 * @param challenge_string the challenge string that needs to be encrypted or decrypted depending on mode that is set. In case if mode is set to  Cipher.ENCRYPT_MODE then this text shall be encrypted; whereas if mode is set to Cipher.DECRYPT_MODE, this text shall be decrypted
		 * @param privateKey the private key. 
		 * 			<p>In case of mode=Cipher.ENCRYPT_MODE, it should be private key of the sender
		 * 			<br>In case of mode=Cipher.DECRYPT_MODE, it should be private key of the receiver</p>
		 * @param publicKey the public key
		 * 			<p>In case of mode=Cipher.ENCRYPT_MODE, it should be public key of the receiver
		 * 			<br>In case of mode=Cipher.DECRYPT_MODE, it should be public key of the sender</p>
		 * @return the byte[]
		 * @throws NoSuchAlgorithmException the no such algorithm exception
		 * @throws NoSuchProviderException the no such provider exception
		 * @throws InvalidKeySpecException the invalid key spec exception
		 * @throws InvalidKeyException the invalid key exception
		 * @throws NoSuchPaddingException the no such padding exception
		 * @throws IllegalBlockSizeException the illegal block size exception
		 * @throws BadPaddingException the bad padding exception
		 * @see Cipher#ENCRYPT_MODE
		 * @see Cipher#DECRYPT_MODE
		 * @see CryptoFunctions#generateEncDecKey()
		 * 
		 */
		public static byte[] encryptDecrypt(int mode, byte[] challenge_string,byte[] privateKey, byte[] publicKey) throws NoSuchAlgorithmException, NoSuchProviderException, InvalidKeySpecException, InvalidKeyException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
			if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
				Security.addProvider(new BouncyCastleProvider());
			}
			KeyAgreement keyAgreement=KeyAgreement.getInstance(X25519, BouncyCastleProvider.PROVIDER_NAME);
			X509EncodedKeySpec x509EncodedKeySpec = new X509EncodedKeySpec(publicKey);
			PublicKey publickey = KeyFactory.getInstance(X25519, BouncyCastleProvider.PROVIDER_NAME)
					.generatePublic(x509EncodedKeySpec);
			PrivateKey privatekey = KeyFactory.getInstance(X25519, BouncyCastleProvider.PROVIDER_NAME)
					.generatePrivate(new PKCS8EncodedKeySpec(privateKey));
			keyAgreement.init(privatekey);
	        keyAgreement.doPhase(publickey, true);
	        byte[] secret = keyAgreement.generateSecret();
 	        SecretKey originalKey = new SecretKeySpec(secret , 0, secret.length, AES);
	        Cipher cipher = Cipher.getInstance(AES, BouncyCastleProvider.PROVIDER_NAME);
			cipher.init(mode, originalKey);
			byte[] encryptedDecrypted = cipher.doFinal(challenge_string);
			return encryptedDecrypted;
			
		}

		

		/**
		 * Generate blake hash.
		 * 
		 * <pre style="background-color:black;color:white;font-family: Lucida Console, Courier New, monospace">
		 * String message = "message to hash";
		 * byte[] hash_1=CryptoFunctions.generateBlakeHash(message);
		 * String bs64_1 = Base64.getEncoder().encodeToString(hash_1);
		 * System.out.println(bs64_1);
		 * </pre>
		 * @param req the message for which digest(blake2b hash) needs to be generated
		 * @return the byte[] hash value
		 * @throws Exception the exception
		 */
		public static byte[] generateBlakeHash(String req) throws Exception {
			if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
				Security.addProvider(new BouncyCastleProvider());
			}
			MessageDigest digest = MessageDigest.getInstance(BLAKE2B_512, BouncyCastleProvider.PROVIDER_NAME);
			digest.reset();
			digest.update(req.getBytes(StandardCharsets.UTF_8));
			return digest.digest();
		}
		
	}


