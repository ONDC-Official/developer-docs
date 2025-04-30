import { Request, Response } from 'express';
import IssueInstance from '../../Issue/';
import { SchemaValidator } from '../../../utils/validator.schema';
import { IssueStatusSchema, LogisticsIssueSchema } from '../../../utils/schema';
import { IssueStatusPayload, OnIssue } from '../../interfaces/issue.types';
import { AxiosResponse } from 'axios';
import postApi from '../../../utils/posApi';
import { hasRefundKey, hasResolvedAction } from '../../../utils/commonFunction';

class LogisticsServices {
  async issue(req: Request, res: Response) {
    try {
      const issueRequestpayload: OnIssue = req.body;

      const isIssueSchemaValid = SchemaValidator({ schema: LogisticsIssueSchema, data: issueRequestpayload });

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

  async on_issue(payload: any) {
    let on_issue_payload;
    if (!hasResolvedAction(payload.message.issue.issue_actions.respondent_actions)) {
      on_issue_payload = {
        context: {
          ttl: payload.context.ttl,
          domain: payload.context.domain,
          country: payload.context.country,
          city: payload.context.city,
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
              complainant_actions: payload.message.issue.issue_actions.complainant_actions,
              respondent_actions: payload.message.issue.issue_actions.respondent_actions,
            },
            created_at: payload.message.issue.created_at,
            updated_at: new Date().toISOString(),
          },
        },
      };
    } else if (hasRefundKey(payload)) {
      on_issue_payload = {
        context: {
          ttl: payload.context.ttl,
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
              complainant_actions: payload.message.issue.issue_actions.complainant_actions,
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
          ttl: payload.context.ttl,
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
              complainant_actions: payload.message.issue.issue_actions.complainant_actions,
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
              action_triggered: payload.message.issue.resolution.action_triggered,
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

  async on_issue_status(payload: any) {
    console.log('🚀 ~ file: index.ts:310 ~ LogisticsServices ~ on_issue_status ~ payload:', payload);
    let on_issue_payload;

    if (hasResolvedAction(payload.message.issue.issue_actions.respondent_actions)) {
      on_issue_payload = {
        context: {
          ttl: payload.context.ttl,
          domain: payload.context.domain,
          country: payload.context.country,
          city: payload.context.city,
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
              complainant_actions: payload.message.issue.issue_actions.complainant_actions,
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
            resolution: payload.message.issue.resolution,
            created_at: payload.message.issue.created_at,
            updated_at: payload.message.issue.updated_at,
          },
        },
      };
    } else {
      on_issue_payload = {
        context: {
          ttl: payload.context.ttl,
          domain: payload.context.domain,
          country: payload.context.country,
          city: payload.context.city,
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
              complainant_actions: payload.message.issue.issue_actions.complainant_actions,
              respondent_actions: payload.message.issue.issue_actions.respondent_actions,
            },
            created_at: payload.message.issue.created_at,
            updated_at: payload.message.issue.updated_at,
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

export default LogisticsServices;
