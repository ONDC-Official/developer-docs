import express, { Response } from 'express';
import issue from '../Issue';
import { ERROR_CODES, IGM_ROUTES, IgmRoutes } from '../interfaces/igm.types';
// import { validateRequest } from '../middleware/requestValidator';
// import issueSchema from '../../utils/schema/issue.schema';

const router = express.Router();

/**
 * Evaluates an error code and sends an appropriate HTTP response based on the error code.
 *
 * @param error - The error object containing the error code and other details.
 * @param res - The HTTP response object used to send the response.
 */

const evaluateErrorCode = (error: { [key: string]: any; code: ERROR_CODES }, res: Response) => {
  switch (error.code) {
    case ERROR_CODES.ROUTE_NOT_VALID:
      return res.sendStatus(404);
    default:
      return res.json(500).json({ message: 'Something went wrong' });
  }
};

/**
 * Route handler for handling issue-related POST requests with different routes.
 *
 * @param route - The route extracted from the request parameters.
 * @param validateRequest - Middleware function for validating the request body against the issue schema.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */

// validateRequest(issueSchema),
router.post('/:route(issue|on_issue|issue_status|on_issue_status)', (req, res) => {
  // Extract the 'route' from the request parameters and cast it to the 'IgmRoutes' type.

  const route: IgmRoutes = <IGM_ROUTES>req.params.route;

  // If 'issue.config' is not available, throw an error indicating that IGM has not been initialized.
  if (!issue.config) throw new Error('IGM has not been initialised');

  // Evaluate the route using the 'evaluateRoute' method from the 'issue' object.
  const response: any = issue.evaluateRoute({ req, res, route });

  // If the response contains an error, handle the error using 'evaluateErrorCode' and send the appropriate HTTP response.
  if (response?.error) {
    return evaluateErrorCode(response, res);
  }

  // If no error occurs, send a 200 response with the JSON containing the 'route' name.
  // return res.status(200).json({ name: route });
  return;
});

export default router;
