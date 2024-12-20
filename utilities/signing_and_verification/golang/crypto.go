package main

import (
	"bytes"
	"crypto/aes"
	"crypto/ed25519"
	"crypto/rand"
	"crypto/x509/pkix"
	"encoding/asn1"
	b64 "encoding/base64"
	"errors"
	"fmt"
	"io"
	"os"
	"regexp"
	"time"

	"golang.org/x/crypto/blake2b"
	"golang.org/x/crypto/curve25519"
	"maze.io/x/crypto/x25519"
)

type pkcs8 struct {
	Version    int
	Algo       pkix.AlgorithmIdentifier
	PrivateKey []byte
	// optional attributes omitted.
}

type publicKeyInfo struct {
	Raw       asn1.RawContent
	Algorithm pkix.AlgorithmIdentifier
	PublicKey asn1.BitString
}

type pkixPublicKey struct {
	Algo      pkix.AlgorithmIdentifier
	BitString asn1.BitString
}

func base64Decode(payload string) ([]byte, error) {
	return b64.StdEncoding.DecodeString(payload)
}

func base64Encode(payload []byte) string {
	return b64.StdEncoding.EncodeToString(payload)
}

func generateEncryptionKeys() (string, string, error) {
	//publicKey, privateKey, err := ed25519.GenerateKey(nil)
	privateKey, err := x25519.GenerateKey(rand.Reader)
	if err != nil {
		fmt.Println("Error generating x25519 keys for encryption")
		return "", "", err
	}

	marshaledPrivateKey, err := marshalX25519PrivateKey(privateKey.Bytes())
	if err != nil {
		fmt.Println("Error marshaling enc private key to x509.pkcs format", err)
		return "", "", err
	}

	marshaledPublicKey, err := marshalX25519PublicKey(privateKey.PublicKey.Bytes())
	if err != nil {
		fmt.Println("Error marshaling enc public key to x509 format", err)
		return "", "", err
	}

	return base64Encode(marshaledPublicKey), base64Encode(marshaledPrivateKey), nil
}

func marshalX25519PrivateKey(key []byte) ([]byte, error) {
	var privateKey []byte
	curveKey, err := asn1.Marshal(key[:32])
	if err != nil {
		fmt.Println("Error asn1 marshaling private key")
		return privateKey, err
	}
	pkcsKey := pkcs8{
		Version: 1,
		Algo: pkix.AlgorithmIdentifier{
			Algorithm: asn1.ObjectIdentifier{1, 3, 101, 110},
		},
		PrivateKey: curveKey,
	}
	privateKey, err = asn1.Marshal(pkcsKey)
	if err != nil {
		fmt.Println("Error asn1 marshaling pkcs8 key", err)
		return privateKey, err
	}
	return privateKey, nil
}

func marshalX25519PublicKey(key []byte) ([]byte, error) {
	x509Key := pkixPublicKey{
		Algo: pkix.AlgorithmIdentifier{
			Algorithm: asn1.ObjectIdentifier{1, 3, 101, 110},
		},
		BitString: asn1.BitString{
			Bytes:     key,
			BitLength: 8 * len(key),
		},
	}
	publicKey, err := asn1.Marshal(x509Key)
	if err != nil {
		fmt.Println("Error asn1 marshaling public key", err)
		return publicKey, err
	}
	return publicKey, nil
}

func parseX25519PrivateKey(key string) ([]byte, error) {
	var parsedKey []byte
	decoded, err := base64Decode(key)
	if err != nil {
		fmt.Println("Error base64 decoding x25519 private key", err)
		return parsedKey, err
	}

	var pkcsKey pkcs8
	_, err = asn1.Unmarshal(decoded, &pkcsKey)
	if err != nil {
		fmt.Println("Error asn1 unmarshaling x25519 private key", err)
		return parsedKey, err
	}

	_, err = asn1.Unmarshal(pkcsKey.PrivateKey, &parsedKey)
	if err != nil {
		fmt.Println("Error asn1 unmashaling pkcs privat key", err)
		return parsedKey, err
	}
	return parsedKey, nil
}

