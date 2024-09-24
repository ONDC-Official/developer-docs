import { Request, NextFunction, Response } from 'express';
import IssueInstance from '../Issue';
import ALL_ROUTES from '../../constants/endpoints';
import { IssueSchema } from '../../utils/schema';

/**
 * Middleware for validating the request body against the given Joi schema.
 *
 * @param schema - The Joi schema used for request body validation.
 * @returns A middleware function that validates the request body, returning a 400 response with error details if invalid.
 */

function validateSchema<T>({ requestedBody, url }: { url: string; requestedBody: T }) {
  switch (url) {
    case ALL_ROUTES.ISSUE:
      const { error } = IssueSchema.validate(requestedBody);
      return error;

    default:
      return { message: 'Somthing went wrong in validation ' };
  }
}

function validateRequest(req: Request, res: Response, next: NextFunction) {
  // Check if the request URL contains 'issue' or 'issue_status' (with enabled schema validation)

  let validationError;

  if (IssueInstance.config?.validateSchema) {
    // Validate the request body against the provided schema

    // (req.originalUrl.includes('issue') || (req.originalUrl.includes('issue_status') && ))

    validationError = validateSchema({ url: req.originalUrl, requestedBody: req.body });

    if (validationError) {
      console.log('error :', validationError.message);
      return res.status(400).json({ Response: [], message: 'Invalid payload data', error: validationError.message });
    }
  }
  // If the validation passes, continue to the next middleware or route handler

  return next();
}

export { validateRequest };
