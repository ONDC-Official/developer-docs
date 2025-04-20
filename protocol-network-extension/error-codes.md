# ONDC Error Codes (for Buyer App, Seller App, Gateway)

## ID: 
ONDC-RFC-001

## Draft ID
Draft-01

## Title:
ONDC Error Codes

## Category:
Network Policy

## Status:
Protocol Draft

## Published on:
March 13, 2022

## Expires on:
March 12, 2026 or Date of publication of next draft which ever is earlier

## License:
CC-BY-ND

## Authors:
1. Supriyo Ghosh : supriyo@ondc.org

## Introduction
  This document outlines the error codes which must be returned by a Buyer App, Seller App or Gateway. 

  ## Error Codes
  |**Code**|**Type**|**Message**|**Description**|
  |---|---|---|---|
  |10000|Gateway|Bad or Invalid request error|Generic bad or invalid request error|
  |10001|Gateway|Invalid Signature|Cannot verify signature for request|
  |10002|Gateway|Invalid City Code|Valid city code needs to be passed for search|
  |20000|BNP|Invalid catalog|Catalog refresh is invalid|
  |20001|BNP|Invalid Signature|Cannot verify signature for response|
  |20002|BNP|Stale Request|Cannot process stale request|
  |20003|BNP|Provider not found|Provider not found|
  |20004|BNP|Provider location not found|Provider location not found|
  |20005|BNP|Item not found|Item not found|
  |20006|BNP|Invalid response|Invalid response does not meet API contract specifications|
  |20007|BNP|Invalid order state|Order/fulfillment state is stale or not valid|
  |20008|BNP|Response out of sequence|Callback received prior to ACK for request or out of sequence|
  |20009|BNP|Timeout|Callback received late, session timed out|
  |21001|BNP|Feature not supported|Feature not supported|
  |21002|BNP|Increase in item quantity|Increase in item quantity|
  |21003|BNP|Change in item quote|Change in item quote without change in quantity|
  |22501|BNP|Part Fill Unacceptable|Buyer doesn't accept part fill for the order, wants to cancel the order|
  |22502|BNP|Cancellation unacceptable|Invalid cancellation reason|
  |22503|BNP|Cancellation unacceptable|Updated quote does not match original order value and cancellation terms|
  |22504|BNP|Invalid Fulfillment TAT|Fulfillment TAT is different from what was quoted earlier|
  |22505|BNP|Invalid Cancellation Terms|Cancellation terms are different from what was quoted earlier|
  |22506|BNP|Invalid Terms of Reference|Terms of Reference are different from what was quoted earlier|
  |22507|BNP|Invalid Quote|Quote is invalid as it does not meet the API contract specifications|
  |22508|BNP|Invalid Part Cancel Request|Part cancel request is invalid|
  |22509|BNP|Cancel Return Request|Buyer cancelling return request|
  |23001|BNP|Internal Error|Cannot process response due to internal error, please retry|
  |23002|BNP|Order validation failure|Order validation failure|
  |25001|BNP|Order Confirm Failure|Buyer App cannot confirm order as no response from Seller App|
  |27501|BNP|Terms and Conditions unacceptable|Seller App terms and conditions not acceptable to Buyer App|
  |27502|BNP|Order terminated|Order terminated as Seller App did not accept terms and conditions proposed by Buyer App|
  |30000|SNP|Invalid request|Invalid request does not meet API contract specifications|
  |30001|SNP|Provider not found|When Seller App is unable to find the provider id sent by the Buyer App|
  |30002|SNP|Provider location not found|When Seller App is unable to find the provider location id sent by the Buyer App|
  |30003|SNP|Provider category not found|When Seller App is unable to find the provider category id sent by the Buyer App|
  |30004|SNP|Item not found|Unable to find details for item, may have been deleted|
  |30005|SNP|Invalid return request|Return reason is invalid|
  |30006|SNP|Offer code invalid|Offer code is not valid anymore|
  |30007|SNP|Offer fulfillment error|Offer cannot be fulfilled at this time|
  |30008|SNP|Location Serviceability error|Pickup location not serviceable by Logistics Provider|
  |30009|SNP|Location Serviceability error|Dropoff location not serviceable by Logistics Provider|
  |30010|SNP|Location Serviceability error|Delivery distance exceeds the maximum serviceability distance|
  |30011|SNP|Order Serviceability error|Delivery Partners not available|
  |30012|SNP|Invalid cancellation reason|Cancellation reason is invalid|
  |30013|SNP|Invalid Fulfillment TAT|Fulfillment TAT is different from what was quoted earlier|
  |30014|SNP|Cancellation unacceptable|Cancellation request is rejected as fulfillment TAT is not breached|
  |30015|SNP|Invalid rating value|When the Seller App receives an invalid value as the rating value in value|
  |30016|SNP|Invalid Signature|Cannot verify signature for request|
  |30017|SNP|Merchant unavailable|Merchant is currently not taking orders|
  |30018|SNP|Invalid Order|Order not found|
  |30019|SNP|Order Confirm Error|Seller App is unable to confirm the order|
  |30020|SNP|Order Confirm Failure|Seller App cannot confirm order as no response from Buyer App|
  |30021|SNP|Merchant Inactive|Merchant is inactive|
  |30022|SNP|Stale Request|Cannot process stale request|
  |30023|SNP|Minimum order value error|Cart value is less than minimum order value|
  |31001|SNP|Internal Error|Cannot process request due to internal error, please retry|
  |31002|SNP|Order validation failure|Order validation failure|
  |31003|SNP|Order processing in progress|Order processing in progress|
  |40000|SNP|Business Error|Generic business error|
  |40001|SNP|Feature not supported|Feature not supported|
  |40002|SNP|Item quantity unavailable|When the Seller App is unable to fulfill the required quantity for items in the order|
  |40003|SNP|Quote unavailable|Quote no longer available|
  |40004|SNP|Payment type not supported|Payment type not supported|
  |40005|SNP|Tracking not enabled|Tracking not enabled for any fulfillment in the order|
  |40006|SNP|Fulfilment agent unavailable|When an agent for fulfilment is not available|
  |40007|SNP|Change in item quantity|Change in item quantity|
  |40008|SNP|Change in quote|Change in quote|
  |40009|SNP|Maximum order qty exceeded|Maximum order qty exceeded|
  |40010|SNP|Expired authorization|Authorization code has expired|
  |40011|SNP|Invalid authorization|Authorization code is invalid|
  |40012|SNP|Minimum order qty required|Minimum order qty required|
  |41001|SNP|Finder fee not acceptable|Buyer finder fee is not acceptable|
  |41002|SNP|Differential weight charges rejected|Differential weight charges rejected|
  |50000|SNP|Policy Error|Generic Policy Error|
  |50001|SNP|Cancellation not possible|When the Seller App is unable to cancel the order due to it's cancellation policy|
  |50002|SNP|Updation not possible|When the Seller App is unable to update the order due to it's updation policy|
  |50003|SNP|Unsupported rating category|When the Seller App receives an entity to rate which is not supported|
  |50004|SNP|Support unavailable|When the Seller App receives an object if for which it does not provide support|
  |50005|SNP|Terms and Conditions unacceptable|Buyer App terms and conditions not acceptable to Seller App|
  |50006|SNP|Order terminated|Order terminated as Buyer App did not accept terms proposed by Seller App|
  |50007|SNP|Fulfillment not found|Fulfillment not found|
  |50008|SNP|Fulfillment cannot be updated|Fulfillment has reached terminal state, cannot be updated|
  |60001|LSP|Location Serviceability Error|Pickup location not serviceable by Logistics Provider|
  |60002|LSP|Location Serviceability Error|Dropoff location not serviceable by Logistics Provider|
  |60003|LSP|Location Serviceability Error|Delivery distance exceeds the maximum serviceability distance|
  |60004|LSP|Order Serviceability Error|Delivery Partners not available|
  |60005|LSP|Invalid Signature|Cannot verify signature for request|
  |60006|LSP|Invalid Request|Invalid request, not compliant with API contract|
  |60007|LSP|Policy Error|Cancellation not possible because of Logistics Provider policy|
  |60008|LSP|Invalid Fulfillment TAT|Fulfillment TAT is different from what was quoted earlier|
  |60009|LSP|Invalid cancellation request|Cancellation reason is invalid|
  |60010|LSP|Cancellation unacceptable|Cancellation request is rejected as fulfillment TAT is not breached|
  |60011|LSP|Difference in packaging details|Weight and / or dimensions provided is different from what was originally provided|
  |60012|LSP|Tracking not enabled|Tracking not enabled for any fulfillment in the order|
  |61001|LSP|Feature not supported|Feature not supported|
  |62501|LBNP|Terms and Conditions unacceptable|Logistics Provider terms & conditions not acceptable to Logistics Buyer|
  |62502|LBNP|Order terminated|Order terminated as Logistics Provider did not accept terms proposed by Logistics Buyer|
  |62503|LBNP|RTO rejected|RTO request rejected as quote does not match the quote provided in catalog|
  |62504|LBNP|Differential weight charges rejected|Differential weight charges rejected|
  |62505|LBNP|Cancellation terms unacceptable|Logistics Provider cancellation terms not acceptable to Logistics Buyer|
  |62506|LBNP|Invalid Fulfillment TAT|Fulfillment TAT is different from what was quoted earlier|
  |62507|LBNP|Difference in packaging details|Weight and / or dimensions provided is different from what was originally provided|
  |62508|LBNP|Quote difference|Total price is different from what was originally provided|
  |62509|LBNP|Invalid Cancellation Terms|Cancellation terms are different from what was quoted earlier|
  |62510|LBNP|Expired authorization|Authorization code has expired|
  |62511|LBNP|Invalid authorization|Authorization code is invalid|
  |62512|LBNP|Pickup status rejected|Pickup auth enabled but not yet complete|
  |62513|LBNP|Delivery status rejected|Delivery auth enabled but not yet complete|
  |63001|LBNP|Internal Error|Cannot process response due to internal error, please retry|
  |63002|LBNP|Order validation failure|Order validation failure|
  |64001|LBNP|Feature not supported|Feature not supported|
  |64002|LBNP|Order validation failure|Order validation failure|
  |65001|LSP|Order Confirm Error|Logistics Provider is unable to confirm the order|
  |65002|LSP|Order terminated|Order terminated as Logistics Buyer did not accept terms proposed by Logistics Provider|
  |65003|LSP|Stale Request|Cannot process stale request|
  |65004|LSP|Terms unacceptable|Logistics Buyer terms not acceptable to Logistics Provider|
  |65005|LSP|Invalid fulfillment terms|Immediate delivery fulfillment requires RTS at order confirm|
  |66001|LSP|Internal Error|Cannot process request due to internal error, please retry|
  |66002|LSP|Order validation failure|Order validation failure|
  |66003|LSP|Order processing in progress|Order processing in progress|
  |66004|LSP|Invalid Order|Order not found|
  |66005|LSP|Quote unavailable|Quote no longer available|

  ## Acknowledgements
  This document has been adapted from the [Error Codes draft document](https://github.com/beckn/protocol-specifications/blob/draft/docs/protocol-drafts/BECKN-RFC-005-Error-Codes-Draft-01.md) from the Beckn Foundation.

*Copyright (c) 2024 ONDC. All rights reserved.*
