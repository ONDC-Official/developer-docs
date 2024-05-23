export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const RESOURCE_POSSESSION = {
  OWN: 'OWN',
  ANY: 'ANY',
  SUB: 'SUB',
};

export const HEADERS = {
  ACCESS_TOKEN: 'access-token',
  AUTH_TOKEN: 'Authorization',
};

export const PAYMENT_TYPES = {
  'ON-ORDER': 'ON-ORDER',
  'PRE-FULFILLMENT': 'PRE-FULFILLMENT',
  'ON-FULFILLMENT': 'ON-FULFILLMENT',
  'POST-FULFILLMENT': 'POST-FULFILLMENT',
};

export const PROTOCOL_CONTEXT = {
  ISSUE: 'issue',
  ON_ISSUE: 'on_issue',
  ISSUE_STATUS: 'issue_status',
  ON_ISSUE_STATUS: 'on_issue_status',
};

export const PROTOCOL_PAYMENT = {
  PAID: 'PAID',
  'NOT-PAID': 'NOT-PAID',
};

export const PROTOCOL_VERSION = {
  v_0_9_1: '0.9.1',
  v_0_9_3: '0.9.3',
  v_1_0_0: '1.0.0',
};

export const SUBSCRIBER_TYPE = {
  BAP: 'BAP',
  BPP: 'BPP',
  BG: 'BG',
  LREG: 'LREG',
  CREG: 'CREG',
  RREG: 'RREG',
};

export const ORDER_STATUS = {
  COMPLETED: 'completed',
  'IN-PROGRESS': 'in-progress',
};

export const PAYMENT_COLLECTED_BY = {
  BAP: 'BAP',
  BPP: 'BPP',
};
