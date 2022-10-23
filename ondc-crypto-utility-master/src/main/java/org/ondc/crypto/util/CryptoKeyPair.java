/*
 * 
 */
package org.ondc.crypto.util;


// TODO: Auto-generated Javadoc
/**
 * The Class CryptoKeyPair is used to store keypair
 */
public class CryptoKeyPair {

	/**
	 * Instantiates a new crypto key pair.
	 *
	 * @param publicKey the public key
	 * @param privateKey the private key
	 */
	public   CryptoKeyPair(byte[] publicKey,byte[] privateKey){
		this.setPrivateKey(privateKey);
		this.setPublicKey(publicKey);
	}
	
	/** The private key. */
	private byte[] privateKey;
	
	/**
	 * Gets the private key.
	 *
	 * @return the private key
	 */
	public byte[] getPrivateKey() {
		return privateKey;
	}
	
	/**
	 * Sets the private key.
	 *
	 * @param privateKey the new private key
	 */
	public void setPrivateKey(byte[] privateKey) {
		this.privateKey = privateKey;
	}
	
	/**
	 * Gets the public key.
	 *
	 * @return the public key
	 */
	public byte[] getPublickKey() {
		return publicKey;
	}
	
	/**
	 * Sets the public key.
	 *
	 * @param publicKey the new public key
	 */
	public void setPublicKey(byte[] publicKey) {
		this.publicKey = publicKey;
	}
	
	/** The public key. */
	private byte[] publicKey;
	
}
