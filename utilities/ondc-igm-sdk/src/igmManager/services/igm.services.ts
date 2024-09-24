import { Request, Response } from 'express';
import BuyerServices from './buyerServices';
import SellerService from './sellerServices';
import IssueInstance from '../Issue/index';
import LogisticsServices from './logisticsServices';

const sellerService = new SellerService();
const buyerServices = new BuyerServices();
const logisticsServices = new LogisticsServices();
class IgmServices {
  constructor() {
    this.issue = this.issue.bind(this);
  }

  issue(req: Request, res: Response) {
    if (IssueInstance.config?.npType[0] === 'SELLER') {
      return sellerService.issue(req, res);
    }
    return logisticsServices.issue(req, res);
  }

  on_issue(req: Request, res: Response) {
    if (IssueInstance.config?.npType[0] === 'BUYER') {
      return buyerServices.on_issue(req, res);
    }
    return sellerService.on_issue(req, res);
  }

  issue_status(req: Request, res: Response) {
    if (IssueInstance.config?.npType[0] === 'SELLER') {
      return sellerService.issue_status(req, res);
    }
    return logisticsServices.issue_status(req, res);
  }

  on_issue_status(req: Request, res: Response) {
    if (IssueInstance.config?.npType[0] === 'BUYER') {
      return buyerServices.on_issue_status(req, res);
    }
    return sellerService.on_issue_status(req, res);
  }
}

export default IgmServices;
