import Joi from 'joi';

const IssueStatusSchema = Joi.object({
  context: Joi.object({
    domain: Joi.string().required().messages({
      'any.required': 'Domain is required',
    }),
    country: Joi.string().required().messages({
      'any.required': 'Country is required',
    }),
    city: Joi.string().required().messages({
      'any.required': 'City is required',
    }),
    action: Joi.string().required().messages({
      'any.required': 'Action is required',
    }),
    core_version: Joi.string().required().messages({
      'any.required': 'Core version is required',
    }),
    bap_id: Joi.string().required().messages({
      'any.required': 'BAP ID is required',
    }),
    bap_uri: Joi.string().required().messages({
      'any.required': 'BAP URI is required',
      'string.uri': 'BAP URI must be a valid URI',
    }),
    bpp_id: Joi.string().required().messages({
      'any.required': 'BPP ID is required',
    }),
    bpp_uri: Joi.string().required().messages({
      'any.required': 'BPP URI is required',
      'string.uri': 'BPP URI must be a valid URI',
    }),
    transaction_id: Joi.string().required().messages({
      'any.required': 'Transaction ID is required',
    }),
    message_id: Joi.string().required().messages({
      'any.required': 'Message ID is required',
    }),
    timestamp: Joi.string().isoDate().required().messages({
      'any.required': 'Timestamp is required',
      'string.isoDate': 'Timestamp must be a valid ISO date',
    }),
    ttl: Joi.string().required().messages({
      'any.required': 'TTL is required',
    }),
  })
    .required()
    .messages({
      'any.required': 'Context is required',
    }),
  message: Joi.object({
    issue_id: Joi.string().required().messages({
      'any.required': 'Issue ID is required',
    }),
  })
    .required()
    .messages({
      'any.required': 'Message is required',
    }),
});

export default IssueStatusSchema;
