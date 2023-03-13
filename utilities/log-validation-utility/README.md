# ONDC-LOG-VALIDATION

### APIs Log Validation tool for Pre-Prod participants

The tool is a NODE.js based utility to check the conformance and compliance of the API logs for retail with the [API Contract](https://drive.google.com/file/d/1Z0eT1PZ8_tthEyxli8bLs-B9oCYAZIS0/view).

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
node index.js retail ./public/logs/
```

4. A text report (log_report.md) will be generated upon successful execution of the utility.
<!-- 5. An error handling txt file (error_report.txt) will also be generated to catch all the errors occurred during the execution. -->

_Notes:_

> There must be a separate payload for every API.

> All the payloads should be named in the correct format as mentioned in the table below.

> The utility validates all the 18 payloads as documented in the [API Contract](https://drive.google.com/file/d/1Z0eT1PZ8_tthEyxli8bLs-B9oCYAZIS0/view).

| Payloads (Correct Format) |
| ------------------------- |
| search.json               |
| on_search.json            |
| select.json               |
| on_select.json            |
| init.json                 |
| on_init.json              |
| confirm.json              |
| on_confirm.json           |
| cancel.json               |
| on_cancel.json            |
| track.json                |
| on_track.json             |
| status.json               |
| on_status.json            |
| update.json               |
| on_update.json            |
| support.json              |
| on_support.json           |

> FAQs for Retail API Contract and Log Validation Utility ([FAQs](https://docs.google.com/document/d/1K-kqoOQ8IB-ywl_4pEiQKttTDk5Co381J07GldEUmD4/edit?usp=sharing))

> Sample payload for search.json is demonstrated below:

```json
{
  "context": {
    "domain": "nic2004:52110",
    "country": "IND",
    "city": "std:080",
    "action": "search",
    "core_version": "1.1.0",
    "bap_id": "buyer-app-preprod.ondc.org",
    "bap_uri": "https://buyer-app-preprod.ondc.org/protocol/v1",
    "transaction_id": "7fc3bf55-2efc-442d-fda3-465d27a35d26",
    "message_id": "89b0ffb1-5f49-4eb7-b319-ca02caecc059",
    "timestamp": "2022-11-11T19:59:52.452Z",
    "ttl": "PT30S"
  },
  "message": {
    "intent": {
      "item": {
        "descriptor": {
          "name": "coffee"
        }
      },
      "fulfillment": {
        "type": "Delivery",
        "end": {
          "location": {
            "gps": "12.96774,77.58891"
          }
        }
      },
      "payment": {
        "@ondc/org/buyer_app_finder_fee_type": "percent",
        "@ondc/org/buyer_app_finder_fee_amount": "3.0"
      }
    }
  }
}
```
