import { ChangeFields, IssueRequest, IssueStatusPayload, OnIssue, OnIssueStatusResoloved } from './issue.types';

export type IssuePayloadProps = ChangeFields<
  IssueRequest,
  {
    context: Omit<
      IssueRequest['context'],
      'bap_id' | 'bap_uri' | 'city' | 'state' | 'country' | 'timestamp' | 'transaction_id' | 'message_id'
    >;
    message: {
      issue: Omit<IssueRequest['message']['issue'], 'updated_at'>;
    };
  }
>;

export type OnIssuePayloadProps = ChangeFields<
  IssueRequest,
  {
    context: Omit<OnIssue['context'], 'bpp_id' | 'bpp_uri' | 'city' | 'state' | 'country' | 'domain' | 'core_version'>;
    message: {
      issue: Omit<OnIssue['message']['issue'], 'updated_at'>;
    };
  }
>;

export type IssueStatusPayloadProps = ChangeFields<
  IssueStatusPayload,
  {
    context: Omit<
      IssueStatusPayload['context'],
      'bap_id' | 'bap_uri' | 'city' | 'state' | 'country' | 'domain' | 'core_version'
    >;
  }
>;

export type OnIssueStatusPayloadProps = ChangeFields<
  OnIssueStatusResoloved,
  {
    context: Omit<
      IssueStatusPayload['context'],
      'bpp_id' | 'bpp_uri' | 'city' | 'state' | 'country' | 'domain' | 'core_version'
    >;
  }
>;

interface Callbacks {
  onSuccess: (successResponse: any) => void;
  onError: (errorResponse: any) => void;
  onNack: (nackResponse: any) => void;
}

export type ManagerProps<T extends string, U, V, W, K> = {
  issue?: U;
  on_issue?: V;
  issue_status?: W;
  on_issue_status?: K;
} & Callbacks;

export type RouteSpecificManagerProps = ManagerProps<
  'issue' | 'on_issue' | 'issue_status' | 'on_issue_status',
  IssuePayloadProps,
  OnIssuePayloadProps,
  IssueStatusPayloadProps,
  OnIssueStatusPayloadProps
>;
