export function hasResolvedAction(respondentActions: any[]): boolean {
  return respondentActions.some((action) => action.respondent_action === 'RESOLVED');
}

export function hasRefundKey(payload: any) {
  return Object.keys(payload.message.issue.resolution).includes('refund_amount');
}
