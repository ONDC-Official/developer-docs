import { Request, Response } from 'express';
import IgmServices from '../services/igm.services';

const igmServices = new IgmServices();

class IGMController {
  constructor() {
    this.issue = this.issue.bind(this);
  }

  /**
   * Handles an issue-related HTTP request and invokes the corresponding service method.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   */

  async issue({ req, res }: { req: Request; res: Response }) {
    try {
      igmServices.issue(req, res);
    } catch (err) {
      console.log(err);
    }
  }

  on_issue(req: Request, res: Response) {
    try {
      igmServices.on_issue(req, res);
    } catch (err) {
      console.log(err);
    }
  }

  issue_status(req: Request, res: Response) {
    try {
      igmServices.issue_status(req, res);
    } catch (err) {
      console.log(err);
    }
  }

  on_issue_status(req: Request, res: Response) {
    try {
      igmServices.on_issue_status(req, res);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new IGMController();
