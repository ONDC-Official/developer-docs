package main

import (
	"bytes"
	"crypto/aes"
	"crypto/ecdh"
	"crypto/ed25519"
	"crypto/x509"
	b64 "encoding/base64"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"regexp"
	"time"

	"golang.org/x/crypto/blake2b"
)

func base64Decode(payload string) ([]byte, error) {
	return b64.StdEncoding.DecodeString(payload)
}

func base64Encode(payload []byte) string {
	return b64.StdEncoding.EncodeToString(payload)
}

func parsePrivateKey(key string) ([]byte, error) {
	var keybytes []byte
	decoded, err := base64Decode(key)
	if err != nil {
		log.Println("Error in base64 decoding private key", err)
		return keybytes, err
	}

	derKey, err := x509.ParsePKCS8PrivateKey(decoded)
	if err != nil {
		log.Println("Error getting x25519 key from base64 decoded key", err)
		return keybytes, err
	}
	if privateKey, found := derKey.(*ecdh.PrivateKey); found {
		return privateKey.Bytes(), nil
	} else {
		log.Println("Error type casting ecdh private key", err)
		return keybytes, errors.New("unexpected error in private key type cast")
	}
}

func AESEncrypt(payload []byte, key []byte) ([]byte, error) {
	cipher, err := aes.NewCipher(key)
	blockSize := cipher.BlockSize()
	if err != nil {
		log.Println("Error creating AES cipher", err)
		return nil, err
	}
	size := len(payload)
	if size%blockSize != 0 {
		remainder := blockSize - (size % blockSize)
		pad := bytes.Repeat([]byte(" "), remainder)
		payload = append(payload, pad...)
		size = len(payload)
	}

	buf := make([]byte, blockSize)
	var encrypted []byte
	for i := 0; i < size; i += blockSize {
		cipher.Encrypt(buf, payload[i:i+blockSize])
		encrypted = append(encrypted, buf...)
	}
	return encrypted, nil
}

func AESDecrypt(cipherText []byte, key []byte) ([]byte, error) {
	cipher, err := aes.NewCipher(key)
	blockSize := cipher.BlockSize()
	if err != nil {
		log.Println("Error creating AES cipher", err)
		return nil, err
	}
	size := len(cipherText)
	buf := make([]byte, blockSize)
	var plainText []byte
	for i := 0; i < size; i += blockSize {
		cipher.Decrypt(buf, cipherText[i:i+blockSize])
		plainText = append(plainText, buf...)
	}
	return plainText, nil
}

func generateSigningKeys() (string, string, error) {
	publicKey, privateKey, err := ed25519.GenerateKey(nil)
	if err != nil {
		fmt.Println("Error generating signing keys", err)
		return "", "", err
	}

	return base64Encode(publicKey), base64Encode(privateKey), nil
}

func signRequest(privateKey string, payload []byte, currentTime int, ttl int) (string, error) {

	//compute blake 512 hash over the payload
	hash := blake2b.Sum512(payload)
	digest := base64Encode(hash[:])

	//create a signature and then sign with ed25519 private key
	signatureBody := fmt.Sprintf("(created): %d\n(expires): %d\ndigest: BLAKE-512=%s", currentTime, (currentTime + ttl), digest)
	decodedKey, err := base64Decode(privateKey)
	if err != nil {
		log.Println("Error decoding signing private key", err)
		return "", err
	}
	signature := ed25519.Sign(decodedKey, []byte(signatureBody))
	return base64Encode(signature), nil
}

func getRequestBody() ([]byte, error) {
	var payload []byte
	file, err := os.Open("request_body_raw_text.txt")
	if err != nil {
		fmt.Println("Error opening request body text file", err)
		return payload, err
	}
	defer file.Close()

	payload, err = io.ReadAll(file)
	if err != nil {
		fmt.Println("Error reading request body text file", err)
		return payload, err
	}

	return payload, nil
}

func getAuthHeader() (string, error) {
	var authHeader string

	payload, err := getRequestBody()
	if err != nil {
		return authHeader, err
	}

	privateKey := os.Getenv("PRIVATE_KEY")
	currentTime := int(time.Now().Unix())

	//ttl we are using is 30 seconds
	ttl := 30

	signature, err := signRequest(privateKey, payload, currentTime, ttl)
	if err != nil {
		fmt.Println("Could not compute signature", err)
		return authHeader, err
	}

	subscriberID := os.Getenv("SUBSCRIBER_ID")
	if subscriberID == "" {
		subscriberID = "buyer-app.ondc.org"
	}

	uniqueKeyID := os.Getenv("UNIQUE_KEY_ID")
	if uniqueKeyID == "" {
		uniqueKeyID = "207"
	}
	authHeader = fmt.Sprintf(`Signature keyId="%s|%s|ed25519",algorithm="ed25519",created="%d",expires="%d",headers="(created) (expires) digest",signature="%s"`, subscriberID, uniqueKeyID, currentTime, currentTime+ttl, signature)

	return authHeader, nil
}

func verifyRequest(authHeader string) bool {

	payload, err := getRequestBody()
	if err != nil {
		return false
	}

	publicKey := os.Getenv("PUBLIC_KEY")

	_, created, expires, signature, err := parseAuthHeader(authHeader)
	if err != nil {
		return false
	}

	//compute blake 512 hash over the payload
	hash := blake2b.Sum512(payload)
	digest := base64Encode(hash[:])

	//create a signature and then sign with ed25519 private key
	computedMessage := fmt.Sprintf("(created): %s\n(expires): %s\ndigest: BLAKE-512=%s", created, expires, digest)
	publicKeyBytes, err := base64Decode(publicKey)
	if err != nil {
		log.Println("Error decoding public key", err)
		return false
	}
	receivedSignature, err := base64Decode(signature)
	if err != nil {
		log.Println("Unable to base64 decode received signature", err)
		return false
	}
	return ed25519.Verify(publicKeyBytes, []byte(computedMessage), receivedSignature)
}

func main() {

	args := os.Args[1:]
	if len(args) == 0 {
		fmt.Println("Missing paramsters. Try ./crypto generate_key_pairs")
		return
	}

	switch args[0] {
	case "generate_key_pairs":
		signingPublicKey, signingPrivateKey, err := generateSigningKeys()
		if err != nil {
			fmt.Println("Could not generate signing keys")
			return
		}
		fmt.Println("Signing_private_key:", signingPrivateKey)
		fmt.Println("Signing_public_key:", signingPublicKey)
	case "create_authorisation_header":
		authHeader, err := getAuthHeader()
		if err == nil {
			fmt.Println(authHeader)
		}
	case "verify_authorisation_header":
		authHeader := args[1]
		fmt.Println(verifyRequest(authHeader))
	}
}

func parseAuthHeader(authHeader string) (string, string, string, string, error) {
	signatureRegex := regexp.MustCompile(`keyId=\"(.+?)\".+?created=\"(.+?)\".+?expires=\"(.+?)\".+?signature=\"(.+?)\"`)
	groups := signatureRegex.FindAllStringSubmatch(authHeader, -1)
	if len(groups) > 0 && len(groups[0]) > 4 {
		return groups[0][1], groups[0][2], groups[0][3], groups[0][4], nil
	}
	fmt.Println("Error parsing auth header. Please make sure that the auh headers passed as command line argument is valid")
	return "", "", "", "", errors.New("error parsing auth header")
}
