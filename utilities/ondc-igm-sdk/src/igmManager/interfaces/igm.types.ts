import { Request, Response } from 'express';

export enum IGM_ROUTES {
  ISSUE = 'issue',
  ON_ISSUE = 'on_issue',
  ISSUE_STATUS = 'issue_status',
  ON_ISSUE_STATUS = 'on_issue_status',
}

export enum ERROR_CODES {
  ROUTE_NOT_VALID = 'ROUTE_NOT_VALID',
}

export type DOMAINS = 'RETAIL' | 'MOBILITY' | 'LOGISTICS';

export type NP_TYPES = 'BUYER' | 'SELLER' | 'LOGISTICS';

export type IgmRoutes = IGM_ROUTES.ISSUE | IGM_ROUTES.ON_ISSUE | IGM_ROUTES.ISSUE_STATUS | IGM_ROUTES.ON_ISSUE_STATUS;

export interface EvaluateRoute {
  req: Request;
  res: Response;
  route: IgmRoutes;
}

export interface IssueParameterContext {
  subscriberType: NP_TYPES;
  subscriberId: string;
  subscriberURL: string;
  subscriberDomain: string;
  subscriberCountry: string;
  subcriberState: string;
  subscriberCity: string;
  expected_response_time: string;
  expected_resolution_time: string;
  ttl: string;
}

export interface IssuesParamaters<T = any, K = any> {
  validateSchema: boolean;
  domain: DOMAINS[];
  npType: NP_TYPES[];
  context: IssueParameterContext[];
  onSuccess?: {
    [k in IgmRoutes]?: (args: T) => any;
  };
  onError?: (args: K) => any;
}
