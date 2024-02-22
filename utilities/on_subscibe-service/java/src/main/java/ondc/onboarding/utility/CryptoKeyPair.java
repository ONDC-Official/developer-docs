/*
 * 
 */
package ondc.onboarding.utility;



public class CryptoKeyPair {

	public CryptoKeyPair(byte[] publicKey, byte[] privateKey){
		this.setPrivateKey(privateKey);
		this.setPublicKey(publicKey);
	}
	
	private byte[] privateKey;
	
	public byte[] getPrivateKey() {
		return privateKey;
	}
	

	public void setPrivateKey(byte[] privateKey) {
		this.privateKey = privateKey;
	}
	

	public byte[] getPublickKey() {
		return publicKey;
	}
	

	public void setPublicKey(byte[] publicKey) {
		this.publicKey = publicKey;
	}
	
	private byte[] publicKey;
	
}
