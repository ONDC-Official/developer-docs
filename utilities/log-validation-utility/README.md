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

> The utility validates all the payloads as documented in the [API Contract](https://drive.google.com/file/d/1Z0eT1PZ8_tthEyxli8bLs-B9oCYAZIS0/view).

| Payloads (Correct Format)                   |
| ------------------------------------------- |
| search.json                                 |
| on_search.json                              |
| select.json                                 |
| on_select.json                              |
| init.json                                   |
| on_init.json                                |
| confirm.json                                |
| on_confirm.json                             |
| cancel.json                                 |
| on_cancel.json                              |
| track.json                                  |
| on_track.json                               |
| on_status_pending.json (Pending)            |
| on_status_picked.json (Order-picked-up)     |
| on_status_delivered.json (Order-delivered)  |
| update.json                                 |
| update_billing.json (Refund)                |
| on_update_initiated.json (Return_Initiated) |
| on_update_approved.json (Return_Approved)   |
| on_update_picked.json (Return_Picked)       |
| on_update_delivered.json (Return_Delivered) |
| on_update_liquidated.json (Liquidated)      |
| on_update_rejected.json (Return_Rejected)   |
| support.json                                |
| on_support.json                             |

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
    "timestamp": "2023-05-20T12:15:00.000Z",
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
            "gps": "12.967794,77.588891"
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

### N.B.

> - Please utilize the Log Validation Utility to validate logs for Flow 1, as outlined in the test case scenario document (accessible at: [link](https://docs.google.com/document/d/1ttixilM-I6dutEdHL10uzqRFd8RcJlEO_9wBUijtdDc/edit)).
> - Please be aware that for Flow 2 and subsequent flows, the Log Validation Utility may produce unnecessary outcomes.
> - For debugging purpose, please review the "./logs/validations.log" file that is generated after running the utility. It will consist of the error logs of the utility
> - Community contributions are welcomed to enhance this utility for future releases.
