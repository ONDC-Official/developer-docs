/// Base interface for all the All Responses
export interface IBaseIssue {
  context: Context;
  message: Message;
}
export interface Context {
  domain: string;
  country: string;
  city: string;
  state?: string;
  action: string;
  core_version: string;
  bap_id: string;
  bap_uri: string;
  bpp_id: string;
  bpp_uri: string;
  transaction_id: string;
  message_id: string;
  timestamp: string;
  ttl: string;
}
export interface Message {
  issue: Issue;
}

export enum Rating {
  'THUMBS-UP',
  'THUMBS-DOWN',
}

export interface Issue {
  id: string;
  category: string;
  sub_category: string;
  complainant_info: ComplainantInfo;
  order_details: OrderDetails;
  description: Description;
  source: Source;
  expected_response_time: ExpectedResTime;
  expected_resolution_time: ExpectedResTime;
  status: string;
  issue_type: string;
  issue_actions: IssueActions;
  rating?: Rating;
  resolution: Resolution | ResolutionWithoutRefund;
  resolution_provider: ResolutionProvider;
  created_at: string;
  updated_at: string;
}

export interface ResolutionProvider {
  respondent_info: RespondentInfo;
}

export interface Organization {
  org: Org;
  contact: Contact;
  person: Org;
}

export interface Contact {
  phone: string;
  email: string;
}

export interface Org {
  name: string;
}

export interface ResolutionSupport {
  chat_link: string;
  contact: Contact;
  gros: Gro[];
}

export interface Gro {
  person: Org;
  contact: Contact;
  gro_type: string;
}

export interface RespondentInfo {
  type: string;
  organization: Organization;
  resolution_support: ResolutionSupport;
}

export interface Resolution {
  short_desc: string;
  long_desc: string;
  action_triggered: 'REFUND';
  refund_amount: string;
}

export interface ResolutionWithoutRefund {
  short_desc: string;
  long_desc: string;
  action_triggered: 'RESOLVED' | 'REPLACE' | 'NO-ACTION' | 'CASCADED' | string;
}

export interface ComplainantInfo {
  person: Person;
  contact: ComplainantInfoContact;
}
export interface ComplainantInfoContact {
  phone: string;
  email: string;
}
export interface Person {
  name: string;
  email: string;
}
export interface Description {
  short_desc: string;
  long_desc: string;
  additional_desc: AdditionalDesc;
  images: string[];
}
export interface AdditionalDesc {
  url: string;
  content_type: string;
}
export interface ExpectedResTime {
  duration: string;
}
export interface IssueActions {
  complainant_actions: ComplainantAction[];
  respondent_actions: RespondentAction[];
}
export interface ComplainantAction {
  complainant_action: string;
  short_desc: string;
  updated_at: string;
  updated_by: UpdatedBy;
}
export interface UpdatedBy {
  org: Org;
  contact: UpdatedByContact;
  person: Org;
}
export interface RespondentAction {
  respondent_action: string;
  short_desc: string;
  updated_at: string;
  updated_by: UpdatedBy;
  cascaded_level: number;
}

export interface UpdatedBy {
  org: Org;
  contact: Contact;
  person: Org;
}

export interface Contact {
  phone: string;
  email: string;
}

export interface Org {
  name: string;
}
export interface UpdatedByContact {
  phone: string;
  email: string;
}
export interface Org {
  name: string;
}
export interface OrderDetails {
  id: string;
  state: string;
  items: Item[];
  fulfillments: Fulfillment[];
  provider_id: string;
  merchant_order_id?: string;
}
export interface Fulfillment {
  id: string;
  state: string;
}
export interface Item {
  id: string;
  quantity: number;
}
export interface Source {
  network_participant_id: string;
  type: string;
}
