import { RouteSpecificManagerProps } from '../../interfaces/manager.type';
import SellerService from '../../services/sellerServices';

const sellerService = new SellerService();

class SellerManager {
  async logistics_issue({ issue, onError, onNack, onSuccess }: RouteSpecificManagerProps) {
    try {
      const response: any = await sellerService.issueToLogistics(issue!);

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

  async logistics_issue_status({ issue_status, onError, onNack, onSuccess }: RouteSpecificManagerProps) {
    try {
      const response: any = await sellerService.issue_statusToLogistics(issue_status!);

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

  async on_issue({ on_issue, onError, onNack, onSuccess }: RouteSpecificManagerProps) {
    try {
      const response: any = await sellerService.on_issue_post(on_issue!);

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
  async on_issue_status({ on_issue_status, onError, onNack, onSuccess }: RouteSpecificManagerProps) {
    try {
      const response: any = await sellerService.on_issue_status_post(on_issue_status!);

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

export default SellerManager;
