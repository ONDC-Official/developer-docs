# ONDC-LOG-VERIFICATION-SERVER

### APIs Log Verification tool for Pre-Prod participants

The tool is a NODE.js based server to check the conformance and compliance of the API logs for [logistics](https://docs.google.com/document/d/10GpEuKZE2g96DFJT3HKq6wIEMhPC-kkMZhXNn2jHHXc/edit?pli=1) and [B2B](https://github.com/ONDC-Official/ONDC-RET-Specifications) based on the examples in the API Contract.

The Log Verification Server is a tool designed to validate log files. It offers an endpoint `/validate/<domain name>` that allows users to send a directory path containing log files for verification. The directory can have single log file or all the log files for the complete flow. In case of single log files, if sent in sequence will validate the complete flow for same transaction id.
The server responds with a log report, indicating any errors found in the log files.

### Tech

- [[node.js](https://nodejs.org/en/)]
- [[lmdb](https://www.npmjs.com/package/lmdb)]
- [[lodash](https://www.npmjs.com/package/lodash)]
- [[ajv](https://ajv.js.org/)]

## Steps to run the server

Log Verification Server requires [Node.js](https://nodejs.org/) to run.

1. Clone the repository, navigate to log-verification-utility and install the dependencies.

```sh

cd log-verification-utility

npm i
```

2. Set up the .env file in root directory with the following configuration:

```code
MAPPLS_API_KEY=<api_key_value>
PORT=<port>
```
To get the api_key, refer to this link: https://developer.mappls.com/mapping/reverse-geocoding-api

3. Start the server with the following command:

```sh
npm run server:start
```
The server will be up and running at `http://localhost:3000`  

4. The server provides an HTTP endpoint for log file verification:

```code
http://localhost:3000/validate/<domainName>
```

Example endpoint for Logistics

**``
http://localhost:3000/validate/logistics
``**

Example endpoint for B2B

**``
http://localhost:3000/validate/b2b
``**

5. Send a POST request to the endpoint with the following parameters:

```code
logPath: <The path to the directory containing the log files>
```

6. Example using Postman:

```
Url: http://localhost:3000/validate/logistics
Request body json: {
    "logPath": "Documents/projects/v1.2.0-logs/Ref-logistics-app/flow2"
}
```

7. Example user cURL:

```
curl -X POST -d "logPath=/path/to/log/files" http://localhost:3000/validate/logistics
```

8. Upon successful validation, the server will respond with a log report in JSON format. The log report will indicate any errors found in the log files.

_Notes:_

> There must be a separate payload for every API.

> The server validates all the payloads as documented in the examples for respective domains:
* [logistics](https://docs.google.com/document/d/10GpEuKZE2g96DFJT3HKq6wIEMhPC-kkMZhXNn2jHHXc/edit?pli=1)

* [B2B](https://github.com/ONDC-Official/ONDC-RET-Specifications)

> Test cases to be referred here -> [logsitics](https://docs.google.com/document/d/1ttixilM-I6dutEdHL10uzqRFd8RcJlEO_9wBUijtdDc/edit) and [B2B](https://docs.google.com/document/d/10ouiTKLY4dm1KnXCuhFwK38cYd9_aDQ30bklkqnPRkM/edit)

> Sample payload for search.json is demonstrated below:

```json
{
  "context":
  {
    "domain":"ONDC:RET10",
    "location": {
      "city": {
        "code": "std:080"
      },
      "country": {
        "code": "IND"
      }
    },
    "action":"search",
    "version":"2.0.1",
    "bap_id":"buyerapp.com",
    "bap_uri":"https://buyerapp.com/grocery",
    "transaction_id":"T1",
    "message_id":"M1",
    "timestamp":"2023-01-08T22:00:00.000Z",
    "ttl":"PT30S"
  },
  "message":
  {
    "intent":
    {
      "item":
      {
        "descriptor":
        {
          "name":"oil"
        }
      },
      "fulfillment":
      {
        "type":"Delivery",
        "stops":
        [
          {
            "type":"end",
            "location":
            {
              "gps":"1.3806217468119772, 103.74636438437074",
              "area_code":"680230"
            }
          }
        ]
      },
      "payment":
      {
        "type":"ON-FULFILLMENT"
      },
      "tags":
      [
        {
          "descriptor": {
            "code":"bap_terms"
          },
          "list":
          [
            {
              "descriptor": {
                "code":"finder_fee_type"
              },
              "value":"percent"
            },
            {
              "descriptor": {
                "code":"finder_fee_amount"
              },
              "value":"0"
            }
          ]
        }
      ]
    }
  }
}
```

### N.B.

> - Community contributions are welcomed to enhance this server for future releases.
