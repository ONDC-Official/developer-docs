import Joi from 'joi';

const customMessages = {
  'string.base': '{{#label}} must be a string',
  'string.uri': '{{#label}} must be a valid URI',
  'string.isoDate': '{{#label}} must be a valid ISO date',
  'string.email': '{{#label}} must be a valid email address',
  'number.base': '{{#label}} must be a number',
  'array.base': '{{#label}} must be an array',
};

const OnIssueSchema = Joi.object({
  context: Joi.object({
    domain: Joi.string().required().messages(customMessages),
    country: Joi.string().required().messages(customMessages),
    city: Joi.string().required().messages(customMessages),
    action: Joi.string().required().messages(customMessages),
    core_version: Joi.string().required().messages(customMessages),
    bap_id: Joi.string().required().messages(customMessages),
    bap_uri: Joi.string().required().messages(customMessages),
    bpp_id: Joi.string().required().messages(customMessages),
    bpp_uri: Joi.string().required().messages(customMessages),
    transaction_id: Joi.string().required().messages(customMessages),
    message_id: Joi.string().required().messages(customMessages),
    timestamp: Joi.string().isoDate().required().messages(customMessages),
  }).required(),
  message: Joi.object({
    issue: Joi.object({
      id: Joi.string().required().messages(customMessages),
      issue_actions: Joi.object({
        respondent_actions: Joi.array().items(
          Joi.object({
            respondent_action: Joi.string().required().messages(customMessages),
            short_desc: Joi.string().required().messages(customMessages),
            updated_at: Joi.string().isoDate().required().messages(customMessages),
            updated_by: Joi.object({
              org: Joi.object({
                name: Joi.string().required().messages(customMessages),
              })
                .required()
                .messages(customMessages),
              contact: Joi.object({
                phone: Joi.string().required().messages(customMessages),
                email: Joi.string().email().required().messages(customMessages),
              })
                .required()
                .messages(customMessages),
              person: Joi.object({
                name: Joi.string().required().messages(customMessages),
              })
                .required()
                .messages(customMessages),
            })
              .required()
              .messages(customMessages),
            cascaded_level: Joi.number().required().messages(customMessages),
          }),
        ),
      })
        .required()
        .messages(customMessages),
      created_at: Joi.string().isoDate().required().messages(customMessages),
      updated_at: Joi.string().isoDate().required().messages(customMessages),
    })
      .required()
      .messages(customMessages),
  })
    .required()
    .messages(customMessages),
});

export default OnIssueSchema;
