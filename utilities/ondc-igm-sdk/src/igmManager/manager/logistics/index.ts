import { RouteSpecificManagerProps } from '../../interfaces/manager.type';
import LogisticsServices from '../../services/logisticsServices';

const logisticsService = new LogisticsServices();

class LogisticsManager {
  async on_issue({ on_issue, onError, onNack, onSuccess }: RouteSpecificManagerProps) {
    try {
      const response: any = await logisticsService.on_issue(on_issue!);

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
      const response: any = await logisticsService.on_issue_status(on_issue_status!);

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

export default LogisticsManager;
