import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import IssueInstance from '../../Issue/';
import { IssueRequest, IssueStatusPayload, OnIssue, OnIssueStatusResoloved } from '../../interfaces/issue.types';
import { AxiosResponse } from 'axios';
import postApi from '../../../utils/posApi';
import { SchemaValidator } from '../../../utils/validator.schema';
import {
  IssueSchema,
  IssueStatusSchema,
  LogisticOnIssueSchema,
  OnIssueStatusResolovedSchema,
  OnIssueStatusScehma,
} from '../../../utils/schema';
import { OnIssuePayloadProps } from '../../interfaces/manager.type';
import { PROTOCOL_CONTEXT } from '../../../shared/contents';
import { hasRefundKey, hasResolvedAction } from '../../../utils/commonFunction';

class SellerService {
  async issue(req: Request, res: Response) {
    try {
      const issueRequestpayload: IssueRequest = req.body;

      const isIssueSchemaValid = SchemaValidator({ schema: IssueSchema, data: issueRequestpayload });

      if (isIssueSchemaValid) {
        if (IssueInstance.config?.onError) {
          IssueInstance.config?.onError({
            payload: issueRequestpayload,
            error: isIssueSchemaValid.message,
            message: {
              ack: {
                status: 'NACK',
              },
            },
          });
        }

        return res.status(200).send({
          payload: issueRequestpayload,
          error: isIssueSchemaValid.message,
          message: {
            ack: {
              status: 'NACK',
            },
          },
        });
      }

      if (IssueInstance.config?.onSuccess?.issue) {
        IssueInstance.config?.onSuccess.issue({
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

  async issueToLogistics(issue: any) {
    try {
      const issueRequest: IssueRequest = {
        context: {
          domain: issue.context.domain,
          country: issue.context.country,
          city: issue.context.city,
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
            id: issue.message.issue.id,
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
              network_participant_id: issue.message.issue.source.network_participant_id,
              type: issue.message.issue.source.type,
            },
            expected_response_time: {
              duration: issue.message.issue.expected_response_time.duration,
            },
            expected_resolution_time: {
              duration: issue.message.issue.expected_response_time.duration,
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

  async issue_statusToLogistics(payload: any) {
    try {
      const issueStatusPayload: IssueStatusPayload = {
        context: {
          domain: payload.context.domain,
          country: payload.context.country,
          city: payload.context.city,
          action: PROTOCOL_CONTEXT.ISSUE,
          core_version: '1.0.0',
          bap_id: IssueInstance.config?.context[0].subscriberId!,
          bap_uri: IssueInstance.config?.context[0].subscriberURL!,
          bpp_id: payload.context.bpp_id,
          bpp_uri: payload.context.bpp_uri,
          transaction_id: uuid(),
          message_id: uuid(),
          timestamp: new Date().toISOString(),
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

  async on_issue(req: Request, res: Response) {
    try {
      const issueRequestpayload: OnIssue = req.body;

      const isOnIssueSchemaValid = SchemaValidator({ schema: LogisticOnIssueSchema, data: issueRequestpayload });

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

  async on_issue_post(payload: OnIssuePayloadProps) {
    const on_issue_payload: OnIssue = {
      context: {
        domain: IssueInstance.config?.context[0].subscriberDomain!,
        country: IssueInstance.config?.context[0].subscriberCountry!,
        city: IssueInstance.config?.context[0].subscriberCity!,
        action: 'on_issue',
        core_version: '1.0.0',
        bap_id: payload.context.bap_id,
        bap_uri: payload.context.bap_uri,
        bpp_id: IssueInstance.config?.context[0].subscriberId!,
        bpp_uri: IssueInstance.config?.context[0].subscriberURL!,
        transaction_id: payload.context.transaction_id,
        message_id: payload.context.message_id,
        timestamp: payload.context.timestamp,
      },
      message: {
        issue: {
          id: payload.message.issue.id,
          issue_actions: {
            respondent_actions: payload.message.issue.issue_actions.respondent_actions,
          },
          created_at: payload.message.issue.created_at,
          updated_at: new Date().toISOString(),
        },
      },
    };

    try {
      const response: AxiosResponse = await postApi({
        baseUrl: payload.context.bap_uri,
        data: on_issue_payload,
        endpoint: '/on_issue',
        method: 'POST',
      });

      if (response.status === 200) {
        return response;
      }

      return { payload: on_issue_payload, status: response.status, message: 'Something went wrong' };
    } catch (e) {
      return e;
    }
  }

  async issue_status(req: Request, res: Response) {
    try {
      const issueRequestpayload: IssueStatusPayload = req.body;

      const isIssueSchemaValid = SchemaValidator({ schema: IssueStatusSchema, data: issueRequestpayload });

      if (isIssueSchemaValid) {
        if (IssueInstance.config?.onError) {
          IssueInstance.config?.onError({
            payload: issueRequestpayload,
            error: isIssueSchemaValid.message,
            message: {
              ack: {
                status: 'NACK',
              },
            },
          });
        }

        return res.status(200).send({
          payload: issueRequestpayload,
          error: isIssueSchemaValid.message,
          message: {
            ack: {
              status: 'NACK',
            },
          },
        });
      }

      if (IssueInstance.config?.onSuccess?.issue_status) {
        IssueInstance.config?.onSuccess.issue_status({
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

  async on_issue_status(req: Request, res: Response) {
    try {
      const issueRequestpayload: OnIssue | OnIssueStatusResoloved = req.body;

      let isIssueSchemaValid;

      if (!hasResolvedAction(issueRequestpayload.message.issue.issue_actions.respondent_actions)) {
        isIssueSchemaValid = SchemaValidator({ schema: OnIssueStatusScehma, data: issueRequestpayload });
      } else {
        isIssueSchemaValid = SchemaValidator({ schema: OnIssueStatusResolovedSchema, data: issueRequestpayload });
      }

      if (isIssueSchemaValid) {
        if (IssueInstance.config?.onError) {
          IssueInstance.config?.onError({
            payload: issueRequestpayload,
            error: isIssueSchemaValid.message,
            message: {
              ack: {
                status: 'NACK',
              },
            },
          });
        }

        return res.status(200).send({
          payload: issueRequestpayload,
          error: isIssueSchemaValid.message,
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

  async on_issue_status_post(payload: any) {
    let on_issue_payload: OnIssue | OnIssueStatusResoloved;
    const respondent_action = payload.message.issue.issue_actions.respondent_actions;

    if (respondent_action.some((item: any) => item.respondent_action === 'RESOLVED') && hasRefundKey(payload)) {
      on_issue_payload = {
        context: {
          domain: IssueInstance.config?.context[0].subscriberDomain!,
          country: IssueInstance.config?.context[0].subscriberCountry!,
          city: IssueInstance.config?.context[0].subscriberCity!,
          action: 'on_issue_status',
          core_version: '1.0.0',
          bap_id: payload.context.bap_id,
          bap_uri: payload.context.bap_uri,
          bpp_id: IssueInstance.config?.context[0].subscriberId!,
          bpp_uri: IssueInstance.config?.context[0].subscriberURL!,
          transaction_id: payload.context.transaction_id,
          message_id: payload.context.message_id,
          timestamp: payload.context.timestamp,
        },
        message: {
          issue: {
            id: payload.message.issue.id,
            issue_actions: {
              respondent_actions: payload.message.issue.issue_actions.respondent_actions,
            },
            resolution_provider: {
              respondent_info: {
                organization: {
                  contact: {
                    email: payload.message.issue.resolution_provider.respondent_info.organization.contact.email,
                    phone: payload.message.issue.resolution_provider.respondent_info.organization.contact.phone,
                  },
                  org: {
                    name: payload.message.issue.resolution_provider.respondent_info.organization.org.name,
                  },
                  person: {
                    name: payload.message.issue.resolution_provider.respondent_info.organization.person.name,
                  },
                },
                type: payload.message.issue.resolution_provider.respondent_info.type,
                resolution_support: {
                  chat_link: payload.message.issue.resolution_provider.respondent_info.resolution_support.chat_link,
                  contact: {
                    phone: payload.message.issue.resolution_provider.respondent_info.resolution_support.contact.phone,
                    email: payload.message.issue.resolution_provider.respondent_info.resolution_support.contact.email,
                  },
                  gros: payload.message.issue.resolution_provider.respondent_info.resolution_support.gros,
                },
              },
            },
            resolution: {
              short_desc: payload.message.issue.resolution.short_desc,
              long_desc: payload.message.issue.resolution.long_desc,
              action_triggered: 'REFUND',
              refund_amount: payload.message.issue.resolution.refund_amount,
            },
            created_at: payload.message.issue.created_at,
            updated_at: new Date().toISOString(),
          },
        },
      };
    } else {
      on_issue_payload = {
        context: {
          domain: IssueInstance.config?.context[0].subscriberDomain!,
          country: IssueInstance.config?.context[0].subscriberCountry!,
          city: IssueInstance.config?.context[0].subscriberCity!,
          action: 'on_issue_status',
          core_version: '1.0.0',
          bap_id: payload.context.bap_id,
          bap_uri: payload.context.bap_uri,
          bpp_id: IssueInstance.config?.context[0].subscriberId!,
          bpp_uri: IssueInstance.config?.context[0].subscriberURL!,
          transaction_id: payload.context.transaction_id,
          message_id: payload.context.message_id,
          timestamp: payload.context.timestamp,
        },
        message: {
          issue: {
            id: payload.message.issue.id,
            issue_actions: {
              respondent_actions: payload.message.issue.issue_actions.respondent_actions,
            },
            created_at: payload.message.issue.created_at,
            updated_at: new Date().toISOString(),
          },
        },
      };
    }

    try {
      const response: AxiosResponse = await postApi({
        baseUrl: payload.context.bap_uri,
        data: on_issue_payload,
        endpoint: '/on_issue_status',
        method: 'POST',
      });

      if (response.status === 200) {
        return response;
      }

      return { payload: on_issue_payload, status: response.status, message: 'Something went wrong' };
    } catch (e) {
      return e;
    }
  }
}

export default SellerService;