func parseX25519PublicKey(key string) ([]byte, error) {
	var parsedKey []byte

	decoded, err := base64Decode(key)
	if err != nil {
		fmt.Println("Error base64 decoding x25519 public key", err)
		return parsedKey, err
	}

	var x509Key publicKeyInfo
	_, err = asn1.Unmarshal(decoded, &x509Key)
	if err != nil {
		fmt.Println("Error asn1 unmarshaling x25519 public key", err)
		return parsedKey, err
	}

	return x509Key.PublicKey.RightAlign(), nil
}

func aesEncrypt(payload []byte, key []byte) ([]byte, error) {
	cipher, err := aes.NewCipher(key)
	blockSize := cipher.BlockSize()
	if err != nil {
		fmt.Println("Error creating AES cipher", err)
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

func aesDecrypt(cipherText []byte, key []byte) ([]byte, error) {
	cipher, err := aes.NewCipher(key)
	blockSize := cipher.BlockSize()
	if err != nil {
		fmt.Println("Error creating AES cipher", err)
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
		fmt.Println("Error decoding signing private key", err)
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
		fmt.Println("Error decoding public key", err)
		return false
	}
	receivedSignature, err := base64Decode(signature)
	if err != nil {
		fmt.Println("Unable to base64 decode received signature", err)
		return false
	}
	return ed25519.Verify(publicKeyBytes, []byte(computedMessage), receivedSignature)
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

func encrypt(privateKey string, publicKey string) (string, error) {
	var encryptedText string
	parsedPrivateKey, err := parseX25519PrivateKey(privateKey)
	if err != nil {
		fmt.Println("Error parsing private key.", err)
		return encryptedText, err
	}

	parsedPublicKey, err := parseX25519PublicKey(publicKey)
	if err != nil {
		fmt.Println("Error parsing public key.", err)
		return encryptedText, err
	}

	secretKey, err := curve25519.X25519(parsedPrivateKey, parsedPublicKey)
	if err != nil {
		fmt.Println("Error constructing secret key", err)
		return encryptedText, nil
	}

	plainText := "ONDC is a Great Initiative!"
	cipherBytes, err := aesEncrypt([]byte(plainText), secretKey)
	if err != nil {
		fmt.Println("Error encrypting with AES", err)
		return encryptedText, err
	}

	encryptedText = base64Encode(cipherBytes)
	return encryptedText, nil
}

func decrypt(privateKey string, publicKey string, cipherText string) (string, error) {
	var decryptedText string
	parsedPrivateKey, err := parseX25519PrivateKey(privateKey)
	if err != nil {
		fmt.Println("Error parsing private key.", err)
		return decryptedText, err
	}

	parsedPublicKey, err := parseX25519PublicKey(publicKey)
	if err != nil {
		fmt.Println("Error parsing public key.", err)
		return decryptedText, err
	}

	secretKey, err := curve25519.X25519(parsedPrivateKey, parsedPublicKey)
	if err != nil {
		fmt.Println("Error constructing secret key", err)
		return decryptedText, nil
	}

	cipherBytes, err := base64Decode(cipherText)
	if err != nil {
		fmt.Println("Error base64 decoding cipher text", err)
		return decryptedText, err
	}
	plainBytes, err := aesDecrypt(cipherBytes, secretKey)
	if err != nil {
		fmt.Println("Error decrypting with AES", err)
		return decryptedText, err
	}

	decryptedText = string(plainBytes)
	return decryptedText, nil
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
		encPublicKey, encPrivateKey, err := generateEncryptionKeys()
		if err != nil {
			fmt.Println("Could not generate encryption keys")
			return
		}
		fmt.Println("Signing_private_key:", signingPrivateKey)
		fmt.Println("Signing_public_key:", signingPublicKey)
		fmt.Println("Crypto_Privatekey:", encPrivateKey)
		fmt.Println("Crypto_Publickey:", encPublicKey)
	case "create_authorisation_header":
		authHeader, err := getAuthHeader()
		if err == nil {
			fmt.Println(authHeader)
		}
	case "verify_authorisation_header":
		authHeader := args[1]
		fmt.Println(verifyRequest(authHeader))
	case "encrypt":
		privateKey := args[1]
		publicKey := args[2]
		cipherText, err := encrypt(privateKey, publicKey)
		if err == nil {
			fmt.Println(cipherText)
		}
	case "decrypt":
		privateKey := args[1]
		publicKey := args[2]
		cipherText := args[3]
		plainText, err := decrypt(privateKey, publicKey, cipherText)
		if err == nil {
			fmt.Println(plainText)
		}

	}
}
