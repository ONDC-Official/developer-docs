import { RouteSpecificManagerProps } from '../../interfaces/manager.type';
import BuyerServices from '../../services/buyerServices';

const buyerServices = new BuyerServices();

class BuyerManager {
  constructor() {
    this.issue = this.issue.bind(this);
  }

  async issue({ issue, onError, onNack, onSuccess }: RouteSpecificManagerProps) {
    try {
      const response: any = await buyerServices.issue(issue!);

      if (response.status === 200) {
        if (response.data.message.ack.status === 'ACK') {
          return onSuccess(response.data);
        } else {
          if (onNack) {
            return onNack(response.data);
          }
        }
      }
      return onError(response.data);
    } catch (e) {
      if (onError) {
        onError(e);
      }
    }
  }

  async issue_status({ issue_status, onError, onNack, onSuccess }: RouteSpecificManagerProps) {
    try {
      const response: any = await buyerServices.issue_status(issue_status!);

      if (response.status === 200) {
        if (response.data.message.ack.status === 'ACK') {
          return onSuccess(response.data);
        } else {
          if (onNack) {
            return onNack(response.data);
          }
        }
      }
      return onError(response.data);
    } catch (e) {
      if (onError) {
        onError(e);
      }
    }
  }
}

export default BuyerManager;
