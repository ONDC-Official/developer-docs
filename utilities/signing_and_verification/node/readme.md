# Signing Key pair generation using Node.js

This Node.js script generates key pairs for signing and encryption using the `tweetnacl` and `crypto` library.

## Prerequisites

Make sure you have Node.js installed on your system. If not, you can download it from [Node.js website](https://nodejs.org/).

## Installation

```bash
npm i
```

## Usage

- Clone the repository or copy the script into your project.
- Run the script using the following command:

```bash
node index.js
```

## Output

The script will output key pairs in base64-encoded format for signing and encryption.

```bash
{
    "Signing_private_key": "BASE64_ENCODED_PRIVATE_KEY",
    "Signing_public_key": "BASE64_ENCODED_PUBLIC_KEY",
    "Encryption_Privatekey": "BASE64_ENCODED_PRIVATE_KEY",
    "Encryption_Publickey": "BASE64_ENCODED_PUBLIC_KEY"
}

```

## Example

```javascript
const keyPairs = generateKeyPairs();
console.log(keyPairs);
```

Feel free to integrate this script into your project or use it as a reference for key pair generation in Node.js.

```vbnet
Copy and paste this markdown content into a `readme.md` file in your project repository. Modify it as needed based on your project structure and additional information you want to provide.

```
