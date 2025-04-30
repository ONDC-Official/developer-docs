# ONDC VLookup Service

This repository contains a simple Express.js server that facilitates the ONDC (Open Network for Digital Commerce) VLookup service. The VLookup service allows you to perform lookups in the ONDC registry and obtain relevant information based on specified parameters.

## Getting Started

### Prerequisites

- Node.js installed on your machine

### Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory in the terminal.
3. Run `npm install` to install the required dependencies.

### Usage

1. Start the server by running `npm start` in the terminal.
2. The server will run on http://localhost:9900.

## Routes

### VLookup

Perform a VLookup operation by sending a POST request to `http://localhost:9900/vlookup`. The payload should be in the following format:

```json
{
  "senderSubscriberId": "your_subscriber_id",
  "privateKey": "your_private_key",

  //search parameters of the NP whose details need to be fetched from registry

  "domain": "ONDC:RET10",
  "subscriberId": "subscriber_id", // subscriber_id you want to lookup
  "country": "IND", // country
  "type": "buyerApp", //buyerApp, sellerApp, gateway
  "city": "std:022", // city code
  "env": "staging" //staging,preprod,prod
}
```

## Signature

Sign your data by sending a POST request to [http://localhost:9900/vlookup/sign](http://localhost:9900/vlookup/sign). The payload should be the same as for the VLookup route. The response will include a signature.

## Important Note

Make sure to replace the sample private key with your actual private key.

## Dependencies

- Express.js
- sodium-native
- crypto
- axios

## Contributing

Feel free to contribute to the development of this project by submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
