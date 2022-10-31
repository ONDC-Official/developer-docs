package org.ondc.crypto.util;

import static org.junit.jupiter.api.Assertions.*;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;



// TODO: Auto-generated Javadoc
/**
 * The Class CryptoTest is used to test ondc.crypto.util.CryptoFunctions
 */
public class CryptoTest {
	
	/** The test case 1. */
	private final String testCase1="Positive flow of signing and verification";

	/**
	 * Test generation of signing key pair 
	 */
	@Test
	@DisplayName(testCase1)
	public void testGenerateSigningKeyPair_Normal() {
		System.out.println("==========================================================================");
		System.out.println(testCase1);
		System.out.println("==========================================================================");
		
		//System.out.println(testCase1+": Start");
		System.out.println("\n");
		
		CryptoKeyPair signingKeyPair=CryptoFunctions.generateSigningKeyPair();
		
		System.out.println("Key Generation :: [OK]");
		
		String message="message to be signed";
		
		byte[] signature= CryptoFunctions.sign(signingKeyPair.getPrivateKey(), message.getBytes());
		
		System.out.println("Signing :: [OK]");
		
		System.out.println("\n\n/** Sender Side **/");
		System.out.println("{");
		System.out.println("\t\"message \":\""+message +"\",");
		System.out.println("\t\"signature \":\""+Base64.getEncoder().encodeToString(signature)+"\",");
		System.out.println("\t\"privateKey \":\""+Base64.getEncoder().encodeToString(signingKeyPair.getPrivateKey()) +"\",");
		System.out.println("}\n\n");
		
		
		boolean verificationResult=CryptoFunctions.verify(signature, message.getBytes(), signingKeyPair.getPublickKey());
		
		System.out.println("\n\n/** Receiver Side **/");
		System.out.println("{");
		System.out.println("\t\"message \":\""+message +"\",");
		System.out.println("\t\"signature \":\""+Base64.getEncoder().encodeToString(signature)+"\",");
		System.out.println("\t\"publicKey \":\""+Base64.getEncoder().encodeToString(signingKeyPair.getPublickKey()) +"\",");
		System.out.println("\t\"verified \":\""+verificationResult +"\",");
		System.out.println("}\n\n");
		if(verificationResult) 
			System.out.println("Verification :: [OK]");
		else
			System.out.println("Verification :: [[NOT OK]]");
		
		assertEquals(true, verificationResult);
		
		
	}
	
	/**
	 * Test to verify tampered message and signature 
	 */
	@Test
	@DisplayName("Negative Flow to check whether tampered message is verified unsuccessfully")
	public void testGenerateSigningKeyPair_Tampered() {
		System.out.println("==========================================================================");
		System.out.println("Negative Flow to check whether tampered message is verified unsuccessfully");
		System.out.println("==========================================================================");
		System.out.println("\n");
		
		CryptoKeyPair signingKeyPair=CryptoFunctions.generateSigningKeyPair();
		System.out.println("Key Generation :: [OK]");
		
		
		String message="message to be signed";
		
		byte[] signature= CryptoFunctions.sign(signingKeyPair.getPrivateKey(), message.getBytes());
		System.out.println("Signing :: [OK]");
		
		System.out.println("\n\n/** Sender Side **/");
		System.out.println("{");
		System.out.println("\t\"message \":\""+message +"\",");
		System.out.println("\t\"signature \":\""+Base64.getEncoder().encodeToString(signature)+"\",");
		System.out.println("\t\"privateKey \":\""+Base64.getEncoder().encodeToString(signingKeyPair.getPrivateKey()) +"\",");
		System.out.println("}\n\n");
		
		message="tampered message to be verified";
		
		boolean verificationResult=CryptoFunctions.verify(signature, message.getBytes(), signingKeyPair.getPublickKey());
		
		System.out.println("\n\n/** Receiver Side **/");
		System.out.println("{");
		System.out.println("\t\"message \":\""+message +"\",");
		System.out.println("\t\"signature \":\""+Base64.getEncoder().encodeToString(signature)+"\",");
		System.out.println("\t\"publicKey \":\""+Base64.getEncoder().encodeToString(signingKeyPair.getPublickKey()) +"\",");
		System.out.println("\t\"verified \":\""+verificationResult +"\",");
		System.out.println("}\n\n");
		
		if(!verificationResult) 
			System.out.println("Verification Failed as expected :: [OK]");
		else
			System.out.println("Verification Failed as expected :: [[NOT OK]]");
		
		
		assertEquals(false, verificationResult);
	}
	
