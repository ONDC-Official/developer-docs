import { Response, Request } from 'express';
import { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import { PROTOCOL_CONTEXT } from '../../../shared/contents';
import { IssueStatusPayload, IssueRequest, OnIssue, OnIssueStatusResoloved } from '../../interfaces/issue.types';
import IssueInstance from '../../Issue';
import postApi from '../../../utils/posApi';
import { IssuePayloadProps, IssueStatusPayloadProps } from '../../interfaces/manager.type';
import { SchemaValidator } from '../../../utils/validator.schema';
import { OnIssueSchema, OnIssueStatusScehma, OnIssueStatusResolovedSchema } from '../../../utils/schema';
import { hasResolvedAction } from '../../../utils/commonFunction';

class BuyerServices {
  constructor() {
    this.issue = this.issue.bind(this);
    ``;
  }

  /**
   * Creates and submits a new issue based on the provided request.
   *
   * @param req - The incoming HTTP request containing the issue data in the request body.
   * @returns A promise that resolves to the response containing the status of the submitted issue.
   * @throws Will throw an error if an issue schema validation fails or an API call encounters an error.
   */
  async issue(issue: IssuePayloadProps) {
    try {
      const issueRequest: IssueRequest = {
        context: {
          domain: IssueInstance.config?.context[0].subscriberDomain!,
          country: IssueInstance.config?.context[0].subscriberCountry!,
          city: IssueInstance.config?.context[0].subscriberCity!,
          action: PROTOCOL_CONTEXT.ISSUE,
          core_version: '1.0.0',
          bap_id: IssueInstance.config?.context[0].subscriberId!,
          bap_uri: IssueInstance.config?.context[0].subscriberURL!,
          bpp_id: issue.context.bpp_id,
          bpp_uri: issue.context.bpp_uri,
          transaction_id: uuid(),
          message_id: uuid(),
          timestamp: new Date().toISOString(),
          ttl: issue.context.ttl,
        },
        message: {
          issue: {
            id: uuid(),
            category: issue.message.issue.category,
            sub_category: issue.message.issue.sub_category,
            complainant_info: issue.message.issue.complainant_info,
            status: issue.message.issue.status || 'OPEN',
            issue_type: PROTOCOL_CONTEXT?.ISSUE.toUpperCase(),
            issue_actions: issue.message.issue.issue_actions,
            order_details: {
              id: issue.message.issue.order_details?.id,
              state: issue.message.issue.order_details?.state,
              items: issue.message.issue.order_details.items,
              fulfillments: issue.message.issue.order_details.fulfillments,
              provider_id: issue.message.issue.order_details?.provider_id,
            },
            description: {
              short_desc: issue.message.issue.description?.short_desc,
              long_desc: issue.message.issue.description?.long_desc,
              additional_desc: issue.message.issue.description?.additional_desc,
              images: issue.message.issue.description?.images,
            },
            source: {
              network_participant_id: IssueInstance.config?.context[0].subscriberId!,
              type: 'CONSUMER',
            },
            expected_response_time: {
              duration: IssueInstance.config?.context[0].expected_resolution_time!,
            },
            expected_resolution_time: {
              duration: IssueInstance.config?.context[0].expected_resolution_time!,
            },
            created_at: issue.message.issue.created_at,
            updated_at: new Date().toISOString(),
          },
        },
      };

      const response: AxiosResponse = await postApi({
        baseUrl: issueRequest.context.bpp_uri,
        data: issueRequest,
        endpoint: PROTOCOL_CONTEXT.ISSUE,
        method: 'POST',
      });
      if (response.status === 200) {
        return response;
      }
      return { payload: issueRequest, status: response.status, message: 'Something went wrong' };
    } catch (err) {
      throw err;
    }
  }

  async on_issue(req: Request, res: Response) {
    try {
      const issueRequestpayload: OnIssue = req.body;

      const isOnIssueSchemaValid = SchemaValidator({ schema: OnIssueSchema, data: issueRequestpayload });

      if (isOnIssueSchemaValid) {
        if (IssueInstance.config?.onError) {
          IssueInstance.config?.onError({
            payload: issueRequestpayload,
            error: isOnIssueSchemaValid.message,
            message: {
              ack: {
                status: 'NACK',
              },
            },
          });
        }

        return res.status(200).send({
          payload: issueRequestpayload,
          error: isOnIssueSchemaValid.message,
          message: {
            ack: {
              status: 'NACK',
            },
          },
        });
      }

      if (IssueInstance.config?.onSuccess?.on_issue) {
        IssueInstance.config?.onSuccess.on_issue({
          payload: issueRequestpayload,
          message: {
            ack: {
              status: 'ACK',
            },
          },
        });
      }

      return res.status(200).send({
        payload: issueRequestpayload,
        message: {
          ack: {
            status: 'ACK',
          },
        },
      });
    } catch (err) {
      if (IssueInstance.config?.onError) {
        IssueInstance.config?.onError({
          error: err,
          message: {
            ack: {
              status: 'NACK',
            },
          },
        });
      }
      throw err;
    }
  }

  /**
   * Retrieves the status of a specific issue based on the provided request.
   *
   * @param req - The incoming HTTP request containing the issue ID in the request body.
   * @param res - The HTTP response object to send the issue status response.
   * @returns A promise that resolves to the response containing the status of the requested issue.
   * @throws Will throw an error if an API call encounters an error.
   */
  async issue_status(payload: IssueStatusPayloadProps) {
    try {
      const issueStatusPayload: IssueStatusPayload = {
        context: {
          domain: IssueInstance.config?.context[0].subscriberDomain!,
          country: IssueInstance.config?.context[0].subscriberCountry!,
          city: IssueInstance.config?.context[0].subscriberCity!,
          action: 'issue_status',
          core_version: '1.0.0',
          bap_id: IssueInstance.config?.context[0].subscriberId!,
          bap_uri: IssueInstance.config?.context[0].subscriberURL!,
          bpp_id: payload.context.bpp_id,
          bpp_uri: payload.context.bpp_uri,
          transaction_id: payload.context.transaction_id,
          message_id: uuid(),
          timestamp: payload.context.timestamp,
          ttl: payload.context.ttl,
        },
        message: {
          issue_id: payload.message.issue_id,
        },
      };

      const response: AxiosResponse = await postApi({
        baseUrl: payload.context.bpp_uri,
        data: issueStatusPayload,
        endpoint: '/issue_status',
        method: 'POST',
      });
      return { payload: issueStatusPayload, data: response.data, status: response.status };
    } catch (err) {
      throw err;
    }
  }

  async on_issue_status(req: Request, res: Response) {
    let isOnIssueSchemaValid;

    try {
      const issueRequestpayload: OnIssueStatusResoloved = req.body;

      const respondent_actions = issueRequestpayload.message.issue.issue_actions.respondent_actions;

      if (hasResolvedAction(respondent_actions)) {
        isOnIssueSchemaValid = SchemaValidator({ schema: OnIssueStatusResolovedSchema, data: issueRequestpayload });
      } else {
        isOnIssueSchemaValid = SchemaValidator({ schema: OnIssueStatusScehma, data: issueRequestpayload });
      }

      if (isOnIssueSchemaValid) {
        if (IssueInstance.config?.onError) {
          IssueInstance.config?.onError({
            payload: issueRequestpayload,
            error: isOnIssueSchemaValid.message,
            message: {
              ack: {
                status: 'NACK',
              },
            },
          });
        }

        return res.status(200).send({
          payload: issueRequestpayload,
          error: isOnIssueSchemaValid.message,
          message: {
            ack: {
              status: 'NACK',
            },
          },
        });
      }

      if (IssueInstance.config?.onSuccess?.on_issue_status) {
        IssueInstance.config?.onSuccess.on_issue_status({
          payload: issueRequestpayload,
          message: {
            ack: {
              status: 'ACK',
            },
          },
        });
      }

      return res.status(200).send({
        payload: issueRequestpayload,
        message: {
          ack: {
            status: 'ACK',
          },
        },
      });
    } catch (err) {
      if (IssueInstance.config?.onError) {
        IssueInstance.config?.onError({
          error: err,
          message: {
            ack: {
              status: 'NACK',
            },
          },
        });
      }
      throw err;
    }
  }
}

export default BuyerServices;
