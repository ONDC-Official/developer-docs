# ONDC-LOG-VALIDATION

### APIs Log Validation tool for Pre-Prod participants

The tool is a NODE.js based utility to check the conformance and compliance of the API logs for [logistics](https://docs.google.com/document/d/10GpEuKZE2g96DFJT3HKq6wIEMhPC-kkMZhXNn2jHHXc/edit?pli=1) and [B2B](https://github.com/ONDC-Official/ONDC-RET-Specifications) based on the examples in the API Contract.

### Tech

- [[node.js](https://nodejs.org/en/)]
- [[lmdb](https://www.npmjs.com/package/lmdb)]
- [[lodash](https://www.npmjs.com/package/lodash)]
- [[ajv](https://ajv.js.org/)]

## Steps to run the utility

Log Validation Tool requires [Node.js](https://nodejs.org/) to run.

1. Clone the repository, navigate to log-validation-utility and install the dependencies.

```sh

cd log-validation-utility

npm i
```

2. Move all the API payloads inside "/public/logs" folder or mention the path to the logs folder as demonstrated in the next step.

3. Run the utility in the following format

   > node index.js "domain" "/path/to/logs/folder/"

```sh
node index.js logistics ./public/logs/
node index.js b2b ./public/logs/
```

4. A text report (**log_report.json**) will be generated upon successful execution of the utility.
<!-- 5. An error handling txt file (error_report.txt) will also be generated to catch all the errors occurred during the execution. -->

_Notes:_

> There must be a separate payload for every API.

> The utility validates all the payloads as documented in the examples for respective domains:
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

> - Community contributions are welcomed to enhance this utility for future releases.