	/**
	 * Test generate encryption decryption key pair, encrypt and then decrypt.
	 *
	 * @throws InvalidKeyException the invalid key exception
	 * @throws NoSuchAlgorithmException the no such algorithm exception
	 * @throws NoSuchProviderException the no such provider exception
	 * @throws InvalidKeySpecException the invalid key spec exception
	 * @throws NoSuchPaddingException the no such padding exception
	 * @throws IllegalBlockSizeException the illegal block size exception
	 * @throws BadPaddingException the bad padding exception
	 */
	@Test
	@DisplayName("To check normal flow of Encryption and Decryption")
	public void testGenerateEncryptionDecryptionKeyPair_Normal() throws InvalidKeyException, NoSuchAlgorithmException, NoSuchProviderException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
		System.out.println("=================================================");
		System.out.println("To check normal flow of Encryption and Decryption");
		System.out.println("=================================================");
		CryptoKeyPair senderEncDecKeyPair=null;
		CryptoKeyPair receiverEncDecKeyPair=null;
		
		try {
			senderEncDecKeyPair= CryptoFunctions.generateEncDecKey();
			receiverEncDecKeyPair= CryptoFunctions.generateEncDecKey();
			System.out.println("Key Generation :: [OK]");
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		String message="message to be encrypted";
		
		byte[] encrypted= CryptoFunctions.encryptDecrypt(Cipher.ENCRYPT_MODE,message.getBytes(),senderEncDecKeyPair.getPrivateKey(),receiverEncDecKeyPair.getPublickKey());
		
		System.out.println("Encryption :: [OK]");
		
		System.out.println("\n\n/** Sender Side **/");
		System.out.println("{");
		System.out.println("\t\"plainChallengeString \":\""+message +"\",");
		System.out.println("\t\"EncryptedChallengeString \":\""+Base64.getEncoder().encodeToString(encrypted)+"\",");
		System.out.println("\t\"senderPrivateKey \":\""+Base64.getEncoder().encodeToString(senderEncDecKeyPair.getPrivateKey()) +"\",");
		System.out.println("\t\"receiverPublicKey \":\""+Base64.getEncoder().encodeToString(receiverEncDecKeyPair.getPublickKey()) +"\"");
		System.out.println("}\n\n");
		
		byte[] decrypted= CryptoFunctions.encryptDecrypt(Cipher.DECRYPT_MODE,encrypted,receiverEncDecKeyPair.getPrivateKey(),senderEncDecKeyPair.getPublickKey());
		System.out.println("Decryption :: [OK]");
		
		String decryptedMessage=new String(decrypted);
		
		
		System.out.println("\n\n/** Receiver Side **/");
		System.out.println("{");
		System.out.println("\t\"decryptedChallengeString \":\""+decryptedMessage+"\",");
		System.out.println("\t\"receiverPrivateKey \":\""+Base64.getEncoder().encodeToString(receiverEncDecKeyPair.getPrivateKey()) +"\",");
		System.out.println("\t\"senderPublicKey \":\""+Base64.getEncoder().encodeToString(senderEncDecKeyPair.getPublickKey()) +"\",");
		System.out.println("\t\"match\":\""+message.equals(decryptedMessage)+"\"");
			
		System.out.println("}");
		
		if(message.equals(decryptedMessage)) 
			System.out.println("Verification :: [OK]");
		else
			System.out.println("Verification :: [[NOT OK]]");
	
		assertEquals(message, decryptedMessage);
	}

@Test
@DisplayName("To check whether hashing is working")
public void testGenerateBlakeHash() throws Exception {
	System.out.println("===================================");
	System.out.println("To check whether hashing is working");
	System.out.println("===================================");
	
	String message = "message to hash";
	byte[] hash_1=CryptoFunctions.generateBlakeHash(message);
	System.out.println("Message Hashed :: [OK]");
	
	String bs64_1 = Base64.getEncoder().encodeToString(hash_1);
	System.out.println("{");
	System.out.println("\t\"message to be hashed\":\""+message+"\",");
	System.out.println("\t\"first_digest\":\""+bs64_1+"\",");
	
	byte[] hash_2=CryptoFunctions.generateBlakeHash(message);
	System.out.println("Message Hashed :: [OK]");
	
	String bs64_2 = Base64.getEncoder().encodeToString(hash_2);
	System.out.println("\t\"second_digest\":\""+bs64_2+"\",");
	System.out.println("\t\"match\":\""+bs64_2.equals(bs64_1)+"\"");
	System.out.println("}");
	if(bs64_2.equals(bs64_1)) 
		System.out.println("Hash Matching :: [OK]");
	else
		System.out.println("Hash Matching :: [[NOT OK]]");

	assertEquals(bs64_1 , bs64_2);
	
	
	
}

}
