import {
  ComplainantInfo,
  Context,
  IBaseIssue,
  Issue,
  IssueActions,
  Item,
  Message,
  OrderDetails,
  Person,
} from './issueBase.types';

export type ChangeFields<T, R> = Omit<T, keyof R> & R;

export type OmitKey<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// use this for /on_issue
export type OnIssue = ChangeFields<
  Omit<IBaseIssue, 'logisticsTransactionId'>,
  {
    context: Omit<Context, 'ttl'>;
    message: ChangeFields<
      Message,
      {
        issue: ChangeFields<
          Omit<
            Issue,
            | 'order_details'
            | 'issue_type'
            | 'category'
            | 'complainant_info'
            | 'description'
            | 'expected_resolution_time'
            | 'expected_response_time'
            | 'source'
            | 'status'
            | 'sub_category'
            | 'rating'
            | 'resolution'
            | 'resolution_provider'
          >,
          {
            issue_actions: Omit<IssueActions, 'complainant_actions'>;
          }
        >;
      }
    >;
  }
>;

// issue for logistics payload
export type IssueRequestLogistics = ChangeFields<
  Omit<IBaseIssue, 'logisticsTransactionId'>,
  {
    message: ChangeFields<
      Message,
      {
        issue: ChangeFields<
          Omit<Issue, 'resolution_provider' | 'resolution'>,
          {
            complainant_info: ChangeFields<
              ComplainantInfo,
              {
                person: Omit<Person, 'email'>;
              }
            >;

            order_details: ChangeFields<
              Omit<OrderDetails, 'orderDetailsId' | 'provider_name'>,
              {
                items: Omit<Item, 'product_name'>[];
              }
            >;
          }
        >;
      }
    >;
  }
>;

export type IssueRequestLogisticsResolved = ChangeFields<
  Omit<IBaseIssue, 'logisticsTransactionId'>,
  {
    message: ChangeFields<
      Message,
      {
        issue: ChangeFields<
          Issue,
          {
            complainant_info: ChangeFields<
              ComplainantInfo,
              {
                person: Omit<Person, 'email'>;
              }
            >;
            order_details: ChangeFields<
              Omit<OrderDetails, 'orderDetailsId' | 'provider_name'>,
              {
                items: Omit<Item, 'product_name'>[];
              }
            >;
          }
        >;
      }
    >;
  }
>;

// issue_request contains complainent actions
export type IssueRequest = ChangeFields<
  IBaseIssue,
  {
    message: ChangeFields<
      Message,
      {
        issue: Omit<Issue, 'resolution' | 'resolution_provider'>;
      }
    >;
  }
>;
 

// use this for /on_issue_status when Seller has RESOLVED the issue

export type OnIssueStatusResoloved = ChangeFields<
  Omit<IBaseIssue, 'logisticsTransactionId'>,
  {
    context: Omit<Context, 'ttl'>;
    message: ChangeFields<
      Message,
      {
        issue: ChangeFields<
          Omit<
            Issue,
            | 'order_details'
            | 'issue_type'
            | 'category'
            | 'complainant_info'
            | 'description'
            | 'expected_resolution_time'
            | 'expected_response_time'
            | 'source'
            | 'status'
            | 'sub_category'
            | 'rating'
          >,
          {
            issue_actions: Omit<IssueActions, 'complainant_actions'>;
          }
        >;
      }
    >;
  }
>;

export type IssueStatusPayload = {
  context: Context;
  message: {
    issue_id: string;
  };
};
